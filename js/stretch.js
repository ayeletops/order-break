/* STRETCH TYPE — the shared title language.
   A word is set letter by letter into slots. Slot widths come from the page's grid (birthdays).
   Each letter is stretched non-uniformly to fill its slot exactly: the grid deforms the type.
   Hover widens a slot; its neighbours squeeze; every letter re-stretches live.
   Letters keep mutating between fonts/weights of the family, and sometimes become a symbol
   drawn from the same fonts. No images: only letters and symbols. setWord() swaps the word letter by letter.
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
      container.appendChild(s);
      const slot = { el: s, c, ch, glyph: ch, face: FACES[0] };
      slots.push(slot);
      if (opt.hover !== false) {
        s.addEventListener('mouseenter', () => { s.style.setProperty('--grow', opt.grow || 2.4); if (opt.onEnter) opt.onEnter(slot); draw(slot); });
        s.addEventListener('mouseleave', () => { s.style.removeProperty('--grow'); if (opt.onLeave) opt.onLeave(slot); draw(slot); });
      }
      if (opt.href) { s.style.cursor = 'pointer'; s.addEventListener('click', () => location.href = opt.href); }
    });

    function draw(slot) {
      const r = slot.el.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));   // the letter fills the whole block
      const c = slot.c; if (c.width !== W * dpr || c.height !== H * dpr) { c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; }
      const x = c.getContext('2d');
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
      x.font = fontStr(slot.face, 200); x.textBaseline = 'alphabetic';
      const m = x.measureText(slot.glyph);
      const gw = (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) || 1, gh = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || 1;
      x.setTransform(W / gw * dpr, 0, 0, H / gh * dpr, 0, 0);
      x.fillStyle = color;
      x.fillText(slot.glyph, m.actualBoundingBoxLeft, m.actualBoundingBoxAscent);
    }
    const drawAll = () => slots.forEach(draw);

    // live re-stretch while widths change (hover transitions, resize, slider)
    const ro = new ResizeObserver(drawAll); slots.forEach(s => ro.observe(s.el));
    const head = container.closest('.page-head');   // content below a page header follows its real (wrapped) height
    if (head) {
      const set = () => document.documentElement.style.setProperty('--content-top', Math.ceil(head.getBoundingClientRect().bottom) + 'px');
      new ResizeObserver(set).observe(head); addEventListener('resize', set); ready.then(set); set();
    }
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

    // swap to another word of the same length: each slot flickers, staggered, then lands on its new letter
    function setWord(w) {
      [...w].forEach((ch, i) => {
        const s = slots[i]; if (!s) return;
        setTimeout(() => {
          let n = 0;
          const t = setInterval(() => {
            if (n++ < 6) { s.face = rand(FACES); s.glyph = Math.random() < .5 ? rand(SYMBOLS) : (Math.random() < .5 ? s.ch : ch); }
            else { clearInterval(t); s.ch = ch; s.glyph = ch; s.face = rand(FACES); }
            draw(s);
          }, 60);
        }, i * 70);
      });
    }
    return { slots, drawAll, draw, setWord };
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
