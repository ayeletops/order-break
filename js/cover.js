/* COVER
   - letters sit in slots whose widths are weighted by the 8 days of birth (cycling)
   - each letter keeps mutating between Bodoni, Bodoni italic, slab, typewriter and a symbol, then resolves
   - hover a slot: a random item from the gallery appears inside it. Documents only ever appear redacted.
   - the size slider sets the type size; slot widths follow it, so the line breaks move
   - on first load, the AI default is shown, redacted and removed
*/
(() => {
  const NAME = 'ayeletops';
  const STYLES = ['bodoni', 'bodoni-i', 'slab', 'type'];
  const SYMBOLS = ['∿', '☣', '◎', '⌁', '≋', '⊕', '✳', '⧖', '◐', '⚕'];   // waves, hazard, signal, health: my subjects as glyphs

  // gallery: my own work as images; private categories as redacted cards until each item is approved
  const GALLERY = [
    { img: 'assets/img/gn-13-petri-dish.jpg', cap: 'Vaccine Futures — petri dish' },
    { img: 'assets/img/gn-06-rna.jpg', cap: 'Vaccine Futures — RNA' },
    { img: 'assets/img/gn-15-bio-glove.jpg', cap: 'Vaccine Futures — bio glove' },
    { img: 'assets/img/gn-09-opt-out-kit.jpg', cap: 'Vaccine Futures — opt-out kit' },
    { img: 'assets/img/gn-07-material-design.jpg', cap: 'Vaccine Futures — material' },
    { img: 'assets/img/gn-03-outbreak-map.jpg', cap: 'Vaccine Futures — outbreak map' },
    { img: 'assets/img/proj-frequencies.jpg', cap: 'Frequencies' },
    { img: 'assets/img/proj-this-and-that.jpg', cap: 'This and That — luz bone' },
    { doc: 4, cap: 'ticket — redacted' },
    { doc: 6, cap: 'bill — redacted' },
    { doc: 3, cap: 'family — pending consent' },
    { doc: 2, cap: 'me — pending' },
    { doc: 2, cap: 'cats — pending' },
  ];

  const root = document.documentElement;
  const days = getComputedStyle(root).getPropertyValue('--cover-cols').trim().split(/\s+/).map(parseFloat);
  const cover = document.getElementById('cover');
  const rand = a => a[Math.floor(Math.random() * a.length)];

  // build slots
  const slots = [...NAME].map((ch, i) => {
    const s = document.createElement('div');
    s.className = 'slot';
    s.style.setProperty('--d', days[i % days.length]);
    s.innerHTML = `<span class="idx">${String(i + 1).padStart(2, '0')}</span><span class="g bodoni">${ch}</span><figure></figure>`;
    s.addEventListener('mouseenter', () => fill(s.querySelector('figure')));
    cover.appendChild(s);
    return { el: s, g: s.querySelector('.g'), ch };
  });

  function fill(fig) {
    const item = rand(GALLERY);
    fig.className = item.doc ? 'doc' : '';
    fig.innerHTML = item.doc
      ? Array.from({ length: item.doc }, (_, k) => `<span class="bar" style="width:${40 + ((k * 37) % 60)}%"></span>`).join('') + `<figcaption>${item.cap}</figcaption>`
      : `<img src="${item.img}" alt=""><figcaption>${item.cap}</figcaption>`;
  }

  // mutation: one slot at a time flickers through styles/symbols, then resolves to a style
  function mutate() {
    const s = rand(slots);
    let n = 0;
    const flick = setInterval(() => {
      if (n++ < 5) {
        const sym = Math.random() < .35;
        s.g.className = 'g ' + (sym ? 'sym' : rand(STYLES));
        s.g.textContent = sym ? rand(SYMBOLS) : s.ch;
      } else {
        clearInterval(flick);
        s.g.className = 'g ' + rand(STYLES);
        s.g.textContent = s.ch;
      }
    }, 70);
  }
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(mutate, 900);

  // size slider
  const fs = document.getElementById('fs'), fsv = document.getElementById('fsv');
  const setFs = v => { cover.style.setProperty('--fs', v); fsv.textContent = v; };
  fs.addEventListener('input', e => setFs(e.target.value));
  setFs(Math.round(Math.min(220, Math.max(72, innerWidth / 7))));
  fs.value = cover.style.getPropertyValue('--fs');

  // the default: shown, redacted line by line, removed
  const def = document.getElementById('default');
  function playDefault() {
    def.classList.remove('gone', 'redacted');
    const lines = def.querySelectorAll('.ln');
    lines.forEach(l => l.style.setProperty('--dl', '0s'));
    setTimeout(() => {
      lines.forEach((l, i) => l.style.setProperty('--dl', `${i * 0.18}s`));
      def.classList.add('redacted');
      setTimeout(() => def.classList.add('gone'), 1600 + lines.length * 180);
    }, 1400);
  }
  playDefault();
  document.getElementById('replay').addEventListener('click', e => { e.preventDefault(); scrollTo(0, 0); playDefault(); });
})();
