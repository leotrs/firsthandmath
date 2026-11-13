// The light/dark toggle in the header, and on phones the menu that holds it. Until the reader
// presses the toggle, the page follows the system's setting. A press switches to the other mode
// and saves the choice where RSM saves its own Theme setting (theme in rsm-reading), so the two
// always agree. Loaded in <head> without defer, so a saved choice is applied before the page is
// first drawn.
(() => {
  const KEY = "rsm-reading";
  const root = document.documentElement;
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch {
      return {};
    }
  };
  const apply = (mode) => {
    root.classList.toggle("dark-theme", mode === "dark");
    root.classList.toggle("light-theme", mode === "light");
  };
  const saved = read().theme;
  if (saved === "light" || saved === "dark") apply(saved);

  const system = matchMedia("(prefers-color-scheme: dark)");
  const dark = () => root.classList.contains("dark-theme") || (!root.classList.contains("light-theme") && system.matches);

  addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".fm-theme");
    const show = () => toggle?.setAttribute("aria-pressed", String(dark()));
    show();
    system.addEventListener("change", show);
    const flip = () => {
      const mode = dark() ? "light" : "dark";
      apply(mode);
      const prefs = read();
      prefs.theme = mode;
      try {
        localStorage.setItem(KEY, JSON.stringify(prefs));
      } catch {}
      // RSM's reading settings on an exploration page show the same choice.
      for (const o of document.querySelectorAll('.reading-row[data-control="theme"] .reading-opt')) {
        const on = o.dataset.value === mode;
        o.classList.toggle("active", on);
        o.setAttribute("aria-pressed", String(on));
      }
      show();
    };
    toggle?.addEventListener("click", flip);

    const more = document.querySelector(".fm-more");
    const menu = document.querySelector(".fm-menu");
    if (!more || !menu) return;
    const open = (on) => {
      menu.hidden = !on;
      more.setAttribute("aria-expanded", String(on));
    };
    more.addEventListener("click", () => open(menu.hidden));
    menu.querySelector(".fm-mode")?.addEventListener("click", flip);
    document.addEventListener("click", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !more.contains(e.target)) open(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        open(false);
        more.focus();
      }
    });
  });
})();
