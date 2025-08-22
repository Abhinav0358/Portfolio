(function () {
    'use strict';

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (!name || !email || !message) {
                window.showNotification('Please fill in all fields', 'error');
                return;
            }
            if (!window.isValidEmail(email)) {
                window.showNotification('Please enter a valid email address', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const original = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = original;
                submitBtn.disabled = false;
                form.reset();
                window.showNotification('Thank you! Your message has been sent.', 'success');
            }, 2000);
        });
    }

    window.initContactForm = initContactForm;
    console.log('contactForm.js loaded');
})();