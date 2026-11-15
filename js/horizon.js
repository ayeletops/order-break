/* EVENT HORIZON — a bubble timeline, on red.
   Time runs left to right but bends: each event gets its own column, as wide as its circle; the years keep their order,
   not their spacing. Columns never overlap; the circles breathe in place. Their year appears, large, only on hover.
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
  const LW = () => H / Math.max(1, LINES.length) * .72;             // line weight: 72% band, 28% red gap
  // time → x: piecewise, through the event centres (set in layout)
  let KN = [[1936, 0], [2027, 1]];
  const X = y => { for (let i = 1; i < KN.length; i++) if (y <= KN[i][0]) { const [y0, x0] = KN[i - 1], [y1, x1] = KN[i]; return x0 + (y - y0) / (y1 - y0) * (x1 - x0); } return KN[KN.length - 1][1]; };

  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; [cv, A, B].forEach(c => { c.width = W * dpr; c.height = H * dpr; });
    // events: x by year, alternating rows; grow radii as large as possible without any overlap
    // circles: one column per event, side by side, each column as wide as its circle (order of years kept, spacing not).
    // Columns never overlap; circles may overlap the bands vertically.
    const want = [.2, .26, .17, .23, .3], ys = [.46, .54, .42, .58, .5], x0 = .09 * W, span = W - x0 - 4, gap = 10;
    const sum = want.reduce((p, q) => p + q, 0);
    let d = want.map(w => Math.min(H * .96, (span - gap * (want.length - 1)) * w / sum));
    const used = d.reduce((p, q) => p + q, 0) + gap * (want.length - 1), pad = (span - used) / want.length;
    let cx = x0;
    C = EVENTS.map((y, i) => { const c = { ev: y, x: cx + pad / 2 + d[i] / 2, y: ys[i] * H, r: d[i] / 2 }; cx += d[i] + gap + pad; return c; });
    // time axis: before 2008 squeezed into the first 9%; after that it bends through the event centres
    KN = [[1936, .005 * W], [2008, x0]].concat(C.map(c => [c.ev, c.x])).concat([[2027, W]]);
    LY = LINES.map((_, i) => H * (i + .5) / LINES.length);           // crosswalk: bands as thick as the gaps
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
    // on hover: the circle goes solid black, its year in white
    if (hover >= 0) {
      const c = C[hover], rr = c.r * breathe(c, t) * 1.03;
      x.fillStyle = '#000'; x.beginPath(); x.arc(c.x, c.y, rr, 0, 6.283); x.fill();
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `900 ${Math.round(c.r * .55)}px "Bodoni Moda", Didot, serif`; x.fillText(String(c.ev), c.x, c.y);
    }
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
