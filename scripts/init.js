(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (window.initNetherParticleSystem) window.initNetherParticleSystem();
        if (window.initContactParticles) window.initContactParticles();
        if (window.initAnimatedDots) window.initAnimatedDots();
        if (window.initNavigation) window.initNavigation();
        if (window.initProjectCarousel) window.initProjectCarousel();
        if (window.initSkillAnimations) window.initSkillAnimations();
        if (window.initContactForm) window.initContactForm();
        if (window.initScrollAnimations) window.initScrollAnimations();
        if (window.initResumeDownload) window.initResumeDownload();
        if (window.initMobileNav) window.initMobileNav();
        if (window.initCloudTransitions) window.initCloudTransitions();
        if (window.initHeroZoomEffect) window.initHeroZoomEffect();
        if (window.initSocialLinks) window.initSocialLinks();

        // small global enhancements
        const interactive = document.querySelectorAll('button, .nav-link, .social-link, .project-card');
        interactive.forEach(el => {
            el.addEventListener('mouseenter', () => { el.style.textShadow = '0 0 8px rgba(255, 107, 53, 0.6)'; });
            el.addEventListener('mouseleave', () => { el.style.textShadow = ''; });
        });

        console.log('init.js completed DOMContentLoaded tasks');
    });
})();