class PortfolioApp {
    constructor() {
        this.currentSection = 0;
        this.sections = ['home', 'projects', 'skills', 'contact'];
        this.isTransitioning = false;
        this.scrollThreshold = 100;
        this.scrollAccumulator = 0;
        this.projectRotation = 0;
        this.isDragging = false;
        this.isCarouselDragging = false;
        
        this.init();
    }
    
    init() {
        this.setupParticleSystem();
        this.setupScrollHandler();
        this.setupNavigation();
        this.setupSteveInteraction();
        this.setupProjectCarousel();
        this.setupContactForm();
        this.preventDefaultScrolling();
        this.updateActiveSection();
    }
    
    // Particle System
    setupParticleSystem() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create initial particles
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
        
        this.animateParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -Math.random() * 2 - 1,
            size: Math.random() * 4 + 2,
            life: 1,
            decay: Math.random() * 0.01 + 0.005,
            trail: []
        };
    }
    
    animateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add new particles occasionally
        if (Math.random() < 0.1) {
            this.particles.push(this.createParticle());
        }
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Add to trail
            particle.trail.push({ x: particle.x, y: particle.y, life: particle.life });
            if (particle.trail.length > 10) {
                particle.trail.shift();
            }
            
            // Remove dead particles
            if (particle.life <= 0 || particle.y < -10) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Draw trail
            for (let j = 0; j < particle.trail.length - 1; j++) {
                const current = particle.trail[j];
                const next = particle.trail[j + 1];
                const alpha = (current.life * 0.3) * (j / particle.trail.length);
                
                this.ctx.beginPath();
                this.ctx.moveTo(current.x, current.y);
                this.ctx.lineTo(next.x, next.y);
                this.ctx.strokeStyle = `rgba(255, 165, 0, ${alpha})`;
                this.ctx.lineWidth = particle.size * (j / particle.trail.length);
                this.ctx.stroke();
            }
            
            // Draw particle
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, `rgba(255, 255, 0, ${particle.life * 0.8})`);
            gradient.addColorStop(0.4, `rgba(255, 165, 0, ${particle.life * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 69, 0, ${particle.life * 0.2})`);
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = particle.size * 2;
            this.ctx.shadowColor = 'rgba(255, 165, 0, 0.5)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        requestAnimationFrame(() => this.animateParticles());
    }
    
    // Scroll Handling
    setupScrollHandler() {
        let scrollTimeout;
        
        window.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (this.isTransitioning || this.isCarouselDragging) return;
            
            this.scrollAccumulator += e.deltaY;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.scrollAccumulator = 0;
            }, 100);
            
            if (Math.abs(this.scrollAccumulator) >= this.scrollThreshold) {
                if (this.scrollAccumulator > 0) {
                    this.nextSection();
                } else {
                    this.previousSection();
                }
                this.scrollAccumulator = 0;
            }
        }, { passive: false });
    }
    
    preventDefaultScrolling() {
        document.body.style.overflow = 'hidden';
        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            window.scrollTo(0, 0);
        }, { passive: false });
        
        // Prevent arrow key scrolling
        window.addEventListener('keydown', (e) => {
            if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
            }
        });
    }
    
    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.currentSection++;
            this.transitionToSection();
        }
    }
    
    previousSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.transitionToSection();
        }
    }
    
    goToSection(index) {
        if (index >= 0 && index < this.sections.length && index !== this.currentSection) {
            this.currentSection = index;
            this.transitionToSection();
        }
    }
    
    transitionToSection() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Show clouds
        const cloudOverlay = document.getElementById('cloudOverlay');
        cloudOverlay.classList.add('active');
        
        setTimeout(() => {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(this.sections[this.currentSection]).classList.add('active');
            
            this.updateActiveSection();
            
            setTimeout(() => {
                // Hide clouds
                cloudOverlay.classList.remove('active');
                this.isTransitioning = false;
            }, 800);
        }, 1000);
    }
    
    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetSectionName = link.dataset.section;
                const targetIndex = this.sections.indexOf(targetSectionName);
                
                if (targetIndex !== -1) {
                    this.goToSection(targetIndex);
                }
            });
        });
        
        // Resume download
        document.querySelector('.resume-btn').addEventListener('click', (e) => {
            e.preventDefault();
            // Create a dummy download
            const link = document.createElement('a');
            link.href = 'data:text/plain;charset=utf-8,Resume%20Content%20-%20Abhinav%20Portfolio';
            link.download = 'Abhinav_Resume.pdf';
            link.click();
        });
    }
    
    updateActiveSection() {
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === this.sections[this.currentSection]) {
                link.classList.add('active');
            }
        });
    }
    
    // Steve Character Interaction
    setupSteveInteraction() {
        const steve = document.getElementById('steveCharacter');
        let isDragging = false;
        let startX, startY;
        let rotationX = -10, rotationY = 0;
        
        const updateRotation = () => {
            steve.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        };
        
        steve.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            steve.style.animationPlayState = 'paused';
            e.preventDefault();
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            rotationY += deltaX * 0.5;
            rotationX -= deltaY * 0.5;
            
            // Limit rotation
            rotationX = Math.max(-90, Math.min(90, rotationX));
            
            updateRotation();
            
            startX = e.clientX;
            startY = e.clientY;
        });
        
        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    steve.style.animationPlayState = 'running';
                }, 2000);
            }
        });
        
        // Touch support
        steve.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            steve.style.animationPlayState = 'paused';
            e.preventDefault();
        });
        
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            rotationY += deltaX * 0.5;
            rotationX -= deltaY * 0.5;
            
            rotationX = Math.max(-90, Math.min(90, rotationX));
            
            updateRotation();
            
            startX = touch.clientX;
            startY = touch.clientY;
            
            e.preventDefault();
        });
        
        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    steve.style.animationPlayState = 'running';
                }, 2000);
            }
        });
    }
    
    // Project Carousel
    setupProjectCarousel() {
        const carousel = document.querySelector('.carousel-container');
        const cards = document.querySelectorAll('.project-card');
        let currentProject = 0;
        let startCarouselX = 0;
        let lastMoveTime = 0;
        
        const updateCarousel = () => {
            cards.forEach((card, index) => {
                const angle = ((index - currentProject) * 120) * (Math.PI / 180);
                const radius = 300;
                const x = Math.sin(angle) * radius;
                const z = Math.cos(angle) * radius;
                const rotY = -angle * (180 / Math.PI);
                
                card.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg)`;
                card.style.opacity = Math.abs(angle) > Math.PI / 2 ? 0.3 : 1;
                card.style.zIndex = Math.abs(angle) > Math.PI / 2 ? 1 : 10;
            });
        };
        
        const nextProject = () => {
            currentProject = (currentProject + 1) % cards.length;
            updateCarousel();
        };
        
        const prevProject = () => {
            currentProject = (currentProject - 1 + cards.length) % cards.length;
            updateCarousel();
        };
        
        // Mouse events with proper isolation
        carousel.addEventListener('mousedown', (e) => {
            this.isCarouselDragging = true;
            startCarouselX = e.clientX;
            lastMoveTime = Date.now();
            e.preventDefault();
            e.stopPropagation();
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!this.isCarouselDragging) return;
            
            const currentTime = Date.now();
            if (currentTime - lastMoveTime < 50) return; // Throttle movement
            
            const deltaX = e.clientX - startCarouselX;
            
            if (Math.abs(deltaX) > 80) {
                if (deltaX > 0) {
                    prevProject();
                } else {
                    nextProject();
                }
                startCarouselX = e.clientX;
                lastMoveTime = currentTime;
            }
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        carousel.addEventListener('mouseup', (e) => {
            this.isCarouselDragging = false;
            e.preventDefault();
            e.stopPropagation();
        });
        
        carousel.addEventListener('mouseleave', () => {
            this.isCarouselDragging = false;
        });
        
        // Touch events with proper isolation
        carousel.addEventListener('touchstart', (e) => {
            this.isCarouselDragging = true;
            startCarouselX = e.touches[0].clientX;
            lastMoveTime = Date.now();
            e.preventDefault();
            e.stopPropagation();
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!this.isCarouselDragging) return;
            
            const currentTime = Date.now();
            if (currentTime - lastMoveTime < 50) return;
            
            const deltaX = e.touches[0].clientX - startCarouselX;
            
            if (Math.abs(deltaX) > 80) {
                if (deltaX > 0) {
                    prevProject();
                } else {
                    nextProject();
                }
                startCarouselX = e.touches[0].clientX;
                lastMoveTime = currentTime;
            }
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        carousel.addEventListener('touchend', (e) => {
            this.isCarouselDragging = false;
            e.preventDefault();
            e.stopPropagation();
        });
        
        // Keyboard navigation for carousel
        document.addEventListener('keydown', (e) => {
            if (this.sections[this.currentSection] === 'projects' && !this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevProject();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextProject();
                }
            }
        });
        
        // Initialize carousel
        updateCarousel();
        
        // Auto-rotate projects (only when not manually interacting)
        setInterval(() => {
            if (!this.isCarouselDragging && this.sections[this.currentSection] === 'projects') {
                nextProject();
            }
        }, 6000);
    }
    
    // Contact Form
    setupContactForm() {
        const form = document.querySelector('.contact-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('.btn--primary');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();
                }, 2000);
            }, 1500);
        });
        
        // Add form field animations
        const formFields = form.querySelectorAll('.form-control');
        formFields.forEach(field => {
            field.addEventListener('focus', (e) => {
                e.target.style.borderColor = '#FFA500';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 165, 0, 0.2)';
            });
            
            field.addEventListener('blur', (e) => {
                e.target.style.borderColor = '';
                e.target.style.boxShadow = '';
            });
        });
    }
}

// Enhanced particle effects for specific sections
class AdvancedEffects {
    constructor() {
        this.setupSectionEffects();
    }
    
    setupSectionEffects() {
        // Add extra effects when entering different sections
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    const sectionId = mutation.target.id;
                    this.triggerSectionEffect(sectionId);
                }
            });
        });
        
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section, { attributes: true, attributeFilter: ['class'] });
        });
    }
    
    triggerSectionEffect(sectionId) {
        switch (sectionId) {
            case 'projects':
                this.createProjectsEffect();
                break;
            case 'skills':
                this.createSkillsEffect();
                break;
            case 'contact':
                this.createContactEffect();
                break;
        }
    }
    
    createProjectsEffect() {
        // Add extra glowing particles
        const effectContainer = document.createElement('div');
        effectContainer.className = 'section-effect';
        effectContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        `;
        
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            projectsSection.appendChild(effectContainer);
            
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.style.cssText = `
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: radial-gradient(circle, #FFA500, #FF6B35);
                        border-radius: 50%;
                        top: ${Math.random() * 100}%;
                        left: ${Math.random() * 100}%;
                        animation: float 3s ease-out forwards;
                        box-shadow: 0 0 10px rgba(255, 165, 0, 0.8);
                    `;
                    
                    effectContainer.appendChild(particle);
                    
                    setTimeout(() => {
                        if (particle.parentNode) particle.remove();
                    }, 3000);
                }, i * 100);
            }
            
            // Remove effect container after animation
            setTimeout(() => {
                if (effectContainer.parentNode) effectContainer.remove();
            }, 5000);
        }
    }
    
    createSkillsEffect() {
        // Add skill category glow effects
        const categories = document.querySelectorAll('.skill-category');
        categories.forEach((category, index) => {
            setTimeout(() => {
                category.style.animation = 'skill-highlight 0.8s ease-out';
                setTimeout(() => {
                    category.style.animation = '';
                }, 800);
            }, index * 200);
        });
    }
    
    createContactEffect() {
        // Add communication wave effect
        const waves = document.createElement('div');
        waves.className = 'contact-waves';
        waves.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 2;
        `;
        
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.appendChild(waves);
            
            for (let i = 0; i < 3; i++) {
                const wave = document.createElement('div');
                wave.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 2px solid rgba(255, 165, 0, 0.3);
                    border-radius: 50%;
                    animation: wave-expand 2s ease-out infinite;
                    animation-delay: ${i * 0.6}s;
                `;
                waves.appendChild(wave);
            }
            
            setTimeout(() => {
                if (waves.parentNode) waves.remove();
            }, 6000);
        }
    }
}

// Add CSS animations dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes float {
        0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0); 
        }
        50% { 
            opacity: 1; 
            transform: translateY(-20px) scale(1.2); 
        }
        100% { 
            opacity: 0; 
            transform: translateY(-100px) scale(0.8); 
        }
    }
    
    @keyframes skill-highlight {
        0% { box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2); }
        50% { box-shadow: 0 15px 40px rgba(255, 165, 0, 0.6); }
        100% { box-shadow: 0 8px 25px rgba(255, 107, 53, 0.2); }
    }
    
    @keyframes wave-expand {
        0% { 
            transform: scale(0); 
            opacity: 1; 
        }
        100% { 
            transform: scale(4); 
            opacity: 0; 
        }
    }
`;
document.head.appendChild(styleSheet);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    new AdvancedEffects();
});

// Prevent context menu on canvas and carousel
document.getElementById('particleCanvas').addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add loading screen fade out
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});