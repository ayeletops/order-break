/* EVENT HORIZON
   A slow starfield. Five black holes placed by year along the x-axis; light bends around them.
   Thin red vertical lines mark years (the grid, visible). Eight bright stars joined by thin lines: a constellation of the people I love
   (positions from the shuffled day and age values in css/grids.css — no dates).
   Only the year is shown beside each hole. Nothing else is said.
*/
(() => {
  const HOLES = [2010, 2014, 2016, 2019, 2023];
  const FROM = 2007, TO = 2026;
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const days = Stretch.weights('days'), ages = Stretch.weights('ages');
  let W, H, dpr, stars = [], tags = [];
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(20261115);   // fixed seed: the sky is the same for everyone

  function layout() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    stars = Array.from({ length: Math.round(W * H / 2200) }, () => ({ x: rnd() * W, y: rnd() * H, r: rnd() ** 3 * 1.6 + .25, a: .25 + rnd() * .75, tw: rnd() * 6.28 }));
    tags.forEach(t => t.remove()); tags = [];
    HOLES.forEach((y, i) => {
      const t = document.createElement('div'); t.className = 'tag'; t.textContent = y; document.body.appendChild(t); tags.push(t);
    });
  }
  const holeAt = (y, i) => {
    const hx = (y - FROM) / (TO - FROM) * W;
    const hy = H * [.32, .72, .26, .62, .42][i];
    const R = Math.max(18, Math.min(W, H) * (.035 + .012 * ((i * 3) % 4)));
    return { x: hx, y: hy, R };
  };
  // gravitational lensing: push star positions away from each hole (Einstein-ring-ish)
  function lens(px, py, hs) {
    for (const h of hs) {
      const dx = px - h.x, dy = py - h.y, d = Math.hypot(dx, dy) || 1, re = h.R * 2.2;
      if (d < re * 4) { const k = 1 + (re * re) / (d * d) * .5; px = h.x + dx * k; py = h.y + dy * k; }
    }
    return [px, py];
  }
  function frame(t) {
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#0b0b0b'; x.fillRect(0, 0, W, H);
    // red year lines
    x.strokeStyle = 'rgba(229,51,42,.55)'; x.lineWidth = 1;
    for (let y = FROM; y <= TO; y++) { const lx = Math.round((y - FROM) / (TO - FROM) * W) + .5; x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, H); x.stroke(); }
    const hs = HOLES.map(holeAt);
    // stars, drifting very slowly, bent around the holes
    const drift = (t / 1000) * 4;
    for (const s of stars) {
      let sx = (s.x + drift * s.r) % W, sy = s.y;
      [sx, sy] = lens(sx, sy, hs);
      x.globalAlpha = s.a * (.75 + .25 * Math.sin(t / 900 + s.tw));
      x.fillStyle = '#fff'; x.beginPath(); x.arc(sx, sy, s.r, 0, 6.283); x.fill();
    }
    x.globalAlpha = 1;
    // constellation of eight
    const pts = days.map((d, i) => [W * (.12 + .76 * (d / 31)), H * (.12 + .55 * ((ages[i] || 50) / 100))]);
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = .8; x.beginPath();
    pts.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); x.stroke();
    pts.forEach(([px, py]) => { x.fillStyle = '#fff'; x.beginPath(); x.arc(px, py, 2.2, 0, 6.283); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.25)'; x.beginPath(); x.arc(px, py, 6, 0, 6.283); x.stroke(); });
    // black holes: photon ring, accretion glow, event horizon
    hs.forEach((h, i) => {
      const glow = x.createRadialGradient(h.x, h.y, h.R * .9, h.x, h.y, h.R * 3.2);
      glow.addColorStop(0, 'rgba(255,255,255,.55)'); glow.addColorStop(.18, 'rgba(255,255,255,.12)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = glow; x.beginPath(); x.arc(h.x, h.y, h.R * 3.2, 0, 6.283); x.fill();
      x.save(); x.translate(h.x, h.y); x.rotate(-.35 + i * .2); x.scale(1, .28);       // accretion disc, tilted
      x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2.2; x.beginPath(); x.arc(0, 0, h.R * 1.9, 0, 6.283); x.stroke();
      x.restore();
      x.fillStyle = '#000'; x.beginPath(); x.arc(h.x, h.y, h.R, 0, 6.283); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 1.2; x.beginPath(); x.arc(h.x, h.y, h.R * 1.04 + Math.sin(t / 700 + i) * .6, 0, 6.283); x.stroke();
      const r = cv.getBoundingClientRect(); tags[i].style.left = (r.left + h.x) + 'px'; tags[i].style.top = (r.top + h.y + h.R * 1.9) + 'px';
    });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(frame);
  }
  layout(); addEventListener('resize', layout);
  new ResizeObserver(layout).observe(cv);
  requestAnimationFrame(frame);
})();
