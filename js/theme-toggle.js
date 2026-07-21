/* ====================================================
   LUMORA AI — THEME TOGGLE
   Include on every page, right before </body>:
   <script src="js/theme-toggle.js"></script>
   (adjust path to wherever you keep JS files)
==================================================== */

(function () {
  const STORAGE_KEY = "lumora-theme";
  const btn = document.getElementById("themeToggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (btn) btn.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-mode");
      if (btn) btn.textContent = "🌙";
    }
  }

  // 1. Check saved preference, else fall back to system preference
  const saved = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = saved || (systemPrefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  // 2. Toggle on click
  if (btn) {
    btn.addEventListener("click", function () {
      const isDark = document.body.classList.contains("dark-mode");
      const newTheme = isDark ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
    });
  }
})();
