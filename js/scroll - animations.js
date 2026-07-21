/* ====================================================
   LUMORA AI — SCROLL ANIMATIONS
   Fades in .card, .stat, and .panel elements as they
   scroll into view, instead of on page load.
   Include on every page, right before </body>:
   <script src="js/scroll-animations.js"></script>
==================================================== */

(function () {
  const targets = document.querySelectorAll('.card, .stat, .panel');
  if (!targets.length) return;

  // If the browser doesn't support IntersectionObserver, just show everything
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
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
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();
