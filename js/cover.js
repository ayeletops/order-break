/* HOME / COVER
   - the name, letter by letter, each letter stretched to fill its whole block (js/stretch.js)
   - block widths: the 8 days of birth, cycling; hover widens a block, the others squeeze
   - switch: ayeletops ⇄ sella_vie (both 9 letters, same blocks). Click the cover or the switch.
   - size slider: row height; block widths follow, so the line breaks move
   - "See the default": the AI typology, shown on request, redacted, removed
*/
(() => {
  const cover = document.getElementById('cover');
  const T = Stretch.make(cover, 'ayeletops', Stretch.weights('days'), { lock: true, every: 260, flick: 45 });

  // rupture: the blocks that fall on the event years slip out of line, the red frame stays where the grid put it
  Rupture.YEARS.forEach((y, k) => { const s = T.slots[y % T.slots.length]; if (!s) return;
    s.el.classList.add('slip'); s.el.style.setProperty('--sx', `${[-7, 5, -4, 8, -6][k]}px`); s.el.style.setProperty('--sy', `${[11, -8, 14, -10, 7][k]}px`); });
  Rupture.schedule(document.querySelector('main'), 6500);

  const names = ['ayeletops', 'sella_vie'];
  let cur = 0;
  const btns = document.querySelectorAll('.switch button');
  function show(i) {
    cur = i; T.setWord(names[i]); cover.setAttribute('aria-label', names[i]);
    btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.w === names[i]));
  }
  btns.forEach(b => b.addEventListener('click', () => show(names.indexOf(b.dataset.w))));
  cover.addEventListener('click', () => show(1 - cur));

  const fs = document.getElementById('fs'), fsv = document.getElementById('fsv');
  const setFs = v => { cover.style.setProperty('--fs', v); document.documentElement.style.setProperty('--fs', v); fsv.textContent = v; fs.value = v; };
  fs.addEventListener('input', e => setFs(e.target.value));
  setFs(Math.round(Math.min(340, innerWidth / 3.2, Math.max(90, (innerHeight - 140) / 2.2))));

})();
