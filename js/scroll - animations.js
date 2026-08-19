(function () {
    try {
        const targets = document.querySelectorAll('.card, .stat, .panel');

        if (!targets.length) return;

        function revealAll() {
            targets.forEach((el) => {
                el.classList.add('in-view');
            });
        }

        // Reveal elements that are already visible when the page loads
        function revealVisible() {
            const windowHeight = window.innerHeight;

            targets.forEach((el) => {
                const rect = el.getBoundingClientRect();

                if (rect.top < windowHeight * 0.95) {
                    el.classList.add('in-view');
                }
            });
        }

        // Fallback for browsers without IntersectionObserver
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
            {
                threshold: 0.1,
                rootMargin: '0px 0px -30px 0px'
            }
        );

        targets.forEach((el) => {
            observer.observe(el);
        });

        // Check immediately after the page loads
        revealVisible();

    } catch (err) {
        console.error('Scroll animation error:', err);

        document
            .querySelectorAll('.card, .stat, .panel')
            .forEach((el) => {
                el.classList.add('in-view');
            });
    }
})();
