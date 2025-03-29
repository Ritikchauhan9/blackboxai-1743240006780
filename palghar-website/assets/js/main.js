// Main JavaScript file for Palghar Tourism Website

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Scroll Animation for elements with 'animate-on-scroll' class
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.classList.add('animated');
        }
    });
}

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        // Remove existing error messages
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Check if field is required and empty
        if (input.required && !input.value.trim()) {
            displayError(input, 'This field is required');
            isValid = false;
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                displayError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone number validation (if present)
        if (input.type === 'tel' && input.value) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                displayError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });

    return isValid;
}

// Display error message under input field
function displayError(inputElement, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    inputElement.parentElement.appendChild(errorDiv);
    inputElement.classList.add('border-red-500');
}

// Handle form submissions
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (validateForm(event.target)) {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message bg-green-100 text-green-700 p-4 rounded mt-4';
        successMessage.textContent = 'Thank you! Your message has been sent successfully.';
        
        event.target.appendChild(successMessage);
        
        // Clear form
        event.target.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
}

// Image Gallery Lightbox
class Lightbox {
    constructor() {
        this.init();
    }

    init() {
        // Create lightbox container
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 hidden z-50 flex items-center justify-center';
        document.body.appendChild(this.lightbox);

        // Create image element
        this.img = document.createElement('img');
        this.img.className = 'max-h-[90vh] max-w-[90vw] object-contain';
        this.lightbox.appendChild(this.img);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'absolute top-4 right-4 text-white text-4xl';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => this.close();
        this.lightbox.appendChild(closeBtn);

        // Click outside to close
        this.lightbox.onclick = (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        };

        // Initialize gallery items
        this.initGalleryItems();
    }

    initGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.onclick = () => {
                const imgSrc = item.getAttribute('data-full-img') || item.querySelector('img').src;
                this.open(imgSrc);
            };
        });
    }

    open(src) {
        this.img.src = src;
        this.lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Newsletter Form Handling
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    if (!emailInput.value.trim()) {
        displayError(emailInput, 'Please enter your email address');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        displayError(emailInput, 'Please enter a valid email address');
        return;
    }

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message bg-green-100 text-green-700 p-4 rounded mt-4';
    successMessage.textContent = 'Thank you for subscribing to our newsletter!';
    
    event.target.appendChild(successMessage);
    
    // Clear form
    event.target.reset();
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    initMobileMenu();

    // Initialize lightbox for gallery
    if (document.querySelector('.gallery-item')) {
        new Lightbox();
    }

    // Add scroll animation handler
    window.addEventListener('scroll', handleScrollAnimations);
    handleScrollAnimations(); // Initial check

    // Initialize all forms
    const forms = document.querySelectorAll('form:not(.newsletter-form)');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Initialize newsletter forms
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });
});

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        handleFormSubmit,
        handleNewsletterSubmit,
        Lightbox
    };
}