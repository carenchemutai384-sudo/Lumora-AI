(function () {
  try {
    const targets = document.querySelectorAll('.card, .stat, .panel');
    if (!targets.length) return;

    function revealAll() {
      targets.forEach((el) => el.classList.add('in-view'));
    }

    if (!('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    setTimeout(revealAll, 2500);

  } catch (err) {
    document.querySelectorAll('.card, .stat, .panel').forEach((el) => {
      el.classList.add('in-view');
    });
  }
})();
