/* RUPTURE — five bodies, one physics, every page.
   The five cataclysmic events are five circles with mass. They start in their columns (Rupture.layout),
   chase the pointer (heavier ones lag), collide with each other and the edges like billiard balls, breathe,
   and drift home when the pointer leaves.
   They live on Event Horizon: black balls on red. (The invisible lenses on other pages were removed.)
*/
window.Rupture = (() => {
  const YEARS = [2010, 2014, 2016, 2019, 2023];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SIZE = .46;                                                  // smaller than the original columns

  function layout(W, H) {                                            // home positions: one column per event, side by side
    const want = [.2, .26, .17, .23, .3], ys = [.44, .56, .4, .6, .5], m = 16, gap = 14;
    const sum = want.reduce((p, q) => p + q, 0), span = W - 2 * m - gap * (want.length - 1);
    const d = want.map(w => Math.min(H * .92, span * w / sum));
    const pad = (W - 2 * m - d.reduce((p, q) => p + q, 0) - gap * (want.length - 1)) / want.length;
    let cx = m;
    return YEARS.map((y, i) => { const c = { ev: y, x: cx + pad / 2 + d[i] / 2, y: ys[i] * H, r: d[i] / 2 }; cx += d[i] + gap + pad; return c; });
  }
  const breathe = (ev, t) => 1 + Math.sin(t / 2400 + ev) * .03;

  // ── the simulation (viewport coordinates)
  const S = { bodies: [], mouse: null, top: 0, W: 0, H: 0, t: 0 };
  function home() {
    S.top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--content-top')) || 0;
    S.W = innerWidth; S.H = innerHeight - S.top;
    const L = layout(S.W, S.H);
    if (!S.bodies.length) S.bodies = L.map(c => ({ ev: c.ev, x: c.x, y: c.y + S.top, vx: 0, vy: 0, r: c.r * SIZE }));
    S.bodies.forEach((b, i) => { b.hx = L[i].x; b.hy = L[i].y + S.top; b.r = L[i].r * SIZE; b.m = b.r * b.r; });
  }
  addEventListener('pointermove', e => S.mouse = { x: e.clientX, y: e.clientY });
  document.addEventListener('pointerleave', () => S.mouse = null);
  addEventListener('blur', () => S.mouse = null);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(home, 100); });

  function step(dt) {
    const B = S.bodies;
    B.forEach(b => {
      const tx = S.mouse ? S.mouse.x : b.hx, ty = S.mouse ? S.mouse.y : b.hy;
      const k = (S.mouse ? 9 : 4) / Math.sqrt(b.r);                 // heavier balls follow more slowly
      b.vx += (tx - b.x) * k * dt; b.vy += (ty - b.y) * k * dt;
      const damp = Math.pow(S.mouse ? .2 : .08, dt); b.vx *= damp; b.vy *= damp;
      b.x += b.vx * dt; b.y += b.vy * dt;
      // the edges are cushions
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * .8; } if (b.x > S.W - b.r) { b.x = S.W - b.r; b.vx = -Math.abs(b.vx) * .8; }
      if (b.y < S.top + b.r) { b.y = S.top + b.r; b.vy = Math.abs(b.vy) * .8; } if (b.y > innerHeight - b.r) { b.y = innerHeight - b.r; b.vy = -Math.abs(b.vy) * .8; }
    });
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {   // billiard collisions
      const a = B[i], b = B[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, min = a.r + b.r;
      if (d >= min) continue;
      const nx = dx / d, ny = dy / d, over = min - d, tm = a.m + b.m;
      a.x -= nx * over * b.m / tm; a.y -= ny * over * b.m / tm; b.x += nx * over * a.m / tm; b.y += ny * over * a.m / tm;
      const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rel > 0) continue;
      const imp = -(1 + .92) * rel / (1 / a.m + 1 / b.m);
      a.vx -= imp * nx / a.m; a.vy -= imp * ny / a.m; b.vx += imp * nx / b.m; b.vy += imp * ny / b.m;
    }
  }
  const subs = [];
  let last = 0;
  function loop(t) {
    const dt = Math.min(.05, (t - last) / 1000 || .016); last = t; S.t = t;
    if (!reduce) for (let s = 0; s < 3; s++) step(dt / 3);
    subs.forEach(f => f(t));
    requestAnimationFrame(loop);
  }
  const ready = () => { home(); requestAnimationFrame(loop); };
  if (document.readyState === 'complete') setTimeout(ready, 50); else addEventListener('load', ready);
  // bodies as seen from an element's box, breathing
  const view = (el, t) => { const r = el.getBoundingClientRect(); return S.bodies.map(b => ({ ev: b.ev, x: b.x - r.left, y: b.y - r.top, r: b.r * breathe(b.ev, t) })); };

  // a page can draw the bodies itself (Event Horizon)
  const watch = fn => subs.push(fn);
  return { YEARS, layout, breathe, view, watch, sim: S };
})();
