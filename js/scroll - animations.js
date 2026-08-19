(function () {
    try {
        const targets = document.querySelectorAll('.card, .stat, .panel');

        if (!targets.length) return;

        // Immediately reveal everything.
        targets.forEach(function (el) {
            el.classList.add('in-view');
        });

    } catch (error) {
        console.error('Lumora scroll animation error:', error);

        // Emergency fallback: make everything visible.
        document.querySelectorAll('.card, .stat, .panel').forEach(function (el) {
            el.classList.add('in-view');
        });
    }
})();
