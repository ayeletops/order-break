/* RUPTURE — five invisible lenses.
   The five cataclysmic events (the black balls of Event Horizon) lie under the other pages as circles you never see.
   Wherever one sits, the grid and everything on it blows up, as if under a magnifying glass.
   The order is intact everywhere else; only there does it swell.
   Technique: an SVG displacement filter whose map is drawn from the circles (each pixel inside a circle samples
   from closer to the centre, so the content appears enlarged).
*/
window.Rupture = (() => {
  const YEARS = [2010, 2014, 2016, 2019, 2023];
  const NS = 'http://www.w3.org/2000/svg';
  const host = document.createElementNS(NS, 'svg');
  host.setAttribute('width', '0'); host.setAttribute('height', '0'); host.style.position = 'absolute';
  document.body.appendChild(host);
  let n = 0;

  // lens(el, circlesFn, power): circlesFn(w, h) → [{x, y, r}] in the element's own pixels
  function lens(el, circlesFn, power = .5) {
    if (!el) return;
    const id = 'lens' + (n++);
    const f = document.createElementNS(NS, 'filter');
    f.setAttribute('id', id); f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse');
    f.setAttribute('color-interpolation-filters', 'sRGB');
    f.innerHTML = `<feImage result="map" preserveAspectRatio="none"/><feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G"/>`;
    host.appendChild(f);
    const img = f.querySelector('feImage'), disp = f.querySelector('feDisplacementMap');
    function build() {
      const w = el.scrollWidth || el.offsetWidth, h = el.scrollHeight || el.offsetHeight; if (!w || !h) return;
      const C = circlesFn(w, h), q = Math.max(1, Math.ceil(Math.max(w, h) / 2400));   // map resolution (finer = smoother lens)
      const cw = Math.ceil(w / q), ch = Math.ceil(h / q), cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      const x = cv.getContext('2d'), id_ = x.createImageData(cw, ch), d = id_.data;
      const maxOff = Math.max(1, ...C.map(c => c.r * power)) / q, scale = maxOff * 2.2;
      for (let i = 0; i < d.length; i += 4) { d[i] = 128; d[i + 1] = 128; d[i + 2] = 128; d[i + 3] = 255; }
      C.forEach(c => {
        const cx = c.x / q, cy = c.y / q, r = c.r / q;
        for (let py = Math.max(0, Math.floor(cy - r)); py < Math.min(ch, Math.ceil(cy + r)); py++)
          for (let px = Math.max(0, Math.floor(cx - r)); px < Math.min(cw, Math.ceil(cx + r)); px++) {
            const dx = px - cx, dy = py - cy, dd = Math.hypot(dx, dy); if (dd >= r) continue;
            const t = 1 - (dd / r) ** 2, k = power * t * t;      // strongest at the centre, zero at the rim
            const o = (py * cw + px) * 4;
            d[o] = Math.max(0, Math.min(255, 128 + (-dx * k) / scale * 255));
            d[o + 1] = Math.max(0, Math.min(255, 128 + (-dy * k) / scale * 255));
          }
      });
      x.putImageData(id_, 0, 0);
      const url = cv.toDataURL();
      img.setAttribute('href', url); img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url);   // Safari needs xlink
      img.setAttribute('x', 0); img.setAttribute('y', 0); img.setAttribute('width', w); img.setAttribute('height', h);
      f.setAttribute('x', 0); f.setAttribute('y', 0); f.setAttribute('width', w); f.setAttribute('height', h);
      disp.setAttribute('scale', String(scale * q));
      el.style.filter = `url(#${id})`;
    }
    build();
    let t; new ResizeObserver(() => { clearTimeout(t); t = setTimeout(build, 120); }).observe(el);
    return { build };
  }
  return { YEARS, lens };
})();
