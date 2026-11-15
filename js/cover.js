/* COVER
   - ayeletops, letter by letter, each letter stretched to fill a slot weighted by a day of birth (js/stretch.js)
   - hover a letter: its column widens, the others squeeze; an image appears INSIDE the letterform only.
     Documents only ever appear as redaction bars. Private categories stay redacted until each item is approved.
   - the size slider sets the row height; slot widths follow, so the line breaks move
   - on first load, the AI default is shown, redacted and removed
*/
(() => {
  const root = document.documentElement;
  const days = getComputedStyle(root).getPropertyValue('--cover-cols').trim().split(/\s+/).map(parseFloat);
  const cover = document.getElementById('cover');

  const GALLERY = [
    ['assets/img/gn-13-petri-dish.jpg', 'Vaccine Futures'], ['assets/img/gn-06-rna.jpg', 'Vaccine Futures'],
    ['assets/img/gn-15-bio-glove.jpg', 'Vaccine Futures'], ['assets/img/gn-09-opt-out-kit.jpg', 'Vaccine Futures'],
    ['assets/img/gn-07-material-design.jpg', 'Vaccine Futures'], ['assets/img/gn-03-outbreak-map.jpg', 'Vaccine Futures'],
    ['assets/img/proj-frequencies.jpg', 'Frequencies'], ['assets/img/proj-this-and-that.jpg', 'This and That'],
  ].map(([src, cap]) => { const img = new Image(); img.src = src; return { img, cap }; })
   .concat([{ bars: 5, cap: 'ticket — redacted' }, { bars: 7, cap: 'bill — redacted' }, { bars: 4, cap: 'family — pending' }, { bars: 3, cap: 'me — pending' }, { bars: 3, cap: 'cats — pending' }]);
  const rand = a => a[Math.floor(Math.random() * a.length)];

  Stretch.make(cover, 'ayeletops', days, {
    index: true, caption: true, grow: 2.6, every: 900,
    onEnter: s => { s.fill = rand(GALLERY); s.el.querySelector('.st-cap').textContent = s.fill.cap; },
    onLeave: s => { s.el.querySelector('.st-cap').textContent = ''; },
  });

  // size slider
  const fs = document.getElementById('fs'), fsv = document.getElementById('fsv');
  const setFs = v => { cover.style.setProperty('--fs', v); fsv.textContent = v; fs.value = v; };
  fs.addEventListener('input', e => setFs(e.target.value));
  setFs(Math.round(Math.min(300, Math.max(90, innerHeight / 3.4))));

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
