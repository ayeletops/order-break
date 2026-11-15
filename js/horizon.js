/* EVENT HORIZON — subtle.
   A dim, slowly drifting starfield. Five black holes: small discs you notice mostly by absence —
   stars bend around them and vanish at the edge. A hairline ring, a year beneath. Nothing else is said.
   Faint red year lines (the grid). A faint constellation of eight stars: the people I love
   (positions from the shuffled day and age values in css/grids.css — no dates).
*/
(() => {
  const HOLES = [2010, 2014, 2016, 2019, 2023];
  const FROM = 2007, TO = 2026;
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const days = Stretch.weights('days'), ages = Stretch.weights('ages');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, stars = [], tags = [], mouse = { x: 0, y: 0 }, hover = -1;
  const seed = s => () => (s = (s * 16807) % 2147483647) / 2147483647;

  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
    const rnd = seed(20261115);
    stars = Array.from({ length: Math.round(W * H / 1500) }, () => ({ x: rnd() * W, y: rnd() * H, r: rnd() ** 4 * 1.3 + .3, a: .12 + rnd() ** 2 * .6, tw: rnd() * 6.28, z: .3 + rnd() * .7 }));
    tags.forEach(t => t.remove());
    tags = HOLES.map(y => { const t = document.createElement('div'); t.className = 'tag'; t.textContent = y; document.body.appendChild(t); return t; });
  }
  const holes = () => HOLES.map((y, i) => ({
    x: (y - FROM + .5) / (TO - FROM + 1) * W,
    y: H * [.36, .64, .30, .58, .44][i],
    R: Math.max(7, Math.min(W, H) * [.016, .022, .013, .019, .025][i]),
  }));
  function lens(px, py, hs) {           // light bends around each hole; inside the horizon it disappears
    for (const h of hs) {
      const dx = px - h.x, dy = py - h.y, d2 = dx * dx + dy * dy, re = h.R * 2.6;
      if (d2 < (h.R * 1.05) ** 2) return null;
      if (d2 < (re * 5) ** 2) { const k = 1 + (re * re) / d2 * .45; px = h.x + dx * k; py = h.y + dy * k; }
    }
    return [px, py];
  }
  function frame(t) {
    layout();
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#060606'; x.fillRect(0, 0, W, H);
    // the grid: faint red year lines
    x.strokeStyle = 'rgba(229,51,42,.22)'; x.lineWidth = 1;
    for (let y = FROM; y <= TO + 1; y++) { const lx = Math.round((y - FROM) / (TO - FROM + 1) * W) + .5; x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, H); x.stroke(); }
    const hs = holes();
    const px = (mouse.x - .5) * 10, py = (mouse.y - .5) * 6, drift = reduce ? 0 : t / 1000 * 2.2;
    for (const s of stars) {
      const p = lens(((s.x + drift * s.z + px * s.z) % W + W) % W, s.y + py * s.z, hs); if (!p) continue;
      x.globalAlpha = s.a * (reduce ? 1 : .8 + .2 * Math.sin(t / 1300 + s.tw));
      x.fillStyle = '#fff'; x.beginPath(); x.arc(p[0], p[1], s.r, 0, 6.283); x.fill();
    }
    x.globalAlpha = 1;
    // constellation, faint
    const pts = days.map((d, i) => [W * (.1 + .8 * (d / 31)), H * (.14 + .6 * ((ages[i] || 50) / 100))]);
    x.strokeStyle = 'rgba(255,255,255,.12)'; x.lineWidth = .7; x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke();
    pts.forEach(([a, b]) => { x.fillStyle = 'rgba(255,255,255,.75)'; x.beginPath(); x.arc(a, b, 1.6, 0, 6.283); x.fill(); });
    // holes: true black, a hairline photon ring, a faint dark shadow
    const cr = cv.getBoundingClientRect();
    hs.forEach((h, i) => {
      const sh = x.createRadialGradient(h.x, h.y, h.R, h.x, h.y, h.R * 3); sh.addColorStop(0, 'rgba(0,0,0,.9)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = sh; x.beginPath(); x.arc(h.x, h.y, h.R * 3, 0, 6.283); x.fill();
      x.fillStyle = '#000'; x.beginPath(); x.arc(h.x, h.y, h.R, 0, 6.283); x.fill();
      x.strokeStyle = `rgba(255,255,255,${hover === i ? .9 : .38})`; x.lineWidth = .8;
      x.beginPath(); x.arc(h.x, h.y, h.R * 1.08, 0, 6.283); x.stroke();
      const tg = tags[i]; tg.style.left = (cr.left + h.x) + 'px'; tg.style.top = (cr.top + h.y + h.R * 1.08 + 14) + 'px'; tg.classList.toggle('on', hover === i);
    });
    if (!reduce) requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect(); mouse = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    const hs = holes(); hover = hs.findIndex(h => Math.hypot(e.clientX - r.left - h.x, e.clientY - r.top - h.y) < h.R * 3);
  });
  cv.addEventListener('pointerleave', () => hover = -1);
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
