/* WORK · CHAOS — the board of a mind that connects everything.
   Paper: Ayelet's own images (assets/board, listed by tools/board-manifest.py) + real scans of tickets, receipts, telegrams,
   envelopes and handwriting from Wikimedia Commons (js/board-scraps.js) + a few public-domain photographs of early cinema.
   Sizes from tiny to huge, some blended into the cork (multiply / darken / overlay), rotated, layered. Click brings one to the front.
   Real materials: a cork photograph, photographed tacks, nails and pushpins (assets/board/materials).
   Thin lines, as on the ROI field, join things that share a topic (js/board-topics.js for her images; keywords for the scans).
   Every position comes from the secret offsets.
*/
window.Board = (() => {
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  const thumb = (p, w) => WM + p + '/' + w + 'px-' + p.split('/').pop();
  const PD = ['d/d2/The_Horse_in_Motion_high_res.jpg', '0/04/Le_Voyage_dans_la_lune.jpg', '0/0b/Kinetoscope.jpg'];
  const CORK = 'https://cdn.pakutaso.com/shared/img/thumb/YUKI1211A1139_TP_V.jpg';             // PAKUTASO, free for any use
  const M = () => Object.assign({ cork: CORK }, (window.BOARD && BOARD.materials) || {});
  // paper sinks into the cork (multiply / darken); photos sometimes ghost into it (overlay)
  const BLEND_SCAN = ['multiply', 'multiply', 'darken', 'multiply', 'normal', 'darken', 'multiply', 'overlay'];
  const BLEND_PHOTO = ['normal', 'overlay', 'multiply', 'normal', 'darken', 'overlay', 'normal', 'multiply', 'darken', 'normal'];

  const KW = [[/ticket|stub|boarding|admission|raffle/i, 'ticket'], [/receipt|quittung|invoice/i, 'receipt'], [/letter|postcard|diary|note|journal|telegram|list|recipe|poem|clipping|handwrit/i, 'text'],
    [/concert|grateful|korn|midnight|letov|sven|jackson|buffett|presley/i, 'music'], [/movie|theat|programme|cinema/i, 'film'], [/matchbook|bier|beer/i, 'night'],
    [/envelope|postcard|telegram/i, 'mail'], [/shopping|recipe|menu|cake/i, 'home'], [/darwin|lyell|lepidoptera|swedenborg/i, 'mind']];
  const scanTopics = p => { const t = KW.filter(([re]) => re.test(decodeURIComponent(p))).map(k => k[1]); return t.length ? t : ['text']; };
  // the paper, mixed: own images and scans interleaved
  function items() {
    const own = ((window.BOARD && BOARD.images) || []).map(src => ({ src, own: 1, corner: /\/s-\d/.test(src), topics: (window.TOPICS || {})[src.split('/').pop()] || ['self'] }));
    const scans = (window.SCRAPS || []).map(([p, ar, lic, by]) => ({ p, ar, lic, by, scan: 1, topics: scanTopics(p) }));
    const pd = PD.map(p => ({ p, ar: .75, topics: ['film'] }));
    const out = [], n = Math.max(own.length, scans.length);
    for (let i = 0; i < n; i++) { if (own[i]) out.push(own[i]); if (scans[i]) out.push(scans[i]); }
    return out.concat(pd);
  }

  function build({ OFF, left, width, top, height }) {
    const list = items(), html = [], anchors = []; G.length = 0;
    list.forEach((it, k) => {
      const o = OFF[(k * 13 + 5) % OFF.length], o2 = OFF[(k * 7 + 19) % OFF.length], o3 = OFF[(k * 11 + 3) % OFF.length];
      // size: mostly small, some big, a few huge
      let w = Math.round(64 + Math.pow(Math.abs(o2[0]), 1.7) * 380);
      if (k % 17 === 4) w = Math.round(460 + Math.abs(o3[0]) * 200);
      if (it.scan && it.ar > 1.6) w = Math.round(w * .7);
      const h = it.ar ? w * it.ar : w;
      const x = left + ((k * .6180339) % 1) * (width - w * .6) + o[0] * 90 - w * .2;
      const y = top - 20 + ((k * .7548776 + Math.abs(o[1]) * .5) % 1) * Math.max(40, height - h * .55);
      const kind = it.scan ? 'scan' : it.corner ? 'print' : (k % 4 === 0 ? 'pol' : 'print');
      const rt = (k * 7 + 3) % 6 === 0;                                                        // red thread: grainy red duotone, like a risograph
      const BL = it.scan ? BLEND_SCAN : BLEND_PHOTO, blend = rt ? 'normal' : BL[Math.abs(Math.round(o3[1] * 1000)) % BL.length];
      const r = (o2[1] * (it.scan ? 28 : 18)).toFixed(1), curl = (o3[0] * 7).toFixed(1);
      // the pin: top-centre, or top-right for tiles cut from a saved board; the print rotates around it
      const ax = it.corner ? w * .86 : w * (.5 + o3[0] * .18), ay = it.corner ? w * .12 : Math.min(18, h * .08);
      const src = it.src || thumb(it.p, w > 300 ? 500 : 330);
      html.push(`<figure class="ph ${kind}${rt ? ' rt' : ''}${blend !== 'normal' ? ' bl' : ''}" data-k="${k}" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${w}px;--r:${r}deg;--curl:${curl}deg;transform-origin:${ax.toFixed(0)}px ${ay.toFixed(0)}px;mix-blend-mode:${blend};z-index:${5 + (k % 25)}">`
        + `<img src="${src}" alt="" decoding="async" referrerpolicy="no-referrer"><i class="sheen"></i></figure>`);
      anchors.push([x + ax, y + ay, w, it.topics, 'ph']);
      G.push({ big: it.src || thumb(it.p, 960), cap: it.scan ? decodeURIComponent(it.p.split('/').pop()).replace(/_/g, ' ').replace(/\.\w+$/, '') + ' · ' + it.by + ' · ' + it.lic + ' · Wikimedia Commons' : '' });
    });
    return { html: html.join(''), anchors };
  }

  // topic lines: thin, straight, like the ROI field. each thing reaches its nearest kin by topic; a few long leaps
  // nodes: [x, y, w, topics[], kind]. ink lines inside a kind, red dashed (rhizome) between kinds
  function lines(nodes, W, H) {
    const seen = new Set(), out = [];
    const share = (a, b) => a[3].some(t => b[3].includes(t));
    nodes.forEach((a, i) => {
      const kin = nodes.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1])]).filter(([j]) => j !== i && share(a, nodes[j])).sort((p, q) => p[1] - q[1]);
      const pick = kin.slice(0, 2); if (i % 4 === 0 && kin.length > 6) pick.push(kin[6 + (i % (kin.length - 6))]);
      pick.forEach(([j]) => { const key = i < j ? i + ':' + j : j + ':' + i; if (seen.has(key)) return; seen.add(key);
        const b = nodes[j], cross = a[4] !== b[4];
        out.push(`<line class="${cross ? 'rh' : 'tl'}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`); });
    });
    return `<svg class="topics" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out.join('')}</svg>`;
  }

  // pins: photographed brass tacks and black cobbler's nails (cut out of Ayelet's photos), one per anchor, above the cord
  function pins(points, OFF) {
    const m = M(), set = re => Object.keys(m).filter(k => re.test(k)).sort().map(k => m[k]);
    const nails = set(/^nail-/), push = set(/^push-/);
    return points.map(([x, y, w], i) => { const o = OFF[(i * 5 + 2) % OFF.length], hsh = Math.abs(Math.round(o[0] * 991 + o[1] * 313));
      // a mixed handful: mostly small dark tacks, some nails, some red pushpins
      const r5 = hsh % 8, kind = r5 < 4 || !(nails.length || push.length) ? 'tack' : (r5 < 6 && nails.length) || !push.length ? 'nail' : 'push';
      const src = kind === 'tack' ? m.tack : kind === 'nail' ? nails[hsh % nails.length] : push[hsh % push.length];
      if (!src) return `<i class="pin drawn" style="left:${x - 5}px;top:${y - 5}px"></i>`;
      const s = Math.round(kind === 'nail' ? 22 + Math.abs(o[1]) * 10 : kind === 'push' ? 17 + Math.abs(o[1]) * 7 : 9 + Math.abs(o[0]) * 5);
      const rot = kind === 'nail' ? (hsh * 37) % 360 : kind === 'push' ? Math.round(o[1] * 35) : Math.round(o[1] * 90);
      return `<img class="pin ${kind}" src="${src}" alt="" style="left:${(x - s / 2).toFixed(0)}px;top:${(y - s / 2).toFixed(0)}px;width:${s}px;transform:rotate(${rot}deg)">`; }).join('');
  }
  function dress() {}

  // click: the print (or card) comes to the front; a print also opens in the gallery, where you can walk the whole board
  const G = []; let Z = 40, at = 0, box = null;
  function gallery() {
    if (box) return box;
    box = document.createElement('div'); box.className = 'gal'; box.hidden = true;
    box.innerHTML = '<button class="x" aria-label="Close">CLOSE</button><button class="pv" aria-label="Previous">◀ BACK</button><figure><img alt=""><figcaption></figcaption></figure><button class="nx" aria-label="Next">NEXT ▶</button><b class="ct"></b>';
    document.body.appendChild(box);
    const show = k => { at = (k + G.length) % G.length; const g = G[at]; box.querySelector('img').src = g.big; box.querySelector('figcaption').textContent = g.cap; box.querySelector('.ct').textContent = `${at + 1} / ${G.length}`; };
    box.show = show;
    box.addEventListener('click', e => { if (e.target.closest('.pv')) show(at - 1); else if (e.target.closest('.nx')) show(at + 1); });
    document.addEventListener('click', e => { if (!box.hidden && !box.contains(e.target) && !e.target.closest('.ph')) box.hidden = true; });
    document.addEventListener('keydown', e => { if (box.hidden) return; if (e.key === 'Escape') box.hidden = true; if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
    return box;
  }
  function front(track) {
    track.addEventListener('click', e => { const el = e.target.closest('.ph, .role, .dymo'); if (!el || e.target.closest('a')) return;
      el.style.zIndex = ++Z;
      if (el.classList.contains('ph') && G.length) { const b = gallery(); b.show(+el.dataset.k); b.hidden = false; } });
  }
  const material = () => M();
  return { build, lines, pins, dress, front, material };
})();
