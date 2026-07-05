(function () {
  const storageKey = "toolxd-theme";
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(storageKey);
  const initialTheme = savedTheme || "light";

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem(storageKey, theme);

    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const isDark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }

  setTheme(initialTheme);

  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("[data-theme-toggle]");

    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  });
})();