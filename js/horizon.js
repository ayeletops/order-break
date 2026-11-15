/* EVENT HORIZON — on red, five black balls: the cataclysmic events.
   They are the same bodies as the invisible lenses on every other page (js/rupture.js):
   they chase the pointer, collide like billiard balls, breathe, and drift home.
   Hover a ball: it turns white and shows its year. Nothing else is said. The grid is invisible here.
*/
(() => {
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1, hover = -1;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
  }
  Rupture.watch(t => {
    size();
    const C = Rupture.view(cv, t), m = Rupture.sim.mouse, r = cv.getBoundingClientRect();
    hover = m ? C.findIndex(c => Math.hypot(m.x - r.left - c.x, m.y - r.top - c.y) < c.r) : -1;
    cv.style.cursor = hover >= 0 ? 'default' : '';
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, W, H);
    C.forEach((c, i) => {
      const on = i === hover;
      x.fillStyle = on ? '#fff' : '#000'; x.beginPath(); x.arc(c.x, c.y, c.r * (on ? 1.03 : 1), 0, 6.283); x.fill();
      if (on) { x.fillStyle = '#000'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.font = `900 ${Math.round(c.r * .55)}px "Bodoni Moda", Didot, serif`; x.fillText(String(c.ev), c.x, c.y); }
    });
  });
})();
