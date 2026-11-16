/* HOME / COVER
   - the name, letter by letter, each letter stretched to fill its whole block (js/stretch.js)
   - block widths: the 8 days of birth, cycling; hover widens a block, the others squeeze
   - switch: ayeletops ⇄ sella_vie (both 9 letters, same blocks). Click the cover or the switch.
   - size slider: row height; block widths follow, so the line breaks move
   - "See the default": the AI typology, shown on request, redacted, removed
*/
(() => {
  const cover = document.getElementById('cover');
  const T = Stretch.make(cover, 'ayeletops', Stretch.weights('days'), { lock: true, every: 650, flick: 70 });


  const names = ['ayeletops', 'sella_vie'];
  let cur = 0;
  const btns = document.querySelectorAll('.switch button');
  function show(i) {
    cur = i; T.setWord(names[i]); cover.setAttribute('aria-label', names[i]);
    document.documentElement.classList.toggle('negative', i === 1);   // sella_vie is the negative
    btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.w === names[i]));
  }
  btns.forEach(b => b.addEventListener('click', () => show(names.indexOf(b.dataset.w))));
  cover.addEventListener('click', () => show(1 - cur));

  const fs = document.getElementById('fs'), fsv = document.getElementById('fsv');
  const setFs = v => { cover.style.setProperty('--fs', v); document.documentElement.style.setProperty('--fs', v); fsv.textContent = v; fs.value = v; };
  fs.addEventListener('input', e => setFs(e.target.value));
  // the default look: the size Ayelet chose (208 on her 1000px-wide window), scaled with the window's width,
  // so the name always breaks the same way: a-y-e-l-e-t on the first line, o-p-s on the second
  let touched = false;
  const DEF = () => {
    // slot basis is fs * (0.035 * day + 0.42) (site.css); find the sizes where six letters fit on the first line and the seventh doesn't
    const ws = Stretch.weights('days'), d = i => ws[i % ws.length], cs = getComputedStyle(cover);
    const Wc = cover.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight), g = parseFloat(cs.columnGap) || 0;
    let S6 = 0; for (let i = 0; i < 6; i++) S6 += .035 * d(i) + .42; const S7 = S6 + .035 * d(6) + .42;
    const hi = (Wc - 5 * g) / S6 - 1, lo = (Wc - 6 * g) / S7 + 1, want = innerWidth * .208;
    return Math.round(Math.min(420, Math.max(60, lo <= hi ? Math.min(hi, Math.max(lo, want)) : want)));
  };
  fs.addEventListener('input', () => { touched = true; });
  setFs(DEF());
  addEventListener('resize', () => { if (!touched) setFs(DEF()); });
  // coming back to the page (back button) always lands on the default: ayeletops, positive, default size
  addEventListener('pageshow', e => { if (e.persisted) { show(0); touched = false; setFs(DEF()); } });

})();
