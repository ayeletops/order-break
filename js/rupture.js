/* RUPTURE — the break that the grid can't absorb.
   The five event years (the black holes of Event Horizon) buckle the grid on every page, without saying why:
   - Home: the blocks that fall on those years slip out of line, a bad cut left alone.
   - Work: the columns of those years tear; bars passing through them are cut.
   - ROI and Event Horizon: the field tears in bursts.
   And everywhere, at irregular intervals, the page itself tears: a short horizontal glitch,
   like a dropped frame or a broken timecode. Black, white and the system's red only.
*/
window.Rupture = (() => {
  const YEARS = [2010, 2014, 2016, 2019, 2023];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // an SVG tear filter: horizontal displacement driven by stretched noise
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.style.position = 'absolute';
  svg.innerHTML = `<filter id="tear" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feTurbulence id="tear-noise" type="fractalNoise" baseFrequency="0.0004 0.09" numOctaves="1" seed="3" result="n"/>
      <feDisplacementMap id="tear-map" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="A"/>
    </filter>`;
  document.body.appendChild(svg);
  const map = svg.querySelector('#tear-map'), noise = svg.querySelector('#tear-noise');

  // one glitch burst on an element: a few frames of tearing, a jolt, then clean
  function burst(el, strength = 1) {
    if (reduce || !el) return;
    const frames = 5 + Math.floor(Math.random() * 5);
    let f = 0;
    el.classList.add('tearing');
    const step = () => {
      const still = el.dataset.still !== undefined;   // elements that move themselves keep their own transform
      if (f++ >= frames) { el.style.filter = ''; if (!still) el.style.transform = ''; el.classList.remove('tearing'); return; }
      noise.setAttribute('seed', Math.floor(Math.random() * 999));
      noise.setAttribute('baseFrequency', `0.0004 ${(0.03 + Math.random() * 0.12).toFixed(3)}`);
      map.setAttribute('scale', String(Math.round((20 + Math.random() * 90) * strength)));
      el.style.filter = 'url(#tear)';
      if (!still) el.style.transform = Math.random() < .4 ? `translate(${Math.round((Math.random() - .5) * 18 * strength)}px, ${Math.round((Math.random() - .5) * 4)}px)` : '';
      setTimeout(step, 40 + Math.random() * 50);
    };
    step();
  }
  // tear at irregular intervals; a dense cluster now and then
  function schedule(el, base = 7000) {
    if (reduce || !el) return;
    const next = () => setTimeout(() => {
      burst(el, .6 + Math.random() * .8);
      if (Math.random() < .3) setTimeout(() => burst(el, 1.2), 160 + Math.random() * 200);
      next();
    }, base * (.35 + Math.random()));
    setTimeout(() => burst(el, 1), 900);   // one tear soon after arriving
    next();
  }
  return { YEARS, burst, schedule };
})();
