(() => {
  const key = 'apete_appearance';
  let dark = false;
  const palettes = ['serra', 'caju', 'amora', 'oceano'];
  let palette = 'caju';
  try { dark = localStorage.getItem(key) === 'dark'; } catch {}
  try { const saved = localStorage.getItem('apete_palette'); if (palettes.includes(saved)) palette = saved; } catch {}
  const root = document.documentElement;
  function apply() {
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.palette = palette;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? {serra:'#10251f',caju:'#2b1914',amora:'#23172c',oceano:'#10262e'}[palette] : {serra:'#fbf8f3',caju:'#fff5ea',amora:'#faf3fb',oceano:'#f0f8fb'}[palette];
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
      toggle.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
    document.querySelectorAll('[data-palette-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === palette));
    });
  }
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      dark = !dark;
      apply();
      try { localStorage.setItem(key, dark ? 'dark' : 'light'); } catch {}
    });
    document.querySelectorAll('[data-palette-choice]').forEach(button => {
      button.addEventListener('click', () => {
        const choice = button.dataset.paletteChoice;
        if (!palettes.includes(choice)) return;
        palette = choice;
        apply();
        try { localStorage.setItem('apete_palette', palette); } catch {}
      });
    });
  }, { once: true });
})();
