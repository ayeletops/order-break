/* NAV: choosing a page censors it with a black strip, then goes. Each strip is sized to its word. */
document.querySelectorAll('.nav a').forEach(a => {
  const r = document.createRange(); r.selectNodeContents(a); const w = r.getBoundingClientRect ? r.getBoundingClientRect().width : a.offsetWidth;
  a.style.setProperty('--w', w + 'px');
  a.addEventListener('click', e => {
    if (a.hasAttribute('aria-current') || e.metaKey || e.ctrlKey) return;
    e.preventDefault(); document.querySelectorAll('.nav a[aria-current]').forEach(c => c.removeAttribute('aria-current'));
    a.classList.add('censor'); setTimeout(() => location.href = a.href, 260);
  });
});
