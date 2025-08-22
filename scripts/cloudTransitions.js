(function () {
    'use strict';

    window.isCloudTransitioning = false;

    function triggerCloudTransition(callback) {
        if (window.isCloudTransitioning) return;
        const cloudOverlay = document.getElementById('cloudOverlay');
        if (!cloudOverlay) {
            if (callback) callback();
            return;
        }
        window.isCloudTransitioning = true;
        cloudOverlay.classList.add('active');

        setTimeout(() => {
            if (callback) callback();
        }, 1000);

        setTimeout(() => {
            cloudOverlay.classList.remove('active');
            window.isCloudTransitioning = false;
        }, 2000);
    }

    function initCloudTransitions() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#') && !window.isCloudTransitioning) {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        triggerCloudTransition(() => {
                            if (window.scrollToSection) window.scrollToSection(targetSection);
                            if (window.updateActiveNavLink) window.updateActiveNavLink(targetId);
                        });
                    }
                }
            });
        });
    }

    window.triggerCloudTransition = triggerCloudTransition;
    window.initCloudTransitions = initCloudTransitions;
    console.log('cloudTransitions.js loaded');
})();