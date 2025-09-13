// Minecraft Portfolio JavaScript
class PortfolioManager {
    constructor() {
        this.projects = this.loadProjects();
        this.currentProjectId = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProjects();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Add project button
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Modal close buttons
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Click outside modal to close
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('projectModal');
            if (event.target === modal) {
                this.closeModal();
            }
        });

        // Form submission
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProject();
        });

        // Contact form submission
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm();
        });

        // Add copy email functionality
        this.addCopyEmailFunctionality();
        
        // Add scroll to top functionality
        this.setupScrollToTop();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.getAttribute('data-section');
                
                // Remove active class from all nav items and sections
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked nav item and corresponding section
                item.classList.add('active');
                const targetElement = document.getElementById(targetSection);
                targetElement.classList.add('active');
                
                // Smooth scroll to section
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });

        // Add scroll spy for navigation
        this.setupScrollSpy();
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('.content-section');
        const navItems = document.querySelectorAll('.nav-item');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Remove active class from all nav items
                    navItems.forEach(nav => nav.classList.remove('active'));
                    
                    // Add active class to corresponding nav item
                    const activeNav = document.querySelector(`[data-section="${sectionId}"]`);
                    if (activeNav) {
                        activeNav.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    openModal() {
        document.getElementById('projectModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Reset form
        document.getElementById('projectForm').reset();
    }

    closeModal() {
        document.getElementById('projectModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    addProject() {
        const formData = new FormData(document.getElementById('projectForm'));
        const project = {
            id: this.currentProjectId++,
            title: formData.get('title'),
            description: formData.get('description'),
            technologies: formData.get('technologies'),
            link: formData.get('link'),
            image: formData.get('image')
        };

        this.projects.push(project);
        this.saveProjects();
        this.renderProjects();
        this.closeModal();
        
        // Show success message
        this.showNotification('Project added successfully!', 'success');
    }

    deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            this.projects = this.projects.filter(project => project.id !== projectId);
            this.saveProjects();
            this.renderProjects();
            this.showNotification('Project deleted successfully!', 'success');
        }
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (this.projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <div class="no-projects-content">
                        <div class="minecraft-icon">⛏️</div>
                        <h3>No Projects Yet</h3>
                        <p>Start building your portfolio by adding your first project!</p>
                        <button class="add-first-project-btn" onclick="portfolioManager.openModal()">
                            + Add Your First Project
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = this.projects.map(project => `
            <div class="project-card">
                <div class="project-image">
                    ${project.image ? 
                        `<img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">` : 
                        '🔧'
                    }
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <p class="project-tech">${project.technologies || 'Various technologies'}</p>
                <div class="project-actions">
                    ${project.link ? 
                        `<a href="${project.link}" target="_blank" class="project-link">View Project</a>` : 
                        '<span class="no-link">No link available</span>'
                    }
                    <button class="delete-btn" onclick="portfolioManager.deleteProject(${project.id})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

    }


    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#32CD32' : '#FF6347'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            border: 3px solid ${type === 'success' ? '#228B22' : '#DC143C'};
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            z-index: 1001;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    loadProjects() {
        const saved = localStorage.getItem('minecraftPortfolioProjects');
        if (saved) {
            const projects = JSON.parse(saved);
            this.currentProjectId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 0;
            return projects;
        }
        
        // Return some sample projects if none exist
        return [
            {
                id: 0,
                title: "Minecraft Data Analysis Tool",
                description: "A Python application that analyzes Minecraft world data to generate insights about player behavior and world statistics.",
                technologies: "Python, Pandas, Matplotlib, SQLite",
                link: "https://github.com/example/minecraft-analytics",
                image: ""
            },
            {
                id: 1,
                title: "Blockchain Voting System",
                description: "A decentralized voting platform built with smart contracts, ensuring transparency and security in elections.",
                technologies: "Solidity, Web3.js, React, Node.js",
                link: "https://github.com/example/blockchain-voting",
                image: ""
            },
            {
                id: 2,
                title: "Machine Learning Stock Predictor",
                description: "An AI model that predicts stock prices using historical data and sentiment analysis from news articles.",
                technologies: "Python, TensorFlow, Scikit-learn, BeautifulSoup",
                link: "https://github.com/example/stock-predictor",
                image: ""
            }
        ];
    }

    saveProjects() {
        localStorage.setItem('minecraftPortfolioProjects', JSON.stringify(this.projects));
    }

    handleContactForm() {
        const formData = new FormData(document.getElementById('contactForm'));
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            type: formData.get('type'),
            newsletter: formData.get('newsletter') === 'on',
            timestamp: new Date().toISOString()
        };

        // Save contact message to localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // Try to send email directly using EmailJS
        this.sendEmailDirectly(contactData);
    }

    async sendEmailDirectly(contactData) {
        const submitBtn = document.querySelector('.submit-contact-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon">⏳</span>';
            submitBtn.disabled = true;

            // Initialize EmailJS
            emailjs.init("jN_rw3zMQAvbIe975"); // Your EmailJS User ID (Public Key)

            const templateParams = {
                from_name: contactData.name,
                from_email: contactData.email,
                subject: contactData.subject,
                message: contactData.message,
                inquiry_type: contactData.type,
                newsletter: contactData.newsletter ? 'Yes' : 'No',
                to_email: 'ssk080204@gmail.com'
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                'service_yp7b85k', // Your EmailJS service ID
                '__ejs-test-mail-service__', // Your EmailJS template ID
                templateParams
            );

            if (response.status === 200) {
                this.showNotification('Message sent successfully! Check your Gmail inbox! 📧', 'success');
                submitBtn.innerHTML = '<span class="btn-text">Sent!</span><span class="btn-icon">✅</span>';
                submitBtn.style.background = 'linear-gradient(45deg, #4ECDC4, #45B7D1)';
                
                // Reset form
                document.getElementById('contactForm').reset();
            } else {
                throw new Error('Email sending failed');
            }

        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Fallback to mailto method
            this.showNotification('Direct sending failed. Opening email client as backup... 📧', 'success');
            this.fallbackToMailto(contactData);
            
            submitBtn.innerHTML = '<span class="btn-text">Email Opened!</span><span class="btn-icon">📧</span>';
            submitBtn.style.background = 'linear-gradient(45deg, #533483, #0f3460)';
        }

        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }

    fallbackToMailto(contactData) {
        // Create email content
        const emailSubject = encodeURIComponent(contactData.subject);
        const emailBody = encodeURIComponent(
            `Name: ${contactData.name}\n` +
            `Email: ${contactData.email}\n` +
            `Type: ${contactData.type}\n` +
            `Newsletter: ${contactData.newsletter ? 'Yes' : 'No'}\n\n` +
            `Message:\n${contactData.message}`
        );
        
        // Open email client with pre-filled content
        const mailtoLink = `mailto:ssk080204@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        window.open(mailtoLink, '_blank');
    }

    addCopyEmailFunctionality() {
        // Add click handler to email address
        const emailElement = document.querySelector('.contact-details p');
        if (emailElement && emailElement.textContent.includes('@')) {
            emailElement.style.cursor = 'pointer';
            emailElement.title = 'Click to copy email address';
            
            emailElement.addEventListener('click', () => {
                const email = 'ssk080204@gmail.com';
                navigator.clipboard.writeText(email).then(() => {
                    this.showNotification('Email copied to clipboard! 📋', 'success');
                    
                    // Visual feedback
                    emailElement.style.transform = 'scale(1.1)';
                    emailElement.style.color = '#e94560';
                    setTimeout(() => {
                        emailElement.style.transform = 'scale(1)';
                        emailElement.style.color = '';
                    }, 500);
                }).catch(() => {
                    this.showNotification('Could not copy email. Please copy manually.', 'error');
                });
            });
        }
    }

    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-projects {
        grid-column: 1 / -1;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
    }
    
    .no-projects-content {
        text-align: center;
        background: rgba(255, 255, 255, 0.9);
        padding: 40px;
        border-radius: 15px;
        border: 4px solid #8B4513;
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        position: relative;
    }
    
    .no-projects-content::before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        background: linear-gradient(45deg, #8B4513, #A0522D, #8B4513);
        border-radius: 15px;
        z-index: -1;
    }
    
    .minecraft-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: bounce 2s infinite;
    }
    
    .no-projects-content h3 {
        color: #2F4F2F;
        margin-bottom: 15px;
        text-shadow: 1px 1px 0px #90EE90;
    }
    
    .no-projects-content p {
        color: #4F4F4F;
        margin-bottom: 25px;
        line-height: 1.6;
    }
    
    .add-first-project-btn {
        background: #32CD32;
        color: white;
        border: 3px solid #228B22;
        padding: 12px 24px;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.8rem;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 0px #1E7B1E;
    }
    
    .add-first-project-btn:hover {
        background: #228B22;
        transform: translateY(2px);
        box-shadow: 0 2px 0px #1E7B1E;
    }
    
    .no-link {
        color: #888;
        font-size: 0.7rem;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Initialize the portfolio manager when the page loads
let portfolioManager;
document.addEventListener('DOMContentLoaded', () => {
    portfolioManager = new PortfolioManager();
});

// Add some fun interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add click effects to project cards
    document.addEventListener('click', (e) => {
        if (e.target.closest('.project-card')) {
            const card = e.target.closest('.project-card');
            card.style.transform = 'scale(0.95) rotateY(10deg)';
            card.style.filter = 'brightness(1.2)';
            setTimeout(() => {
                card.style.transform = '';
                card.style.filter = '';
            }, 200);
        }
    });

    // Enhanced hover effects for all interactive elements
    const interactiveElements = document.querySelectorAll('button, .nav-item, .project-link, .project-card, .skill-item, .contact-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-3px) scale(1.02)';
            element.style.filter = 'brightness(1.1)';
            element.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.filter = '';
            element.style.boxShadow = '';
        });
    });

    // Add ripple effect on click
    document.addEventListener('click', (e) => {
        if (e.target.matches('button, .nav-item, .project-link')) {
            const ripple = document.createElement('span');
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1000;
            `;
            
            e.target.style.position = 'relative';
            e.target.style.overflow = 'hidden';
            e.target.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }
    });

    // Add smooth parallax effect to background
    let ticking = false;
    let lastScrollY = 0;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.minecraft-world');
        const speed = scrolled * 0.03; // Even more reduced for ultra-smooth effect
        const deltaY = scrolled - lastScrollY;
        
        // Only update if scroll direction changed or significant movement
        if (Math.abs(deltaY) > 1) {
            parallax.style.transform = `translateY(${speed}px)`;
            lastScrollY = scrolled;
        }
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });

    // Add smooth reveal animations for elements
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for smooth reveal
    const revealElements = document.querySelectorAll('.project-card, .value-card, .stat-block, .contact-item, .timeline-item, .skill-category-card');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        revealObserver.observe(el);
    });

    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.style.width;
                skillBar.style.width = '0%';
                skillBar.style.opacity = '0.7';
                setTimeout(() => {
                    skillBar.style.width = width;
                    skillBar.style.opacity = '1';
                }, 100);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => {
        skillBarObserver.observe(bar);
    });

    // Add typing animation to title
    const title = document.querySelector('.main-title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '3px solid #e94560';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                title.style.borderRight = 'none';
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Add floating animation to stats
    const statBlocks = document.querySelectorAll('.stat-block');
    statBlocks.forEach((block, index) => {
        block.style.animationDelay = `${index * 0.2}s`;
        block.style.animation = 'statFloat 4s ease-in-out infinite';
    });

    // Add staggered animation to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'cardSlideIn 0.6s ease-out, cardFloat 6s ease-in-out infinite';
    });

    // Add mouse trail effect
    let mouseTrail = [];
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, #e94560, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX - 3}px;
            top: ${e.clientY - 3}px;
            animation: trailFade 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        mouseTrail.push(trail);
        
        if (mouseTrail.length > 20) {
            const oldTrail = mouseTrail.shift();
            oldTrail.remove();
        }
        
        setTimeout(() => trail.remove(), 1000);
    });
});
