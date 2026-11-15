/* STRETCH TYPE — the shared title language.
   A word is set letter by letter into slots. Slot widths come from the page's grid (birthdays).
   Each letter is stretched non-uniformly to fill its slot exactly: the grid deforms the type.
   Hover widens a slot; its neighbours squeeze; every letter re-stretches live.
   Letters keep mutating between fonts/weights of the family, and sometimes become a symbol
   drawn from the same fonts. Optional: on hover, an image fills the letterform (seen only through the letter).
   Ref: Julien von Schultzendorff (stretching columns, raw type) · Jo Iijima (mutating type in a grid).
*/
window.Stretch = (() => {
  const FACES = [
    { f: 'Bodoni Moda', w: 900, s: 'normal' }, { f: 'Bodoni Moda', w: 900, s: 'italic' }, { f: 'Bodoni Moda', w: 400, s: 'italic' },
    { f: 'Abril Fatface', w: 400, s: 'normal' },
    { f: 'Zilla Slab', w: 700, s: 'normal' }, { f: 'Zilla Slab', w: 300, s: 'italic' },
    { f: 'Alfa Slab One', w: 400, s: 'normal' },
    { f: 'Courier Prime', w: 700, s: 'normal' }, { f: 'Courier Prime', w: 400, s: 'italic' },
    { f: 'Special Elite', w: 400, s: 'normal' },
  ];
  const SYMBOLS = ['&', '§', '¶', '†', '‡', '*', '@', '#', '?'];   // drawn from the same fonts, not a separate set
  const fontStr = (fc, px) => `${fc.s} ${fc.w} ${px}px "${fc.f}"`;
  const rand = a => a[Math.floor(Math.random() * a.length)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ready = Promise.all(FACES.map(fc => document.fonts.load(fontStr(fc, 100), 'a&§')).concat(document.fonts.ready)).catch(() => {});

  function make(container, word, weights, opt = {}) {
    const color = opt.color || '#0b0b0b';
    const slots = [];
    [...word].forEach((ch, i) => {
      const s = document.createElement('div');
      s.className = 'st-slot';
      const d = weights[i % weights.length];
      s.style.setProperty('--d', d);
      s.dataset.d = d;
      const c = document.createElement('canvas');
      s.appendChild(c);
      if (opt.index) s.insertAdjacentHTML('afterbegin', `<span class="st-idx">${String(i + 1).padStart(2, '0')}</span>`);
      if (opt.caption) s.insertAdjacentHTML('beforeend', `<span class="st-cap"></span>`);
      container.appendChild(s);
      const slot = { el: s, c, ch, glyph: ch, face: FACES[0], fill: null };
      slots.push(slot);
      if (opt.hover !== false) {
        s.addEventListener('mouseenter', () => { s.style.setProperty('--grow', opt.grow || 2.4); if (opt.onEnter) opt.onEnter(slot); draw(slot); });
        s.addEventListener('mouseleave', () => { s.style.removeProperty('--grow'); slot.fill = null; if (opt.onLeave) opt.onLeave(slot); draw(slot); });
      }
      if (opt.href) { s.style.cursor = 'pointer'; s.addEventListener('click', () => location.href = opt.href); }
    });

    function draw(slot) {
      const r = slot.el.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height - 14));   // minus rule + padding
      const c = slot.c; if (c.width !== W * dpr || c.height !== H * dpr) { c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; }
      const x = c.getContext('2d');
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
      x.font = fontStr(slot.face, 200); x.textBaseline = 'alphabetic';
      const m = x.measureText(slot.glyph);
      const gw = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || 1, gh = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || 1;
      x.setTransform(W / gw * dpr, 0, 0, H / gh * dpr, 0, 0);
      x.fillStyle = color;
      x.fillText(slot.glyph, m.actualBoundingBoxLeft, m.actualBoundingBoxAscent);
      if (slot.fill) {               // image or redaction seen only through the letterform
        x.setTransform(dpr, 0, 0, dpr, 0, 0); x.globalCompositeOperation = 'source-in';
        if (slot.fill.img && slot.fill.img.complete) {
          const im = slot.fill.img, k = Math.max(W / im.naturalWidth, H / im.naturalHeight);
          x.filter = 'grayscale(1) contrast(1.15)';
          x.drawImage(im, (W - im.naturalWidth * k) / 2, (H - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k);
          x.filter = 'none';
        } else if (slot.fill.bars) {
          x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.fillStyle = color;
          const n = slot.fill.bars; for (let k = 0; k < n; k++) x.fillRect(W * .08, H * (.12 + k * .8 / n), W * (.4 + ((k * 37) % 55) / 100), H * .8 / n * .55);
        }
        x.globalCompositeOperation = 'source-over';
      }
    }
    const drawAll = () => slots.forEach(draw);

    // live re-stretch while widths change (hover transitions, resize, slider)
    const ro = new ResizeObserver(drawAll); slots.forEach(s => ro.observe(s.el));
    if (container.classList.contains('page-title'))   // content below a page title follows its real (wrapped) height
      new ResizeObserver(() => document.documentElement.style.setProperty('--title-h', container.offsetHeight + 'px')).observe(container);
    ready.then(drawAll);

    // mutation: one slot flickers through faces/symbols, then resolves — always returning to a letter (a loop, not a drift)
    function mutate() {
      const s = rand(slots); let n = 0;
      const t = setInterval(() => {
        if (n++ < 5) { s.face = rand(FACES); s.glyph = Math.random() < .3 ? rand(SYMBOLS) : s.ch; }
        else { clearInterval(t); s.face = rand(FACES); s.glyph = s.ch; }
        draw(s);
      }, 75);
    }
    if (!reduce && opt.mutate !== false) setInterval(mutate, opt.every || 1100);
    slots.forEach(s => { s.face = rand(FACES); });
    return { slots, drawAll, draw };
  }
  // the page's own grid as weights: cover → days, field → ages, work → year gaps, holes → months
  function weights(kind) {
    const root = getComputedStyle(document.documentElement);
    if (kind === 'days') return root.getPropertyValue('--cover-cols').trim().split(/\s+/).map(parseFloat);
    if (kind === 'gaps') return root.getPropertyValue('--work-intervals').trim().split(/\s+/).map(parseFloat);
    const probe = (cls, prop) => { const e = document.createElement('i'); e.className = cls; e.style.display = 'none'; document.body.appendChild(e);
      const v = parseFloat(getComputedStyle(e).getPropertyValue(prop)); e.remove(); return v; };
    if (kind === 'ages') return [1,2,3,4,5,6,7,8].map(i => probe('ring-' + i, '--r'));
    if (kind === 'months') return [1,2,3,4,5,6,7,8].map(i => probe('hole-' + i, '--size'));
    return [1];
  }
  return { make, weights, FACES };
})();
