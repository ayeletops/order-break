/* EVENT HORIZON — five black holes on red, filling the screen. Each is an eclipse: a true-black core,
   a faint corona, and an edge that fades into the red. They beat at 120 BPM. Hover one: its year.
   Placement: scattered by the secret offsets (js/placement.js), then relaxed so the cores never touch.
*/
(() => {
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OFF = (window.PLACEMENT && PLACEMENT.offsets) || [[0, 0]];
  let W = 0, H = 0, dpr = 1, hover = -1, C = [];
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
    const m = Math.min(W, H), want = [.34, .44, .3, .4, .5];          // big: together they cover most of the screen
    C = Rupture.YEARS.map((y, i) => {
      const o = OFF[(i * 7 + 3) % OFF.length];
      return { ev: y, x: W * (.5 + o[0] * .42), y: H * (.5 + o[1] * .4), r: m * want[i] * .5 };
    });
    for (let it = 0; it < 200; it++) C.forEach((a, i) => C.forEach((b, j) => {   // relax: cores never touch, stay mostly on screen
      if (j <= i) return; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, min = (a.r + b.r) * .92;
      if (d < min) { const p = (min - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * p; a.y -= ny * p; b.x += nx * p; b.y += ny * p; }
    }));
    C.forEach(c => { c.x = Math.max(c.r * .55, Math.min(W - c.r * .55, c.x)); c.y = Math.max(c.r * .5, Math.min(H - c.r * .5, c.y)); });
  }
  function hole(c, r) {
    // corona: a thin pale ring just outside the core, fading out
    let g = x.createRadialGradient(c.x, c.y, r * .96, c.x, c.y, r * 1.5);
    g.addColorStop(0, 'rgba(255,236,226,.55)'); g.addColorStop(.06, 'rgba(255,214,200,.28)'); g.addColorStop(.35, 'rgba(255,190,170,.06)'); g.addColorStop(1, 'rgba(255,190,170,0)');
    x.fillStyle = g; x.beginPath(); x.arc(c.x, c.y, r * 1.5, 0, 6.283); x.fill();
    // the edge fades from black into the red
    g = x.createRadialGradient(c.x, c.y, r * .7, c.x, c.y, r * 1.08);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.72, 'rgba(0,0,0,1)'); g.addColorStop(.86, 'rgba(0,0,0,.82)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.beginPath(); x.arc(c.x, c.y, r * 1.08, 0, 6.283); x.fill();
  }
  function frame(t) {
    size(); if (reduce) t = 0;
    const b = 1 + .045 * Rupture.beat(t);
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'source-over';
    C.forEach(c => hole(c, c.r * b));
    if (hover >= 0) { const c = C[hover]; x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `900 ${Math.round(c.r * .42)}px "Bodoni Moda", Didot, serif`; x.fillText(String(c.ev), c.x, c.y); }
    requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = -1, bd = Infinity; C.forEach((c, i) => { const d = Math.hypot(mx - c.x, my - c.y); if (d < c.r && d / c.r < bd) { bd = d / c.r; best = i; } }); hover = best; });
  cv.addEventListener('pointerleave', () => hover = -1);
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
