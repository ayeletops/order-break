/* WORK · CHAOS — the board of a mind that connects everything.
   Paper: Ayelet's own images (assets/board, listed by tools/board-manifest.py) + real scans of tickets, receipts, telegrams,
   envelopes and handwriting from Wikimedia Commons (js/board-scraps.js) + a few public-domain photographs of early cinema.
   Sizes from tiny to huge, some blended into the cork (multiply / darken / overlay), rotated, layered. Click brings one to the front.
   Real materials: a cork photograph, a red cord photographed and laid along every string (canvas), a photographed pushpin
   (keyed out of its white ground at runtime). Every position comes from the secret offsets.
*/
window.Board = (() => {
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  const thumb = (p, w) => WM + p + '/' + w + 'px-' + p.split('/').pop();
  const PD = ['d/d2/The_Horse_in_Motion_high_res.jpg', '0/04/Le_Voyage_dans_la_lune.jpg', '0/0b/Kinetoscope.jpg'];
  const CORK = 'https://cdn.pakutaso.com/shared/img/thumb/YUKI1211A1139_TP_V.jpg';             // PAKUTASO, free for any use
  const PIN = WM + '0/05/RedPushPin_%28cropped%29.jpg/500px-RedPushPin_%28cropped%29.jpg';        // CC BY-SA 4.0, keyed at runtime
  const M = () => Object.assign({ cork: CORK }, (window.BOARD && BOARD.materials) || {});
  const BLEND = ['normal', 'normal', 'multiply', 'normal', 'darken', 'overlay', 'normal', 'multiply', 'normal', 'darken', 'overlay', 'multiply'];

  // the paper, mixed: own images and scans interleaved
  function items() {
    const own = ((window.BOARD && BOARD.images) || []).map(src => ({ src, own: 1, corner: /\/s-\d/.test(src) }));
    const scans = (window.SCRAPS || []).map(([p, ar]) => ({ p, ar, scan: 1 }));
    const pd = PD.map(p => ({ p, ar: .75 }));
    const out = [], n = Math.max(own.length, scans.length);
    for (let i = 0; i < n; i++) { if (own[i]) out.push(own[i]); if (scans[i]) out.push(scans[i]); }
    return out.concat(pd);
  }

  function build({ OFF, left, width, top, height }) {
    const list = items(), html = [], anchors = [];
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
      const blend = BLEND[Math.abs(Math.round(o3[1] * 1000)) % BLEND.length];
      const r = (o2[1] * (it.scan ? 28 : 18)).toFixed(1), curl = (o3[0] * 7).toFixed(1);
      // the pin: top-centre, or top-right for tiles cut from a saved board; the print rotates around it
      const ax = it.corner ? w * .86 : w * (.5 + o3[0] * .18), ay = it.corner ? w * .12 : Math.min(18, h * .08);
      const src = it.src || thumb(it.p, w > 300 ? 500 : 330);
      html.push(`<figure class="ph ${kind}" data-k="${k}" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;width:${w}px;--r:${r}deg;--curl:${curl}deg;transform-origin:${ax.toFixed(0)}px ${ay.toFixed(0)}px;mix-blend-mode:${blend};z-index:${5 + (k % 25)}">`
        + `<img src="${src}" alt="" decoding="async" referrerpolicy="no-referrer"><i class="sheen"></i></figure>`);
      anchors.push([x + ax, y + ay, w]);
    });
    return { html: html.join(''), anchors };
  }

  // the cord: one photographed stretch of red cord, laid in short rotated pieces along each sagging curve
  function strings(cv, links) {
    const W = +cv.getAttribute('width'), H = +cv.getAttribute('height');
    const dpr = Math.min(window.devicePixelRatio || 1, W * H > 6e6 ? 1 : 2);
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    const c = cv.getContext('2d'); if (!c) return; c.scale(dpr, dpr);
    const curve = (a, b, i) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), sag = Math.min(110, L * .09) + (i % 4) * 5;
      return [L, (a[0] + b[0]) / 2 + (i % 2 ? 10 : -10), (a[1] + b[1]) / 2 + sag]; };
    const pt = (a, b, mx, my, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * my + t * t * b[1]];
    const draw = tex => {
      c.clearRect(0, 0, W, H);
      links.forEach(([a, b], i) => {                                       // cast shadows first
        const [, mx, my] = curve(a, b, i);
        c.save(); c.strokeStyle = 'rgba(30,12,0,.30)'; c.lineWidth = 3; c.shadowColor = 'rgba(30,12,0,.45)'; c.shadowBlur = 4; c.shadowOffsetX = 3; c.shadowOffsetY = 7;
        c.beginPath(); c.moveTo(a[0] + 3, a[1] + 7); c.quadraticCurveTo(mx + 3, my + 7, b[0] + 3, b[1] + 7); c.stroke(); c.restore();
      });
      links.forEach(([a, b], i) => {
        const [L, mx, my] = curve(a, b, i), th = 3.4 + (i % 5) * .55, n = Math.max(3, Math.round(L / 16));
        for (let j = 0; j < n; j++) {
          const p0 = pt(a, b, mx, my, j / n), p1 = pt(a, b, mx, my, (j + 1) / n), len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + 1.2;
          c.save(); c.translate(p0[0], p0[1]); c.rotate(Math.atan2(p1[1] - p0[1], p1[0] - p0[0]));
          if (tex) { const sw = Math.min(tex.width, len * tex.height / th), sx = ((i * 37 + j * sw) % Math.max(1, tex.width - sw)); c.drawImage(tex, sx, 0, sw, tex.height, 0, -th / 2, len, th); }
          else { c.fillStyle = '#b0170f'; c.fillRect(0, -th / 2, len, th); }
          c.restore();
        }
      });
    };
    const src = M().string; if (!src) return draw(null);
    const t = new Image(); t.onload = () => draw(t); t.onerror = () => draw(null); t.src = src;
  }

  // the pushpin: a real photograph, keyed off white once, then reused; tilted and sized per pin
  let pinURL = null; const waiting = [];
  function pinPhoto(cb) {
    if (M().pin) return cb(M().pin);
    if (pinURL) return cb(pinURL); waiting.push(cb); if (waiting.length > 1) return;
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { try {
      const W = im.naturalWidth, H = im.naturalHeight, c = document.createElement('canvas'); c.width = W; c.height = H;
      const x = c.getContext('2d'); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, W, H), p = d.data;
      let x0 = W, x1 = 0, y0 = H, y1 = 0;
      for (let i = 0; i < p.length; i += 4) { const r = p[i], g = p[i + 1], b = p[i + 2], mn = Math.min(r, g, b), red = r - Math.max(g, b);
        let a = Math.min(1, Math.max(0, (245 - mn) / 60)); if (red < 30) a = Math.min(a, Math.max(0, (200 - mn) / 120)); p[i + 3] = a * 255;
        const k = i / 4, X = k % W, Y = (k / W) | 0; if (Y < H * .62 && X > W * .3 && p[i + 3] > 200 && red > 40) { x0 = Math.min(x0, X); x1 = Math.max(x1, X); y0 = Math.min(y0, Y); y1 = Math.max(y1, Y); } }
      x.putImageData(d, 0, 0);
      const cw = x1 - x0 + 8, ch = y1 - y0 + 8, s = 72 / cw, o = document.createElement('canvas'); o.width = 72; o.height = Math.round(ch * s);
      o.getContext('2d').drawImage(c, x0 - 4, y0 - 4, cw, ch, 0, 0, o.width, o.height); pinURL = o.toDataURL('image/png');
    } catch (e) { pinURL = ''; } waiting.splice(0).forEach(f => f(pinURL)); };
    im.onerror = () => { pinURL = ''; waiting.splice(0).forEach(f => f(pinURL)); };
    im.src = PIN;
  }
  // pins: one per anchor, above the cord. size and tilt from the offsets
  function pins(points, OFF) {
    return points.map(([x, y, w], i) => { const o = OFF[(i * 5 + 2) % OFF.length], s = Math.round(Math.max(18, Math.min(34, 16 + (w || 200) / 18)) + o[0] * 3);
      return `<img class="pin" alt="" style="left:${(x - s * .5).toFixed(0)}px;top:${(y - s * 1.15).toFixed(0)}px;width:${s}px;transform:rotate(${(o[1] * 38).toFixed(0)}deg)">`; }).join('');
  }
  function dress(root) { pinPhoto(u => root.querySelectorAll('img.pin').forEach(p => { if (u) p.src = u; else p.classList.add('drawn'); })); }

  // click brings a print (or a card) to the front
  let Z = 40;
  function front(track) {
    track.addEventListener('click', e => { const el = e.target.closest('.ph, .role'); if (el && !e.target.closest('a')) el.style.zIndex = ++Z; });
  }
  const material = () => M();
  return { build, strings, pins, dress, front, material };
})();
