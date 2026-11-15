/* EVENT HORIZON — a bubble timeline, on red.
   Time runs left to right (compressed before 2007). Five large circles: the cataclysmic events, placed by year,
   never overlapping; they breathe in place. Their year appears, large, only on hover.
   The people I love are lines: each fades in around when they were born (blurred on purpose) and runs on.
   One line ends. Where a line crosses a circle, black turns white (odd layers black, even white). The grid is invisible.
   Data: js/horizon-data.js (generated; no dates).
*/
(() => {
  const EVENTS = [2010, 2014, 2016, 2019, 2023];
  const LINES = window.LINES || [];
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = document.createElement('canvas'), B = document.createElement('canvas');
  const a = A.getContext('2d'), b = B.getContext('2d');
  let W = 0, H = 0, dpr = 1, hover = -1, C = [], LY = [];
  const LW = () => Math.max(6, Math.round(H / 90));   // line weight
  // time → x: 1936–2007 squeezed into the first 12%, 2007–2027 opened across the rest
  const X = y => W * (y < 2007 ? .01 + (y - 1936) / (2007 - 1936) * .11 : .12 + (y - 2007) / (2027 - 2007) * .86);

  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; [cv, A, B].forEach(c => { c.width = W * dpr; c.height = H * dpr; });
    // events: x by year, alternating rows; grow radii as large as possible without any overlap
    const want = [.2, .26, .17, .23, .3], ROWS = [.22, .5, .78];
    // try every row arrangement; keep the one that lets the circles be largest without touching
    const fit = cs => { let k = Math.min(W, H) * 3;
      const ok = s => cs.every((c, i) => cs.every((d, j) => j <= i || Math.hypot(c.x - d.x, c.y - d.y) >= (c.w + d.w) * s * 1.04 + 6));
      while (k > 10 && !ok(k)) k *= .98; return k; };
    let best = null, bk = 0;
    for (let n = 0; n < 243; n++) {
      const cs = EVENTS.map((y, i) => ({ ev: y, x: X(y), y: ROWS[Math.floor(n / 3 ** i) % 3] * H, w: want[i] }));
      const k = fit(cs); if (k > bk) { bk = k; best = cs; }
    }
    C = best; const k = bk;
    C.forEach(c => c.r = c.w * k);
    LY = LINES.map((_, i) => H * (.1 + .8 * (i + .5) / LINES.length));
  }
  const breathe = (c, t) => 1 + Math.sin(t / 2400 + c.ev) * .035;

  function shapes(k, t) {   // draw every circle and solid line segment into a mask context
    C.forEach((c, i) => { k.beginPath(); k.arc(c.x, c.y, c.r * breathe(c, t) * (hover === i ? 1.03 : 1), 0, 6.283); k.fill(); });
    LINES.forEach((l, i) => { const x0 = X(l.b), x1 = l.end ? X(l.end) : W; k.fillRect(x0, LY[i] - LW() / 2, x1 - x0, LW()); });
  }
  function frame(t) {
    layout(); if (reduce) t = 0;
    [a, b].forEach(k => { k.setTransform(dpr, 0, 0, dpr, 0, 0); k.clearRect(0, 0, W, H); });
    a.fillStyle = '#fff'; shapes(a, t);
    b.globalCompositeOperation = 'xor'; b.fillStyle = '#000'; shapes(b, t);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over';
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, cv.width, cv.height);
    x.drawImage(A, 0, 0); x.drawImage(B, 0, 0);
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    // blurred starts: each line fades in over its window
    LINES.forEach((l, i) => { const x0 = X(l.a), x1 = X(l.b), g = x.createLinearGradient(x0, 0, x1, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); x.fillStyle = g; x.fillRect(x0, LY[i] - LW() / 2, x1 - x0, LW()); });
    // the year, only on hover, large and inside its circle
    x.globalCompositeOperation = 'difference'; x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (hover >= 0) { const c = C[hover]; x.font = `900 ${Math.round(c.r * .55)}px "Bodoni Moda", Didot, serif`; x.fillText(String(c.ev), c.x, c.y); }
    x.globalCompositeOperation = 'source-over';
    if (!reduce) requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    hover = C.findIndex(c => Math.hypot(mx - c.x, my - c.y) < c.r);
    if (reduce) requestAnimationFrame(frame);
  });
  cv.addEventListener('pointerleave', () => { hover = -1; if (reduce) requestAnimationFrame(frame); });
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
