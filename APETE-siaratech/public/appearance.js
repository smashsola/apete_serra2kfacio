(() => {
  const key = 'apete_appearance';
  let dark = false;
  try {
    dark = localStorage.getItem(key) === 'dark';
    localStorage.removeItem('apete_palette');
  } catch {}
  const root = document.documentElement;
  root.removeAttribute('data-palette');
  function apply() {
    root.dataset.theme = dark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#121c16' : '#f8f7ef';
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
      toggle.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
  }
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      dark = !dark;
      apply();
      try { localStorage.setItem(key, dark ? 'dark' : 'light'); } catch {}
    });
  }, { once: true });
})();
