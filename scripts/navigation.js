(function () {
    'use strict';

    function updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    function scrollToSection(targetSection) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    function initNavigation() {
        const sections = document.querySelectorAll('section[id]');
        function updateActiveNav() {
            if (window.isCloudTransitioning) return;
            const scrollPos = window.scrollY + 100;
            let activeSection = null;
            sections.forEach(section => {
                const top = section.offsetTop;
                const h = section.offsetHeight;
                const id = section.getAttribute('id');
                if (scrollPos >= top && scrollPos < top + h) activeSection = id;
            });
            if (activeSection) updateActiveNavLink(activeSection);
        }
        let navScrollTimeout;
        window.addEventListener('scroll', () => {
            if (navScrollTimeout) clearTimeout(navScrollTimeout);
            navScrollTimeout = setTimeout(updateActiveNav, 50);
        });
        updateActiveNav();
    }

    function initMobileNav() {
        const navMenu = document.querySelector('.nav-menu');
        const navContainer = document.querySelector('.nav-container');
        if (!navMenu || !navContainer) return;

        let navToggle = navContainer.querySelector('.nav-toggle');
        if (!navToggle) {
            navToggle = document.createElement('button');
            navToggle.className = 'nav-toggle';
            navToggle.innerHTML = '☰';
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navContainer.appendChild(navToggle);
        }

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 480) {
                    setTimeout(() => {
                        navMenu.classList.remove('active');
                        navToggle.innerHTML = '☰';
                    }, 1000);
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 480) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.innerHTML = '☰';
            }
        });
    }

    function initHeroZoomEffect() {
        window.addEventListener('scroll', window.throttle(() => {
            const hero = document.getElementById('hero');
            if (!hero) return;
            const scrollPos = window.scrollY;
            const heroHeight = hero.offsetHeight;
            const zoomFactor = Math.min(scrollPos / heroHeight, 1);
            const scale = 1 + (zoomFactor * 0.15);
            const blur = zoomFactor * 2;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `scale(${scale})`;
                heroContent.style.filter = `blur(${blur}px)`;
                heroContent.style.opacity = Math.max(1 - zoomFactor * 1.0, 0);
            }
        }, 16));
    }

    window.updateActiveNavLink = updateActiveNavLink;
    window.scrollToSection = scrollToSection;
    window.initNavigation = initNavigation;
    window.initMobileNav = initMobileNav;
    window.initHeroZoomEffect = initHeroZoomEffect;

    console.log('navigation.js loaded');
})();