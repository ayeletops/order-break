/* EVENT HORIZON — five black holes on red, composed like a printed poster.
   Strict edges. One dominant, the rest stepping down, none touching. They beat at 120 BPM, gently and eased;
   on hover the year appears and beats with its hole.
   The composition is fixed in a 1.6 × 1 frame (landscape) and transposed for portrait screens.
*/
(() => {
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // five slots in a fixed poster composition, largest first; the events move between them
  const SLOTS = [[1.16, .52, .36], [.50, .38, .26], [.64, .82, .15], [.16, .74, .13], [.84, .11, .09]];
  const EVENTS = [2023, 2014, 2019, 2010, 2016];                  // default: who sits in which slot
  let W = 0, H = 0, dpr = 1, hover = -1, C = [], S = [], order = EVENTS.slice(), t0 = 0, from = null, lastXY = null;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
    const land = W >= H, bw = land ? 1.6 : 1, bh = land ? 1 : 1.6;
    const pad = Math.min(W, H) * .06, s = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh);
    const ox = (W - bw * s) / 2, oy = (H - bh * s) / 2;
    S = SLOTS.map(([cx, cy, r]) => ({ x: ox + (land ? cx : cy) * s, y: oy + (land ? cy : cx) * s, r: r * s }));
    if (!C.length) C = EVENTS.map((ev, i) => ({ ev, ...S[i] }));
    else C.forEach(c => Object.assign(c, S[order.indexOf(c.ev)]));
  }
  // a soft, eased heartbeat: lub, then a smaller dub, then rest (120 BPM)
  const ease = v => v <= 0 || v >= 1 ? 0 : Math.sin(Math.PI * v) ** 2;
  const beat = t => { const p = (t % 500) / 500; return ease(p / .34) + .45 * ease((p - .36) / .3); };
  // hover: the chosen event takes the largest slot; the rest keep their order in the remaining slots. One beat, eased.
  function choose(ev) {
    const next = ev == null ? EVENTS.slice() : [ev].concat(EVENTS.filter(e => e !== ev));
    if (next.join() === order.join()) return;
    order = next; from = C.map(c => ({ x: c.x, y: c.y, r: c.r })); t0 = performance.now();
  }
  function settle(t) {
    if (!from) return;
    const p = Math.min(1, (t - t0) / 500), e = p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
    C.forEach((c, i) => { const g = S[order.indexOf(c.ev)], f = from[i]; c.x = f.x + (g.x - f.x) * e; c.y = f.y + (g.y - f.y) * e; c.r = f.r + (g.r - f.r) * e; });
    if (p >= 1) from = null;
  }
  function frame(t) {
    size(); settle(performance.now()); if (reduce) t = 0;
    const b = 1 + .016 * beat(t);
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, W, H);
    C.forEach((c, i) => {
      const r = c.r * b;
      x.fillStyle = '#000'; x.beginPath(); x.arc(c.x, c.y, r, 0, 6.283); x.fill();
      if (i === hover) { x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.font = `900 ${(c.r * .42 * b).toFixed(1)}px "Bodoni Moda", Didot, serif`; x.fillText(String(c.ev), c.x, c.y); }
    });
    requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    const i = C.findIndex(c => Math.hypot(mx - c.x, my - c.y) < c.r);
    hover = i;
    // choose only when settled, and only after the pointer has really moved since the last choice (no chain reactions)
    if (i >= 0 && !from && C[i].ev !== order[0] && (!lastXY || Math.hypot(mx - lastXY[0], my - lastXY[1]) > 40)) { choose(C[i].ev); lastXY = [mx, my]; }
    cv.style.cursor = hover >= 0 ? 'default' : '';
  });
  cv.addEventListener('pointerleave', () => { hover = -1; lastXY = null; choose(null); });
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
