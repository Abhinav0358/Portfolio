(function () {
    'use strict';

    function initContactParticles() {
        const canvas = document.getElementById('contactParticles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const particleCount = 60;

        function getContactEmberColor() {
            const colors = [
                'rgba(255, 107, 53, ',
                'rgba(255, 133, 0, ',
                'rgba(255, 215, 0, ',
                'rgba(255, 165, 0, '
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 1.5 + 0.5,
                speedY: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.6 + 0.2,
                color: getContactEmberColor(),
                trail: []
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > 6) p.trail.shift();

                if (p.x > canvas.width + 10) {
                    p.x = -10;
                    p.y = Math.random() * canvas.height;
                    p.trail = [];
                }

                p.trail.forEach((t, ti) => {
                    const trailOpacity = (p.opacity * ti) / p.trail.length * 0.4;
                    const trailSize = p.size * (ti / p.trail.length) * 0.7;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = p.color + trailOpacity + ')';
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = p.color + '0.6)';
                    ctx.fill();
                });

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + p.opacity + ')';
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color + '0.8)';
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    window.initContactParticles = initContactParticles;
    console.log('contactParticles.js loaded');
})();