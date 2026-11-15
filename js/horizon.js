/* EVENT HORIZON — only circles, on red.
   Five large circles: the cataclysmic events, each marked with its year and nothing else.
   Eight small bubbles: the people I love (sized and placed by their relative ages from css/grids.css — no dates, no labels).
   Where circles overlap the fill flips: an odd number of layers is black, an even number is white.
   Everything drifts slowly, so the intersections keep changing. The grid is invisible here.
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
    C = EVENTS.map((y, i) => ({ ev: y, bx: .08 + (y - FROM) / (TO - FROM) * .84, by: [.42, .6, .34, .58, .46][i], r: m * [.19, .26, .16, .22, .3][i], ph: i * 1.7 }))
      .concat(ages.map((g, i) => ({ bx: .06 + (1 - g / 100) * .88, by: .18 + ((i * .37) % 1) * .64, r: m * (.035 + g / 100 * .05), ph: 10 + i * 2.3 })));
  }
  const pos = (c, t) => ({ x: (c.bx + Math.sin(t / 9000 + c.ph) * .025) * W, y: (c.by + Math.cos(t / 11000 + c.ph * 1.3) * .03) * H });

  function frame(t) {
    layout(); if (reduce) t = 0;
    const P = C.map((c, i) => ({ ...pos(c, t), r: c.r * (hover === i ? 1.04 : 1), c }));
    [a, b].forEach(k => { k.setTransform(dpr, 0, 0, dpr, 0, 0); k.clearRect(0, 0, W, H); });
    a.fillStyle = '#fff'; P.forEach(p => { a.beginPath(); a.arc(p.x, p.y, p.r, 0, 6.283); a.fill(); });                       // anything covered
    b.globalCompositeOperation = 'xor'; b.fillStyle = '#000'; P.forEach(p => { b.beginPath(); b.arc(p.x, p.y, p.r, 0, 6.283); b.fill(); });   // odd layers
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, cv.width, cv.height);
    x.drawImage(A, 0, 0); x.drawImage(B, 0, 0);               // red ground · white where even · black where odd
    // event years: centred in each event circle, always readable
    x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'difference';
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '400 13px "Courier Prime", "Courier New", monospace';
    P.forEach(p => { if (p.c.ev) x.fillText(String(p.c.ev).split('').join(' '), p.x, p.y); });
    x.globalCompositeOperation = 'source-over';
    if (!reduce) requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, t = performance.now();
    hover = C.findIndex(c => c.ev && Math.hypot(mx - pos(c, t).x, my - pos(c, t).y) < c.r);
  });
  cv.addEventListener('pointerleave', () => hover = -1);
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
