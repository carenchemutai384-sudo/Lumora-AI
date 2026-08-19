(function () {
    try {
        const targets = document.querySelectorAll(
            '.card, .stat, .panel'
        );

        targets.forEach(function (el) {
            el.classList.add('in-view');
        });

    } catch (error) {
        console.error('Lumora animation error:', error);

        document
            .querySelectorAll('.card, .stat, .panel')
            .forEach(function (el) {
                el.classList.add('in-view');
            });
    }
})();
