
// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Navigation functionality
class Navigation {
    constructor() {
        this.navbar = $('#navbar');
        this.navToggle = $('#nav-toggle');
        this.navMenu = $('#nav-menu');
        this.navLinks = $$('.nav-link');
        this.sections = $$('section[id]');
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.handleNavToggle();
        this.handleSmoothScroll();
        this.highlightActiveSection();
        
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.highlightActiveSection();
        });
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar.classList.toggle('scrolled', scrolled);
    }
    
    handleNavToggle() {
        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
            }
        });
    }
    
    handleSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = $(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Back to top functionality
        $('.back-to-top').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    highlightActiveSection() {
        const scrollPos = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = $$('.reveal-on-scroll');
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// FAQ Accordion
class FAQ {
    constructor() {
        this.faqItems = $$('.faq-item');
        this.init();
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                this.faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
}

// Form Handling
class FormHandler {
    constructor() {
        this.contactForm = $('#contact-form');
        this.pricingForm = $('#pricing-form');
        this.successModal = $('#success-modal');
        
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e, this.contactForm);
            });
        }
        
        if (this.pricingForm) {
            this.pricingForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e, this.pricingForm);
            });
        }
        
        // Add input validation
        $$('input, textarea, select').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    handleFormSubmit(e, form) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const formObj = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Simulate form submission
        this.showLoading(form);
        
        setTimeout(() => {
            this.hideLoading(form);
            this.showSuccessModal();
            form.reset();
            
            // Log form data (in real app, send to server)
            console.log('Form submitted:', formObj);
        }, 1500);
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        
        // Remove existing error
        this.clearFieldError(input);
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            this.showFieldError(input, 'This field is required');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Name validation
        if (name === 'name' && value) {
            if (value.length < 2) {
                this.showFieldError(input, 'Name must be at least 2 characters');
                return false;
            }
        }
        
        return true;
    }
    
    showFieldError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    clearFieldError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.classList.add('loading');
    }
    
    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.classList.contains('pricing-btn') ? 'Get Pricing Quote' : 'Send Message';
        submitBtn.classList.remove('loading');
    }
    
    showSuccessModal() {
        this.successModal.classList.add('show');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            this.closeModal();
        }, 5000);
    }
    
    closeModal() {
        this.successModal.classList.remove('show');
    }
}

// Global modal close function
window.closeModal = function() {
    const modal = $('#success-modal');
    modal.classList.remove('show');
};

// Scroll indicator functionality
class ScrollIndicator {
    constructor() {
        this.scrollIndicator = $('.scroll-indicator');
        this.init();
    }
    
    init() {
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                const productsSection = $('#products');
                const offsetTop = productsSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            });
            
            // Hide scroll indicator when user scrolls past hero
            window.addEventListener('scroll', () => {
                const heroHeight = $('.hero').offsetHeight;
                const scrolled = window.scrollY > heroHeight * 0.3;
                this.scrollIndicator.style.opacity = scrolled ? '0' : '1';
            });
        }
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy load images when they come into view
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Debounce scroll events
        this.debounceScrollEvents();
    }
    
    lazyLoadImages() {
        const images = $$('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
    
    preloadCriticalResources() {
        // Preload Google Fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
    
    debounceScrollEvents() {
        let ticking = false;
        
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Dispatch custom scroll event
                    window.dispatchEvent(new CustomEvent('optimizedScroll'));
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.addKeyboardNavigation();
        this.enhanceFocusVisibility();
        this.addARIALabels();
        this.respectReducedMotion();
    }
    
    addKeyboardNavigation() {
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = $('.modal.show');
                if (modal) {
                    modal.classList.remove('show');
                }
            }
        });
        
        // Tab navigation for FAQ
        $$('.faq-question').forEach(question => {
            question.setAttribute('tabindex', '0');
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }
    
    enhanceFocusVisibility() {
        // Add focus styles for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .nav-link:focus,
            .btn:focus,
            .faq-question:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    addARIALabels() {
        // Add ARIA labels for better screen reader support
        const navToggle = $('.nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        
        $$('.faq-question').forEach(question => {
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
        });
    }
    
    respectReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Disable animations for users who prefer reduced motion
            document.body.classList.add('reduced-motion');
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new Navigation();
    new ScrollAnimations();
    new FAQ();
    new FormHandler();
    new ScrollIndicator();
    new PerformanceOptimizer();
    new AccessibilityEnhancer();
    
    // Add loading state handler
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
    console.log('Access Link website initialized successfully! 🚀');
});

// Additional form validation styles
const validationStyles = `
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #EF4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .field-error {
        color: #EF4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: none;
    }
    
    .btn.loading {
        opacity: 0.7;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
`;

// Inject validation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = validationStyles;
document.head.appendChild(styleSheet);
