(function () {
    'use strict';

    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    function initAnimatedDots() {
        const dotsElement = document.getElementById('animatedDots');
        if (!dotsElement) return;
        const dots = ['.', '..', '...'];
        let i = 0;
        setInterval(() => {
            dotsElement.textContent = dots[i];
            i = (i + 1) % dots.length;
        }, 800);
    }

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.skill-category, .project-card');
        function check() {
            animatedElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
                    el.classList.add('fade-in', 'visible');
                }
            });
        }
        window.addEventListener('scroll', throttle(check, 100));
        check();
    }

    window.throttle = throttle;
    window.isValidEmail = isValidEmail;
    window.showNotification = showNotification;
    window.initAnimatedDots = initAnimatedDots;
    window.initScrollAnimations = initScrollAnimations;

    window.addEventListener('error', function (e) {
        console.warn('Portfolio app error:', e.error);
    });

    console.log('utils.js loaded');
})();