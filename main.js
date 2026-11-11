(() => {
  const cfg = window.VYRO || {};
  const values = { version: cfg.version, date: cfg.releaseDate, size: cfg.size, notes: cfg.notes, year: new Date().getFullYear() };
  document.querySelectorAll('[data-cfg]').forEach(el => {
    const v = values[el.dataset.cfg];
    if (v != null && v !== '') el.textContent = v;
  });

  // Download buttons: live link only when a real URL is configured.
  const url = (cfg.downloadUrl || '').trim();
  document.querySelectorAll('[data-download]').forEach(btn => {
    const label = btn.querySelector('span');
    if (url) {
      btn.href = url;
      btn.setAttribute('download', '');
      btn.removeAttribute('aria-disabled');
    } else {
      btn.removeAttribute('href');
      btn.setAttribute('aria-disabled', 'true');
      btn.setAttribute('role', 'link');
      if (label) label.textContent = 'Download coming soon';
      btn.addEventListener('click', e => e.preventDefault());
    }
  });

  // Mobile menu
  const menu = document.querySelector('.menu');
  const mnav = document.getElementById('mnav');
  if (menu && mnav) {
    const set = open => { mnav.classList.toggle('open', open); menu.setAttribute('aria-expanded', open); menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
    menu.addEventListener('click', () => set(!mnav.classList.contains('open')));
    mnav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  // Highlight the nav link for the section on screen
  const links = [...document.querySelectorAll('.links a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const a = map.get(en.target.id);
      if (!a) return;
      links.forEach(l => l.removeAttribute('aria-current'));
      a.setAttribute('aria-current', 'page');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

  // Screenshot tabs
  const pv = document.getElementById('pv');
  const tabs = [...document.querySelectorAll('.tabs [role=tab]')];
  const pick = b => {
    tabs.forEach(x => { const on = x === b; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; });
    pv.src = 'assets/screens/' + b.dataset.img + '.png';
    pv.alt = 'VYRO ' + b.textContent + ' screen';
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => pick(b));
    b.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); pick(n); }
    });
  });
})();
