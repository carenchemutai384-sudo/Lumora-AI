/* ====================================================
   LUMORA AI — SCROLL ANIMATIONS
   Fades in .card, .stat, and .panel elements as they
   scroll into view, instead of on page load.
   Include on every page, right before </body>:
   <script src="js/scroll-animations.js"></script>
==================================================== */

(function () {
  try {
    const targets = document.querySelectorAll('.card, .stat, .panel');
    if (!targets.length) return;

    function revealAll() {
      targets.forEach((el) => el.classList.add('in-view'));
    }

    // If the browser doesn't support IntersectionObserver, just show everything
    if (!('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // reveal once, don't re-hide on scroll up
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    // SAFETY NET: if anything ever prevents the observer from firing
    // (layout quirks, timing issues, etc.), force-reveal everything
    // after 2.5s so content can never stay permanently hidden.
    setTimeout(revealAll, 2500);

  } catch (err) {
    // If anything goes wrong at all, immediately show everything
    // rather than risk leaving content invisible.
    document.querySelectorAll('.card, .stat, .panel').forEach((el) => {
      el.classList.add('in-view');
    });
  }
})();
