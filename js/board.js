/* WORK · CHAOS — the board of a mind that connects everything.
   Paper: Ayelet's own images (assets/board, listed by tools/board-manifest.py) + real scans of tickets, receipts, telegrams,
   envelopes and handwriting from Wikimedia Commons (js/board-scraps.js) + a few public-domain photographs of early cinema.
   Sizes from tiny to huge, some blended into the cork (multiply / darken / overlay), rotated, layered. Click brings one to the front.
   Real materials: a cork photograph, a red cord photographed and laid along every string (canvas), photographed brass tacks
   and black nails (assets/board/materials). Every position comes from the secret offsets.
*/
window.Board = (() => {
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  const thumb = (p, w) => WM + p + '/' + w + 'px-' + p.split('/').pop();
  const PD = ['d/d2/The_Horse_in_Motion_high_res.jpg', '0/04/Le_Voyage_dans_la_lune.jpg', '0/0b/Kinetoscope.jpg'];
  const CORK = 'https://cdn.pakutaso.com/shared/img/thumb/YUKI1211A1139_TP_V.jpg';             // PAKUTASO, free for any use
  const M = () => Object.assign({ cork: CORK }, (window.BOARD && BOARD.materials) || {});
  const BLEND = ['normal', 'normal', 'multiply', 'normal', 'darken', 'overlay', 'normal', 'multiply', 'normal', 'darken', 'overlay', 'multiply'];

  // the paper, mixed: own images and scans interleaved
  function items() {
    const own = ((window.BOARD && BOARD.images) || []).map(src => ({ src, own: 1, corner: /\/s-\d/.test(src) }));
    const scans = (window.SCRAPS || []).map(([p, ar, lic, by]) => ({ p, ar, lic, by, scan: 1 }));
    const pd = PD.map(p => ({ p, ar: .75 }));
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
      const blend = rt ? 'normal' : BLEND[Math.abs(Math.round(o3[1] * 1000)) % BLEND.length];
      const r = (o2[1] * (it.scan ? 28 : 18)).toFixed(1), curl = (o3[0] * 7).toFixed(1);
      // the pin: top-centre, or top-right for tiles cut from a saved board; the print rotates around it
      const ax = it.corner ? w * .86 : w * (.5 + o3[0] * .18), ay = it.corner ? w * .12 : Math.min(18, h * .08);
      const src = it.src || thumb(it.p, w > 300 ? 500 : 330);
      html.push(`<figure class="ph ${kind}${rt ? ' rt' : ''}" data-k="${k}" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${w}px;--r:${r}deg;--curl:${curl}deg;transform-origin:${ax.toFixed(0)}px ${ay.toFixed(0)}px;mix-blend-mode:${blend};z-index:${5 + (k % 25)}">`
        + `<img src="${src}" alt="" decoding="async" referrerpolicy="no-referrer"><i class="sheen"></i></figure>`);
      anchors.push([x + ax, y + ay, w]);
      G.push({ big: it.src || thumb(it.p, 960), cap: it.scan ? decodeURIComponent(it.p.split('/').pop()).replace(/_/g, ' ').replace(/\.\w+$/, '') + ' · ' + it.by + ' · ' + it.lic + ' · Wikimedia Commons' : '' });
    });
    return { html: html.join(''), anchors };
  }

  // the cord: one photographed stretch of red cord, laid in short rotated pieces along each sagging curve
  function strings(cv, links) {
    const W = +cv.getAttribute('width'), H = +cv.getAttribute('height');
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(5e6 / (W * H))));   // three layers of cord: keep memory sane
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    const c = cv.getContext('2d'); if (!c) return; c.scale(dpr, dpr);
    const curve = (a, b, i) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), sag = Math.min(110, L * .09) + (i % 4) * 5;
      return [L, (a[0] + b[0]) / 2 + (i % 2 ? 10 : -10), (a[1] + b[1]) / 2 + sag]; };
    const pt = (a, b, mx, my, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
    const draw = tex => {
      c.clearRect(0, 0, W, H);
      links.forEach(([a, b], i) => {                                       // cast shadows first
        const [, mx, my] = curve(a, b, i);
        // a soft cast shadow, built from three faint widening strokes (a blur that works in every browser, no hard outline)
        c.save(); c.lineCap = 'round'; c.translate(3, 7);
        [[8, .05], [5, .07], [2.5, .10]].forEach(([lw, al]) => { c.strokeStyle = `rgba(25,10,0,${al})`; c.lineWidth = lw;
          c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(mx, my, b[0], b[1]); c.stroke(); });
        c.restore();
      });
      links.forEach(([a, b], i) => {
        const [L, mx, my] = curve(a, b, i), th = 2.6 + (i % 5) * .45, n = Math.max(3, Math.round(L / 16));
        for (let j = 0; j < n; j++) {
          const p0 = pt(a, b, mx, my, j / n), p1 = pt(a, b, mx, my, (j + 1) / n), len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + 1.2;
          c.save(); c.translate(p0[0], p0[1]); c.rotate(Math.atan2(p1[1] - p0[1], p1[0] - p0[0]));
          if (tex) { const sw = Math.min(tex.width, len * tex.height / th), sx = ((i * 37 + j * sw) % Math.max(1, tex.width - sw)); c.drawImage(tex, sx, 0, sw, tex.height, 0, -th / 2, len, th); }
          else { c.fillStyle = '#7a0c12'; c.fillRect(0, -th / 2, len, th); }
          c.restore();
        }
      });
    };
    const src = M().string; if (!src) return draw(null);
    const t = new Image(); t.onload = () => draw(t); t.onerror = () => draw(null); t.src = src;
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
    box.innerHTML = '<button class="x" aria-label="Close">×</button><button class="pv" aria-label="Previous">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="nx" aria-label="Next">›</button><b class="ct"></b>';
    document.body.appendChild(box);
    const show = k => { at = (k + G.length) % G.length; const g = G[at]; box.querySelector('img').src = g.big; box.querySelector('figcaption').textContent = g.cap; box.querySelector('.ct').textContent = `${at + 1} / ${G.length}`; };
    box.show = show;
    box.addEventListener('click', e => { if (e.target.closest('.pv')) show(at - 1); else if (e.target.closest('.nx')) show(at + 1); else if (!e.target.closest('figure img')) box.hidden = true; });
    document.addEventListener('keydown', e => { if (box.hidden) return; if (e.key === 'Escape') box.hidden = true; if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
    return box;
  }
  function front(track) {
    track.addEventListener('click', e => { const el = e.target.closest('.ph, .role'); if (!el || e.target.closest('a')) return;
      el.style.zIndex = ++Z;
      if (el.classList.contains('ph') && G.length) { const b = gallery(); b.show(+el.dataset.k); b.hidden = false; } });
  }
  const material = () => M();
  return { build, strings, pins, dress, front, material };
})();
