/* EVENT HORIZON — only circles, on red.
   Five large circles: the cataclysmic events. Their year appears, large, only when you hover.
   Eight small bubbles: the people I love (sized and placed by their relative ages from css/grids.css — no dates, no labels).
   Centres sit on this page's own invisible grid: 12 month-columns (one per letter of EVENTHORIZON) × 4 rows.
   Where circles overlap the fill flips: odd layers black, even layers white. The circles don't move; they breathe.
*/
(() => {
  const EVENTS = [2010, 2014, 2016, 2019, 2023];
  const FROM = 2007, TO = 2026;
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const ages = Stretch.weights('ages');                     // % of the oldest (relative only)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const A = document.createElement('canvas'), B = document.createElement('canvas');   // union mask, parity mask
  const a = A.getContext('2d'), b = B.getContext('2d');
  let W = 0, H = 0, dpr = 1, hover = -1, C = [];

  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height;
    [cv, A, B].forEach(c => { c.width = W * dpr; c.height = H * dpr; });
    const m = Math.min(W, H);
    const col = c => (Math.max(0, Math.min(11, c)) + .5) / 12, row = k => (k + .5) / 4;           // the invisible 12 × 4 grid
    C = EVENTS.map((y, i) => ({ ev: y, bx: col(Math.round((y - FROM) / (TO - FROM) * 11)), by: row([1, 2, 1, 2, 1][i]), r: m * [.19, .26, .16, .22, .3][i], ph: i * 1.7 }))
      .concat(ages.map((g, i) => ({ bx: col(Math.round((1 - g / 100) * 11)), by: row([0, 3, 0, 3, 1, 2, 0, 3][i]), r: m * (.035 + g / 100 * .05), ph: 10 + i * 2.3 })));
  }
  const pos = c => ({ x: c.bx * W, y: c.by * H });                     // fixed: no drift
  const breathe = (c, t) => 1 + Math.sin(t / 2400 + c.ph) * (c.ev ? .035 : .06);

  function frame(t) {
    layout(); if (reduce) t = 0;
    const P = C.map((c, i) => ({ ...pos(c), r: c.r * breathe(c, t) * (hover === i ? 1.05 : 1), c, i }));
    [a, b].forEach(k => { k.setTransform(dpr, 0, 0, dpr, 0, 0); k.clearRect(0, 0, W, H); });
    a.fillStyle = '#fff'; P.forEach(p => { a.beginPath(); a.arc(p.x, p.y, p.r, 0, 6.283); a.fill(); });                       // anything covered
    b.globalCompositeOperation = 'xor'; b.fillStyle = '#000'; P.forEach(p => { b.beginPath(); b.arc(p.x, p.y, p.r, 0, 6.283); b.fill(); });   // odd layers
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, cv.width, cv.height);
    x.drawImage(A, 0, 0); x.drawImage(B, 0, 0);               // red ground · white where even · black where odd
    // event years: centred in each event circle, always readable
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'difference';
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    P.forEach(p => { if (p.c.ev && p.i === hover) { x.font = `900 ${Math.round(p.r * .55)}px "Bodoni Moda", Didot, serif`; x.fillText(String(p.c.ev), p.x, p.y); } });
    x.globalCompositeOperation = 'source-over';
    if (!reduce) requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = -1, bd = Infinity;   // smallest event circle under the pointer
    C.forEach((c, i) => { if (!c.ev) return; const d = Math.hypot(mx - pos(c).x, my - pos(c).y); if (d < c.r && c.r < bd) { bd = c.r; best = i; } });
    hover = best; cv.style.cursor = best >= 0 ? 'default' : '';
  });
  cv.addEventListener('pointerleave', () => hover = -1);
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
