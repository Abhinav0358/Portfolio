(function () {
    'use strict';

    function initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('http')) {
                    e.preventDefault();
                    window.open(href, '_blank');
                }
            });
        });
    }

    window.initSocialLinks = initSocialLinks;
    console.log('social.js loaded');
})();