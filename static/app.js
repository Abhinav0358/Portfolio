// Portfolio Application - Main JavaScript File
class PortfolioApp {
    constructor() {
        this.currentPage = 'home';
        this.scrollAccumulator = 0;
        this.scrollThreshold = 100;
        this.isTransitioning = false;
        this.pages = ['home', 'projects', 'skills', 'contact'];
        this.currentPageIndex = 0;
        
        this.projectData = [
            {
                id: 1,
                title: "Doom using RL",
                description: "A reinforcement learning project aimed at training an agent to play Doom. Utilizes deep learning techniques for decision making.",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 2,
                title: "Live chat using websockets",
                description: "Real-time chat application utilizing WebSocket for instant messaging.",
                image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 3,
                title: "Spherobot",
                description: "An omnidirectional spherical robot with advanced navigation and manipulation capabilities.",
                image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 4,
                title: "Three js",
                description: "interactive pages build using Three.js",
                image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 5,
                title: "Proj 5 ",
                description: "",
                image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            },
            {
                id: 6,
                title: "Portfolio",
                description: "This immersive Nether-themed portfolio website with 3D interactions and particle effects.",
                image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop",
                liveDemo: "https://github.com/abhinav",
                github: "https://github.com/abhinav"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupParticleSystem();
        this.setupScrollHandler();
        this.setupNavigation();
        this.setupProjectCarousel();
        this.setupFormHandler();
        this.setupButtonHandlers();
        
        // Initialize first page
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
    
    // Fixed Navigation with proper click handling
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetPage = link.getAttribute('data-page');
                if (targetPage && this.pages.includes(targetPage)) {
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
        if (this.isTransitioning || !pageId) return;
        
        // Prevent multiple simultaneous transitions
        if (this.currentPage === pageId) return;
        
        this.isTransitioning = true;
        const cloudOverlay = document.getElementById('cloudOverlay');
        const currentSection = document.querySelector('.page-section.active');
        const targetSection = document.getElementById(pageId);
        
        if (!targetSection) {
            this.isTransitioning = false;
            return;
        }
        
        // Show cloud transition
        cloudOverlay.classList.add('active');
        
        setTimeout(() => {
            // Hide current page
            if (currentSection) {
                currentSection.classList.remove('active');
            }
            
            // Show target page
            targetSection.classList.add('active');
            this.currentPage = pageId;
            
            // Update page index to match current page
            this.currentPageIndex = this.pages.indexOf(pageId);
            
            // Update navigation active state with yellowish highlighting
            this.updateNavigation(pageId);
            
            // Special handling for projects page
            if (pageId === 'projects') {
                this.updateProjectInfo(0);
            }
        }, 400);
        
        // Hide clouds
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
        
        this.projectCards = [];
        const radius = 8;
        
        for (let i = 0; i < this.projectData.length; i++) {
            const angle = (i / this.projectData.length) * Math.PI * 2;
            
            // Card geometry with enhanced glow
            const geometry = new THREE.PlaneGeometry(3, 4);
            
            // Enhanced material with better glow
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL((i * 60) % 360 / 360, 0.7, 0.6),
                transparent: true,
                opacity: 0.8
            });
            
            const card = new THREE.Mesh(geometry, material);
            card.position.x = Math.cos(angle) * radius;
            card.position.z = Math.sin(angle) * radius;
            card.position.y = 0;
            card.lookAt(0, 0, 0);
            
            // Enhanced glow effect for flying cards
            const glowGeometry = new THREE.PlaneGeometry(3.4, 4.4);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFA500,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(card.position);
            glow.position.z -= 0.01;
            glow.lookAt(0, 0, 0);
            
            // Add outer glow for extra floating effect
            const outerGlowGeometry = new THREE.PlaneGeometry(3.8, 4.8);
            const outerGlowMaterial = new THREE.MeshBasicMaterial({
                color: 0xFF4500,
                transparent: true,
                opacity: 0.15
            });
            const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
            outerGlow.position.copy(card.position);
            outerGlow.position.z -= 0.02;
            outerGlow.lookAt(0, 0, 0);
            
            this.scene.add(outerGlow);
            this.scene.add(glow);
            this.scene.add(card);
            
            // Store cards with floating animation properties
            this.projectCards.push({ 
                card, 
                glow, 
                outerGlow,
                index: i,
                floatOffset: i * 0.8, // Stagger timing
                floatSpeed: 0.8 + (i * 0.1), // Vary speed
                rotationOffset: (Math.random() - 0.5) * 0.02 // Small random rotation
            });
        }
        
        this.camera.position.set(0, 2, 12);
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
        
        if (titleElement) titleElement.textContent = project.title;
        if (descriptionElement) descriptionElement.textContent = project.description;
        if (liveDemoElement) liveDemoElement.href = project.liveDemo;
        if (githubElement) githubElement.href = project.github;
    }
    
    // Enhanced Carousel Animation with Flying Cards Effect
    animateCarousel() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        // Enhanced floating animation for flying cards
        const time = Date.now() * 0.001;
        
        if (this.projectCards) {
            this.projectCards.forEach((cardObj, index) => {
                const offsetTime = time * cardObj.floatSpeed + cardObj.floatOffset;
                
                // Floating effect - different patterns for each card
                const floatY = Math.sin(offsetTime) * (0.15 + index * 0.02);
                const floatX = Math.cos(offsetTime * 0.7) * 0.05;
                const rotation = Math.sin(offsetTime * 0.5) * cardObj.rotationOffset;
                
                // Apply floating animations
                cardObj.card.position.y = floatY;
                cardObj.glow.position.y = floatY;
                cardObj.outerGlow.position.y = floatY;
                
                // Subtle horizontal drift
                const baseX = Math.cos((cardObj.index / this.projectData.length) * Math.PI * 2) * 8;
                cardObj.card.position.x = baseX + floatX;
                cardObj.glow.position.x = baseX + floatX;
                cardObj.outerGlow.position.x = baseX + floatX;
                
                // Subtle rotation for floating effect
                cardObj.card.rotation.z = rotation;
                cardObj.glow.rotation.z = rotation;
                cardObj.outerGlow.rotation.z = rotation;
                
                // Pulsing glow effect
                const glowPulse = 0.3 + Math.sin(offsetTime * 2) * 0.1;
                cardObj.glow.material.opacity = glowPulse;
                cardObj.outerGlow.material.opacity = glowPulse * 0.5;
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
                this.currentPageIndex = 1; // Projects
                this.showPage('projects');
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                this.currentPageIndex = 3; // Contact
                this.showPage('contact');
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