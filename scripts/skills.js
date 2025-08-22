(function () {
    'use strict';

    function initSkillAnimations() {
        const skillItems = document.querySelectorAll('.skill-item');
        const skillCategories = document.querySelectorAll('.skill-category');

        skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px) scale(1.05)';
                item.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.boxShadow = '0 0 5px rgba(255, 133, 0, 0.2)';
            });
        });

        skillCategories.forEach(category => {
            category.addEventListener('mousemove', (e) => {
                const rect = category.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const rotateY = (x / rect.width) * 8;
                const rotateX = -(y / rect.height) * 8;
                category.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            category.addEventListener('mouseleave', () => {
                category.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    window.initSkillAnimations = initSkillAnimations;
    console.log('skills.js loaded');
})();