/* RUPTURE — five bodies, one physics, every page.
   The five cataclysmic events are five circles with mass. They start in their columns (Rupture.layout),
   chase the pointer (heavier ones lag), collide with each other and the edges like billiard balls, breathe,
   and drift home when the pointer leaves.
   - On Event Horizon they are visible: black balls on red.
   - On every other page they are invisible magnifying lenses: content swells wherever one passes.
   Technique: one simulation in viewport space; each lens is an SVG displacement filter whose map is redrawn from the bodies.
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

  // ── invisible lens over an element's visible box
  const NS = 'http://www.w3.org/2000/svg', host = document.createElementNS(NS, 'svg');
  host.setAttribute('width', '0'); host.setAttribute('height', '0'); host.style.position = 'absolute'; document.body.appendChild(host);
  let n = 0;
  function lens(el, power = .55) {
    if (!el) return;
    const id = 'lens' + (n++), f = document.createElementNS(NS, 'filter');
    f.setAttribute('id', id); f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    f.innerHTML = `<feImage result="map" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G"/>`;
    host.appendChild(f);
    const img = f.querySelector('feImage'), disp = f.querySelector('feDisplacementMap'), cv = document.createElement('canvas'), x = cv.getContext('2d');
    let q = 2, W = 0, H = 0, lastDraw = 0;
    function size() {
      W = el.clientWidth; H = el.clientHeight; if (!W || !H) return;
      q = Math.max(2, Math.ceil(Math.max(W, H) / 800)); cv.width = Math.ceil(W / q); cv.height = Math.ceil(H / q);
      [f, img].forEach(e => { e.setAttribute('x', 0); e.setAttribute('y', 0); e.setAttribute('width', W); e.setAttribute('height', H); });
      el.style.filter = `url(#${id})`;
    }
    size(); new ResizeObserver(size).observe(el);
    subs.push(t => {
      if (!W || t - lastDraw < 33) return; lastDraw = t;         // ~30 updates a second
      const cw = cv.width, ch = cv.height, im = x.createImageData(cw, ch), d = im.data;
      const C = view(el, t).map(c => ({ x: c.x / q, y: c.y / q, r: c.r / q }));
      const scale = Math.max(1, ...C.map(c => c.r * power)) * 2.2;
      for (let i = 0; i < d.length; i += 4) { d[i] = 128; d[i + 1] = 128; d[i + 3] = 255; }
      C.forEach(c => {
        for (let py = Math.max(0, Math.floor(c.y - c.r)); py < Math.min(ch, Math.ceil(c.y + c.r)); py++)
          for (let px = Math.max(0, Math.floor(c.x - c.r)); px < Math.min(cw, Math.ceil(c.x + c.r)); px++) {
            const dx = px - c.x, dy = py - c.y, dd = Math.hypot(dx, dy); if (dd >= c.r) continue;
            const s = 1 - (dd / c.r) ** 2, k = power * s * s, o = (py * cw + px) * 4;
            d[o] = 128 + (-dx * k) / scale * 255; d[o + 1] = 128 + (-dy * k) / scale * 255;
          }
      });
      x.putImageData(im, 0, 0);
      const url = cv.toDataURL();
      img.setAttribute('href', url); img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url);   // Safari needs xlink
      disp.setAttribute('scale', String(scale * q));
    });
  }
  // a page can draw the bodies itself (Event Horizon)
  const watch = fn => subs.push(fn);
  return { YEARS, layout, breathe, lens, view, watch, sim: S };
})();
