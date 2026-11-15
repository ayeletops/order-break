/* EVENT HORIZON — on red, only five big black balls: the cataclysmic events.
   Each event owns its column (order of years kept, spacing not); they breathe in place and never touch.
   On hover a ball turns white and shows its year. Nothing else is said. The grid is invisible here.
*/
(() => {
  const EVENTS = [2010, 2014, 2016, 2019, 2023];
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, hover = -1, C = [];

  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
    const want = [.2, .26, .17, .23, .3], ys = [.44, .56, .4, .6, .5], m = 16, gap = 14;
    const sum = want.reduce((p, q) => p + q, 0), span = W - 2 * m - gap * (want.length - 1);
    const d = want.map(w => Math.min(H * .92, span * w / sum));
    const pad = (W - 2 * m - d.reduce((p, q) => p + q, 0) - gap * (want.length - 1)) / want.length;
    let cx = m;
    C = EVENTS.map((y, i) => { const c = { ev: y, x: cx + pad / 2 + d[i] / 2, y: ys[i] * H, r: d[i] / 2 }; cx += d[i] + gap + pad; return c; });
  }
  const breathe = (c, t) => 1 + Math.sin(t / 2400 + c.ev) * .03;
  function frame(t) {
    layout(); if (reduce) t = 0;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, W, H);
    C.forEach((c, i) => {
      const on = i === hover, rr = c.r * breathe(c, t) * (on ? 1.03 : 1);
      x.fillStyle = on ? '#fff' : '#000'; x.beginPath(); x.arc(c.x, c.y, rr, 0, 6.283); x.fill();
      if (on) { x.fillStyle = '#000'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.font = `900 ${Math.round(c.r * .55)}px "Bodoni Moda", Didot, serif`; x.fillText(String(c.ev), c.x, c.y); }
    });
    if (!reduce) requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    hover = C.findIndex(c => Math.hypot(mx - c.x, my - c.y) < c.r); cv.style.cursor = hover >= 0 ? 'default' : '';
    if (reduce) requestAnimationFrame(frame);
  });
  cv.addEventListener('pointerleave', () => { hover = -1; if (reduce) requestAnimationFrame(frame); });
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
