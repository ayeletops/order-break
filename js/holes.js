/* BLACK HOLES (draft)
   12 month-columns. Five voids sit at birth-month positions (from css/grids.css .hole-N).
   Click a void → enter a key → decrypt in the browser (PBKDF2 + AES-GCM). Nothing is readable without the key.
*/
(() => {
  const sky = document.getElementById('sky');
  const M = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  M.forEach((m, i) => sky.insertAdjacentHTML('beforeend', `<div class="m" style="grid-column:${i + 1}">${m}</div>`));
  for (let i = 1; i <= 5; i++) sky.insertAdjacentHTML('beforeend', `<button class="hole hole-${i}" data-i="${i - 1}" aria-label="Event ${i}, encrypted"><span>0${i}</span></button>`);

  const lock = document.getElementById('lock'), f = document.getElementById('lock-f'), k = document.getElementById('lock-k'),
        out = document.getElementById('lock-out'), n = document.getElementById('lock-n');
  let cur = 0;
  sky.addEventListener('click', e => { const h = e.target.closest('.hole'); if (!h) return;
    cur = +h.dataset.i; n.textContent = `Event 0${cur + 1} — encrypted`; out.textContent = ''; k.value = ''; lock.classList.add('on'); k.focus(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') lock.classList.remove('on'); });

  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function decrypt(entry, pass) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(entry.salt), iterations: 600000, hash: 'SHA-256' },
                                              base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(entry.iv) }, key, b64(entry.ct));
    return new TextDecoder().decode(pt);
  }
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const entry = (window.HOLES || [])[cur];
    if (!entry) { out.textContent = 'Nothing written here yet (draft).'; return; }
    try { out.textContent = await decrypt(entry, k.value); } catch { out.textContent = 'Wrong key. It stays dark.'; }
  });
})();
