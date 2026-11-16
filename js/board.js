/* WORK · CHAOS — the board of a mind that connects everything.
   Paper: Ayelet's own images (assets/board, listed by tools/board-manifest.py) + real scans of tickets, receipts, telegrams,
   envelopes and handwriting from Wikimedia Commons (js/board-scraps.js) + a few public-domain photographs of early cinema.
   Sizes from tiny to huge, some blended into the cork (multiply / darken / overlay), rotated, layered. Click brings one to the front.
   No pins: it is a map. Things lie on the cork, and arrows run between their edges.
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
      // size: mostly small, some medium, a rare large one; nothing taller than about half the board
      let w = Math.round(70 + Math.pow(Math.abs(o2[0]), 1.8) * 230);
      if (k % 23 === 4) w = Math.round(320 + Math.abs(o3[0]) * 90);
      const ar = it.ar || 1, hMax = height * (it.scan ? .5 : .46);
      if (w * ar > hMax) w = Math.round(hMax / ar);
      w = Math.max(56, w);
      const h = w * ar;
      const x = left + ((k * .6180339) % 1) * (width - w * .6) + o[0] * 90 - w * .2;
      const y = top - 20 + ((k * .7548776 + Math.abs(o[1]) * .5) % 1) * Math.max(40, height - h * .55);
      const kind = it.scan ? 'scan' : it.corner ? 'print' : (k % 4 === 0 ? 'pol' : 'print');
      const rt = (k * 7 + 3) % 6 === 0;                                                        // red thread: grainy red duotone, like a risograph
      const BL = it.scan ? BLEND_SCAN : BLEND_PHOTO, blend = rt ? 'normal' : BL[Math.abs(Math.round(o3[1] * 1000)) % BL.length];
      const r = (o2[1] * (it.scan ? 28 : 18)).toFixed(1), curl = (o3[0] * 7).toFixed(1);
      // the pin: top-centre, or top-right for tiles cut from a saved board; the print rotates around it
      const ax = it.corner ? w * .86 : w * (.5 + o3[0] * .18), ay = it.corner ? w * .12 : Math.min(18, h * .08);
      const src = it.src || thumb(it.p, w > 300 ? 500 : 330);
      html.push(`<figure class="ph ${kind}${rt ? ' rt' : ''}${blend !== 'normal' ? ' bl' : ''}" data-k="${k}" data-id="p${k}" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${w}px;--r:${r}deg;--curl:${curl}deg;transform-origin:${ax.toFixed(0)}px ${ay.toFixed(0)}px;mix-blend-mode:${blend};z-index:${5 + (k % 25)}">`
        + `<img src="${src}" alt="" decoding="async" referrerpolicy="no-referrer"><i class="sheen"></i></figure>`);
      const hh = h + (kind === 'pol' ? 51 : kind === 'scan' || blend !== 'normal' ? 0 : 14), ww = w + (kind === 'scan' || blend !== 'normal' ? 0 : 14);
      anchors.push([x + ww / 2, y + hh / 2, w, it.topics, 'ph', 'p' + k, ww, hh]);   // a place on the map: centre and size
      G.push({ own: !!it.src, big: it.src || thumb(it.p, 960), cap: it.scan ? decodeURIComponent(it.p.split('/').pop()).replace(/_/g, ' ').replace(/\.\w+$/, '') + ' · ' + it.by + ' · ' + it.lic + ' · Wikimedia Commons' : '' });
    });
    return { html: html.join(''), anchors };
  }

  // arrows between kin. time runs left to right, so an arrow can lead on into later years (ink, bowing down),
  // reach back into earlier ones (red, dashed, bowing up), run straight off the right edge into the future,
  // or arrive from before the board begins. They sit under the paper; hovering a thing lifts its own arrows on top.
  // nodes: [x, y, w, topics[], kind, id]
  function lines(nodes, W, H, OFF, x0) {
    const seen = new Set(), out = [];
    const share = (a, b) => a[3].some(t => b[3].includes(t));
    const f = v => v.toFixed(1);
    // leave one thing at its edge and arrive at the other's edge, so the arrows run between the pictures, not under them
    const edge = (n, ux, uy) => { const hw = (n[6] || 0) / 2, hh = (n[7] || 0) / 2; if (!hw || !hh) return 0;
      return Math.min(Math.abs(ux) > 1e-6 ? hw / Math.abs(ux) : 1e9, Math.abs(uy) > 1e-6 ? hh / Math.abs(uy) : 1e9); };
    const arrow = (a, b, cls, ida, idb) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
      const ta = edge(a, ux, uy) + 4, tb = edge(b, ux, uy) + 6; if (ta + tb > L - 12) return '';
      const sx = a[0] + ux * ta, sy = a[1] + uy * ta, ex = b[0] - ux * tb, ey = b[1] - uy * tb;
      const bow = Math.min(70, (L - ta - tb) * .14) * (cls === 'bk' ? -1 : 1);
      return `<path class="${cls}" data-a="${ida}" data-b="${idb}" d="M${f(sx)},${f(sy)} Q${f((sx + ex) / 2)},${f((sy + ey) / 2 + bow)} ${f(ex)},${f(ey)}"/>`;
    };
    nodes.forEach((a, i) => {
      const o = OFF[(i * 19 + 7) % OFF.length], hsh = Math.abs(Math.round(o[0] * 613 + o[1] * 389));
      const kin = nodes.map((b, j) => [j, Math.hypot(a[0] - b[0], (a[1] - b[1]) * 1.4)]).filter(([j]) => j !== i && share(a, nodes[j])).sort((p, q) => p[1] - q[1]);
      const pick = kin.slice(0, hsh % 3 ? 1 : 2);
      if (hsh % 5 === 0 && kin.length > 8) pick.push(kin[8 + (hsh % (kin.length - 8))]);              // a leap across the years
      pick.forEach(([j]) => { const key = i < j ? i + ':' + j : j + ':' + i; if (seen.has(key)) return; seen.add(key);
        const b = nodes[j], [early, late] = a[0] <= b[0] ? [a, b] : [b, a], back = (hsh + j) % 4 === 0;
        out.push(back ? arrow(late, early, 'bk', late[5], early[5]) : arrow(early, late, 'fw', early[5], late[5])); });
      if (hsh % 17 === 5) out.push(arrow(a, [W - 6, Math.max(20, Math.min(H - 20, a[1] + o[1] * 60))], 'fu', a[5], 'future'));   // straight to the future
      if (hsh % 23 === 11) out.push(arrow([x0, Math.max(20, Math.min(H - 20, a[1] - o[0] * 60))], a, 'pa', 'before', a[5]));     // from before
    });
    const head = (id, c) => `<marker id="${id}" viewBox="0 0 8 8" refX="7.2" refY="4" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M.6,.8 L7.2,4 L.6,7.2" fill="none" stroke="${c}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></marker>`;
    return `<svg class="topics" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${head('ah-k', '#0b0b0b')}${head('ah-r', '#e5332a')}</defs>${out.join('')}</svg>`
      + `<svg class="topics hl" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"></svg>`;
  }
  // hover: a thing's own arrows, in and out, come up over the paper
  function trace(track) {
    track.addEventListener('pointerover', e => { const el = e.target.closest('[data-id]'), hl = track.querySelector('svg.topics.hl'), base = track.querySelector('svg.topics:not(.hl)');
      if (!hl || !base) return; if (!el || el.classList.contains('lifted')) { hl.innerHTML = ''; return; }
      const id = el.dataset.id; hl.innerHTML = [...base.querySelectorAll(`path[data-a="${id}"],path[data-b="${id}"]`)].map(p => p.outerHTML).join(''); });
    track.addEventListener('pointerleave', () => { const hl = track.querySelector('svg.topics.hl'); if (hl) hl.innerHTML = ''; });
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

  // click: a card or a tag comes to the front. a print leaves its place and comes forward, large, in front of the board;
  // clicking it again, clicking the board, Esc or scrolling puts it back exactly where it was
  const G = []; let Z = 40, cur = null, ui = null, wrapEl = null;
  function controls() {
    if (ui) return ui;
    ui = document.createElement('div'); ui.className = 'gal'; ui.hidden = true;
    ui.innerHTML = '<p class="cap"></p>';
    document.body.appendChild(ui);
    document.addEventListener('keydown', e => { if (cur && e.key === 'Escape') drop(); });
    document.addEventListener('click', e => { if (cur && !e.target.closest('.wrap')) drop(); });
    return ui;
  }
  function lift(el) {
    if (cur === el) return; drop(); controls();
    const w = el.offsetWidth, h = el.offsetHeight, vw = wrapEl.clientWidth, vh = wrapEl.clientHeight;
    const g0 = G[+el.dataset.k], nat = (el.querySelector('img') || {}).naturalWidth || 0;
    const s = Math.min(Math.min(vw * .6, 760) / w, vh * .8 / h, 4, g0 && g0.own && nat ? Math.max(1.2, nat * 2.2 / w) : 4);   // never blow a small file up past ~2x
    const [ox, oy] = getComputedStyle(el).transformOrigin.split(' ').map(parseFloat);
    const cx = wrapEl.scrollLeft + vw / 2 - el.offsetLeft, cy = vh / 2 - el.offsetTop;
    const tx = cx - ox - s * (w / 2 - ox), ty = cy - oy - s * (h / 2 - oy);
    el.dataset.z = el.style.zIndex; el.dataset.bl = el.style.mixBlendMode;
    el.classList.add('lifted'); el.style.zIndex = 5000; el.style.mixBlendMode = 'normal';
    el.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${s.toFixed(3)})`;
    const g = G[+el.dataset.k], img = el.querySelector('img'); if (g && !g.own && img.src !== g.big) { const hi = new Image(); hi.onload = () => { img.src = g.big; }; hi.src = g.big; }
    cur = el; ui.hidden = false; ui.querySelector('.cap').textContent = (g && g.cap) || '';
  }
  function drop() {
    if (!cur) return; const el = cur; cur = null; if (ui) ui.hidden = true;
    el.classList.remove('lifted'); el.classList.add('landing'); el.style.transform = ''; el.style.mixBlendMode = el.dataset.bl || '';
    setTimeout(() => { el.classList.remove('landing'); el.style.zIndex = el.dataset.z; }, 700);
  }
  function front(track) {
    wrapEl = track.closest('.wrap');
    track.addEventListener('click', e => { if (e.target.closest('a')) return; const el = e.target.closest('.ph, .role, .dymo');
      if (!el) { drop(); return; }
      if (el.classList.contains('ph')) { if (el === cur) drop(); else lift(el); return; }
      drop(); el.style.zIndex = ++Z; });
    wrapEl.addEventListener('scroll', () => { if (cur) drop(); }, { passive: true });
    trace(track);
  }
  function reset() { cur = null; if (ui) ui.hidden = true; }
  const material = () => M();
  return { build, lines, pins, dress, front, reset, material };
})();
