(function () {
    'use strict';

    let currentProjectIndex = 0;
    let scrollAccumulator = 0;
    const SCROLL_SENSITIVITY = 0.1;

    function initProjectCarousel() {
        const projectCards = document.querySelectorAll('.project-card');
        const totalProjects = projectCards.length;
        if (totalProjects === 0) return;

        function updateProjectDisplay() {
            projectCards.forEach((card, index) => {
                card.classList.remove('active');
                const angle = (index - currentProjectIndex) * (Math.PI * 2 / totalProjects);
                const radius = 400;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                let transform = `translateX(${x}px) translateZ(${z}px)`;
                if (index === currentProjectIndex) {
                    card.classList.add('active');
                    transform += ' scale(1)';
                    card.style.zIndex = '10';
                } else {
                    const distanceFromActive = Math.abs(index - currentProjectIndex);
                    const minDistance = Math.min(distanceFromActive, totalProjects - distanceFromActive);
                    const scale = Math.max(0.6, 1 - (minDistance * 0.15));
                    transform += ` scale(${scale})`;
                    card.style.zIndex = `${10 - minDistance}`;
                }
                card.style.transform = transform;
            });
        }

        currentProjectIndex = 0;
        updateProjectDisplay();

        let lastScrollY = window.scrollY;
        function handleProjectScroll() {
            const projectsSection = document.getElementById('projects');
            if (!projectsSection) return;
            const rect = projectsSection.getBoundingClientRect();
            const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
            if (isInView) {
                const currentScrollY = window.scrollY;
                const scrollDelta = currentScrollY - lastScrollY;
                scrollAccumulator += scrollDelta * SCROLL_SENSITIVITY;
                const threshold = 30;
                if (Math.abs(scrollAccumulator) > threshold) {
                    if (scrollAccumulator > 0) currentProjectIndex = (currentProjectIndex + 1) % totalProjects;
                    else currentProjectIndex = (currentProjectIndex - 1 + totalProjects) % totalProjects;
                    updateProjectDisplay();
                    scrollAccumulator = 0;
                    lastScrollY = currentScrollY;
                }
            }
        }

        let projectScrollTimeout;
        window.addEventListener('scroll', () => {
            if (projectScrollTimeout) clearTimeout(projectScrollTimeout);
            projectScrollTimeout = setTimeout(handleProjectScroll, 150);
        });

        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.addEventListener('wheel', (e) => {
                const rect = projectsSection.getBoundingClientRect();
                if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                    e.preventDefault();
                    scrollAccumulator += e.deltaY * SCROLL_SENSITIVITY;
                    const threshold = 50;
                    if (Math.abs(scrollAccumulator) > threshold) {
                        const direction = scrollAccumulator > 0 ? 1 : -1;
                        currentProjectIndex = (currentProjectIndex + direction + totalProjects) % totalProjects;
                        updateProjectDisplay();
                        scrollAccumulator = 0;
                    }
                }
            }, { passive: false });
        }

        const projectButtons = document.querySelectorAll('.project-buttons a');
        projectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const text = button.textContent.trim();
                if (text === 'Live Demo') window.showNotification('Live demo would open in production environment', 'info');
                else if (text === 'GitHub') window.open('https://github.com/abhinav', '_blank');
            });
        });
    }

    window.initProjectCarousel = initProjectCarousel;
    console.log('carousel.js loaded');
})();