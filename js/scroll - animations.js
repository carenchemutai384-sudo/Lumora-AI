(function () {
    try {
        /* ==========================================
           HERO FADE-UP ANIMATION
           Only runs on the homepage hero section
        ========================================== */

        const heroText = document.querySelector('.hero-text');
        const heroImage = document.querySelector('.hero-image');

        if (heroText) {
            heroText.style.opacity = '0';
            heroText.style.animation = 'fadeUp 0.8s ease forwards';
        }

        if (heroImage) {
            heroImage.style.opacity = '0';
            heroImage.style.animation = 'fadeUp 1s ease 0.2s forwards';
        }


        /* ==========================================
           CARD / STAT / PANEL REVEAL
           Keeps the rest of the site visible
        ========================================== */

        const targets = document.querySelectorAll(
            '.card, .stat, .panel'
        );

        targets.forEach(function (el) {
            el.classList.add('in-view');
        });

    } catch (error) {

        console.error(
            'Lumora animation error:',
            error
        );

        /* Emergency fallback:
           Make everything visible if animation fails. */

        document
            .querySelectorAll('.hero-text, .hero-image, .card, .stat, .panel')
            .forEach(function (el) {
                el.style.opacity = '1';
                el.classList.add('in-view');
            });
    }
})();
