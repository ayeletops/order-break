/* RUPTURE — the five cataclysmic events: one shared layout and one heartbeat.
   Used by Event Horizon (five large black holes on red). 120 BPM: lub-dub every 500ms, matching CSS --beat.
*/
window.Rupture = (() => {
  const YEARS = [2010, 2014, 2016, 2019, 2023];
  function layout(W, H) {             // one column per event, side by side, each as wide as its circle (order kept, spacing not)
    const want = [.2, .26, .17, .23, .3], ys = [.44, .56, .4, .6, .5], m = 16, gap = 14;
    const sum = want.reduce((p, q) => p + q, 0), span = W - 2 * m - gap * (want.length - 1);
    const d = want.map(w => Math.min(H * .92, span * w / sum));
    const pad = (W - 2 * m - d.reduce((p, q) => p + q, 0) - gap * (want.length - 1)) / want.length;
    let cx = m;
    return YEARS.map((y, i) => { const c = { ev: y, x: cx + pad / 2 + d[i] / 2, y: ys[i] * H, r: d[i] / 2 }; cx += d[i] + gap + pad; return c; });
  }
  const ease = v => v <= 0 || v >= 1 ? 0 : Math.sin(Math.PI * v) ** 2;
  const beat = t => { const p = (t % 500) / 500; return ease(p / .34) + .45 * ease((p - .36) / .3); };
  return { YEARS, layout, beat };
})();
