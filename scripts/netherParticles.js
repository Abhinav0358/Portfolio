(function () {
    'use strict';

    function initNetherParticleSystem() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const particleCount = 120;

        function getRandomEmberColor() {
            const colors = [
                'rgba(255, 255, 0, ',
                'rgba(255, 136, 0, ',
                'rgba(255, 68, 0, ',
                'rgba(255, 215, 0, ',
                'rgba(255, 165, 0, '
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 4 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: -Math.random() * 0.8 - 0.2,
                opacity: Math.random() * 0.6 + 0.4,
                color: getRandomEmberColor(),
                trail: []
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, idx) => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedX += (Math.random() - 0.5) * 0.01;
                p.speedX *= 0.98;

                p.trail.push({ x: p.x, y: p.y });
                if (p.trail.length > 8) p.trail.shift();

                if (p.x < -10) p.x = canvas.width + 10;
                else if (p.x > canvas.width + 10) p.x = -10;

                if (p.y < -60) {
                    p.x = Math.random() * canvas.width;
                    p.y = canvas.height + (10 + Math.random() * 120);
                    p.speedX = (Math.random() - 0.5) * 0.6;
                    p.speedY = - (Math.random() * 1.2 + 0.3);
                    p.opacity = Math.random() * 0.6 + 0.4;
                    p.color = getRandomEmberColor();
                    p.trail = [];
                }

                const currentOpacity = p.opacity;

                p.trail.forEach((t, ti) => {
                    const trailOpacity = (currentOpacity * ti) / p.trail.length * 0.5;
                    const trailSize = p.size * (ti / p.trail.length) * 0.8;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = p.color + trailOpacity + ')';
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = p.color + '0.8)';
                    ctx.fill();
                });

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + currentOpacity + ')';
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color + '1)';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 200, ${currentOpacity * 0.8})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(255, 255, 0, 1)';
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    window.initNetherParticleSystem = initNetherParticleSystem;
    console.log('netherParticles.js loaded');
})();