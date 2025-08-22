// Global variables
let particleSystem = null;
let contactParticles = null;
let currentProjectIndex = 0;
let isScrolling = false;
let scrollTimeout = null;
let isCloudTransitioning = false;
let scrollAccumulator = 0;
const SCROLL_SENSITIVITY = 0.1; // Reduced scroll sensitivity for carousel

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initNetherParticleSystem();
    initContactParticles();
    initAnimatedDots();
    initNavigation();
    initProjectCarousel();
    initSkillAnimations();
    initContactForm();
    initScrollAnimations();
    initResumeDownload();
    initMobileNav();
    initCloudTransitions();
});

// Cloud Transition System - Fixed
function initCloudTransitions() {
    const cloudOverlay = document.getElementById('cloudOverlay');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Handle navigation clicks with cloud transitions
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && !isCloudTransitioning) {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Always trigger cloud transition for navigation clicks
                    triggerCloudTransition(() => {
                        scrollToSection(targetSection);
                        updateActiveNavLink(targetId);
                    });
                }
            }
        });
    });
}

function triggerCloudTransition(callback) {
    if (isCloudTransitioning) return;
    
    const cloudOverlay = document.getElementById('cloudOverlay');
    if (!cloudOverlay) {
        // If no cloud overlay, execute callback immediately
        if (callback) callback();
        return;
    }
    
    isCloudTransitioning = true;
    
    // Start cloud animation
    cloudOverlay.classList.add('active');
    
    // Execute callback at peak of cloud coverage (1 second in)
    setTimeout(() => {
        if (callback) callback();
    }, 1000);
    
    // End cloud animation
    setTimeout(() => {
        cloudOverlay.classList.remove('active');
        isCloudTransitioning = false;
    }, 2000);
}

function scrollToSection(targetSection) {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetSection.offsetTop - navbarHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// Enhanced Nether Particle System for Hero Section
function initNetherParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 120;
    
    // Create Nether-themed embers
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: -Math.random() * 0.8 - 0.2, // Rising motion
            opacity: Math.random() * 0.8 + 0.2,
            color: getRandomEmberColor(),
            life: Math.random() * 100 + 50,
            maxLife: Math.random() * 100 + 50,
            trail: []
        });
    }
    
    function getRandomEmberColor() {
        const colors = [
            'rgba(255, 255, 0, ', // Bright yellow
            'rgba(255, 136, 0, ', // Orange
            'rgba(255, 68, 0, ',  // Red-orange
            'rgba(255, 215, 0, ', // Gold
            'rgba(255, 165, 0, '  // Orange-yellow
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function animateNetherParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            // Update position with rising motion
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life--;
            
            // Add slight horizontal drift
            particle.speedX += (Math.random() - 0.5) * 0.01;
            particle.speedX *= 0.98; // Damping
            
            // Update trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 8) {
                particle.trail.shift();
            }
            
            // Reset particle when it goes off screen or dies
            if (particle.y < -10 || particle.x < -10 || particle.x > canvas.width + 10 || particle.life <= 0) {
                particle.x = Math.random() * canvas.width;
                particle.y = canvas.height + 10;
                particle.speedX = (Math.random() - 0.5) * 0.3;
                particle.speedY = -Math.random() * 0.8 - 0.2;
                particle.life = particle.maxLife;
                particle.color = getRandomEmberColor();
                particle.trail = [];
            }
            
            // Calculate opacity based on life
            const lifeRatio = particle.life / particle.maxLife;
            const currentOpacity = particle.opacity * lifeRatio;
            
            // Draw particle trail
            particle.trail.forEach((trailPoint, trailIndex) => {
                const trailOpacity = (currentOpacity * trailIndex) / particle.trail.length * 0.5;
                const trailSize = particle.size * (trailIndex / particle.trail.length) * 0.8;
                
                ctx.beginPath();
                ctx.arc(trailPoint.x, trailPoint.y, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = particle.color + trailOpacity + ')';
                ctx.shadowBlur = 8;
                ctx.shadowColor = particle.color + '0.8)';
                ctx.fill();
            });
            
            // Draw main particle with enhanced glow
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + currentOpacity + ')';
            ctx.shadowBlur = 15;
            ctx.shadowColor = particle.color + '1)';
            ctx.fill();
            
            // Add inner bright core
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 200, ${currentOpacity * 0.8})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 255, 0, 1)';
            ctx.fill();
        });
        
        requestAnimationFrame(animateNetherParticles);
    }
    
    animateNetherParticles();
}

// Enhanced Contact Particles Animation with Nether Theme
function initContactParticles() {
    const canvas = document.getElementById('contactParticles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 60;
    
    // Create flowing ember particles
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
    
    function getContactEmberColor() {
        const colors = [
            'rgba(255, 107, 53, ',
            'rgba(255, 133, 0, ',
            'rgba(255, 215, 0, ',
            'rgba(255, 165, 0, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function animateContactParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position (flowing effect)
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Update trail
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 6) {
                particle.trail.shift();
            }
            
            // Reset particles that go off screen
            if (particle.x > canvas.width + 10) {
                particle.x = -10;
                particle.y = Math.random() * canvas.height;
                particle.trail = [];
            }
            
            // Draw particle trail
            particle.trail.forEach((trailPoint, trailIndex) => {
                const trailOpacity = (particle.opacity * trailIndex) / particle.trail.length * 0.4;
                const trailSize = particle.size * (trailIndex / particle.trail.length) * 0.7;
                
                ctx.beginPath();
                ctx.arc(trailPoint.x, trailPoint.y, trailSize, 0, Math.PI * 2);
                ctx.fillStyle = particle.color + trailOpacity + ')';
                ctx.shadowBlur = 5;
                ctx.shadowColor = particle.color + '0.6)';
                ctx.fill();
            });
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + particle.opacity + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = particle.color + '0.8)';
            ctx.fill();
        });
        
        requestAnimationFrame(animateContactParticles);
    }
    
    animateContactParticles();
}

// Animated Dots for Hero Title
function initAnimatedDots() {
    const dotsElement = document.getElementById('animatedDots');
    if (!dotsElement) return;
    
    const dots = ['.', '..', '...'];
    let currentDot = 0;
    
    setInterval(() => {
        dotsElement.textContent = dots[currentDot];
        currentDot = (currentDot + 1) % dots.length;
    }, 800);
}

// Navigation System - Fixed for proper section navigation
function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    
    // Update active nav link function
    function updateActiveNav() {
        if (isCloudTransitioning) return; // Don't update during cloud transitions
        
        const scrollPos = window.scrollY + 100;
        
        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        if (activeSection) {
            updateActiveNavLink(activeSection);
        }
    }
    
    // Throttled scroll listener for navigation
    let navScrollTimeout;
    window.addEventListener('scroll', () => {
        if (navScrollTimeout) {
            clearTimeout(navScrollTimeout);
        }
        navScrollTimeout = setTimeout(updateActiveNav, 50);
    });
    
    updateActiveNav(); // Initial call
}

// Project Carousel System - Enhanced with Slower Speed and Better Spacing
function initProjectCarousel() {
    const projectCards = document.querySelectorAll('.project-card');
    const totalProjects = projectCards.length;
    
    if (totalProjects === 0) return;
    
    function updateProjectDisplay() {
        projectCards.forEach((card, index) => {
            card.classList.remove('active');
            
            // Calculate 3D positioning in a circle with increased radius
            const angle = (index - currentProjectIndex) * (Math.PI * 2 / totalProjects);
            const radius = 400; // Increased from 250 to 400 for better spacing
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            let transform = `translateX(${x}px) translateZ(${z}px)`;
            
            if (index === currentProjectIndex) {
                card.classList.add('active');
                transform += ' scale(1)';
                card.style.zIndex = '10';
            } else {
                // Better scaling for non-active cards
                const distanceFromActive = Math.abs(index - currentProjectIndex);
                const minDistance = Math.min(distanceFromActive, totalProjects - distanceFromActive);
                const scale = Math.max(0.6, 1 - (minDistance * 0.15));
                transform += ` scale(${scale})`;
                card.style.zIndex = `${10 - minDistance}`;
            }
            
            card.style.transform = transform;
        });
    }
    
    // Initialize carousel
    currentProjectIndex = 0;
    updateProjectDisplay();
    
    // Scroll-based carousel control with reduced sensitivity
    let lastScrollY = window.scrollY;
    function handleProjectScroll() {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection) return;
        
        const rect = projectsSection.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
        
        if (isInView) {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;
            
            // Accumulate scroll with reduced sensitivity
            scrollAccumulator += scrollDelta * SCROLL_SENSITIVITY;
            
            // Only change project when accumulator reaches threshold
            const threshold = 30; // Increased threshold for slower changes
            if (Math.abs(scrollAccumulator) > threshold) {
                if (scrollAccumulator > 0) {
                    // Scrolling down
                    currentProjectIndex = (currentProjectIndex + 1) % totalProjects;
                } else {
                    // Scrolling up
                    currentProjectIndex = (currentProjectIndex - 1 + totalProjects) % totalProjects;
                }
                updateProjectDisplay();
                scrollAccumulator = 0; // Reset accumulator
                lastScrollY = currentScrollY;
            }
        }
    }
    
    // Throttled scroll listener with longer delay
    let projectScrollTimeout;
    window.addEventListener('scroll', () => {
        if (projectScrollTimeout) {
            clearTimeout(projectScrollTimeout);
        }
        projectScrollTimeout = setTimeout(handleProjectScroll, 150); // Increased delay
    });
    
    // Mouse wheel control for projects section with reduced sensitivity
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.addEventListener('wheel', (e) => {
            const rect = projectsSection.getBoundingClientRect();
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                e.preventDefault();
                
                // Apply sensitivity reduction to wheel events too
                scrollAccumulator += e.deltaY * SCROLL_SENSITIVITY;
                
                const threshold = 50; // Higher threshold for wheel events
                if (Math.abs(scrollAccumulator) > threshold) {
                    const direction = scrollAccumulator > 0 ? 1 : -1;
                    currentProjectIndex = (currentProjectIndex + direction + totalProjects) % totalProjects;
                    updateProjectDisplay();
                    scrollAccumulator = 0;
                }
            }
        }, { passive: false });
    }

    // Initialize working project buttons - Fixed
    const projectButtons = document.querySelectorAll('.project-buttons a');
    projectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const buttonText = button.textContent.trim();
            
            if (buttonText === 'Live Demo') {
                showNotification('Live demo would open in production environment', 'info');
            } else if (buttonText === 'GitHub') {
                // Open GitHub in new tab
                window.open('https://github.com/abhinav', '_blank');
            }
        });
    });
}

// Skills Section Animations - Enhanced
function initSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    const skillCategories = document.querySelectorAll('.skill-category');
    
    // Enhanced hover animations for individual skill items
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
    
    // Enhanced 3D hover effect for skill categories
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

// Contact Form Handler - Fixed
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            form.reset();
            showNotification('Thank you! Your message has been sent.', 'success');
        }, 2000);
    });
}

// Resume Download - Fixed Implementation
function initResumeDownload() {
    const resumeBtn = document.getElementById('resumeBtn');
    if (!resumeBtn) return;
    
    // Remove any existing event listeners and add new one
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Create comprehensive resume content
        const resumeContent = `ABHINAV - Portfolio Resume
Engineering Student & Developer

CONTACT INFORMATION
Email: contact@abhinav.dev
GitHub: github.com/abhinav
LinkedIn: linkedin.com/in/abhinav
Twitter: twitter.com/abhinav

PROFESSIONAL SUMMARY
Passionate engineering student and developer specializing in 3D printing, robotics, and sustainable engineering solutions. Experienced in full-stack development, machine learning, and innovative design. Building the future through technology and engineering excellence.

FEATURED PROJECTS

Suspack - Biodegradable Packaging
• Award-winning sustainable packaging solution with removable layers (Top 20 nationally)
• Technologies: Materials Science, 3D Printing, CAD Design
• Impact: Revolutionary packaging design with sustainability innovation
• Achievement: National recognition for environmental impact

3D Printed Robotics Components
• Modular robotic parts with precise threading and durable PLA construction
• Technologies: 3D Printing, Robotics, SolidWorks
• Features: Custom-designed components with optimized threading
• Innovation: Structural integrity and precision engineering

ML Stock Analysis Tool
• Reinforcement learning system for stock market technical analysis using PPO algorithms
• Technologies: Python, Reinforcement Learning, PPO, Financial Analysis
• Architecture: Advanced ML system using Actor-Critic methods
• Application: Market prediction and algorithmic analysis

Angular-Django Web Platform
• Full-stack web application with modern TypeScript frontend and robust Python backend
• Technologies: Angular, Django, TypeScript, Python
• Scope: Comprehensive web platform development
• Expertise: End-to-end application architecture

CAD Design Automation
• Automated threading and surface optimization for 3D printed components
• Technologies: SolidWorks, Python, 3D Printing, Automation
• Innovation: Intelligent CAD automation reducing design time
• Impact: Improved component quality and workflow efficiency

IoT Environmental Monitoring
• Real-time sensor network for environmental data collection and analysis
• Technologies: Python, IoT, Data Analysis, Sensors
• Features: Comprehensive IoT system with real-time analytics
• Application: Smart environmental monitoring solutions

TECHNICAL SKILLS

Programming Languages:
• Python - Advanced proficiency in data analysis, ML, automation
• JavaScript - Modern web development and interactive applications
• TypeScript - Type-safe development for large-scale applications
• C++ - Systems programming and performance optimization
• Java - Object-oriented programming and enterprise applications

Web Development:
• React - Component-based UI development
• Angular - Enterprise-scale frontend applications
• Django - Robust backend development and APIs
• Node.js - Server-side JavaScript development
• HTML/CSS - Modern web standards and responsive design

3D Design & Manufacturing:
• SolidWorks - Professional CAD design and engineering
• 3D Printing - Additive manufacturing and prototyping
• CAD Design - Technical drawing and product development
• PLA Materials - Material science and polymer engineering
• Threading - Precision mechanical connections
• Mechanical Design - Engineering principles and optimization

AI & Machine Learning:
• Reinforcement Learning - Advanced algorithm implementation
• PPO Algorithms - Policy optimization and training
• TensorFlow - Deep learning framework proficiency
• Data Analysis - Statistical analysis and insights
• Neural Networks - Architecture design and optimization
• Actor-Critic Methods - Advanced ML techniques

Engineering & Robotics:
• Mechanical Design - Engineering systems and components
• Materials Science - Material properties and selection
• Robotics - Automated systems and control
• IoT - Internet of Things development and integration
• Structural Analysis - Engineering analysis and optimization

Development Tools:
• VS Code - Professional development environment
• GitHub - Version control and collaboration
• Git - Source code management
• Docker - Containerization and deployment
• Linux - System administration and development
• Creality Printers - 3D printing hardware expertise

EDUCATION & ACHIEVEMENTS
• Engineering Student with focus on innovative technology solutions
• Suspack Project - Top 20 nationally recognized sustainable packaging
• Advanced 3D printing and CAD expertise
• Full-stack development proficiency with modern frameworks
• AI/ML research experience with practical applications
• Strong foundation in both theoretical and applied engineering

NOTABLE ACCOMPLISHMENTS
• Award-winning sustainable packaging design
• Advanced reinforcement learning implementation
• Professional-grade 3D printing and robotics components
• Full-stack web application development
• IoT system design and implementation
• CAD automation and process optimization

INTERESTS & INNOVATION FOCUS
• Sustainable engineering solutions and environmental technology
• 3D printing and additive manufacturing advancement
• Robotics and automation systems development
• Machine learning applications in engineering
• Environmental technology innovation and impact
• Cross-disciplinary technology integration

TECHNICAL PHILOSOPHY
Committed to leveraging technology for sustainable solutions and innovative engineering. 
Focus on practical applications of advanced technologies including AI, 3D printing, and 
IoT systems to solve real-world problems and create positive environmental impact.

Generated on: ${new Date().toLocaleDateString()}
Portfolio: Nether-themed 3D Interactive Experience`;
        
        try {
            // Create and download the resume file
            const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Abhinav_Resume_Nether_Portfolio.txt';
            link.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showNotification('Resume downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download error:', error);
            showNotification('Download feature unavailable in this environment', 'error');
        }
    });
}

// Social Links - Fixed Implementation
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('http')) {
                e.preventDefault();
                window.open(href, '_blank');
            }
        });
    });
}

// Initialize social links
document.addEventListener('DOMContentLoaded', initSocialLinks);

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card');
    
    function checkAnimations() {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            
            if (isVisible) {
                element.classList.add('fade-in', 'visible');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(checkAnimations, 100));
    checkAnimations(); // Initial check
}

// Handle scroll-based hero camera zoom effect
function initHeroZoomEffect() {
    window.addEventListener('scroll', throttle(() => {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;
        
        const scrollPos = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        // Calculate zoom effect
        const zoomFactor = Math.min(scrollPos / heroHeight, 1);
        const scale = 1 + (zoomFactor * 0.15); // Reduced zoom intensity
        const blur = zoomFactor * 2; // Reduced blur intensity
        
        // Apply effects to hero content
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `scale(${scale})`;
            heroContent.style.filter = `blur(${blur}px)`;
            heroContent.style.opacity = Math.max(1 - zoomFactor * 1.0, 0);
        }
    }, 16));
}

// Initialize hero zoom effect
initHeroZoomEffect();

// Mobile Navigation - Fixed
function initMobileNav() {
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    
    if (!navMenu || !navContainer) return;
    
    // Check if toggle already exists
    let navToggle = navContainer.querySelector('.nav-toggle');
    
    if (!navToggle) {
        // Create mobile toggle button
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
    
    // Close menu when clicking nav links (with cloud transition consideration)
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 480) {
                setTimeout(() => {
                    navMenu.classList.remove('active');
                    navToggle.innerHTML = '☰';
                }, 1000); // Delay to allow cloud transition
            }
        });
    });
    
    // Handle resize events
    function handleResize() {
        if (window.innerWidth > 480) {
            navMenu.classList.remove('active');
            navToggle.innerHTML = '☰';
        }
    }
    
    window.addEventListener('resize', handleResize);
}

// Performance optimization: throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Portfolio app error:', e.error);
});

// Initialize error boundaries
try {
    console.log('Nether-themed portfolio website initialized successfully');
    console.log('Features: Cloud transitions, Enhanced particles, Slower carousel, Better spacing');
} catch (error) {
    console.error('Initialization error:', error);
}

// Additional Nether-themed enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add subtle glow effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, .nav-link, .social-link, .project-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 8px rgba(255, 107, 53, 0.6)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.textShadow = '';
        });
    });
});