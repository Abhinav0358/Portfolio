// Portfolio Application - Main JavaScript File
class PortfolioApp {
    constructor() {
        this.currentPage = 'home';
        this.scrollAccumulator = 0;
        this.scrollThreshold = 100;
        this.isTransitioning = false;
        this.pages = ['home', 'projects', 'skills', 'contact'];
        this.currentPageIndex = 0;
        // NEW: mobile detection flag
        this.isMobile = window.matchMedia('(max-width: 900px)').matches;
        
        this.projectData = [
            {
                id: 1,
                title: "Doom using RL",
                description: "A reinforcement learning project aimed at training an agent to play Doom. Utilizes deep learning techniques for decision making.",
                image: "https://media.giphy.com/media/3o7ZeMCXAFPvusagQU/giphy.gif",
                gif: "https://media.giphy.com/media/3o7ZeMCXAFPvusagQU/giphy.gif",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 2,
                title: "Live chat using websockets",
                description: "Real-time chat application utilizing WebSocket for instant messaging.",
                image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
                gif: "static/gifs/chat.gif",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 3,
                title: "Spherobot",
                description: "An omnidirectional spherical robot with advanced navigation and manipulation capabilities.",
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
                gif: "static/gifs/spherobot.gif",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 4,
                title: "Three js",
                description: "interactive pages build using Three.js",
                image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
                gif: "static/gifs/threejs.gif",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 5,
                title: "Proj 5 ",
                description: "",
                image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
                gif: "", // no gif yet
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 6,
                title: "Portfolio",
                description: "This immersive Nether-themed portfolio website with 3D interactions and particle effects.",
                image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
                gif: "static/gifs/portfolio.gif",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            }
        ];
        
        this.init();
    }
    
    init() {
        // NEW: keep flag updated on resize
        window.addEventListener('resize', () => {
            const prev = this.isMobile;
            this.isMobile = window.matchMedia('(max-width: 900px)').matches;
            if (this.isMobile && !prev) {
                const cloudOverlay = document.getElementById('cloudOverlay');
                cloudOverlay?.classList.remove('active');
            }
            // Rebuild 3D carousel if breakpoint crossed
            if (prev !== this.isMobile && this.scene) {
                this.rebuildCarousel();
            }
        });

        this.setupParticleSystem();
        if (!this.isMobile) {
            this.setupScrollHandler();
        } else {
            this.setupMobileScrolling();
        }
        this.setupNavigation();
        this.setupProjectCarousel();
        this.setupFormHandler();
        this.setupButtonHandlers();
        
        // Initialize first page (desktop only needs active state)
        this.showPage('home');
    }
    
    // Particle System with Reduced Ember Tails
    setupParticleSystem() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.createParticles();
        this.animateParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 100,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: -Math.random() * 2 - 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                life: 1,
                decay: Math.random() * 0.005 + 0.002,
                trail: []
            });
        }
    }
    
    animateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= particle.decay;
            particle.opacity = particle.life * 0.8;
            
            // Add to trail - REDUCED LENGTH from 10 to 5
            particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity });
            if (particle.trail.length > 5) { // Reduced from 10 to 5
                particle.trail.shift();
            }
            
            // Draw trail - SHORTER AND MORE SUBTLE
            for (let j = 0; j < particle.trail.length; j++) {
                const trailParticle = particle.trail[j];
                const trailOpacity = (trailParticle.opacity * (j + 1)) / particle.trail.length * 0.6; // More subtle
                
                this.ctx.save();
                this.ctx.globalAlpha = trailOpacity;
                this.ctx.fillStyle = '#FFA500';
                this.ctx.shadowBlur = 6; // Reduced from 10
                this.ctx.shadowColor = '#FF4500';
                this.ctx.beginPath();
                this.ctx.arc(trailParticle.x, trailParticle.y, particle.size * 0.3, 0, Math.PI * 2); // Reduced from 0.5 to 0.3
                this.ctx.fill();
                this.ctx.restore();
            }
            
            // Draw main particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = '#FFD700';
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#FF4500';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            // Remove dead particles
            if (particle.life <= 0 || particle.y < -100) {
                this.particles.splice(i, 1);
            }
        }
        
        // Add new particles
        while (this.particles.length < Math.floor(window.innerWidth / 20)) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 50,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: -Math.random() * 2 - 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                life: 1,
                decay: Math.random() * 0.005 + 0.002,
                trail: []
            });
        }
        
        requestAnimationFrame(() => this.animateParticles());
    }
    
    // Fixed Scroll Handler with better direction handling
    setupScrollHandler() {
        let lastScrollTime = 0;
        const scrollDecay = 0.95;
        
        window.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;
            
            e.preventDefault();
            
            const currentTime = Date.now();
            const deltaTime = currentTime - lastScrollTime;
            
            // Decay accumulator over time
            if (deltaTime > 100) {
                this.scrollAccumulator *= Math.pow(scrollDecay, deltaTime / 100);
            }
            
            this.scrollAccumulator += Math.abs(e.deltaY);
            lastScrollTime = currentTime;
            
            if (this.scrollAccumulator > this.scrollThreshold) {
                const direction = e.deltaY > 0 ? 1 : -1;
                this.navigateToPage(direction);
                this.scrollAccumulator = 0;
            }
        }, { passive: false });
    }
    
    // NEW: Mobile smooth scroll + active nav tracking
    setupMobileScrolling() {
        // IntersectionObserver to highlight nav while scrolling
        const options = {
            root: null,
            rootMargin: '-40% 0px -50% 0px',
            threshold: 0
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    if (this.pages.includes(id)) {
                        this.updateNavigation(id);
                        this.currentPage = id;
                        this.currentPageIndex = this.pages.indexOf(id);
                    }
                }
            });
        }, options);

        this.pages.forEach(p => {
            const section = document.getElementById(p);
            if (section) observer.observe(section);
        });
    }

    // Fixed Navigation with proper click handling
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetPage = link.getAttribute('data-page');
                if (!targetPage || !this.pages.includes(targetPage)) return;

                if (this.isMobile) {
                    // Mobile: smooth scroll only
                    const section = document.getElementById(targetPage);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        this.updateNavigation(targetPage);
                        this.currentPage = targetPage;
                        this.currentPageIndex = this.pages.indexOf(targetPage);
                    }
                } else {
                    this.currentPageIndex = this.pages.indexOf(targetPage);
                    this.showPage(targetPage);
                }
            });
        });
        
        // Resume download handler
        const resumeBtn = document.querySelector('.resume-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Create a temporary link to trigger download simulation
                const link = document.createElement('a');
                link.href = 'data:text/plain;charset=utf-8,Resume%20of%20Abhinav%20-%20Engineering%20Student%20%26%20Developer';
                link.download = 'Abhinav_Resume.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
        
        // Setup social media links with updated structure
        this.setupSocialLinks();
    }
    
    // Fixed social links with proper email handling
    setupSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const href = link.getAttribute('href');
                const linkText = link.textContent.toLowerCase();
                
                if (href && href.startsWith('mailto:')) {
                    // Handle email links
                    window.location.href = href;
                } else if (href && href !== '#' && !href.startsWith('mailto:')) {
                    // Handle external links
                    window.open(href, '_blank');
                } else {
                    // Handle based on content for fallback
                    if (linkText.includes('github')) {
                        window.open('https://github.com/abhinav', '_blank');
                    } else if (linkText.includes('linkedin')) {
                        window.open('https://linkedin.com/in/abhinav', '_blank');
                    } else if (linkText.includes('email')) {
                        window.location.href = 'mailto:abhinav.portfolio@example.com';
                    }
                }
            });
        });
    }
    
    // Fixed navigation with better bounds checking
    navigateToPage(direction) {
        if (this.isTransitioning) return;
        
        let newPageIndex = this.currentPageIndex + direction;
        
        // Proper wrap around handling
        if (newPageIndex >= this.pages.length) {
            newPageIndex = 0;
        } else if (newPageIndex < 0) {
            newPageIndex = this.pages.length - 1;
        }
        
        // Ensure we don't get stuck in loops
        if (newPageIndex === this.currentPageIndex) {
            return;
        }
        
        this.currentPageIndex = newPageIndex;
        this.showPage(this.pages[newPageIndex]);
    }
    
    // Enhanced page showing with better state management
    showPage(pageId) {
        // MOBILE OVERRIDE: skip overlay animation & visibility toggles
        if (this.isMobile) {
            // Just ensure navigation highlight; all sections already visible
            this.updateNavigation(pageId);
            return;
        }

        if (this.isTransitioning || !pageId) return;
        if (this.currentPage === pageId) return;
        
        this.isTransitioning = true;
        const cloudOverlay = document.getElementById('cloudOverlay');
        const currentSection = document.querySelector('.page-section.active');
        const targetSection = document.getElementById(pageId);
        
        if (!targetSection) {
            this.isTransitioning = false;
            return;
        }
        
        cloudOverlay.classList.add('active');
        
        setTimeout(() => {
            if (currentSection) currentSection.classList.remove('active');
            targetSection.classList.add('active');
            this.currentPage = pageId;
            this.currentPageIndex = this.pages.indexOf(pageId);
            this.updateNavigation(pageId);
            if (pageId === 'projects') {
                this.updateProjectInfo(0);
            }
        }, 400);
        
        setTimeout(() => {
            cloudOverlay.classList.remove('active');
            this.isTransitioning = false;
        }, 800);
    }
    
    // Updated Navigation with Active State Highlighting
    updateNavigation(activePageId) {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === activePageId) {
                link.classList.add('active');
            }
        });
    }
    
    // 3D Project Carousel with Flying Cards Effect
    setupProjectCarousel() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded, skipping carousel setup');
            return;
        }
        
        this.currentProjectIndex = 0;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        const carouselContainer = document.getElementById('projectCarousel');
        if (!carouselContainer) return;
        
        this.renderer.setSize(carouselContainer.offsetWidth, carouselContainer.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        carouselContainer.appendChild(this.renderer.domElement);
        
        this.createProjectCards();
        this.setupCarouselControls();
        this.animateCarousel();
        
        // Handle resize
        window.addEventListener('resize', () => {
            const container = document.getElementById('projectCarousel');
            if (container && this.camera && this.renderer) {
                this.camera.aspect = container.offsetWidth / container.offsetHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(container.offsetWidth, container.offsetHeight);
            }
        });
    }
    
    createProjectCards() {
        if (!this.scene) return;

        // Clear old scene objects (keep lights later if you add them)
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        this.projectCards = [];

        // Responsive dimensions
        const radius = this.isMobile ? 7 : 11;
        const cardWidth = this.isMobile ? 4 : 10;
        const cardHeight = cardWidth * 2.3; // slightly less tall than 2.5 ratio for better mobile fit
        this.carouselRadius = radius;

        const palette = [
            { base: 0x602414, glow: 0xff7a1f, outer: 0xffc24d },
            { base: 0x4d1e12, glow: 0xff6419, outer: 0xffb339 },
            { base: 0x552815, glow: 0xff8c26, outer: 0xffd266 },
            { base: 0x432016, glow: 0xff7522, outer: 0xffbd52 },
            { base: 0x5e2d18, glow: 0xff6a18, outer: 0xffb247 },
            { base: 0x472417, glow: 0xff821f, outer: 0xffcc55 }
        ];

        for (let i = 0; i < this.projectData.length; i++) {
            const angle = (i / this.projectData.length) * Math.PI * 2;
            const colors = palette[i % palette.length];

            const group = new THREE.Group();
            group.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            group.lookAt(0, 0, 0);

            const card = new THREE.Mesh(
                new THREE.PlaneGeometry(cardWidth, cardHeight),
                new THREE.MeshBasicMaterial({
                    color: colors.base,
                    transparent: true,
                    opacity: 0.95
                })
            );

            const glow = new THREE.Mesh(
                new THREE.PlaneGeometry(cardWidth + 0.6, cardHeight + 0.6),
                new THREE.MeshBasicMaterial({
                    color: colors.glow,
                    transparent: true,
                    opacity: 0.42,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                })
            );
            glow.position.z = -0.02;

            const outerGlow = new THREE.Mesh(
                new THREE.PlaneGeometry(cardWidth + 1.3, cardHeight + 1.3),
                new THREE.MeshBasicMaterial({
                    color: colors.outer,
                    transparent: true,
                    opacity: 0.18,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                })
            );
            outerGlow.position.z = -0.04;

            group.add(outerGlow);
            group.add(glow);
            group.add(card);
            this.scene.add(group);

            this.projectCards.push({
                group,
                card,
                glow,
                outerGlow,
                index: i,
                floatOffset: i * 0.8,
                floatSpeed: 0.8 + (i * 0.1),
                rotationOffset: (Math.random() - 0.5) * 0.02
            });
        }

        // Camera adjustments
        if (this.isMobile) {
            this.camera.position.set(0, -2, 20); // farther back to fit more cards
            this.camera.fov = 80;
            this.camera.updateProjectionMatrix();
        } else {
            this.camera.position.set(0, -3, 18);
            this.camera.fov = 75;
            this.camera.updateProjectionMatrix();
        }
        this.camera.lookAt(0, 0, 0);
    }
    
    setupCarouselControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.rotateCarousel(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.rotateCarousel(1));
    }
    
    rotateCarousel(direction) {
        this.currentProjectIndex += direction;
        if (this.currentProjectIndex >= this.projectData.length) {
            this.currentProjectIndex = 0;
        } else if (this.currentProjectIndex < 0) {
            this.currentProjectIndex = this.projectData.length - 1;
        }
        
        const targetAngle = -(this.currentProjectIndex / this.projectData.length) * Math.PI * 2;
        
        // Animate rotation
        const startRotation = this.scene.rotation.y;
        const targetRotation = targetAngle;
        const duration = 1000;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            
            this.scene.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.updateProjectInfo(this.currentProjectIndex);
            }
        };
        
        animate();
    }
    
    updateProjectInfo(index) {
        const project = this.projectData[index];
        const titleElement = document.getElementById('projectTitle');
        const descriptionElement = document.getElementById('projectDescription');
        const liveDemoElement = document.getElementById('liveDemo');
        const githubElement = document.getElementById('githubLink');
        const gifElement = document.getElementById('projectGif');
        const fallbackEl = document.getElementById('projectMediaFallback');
        
        if (titleElement) titleElement.textContent = project.title;
        if (descriptionElement) descriptionElement.textContent = project.description || ' ';
        if (liveDemoElement) liveDemoElement.href = project.liveDemo;
        if (githubElement) githubElement.href = project.github;

        if (gifElement && fallbackEl) {
            if (project.gif) {
                gifElement.src = project.gif;
                gifElement.style.display = 'block';
                fallbackEl.style.display = 'none';
            } else {
                gifElement.style.display = 'none';
                fallbackEl.style.display = 'flex';
            }
        }
    }
    
    // Enhanced Carousel Animation with Flying Cards Effect
    animateCarousel() {
        if (!this.renderer || !this.scene || !this.camera) return;

        const time = Date.now() * 0.001;

        if (this.projectCards) {
            this.projectCards.forEach(obj => {
                const t = time * obj.floatSpeed + obj.floatOffset;

                // Only adjust vertical float on the GROUP (keeps ring intact)
                obj.group.position.y = Math.sin(t) * 0.35;

                // Subtle breathing roll just on the card (not the glows so they stay aligned)
                obj.card.rotation.z = Math.sin(t * 0.6) * obj.rotationOffset * 3;

                // Pulse inner/outer glows
                const pulse = 0.35 + Math.sin(t * 2) * 0.15;
                obj.glow.material.opacity = 0.25 + pulse * 0.4;
                obj.outerGlow.material.opacity = 0.12 + pulse * 0.1;
            });
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animateCarousel());
    }
    
    // Button Handlers
    setupButtonHandlers() {
        const exploreBtn = document.getElementById('exploreBtn');
        const contactBtn = document.getElementById('contactBtn');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                if (this.isMobile) {
                    document.getElementById('projects')?.scrollIntoView({behavior:'smooth'});
                    this.updateNavigation('projects');
                    this.currentPage = 'projects';
                    this.currentPageIndex = this.pages.indexOf('projects');
                } else {
                    this.currentPageIndex = 1;
                    this.showPage('projects');
                }
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                if (this.isMobile) {
                    document.getElementById('contact')?.scrollIntoView({behavior:'smooth'});
                    this.updateNavigation('contact');
                    this.currentPage = 'contact';
                    this.currentPageIndex = this.pages.indexOf('contact');
                } else {
                    this.currentPageIndex = 3;
                    this.showPage('contact');
                }
            });
        }
    }
    
    // Form Handler
    setupFormHandler() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const message = document.getElementById('message')?.value || '';
            
            // Simulate form submission
            alert(`Thank you ${name}! Your message has been sent. I'll get back to you at ${email}.`);
            form.reset();
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});