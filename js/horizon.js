/* EVENT HORIZON — five large black holes on red. They beat at 120 BPM (lub-dub every half second).
   Hover one: it shows its year. Nothing else is said.
*/
(() => {
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, hover = -1, C = [];
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
    C = Rupture.layout(W, H);                                  // one column per event, as large as it can be without touching
  }
  function frame(t) {
    size(); if (reduce) t = 0;
    const b = 1 + .05 * Rupture.beat(t);                        // the heartbeat
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#e5332a'; x.fillRect(0, 0, W, H);
    C.forEach((c, i) => {
      const r = c.r * .96 * b;
      x.fillStyle = '#000'; x.beginPath(); x.arc(c.x, c.y, r, 0, 6.283); x.fill();
      if (i === hover) { x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.font = `900 ${Math.round(c.r * .5)}px "Bodoni Moda", Didot, serif`; x.fillText(String(c.ev), c.x, c.y); }
    });
    requestAnimationFrame(frame);
  }
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); hover = C.findIndex(c => Math.hypot(e.clientX - r.left - c.x, e.clientY - r.top - c.y) < c.r); });
  cv.addEventListener('pointerleave', () => hover = -1);
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
