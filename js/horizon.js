/* EVENT HORIZON — five black holes on red, composed like a printed poster.
   Strict edges. One dominant, the rest stepping down, none touching. They beat at 120 BPM, gently and eased;
   on hover the year appears and beats with its hole.
   The composition is fixed in a 1.6 × 1 frame (landscape) and transposed for portrait screens.
*/
(() => {
  const cv = document.getElementById('sky'), x = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COMP = [[2023, 1.16, .52, .36], [2014, .50, .38, .26], [2019, .64, .82, .15], [2010, .16, .74, .13], [2016, .84, .11, .09]];
  let W = 0, H = 0, dpr = 1, hover = -1, C = [];
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect(); if (r.width === W && r.height === H) return;
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr;
    const land = W >= H, bw = land ? 1.6 : 1, bh = land ? 1 : 1.6;
    const pad = Math.min(W, H) * .06, s = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh);
    const ox = (W - bw * s) / 2, oy = (H - bh * s) / 2;
    C = COMP.map(([ev, cx, cy, r]) => ({ ev, x: ox + (land ? cx : cy) * s, y: oy + (land ? cy : cx) * s, r: r * s }));
  }
  // a soft, eased heartbeat: lub, then a smaller dub, then rest (120 BPM)
  const ease = v => v <= 0 || v >= 1 ? 0 : Math.sin(Math.PI * v) ** 2;
  const beat = t => { const p = (t % 500) / 500; return ease(p / .34) + .45 * ease((p - .36) / .3); };
  function frame(t) {
    size(); if (reduce) t = 0;
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
  cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); hover = C.findIndex(c => Math.hypot(e.clientX - r.left - c.x, e.clientY - r.top - c.y) < c.r); cv.style.cursor = hover >= 0 ? 'default' : ''; });
  cv.addEventListener('pointerleave', () => hover = -1);
  addEventListener('resize', () => { W = 0; });
  requestAnimationFrame(frame);
})();
