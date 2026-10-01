document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       PAGE LOADER
       ========================================================================== */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 300); // Small timeout for visual smoothness
        });
        
        // Safety fallback if load event doesn't fire fast
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 1500);
    }

    /* ==========================================================================
       THEME TOGGLE (Light / Dark Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        body.className = savedTheme;
    } else {
        body.className = systemPrefersDark ? 'dark-theme' : 'light-theme';
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('portfolio-theme', 'light-theme');
            } else {
                body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('portfolio-theme', 'dark-theme');
            }
        });
    }

    /* ==========================================================================
       NAVBAR SCROLL EFFECT & ACTIVE NAVIGATION LINK TRACKING
       ========================================================================== */
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const handleScroll = () => {
        // Navbar glassmorphism trigger
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset for header height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initially

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('active');
        });
        
        // Close menu on clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu on clicking outside nav
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }

    /* ==========================================================================
       ANIMATED TYPING EFFECT (Hero Section)
       ========================================================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const textArray = ["First-Year CSIT Student.", "Software Developer Aspirant.", "AI & ML Enthusiast.", "Cybersecurity Learner."];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newTextDelay = 2000; // Delay between words
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (!typedTextSpan) return;
        
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (!typedTextSpan) return;
        
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, typingSpeed + 500);
        }
    }
    
    // Start typing effect on load
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Animates once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    /* ==========================================================================
       SKILLS PROGRESS BARS ANIMATION
       ========================================================================== */
    const progressBars = document.querySelectorAll('.progress-bar');
    const skillsSection = document.getElementById('skills');
    
    if (progressBars.length > 0 && skillsSection) {
        // Store targets and set widths to 0 initially
        const barTargets = [];
        progressBars.forEach(bar => {
            const targetWidth = bar.style.width;
            barTargets.push({ element: bar, width: targetWidth });
            bar.style.width = '0';
        });
        
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Set targets
                    barTargets.forEach(item => {
                        item.element.style.width = item.width;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       PROJECTS FILTERING SYSTEM
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Change active button state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        const categories = card.getAttribute('data-category').split(' ');
                        if (categories.includes(filterValue)) {
                            card.classList.remove('hidden');
                        } else {
                            card.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUBMISSION SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form inputs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            // Basic validation helpers
            const setError = (inputElement, errorElementId) => {
                inputElement.parentElement.classList.add('invalid');
                isValid = false;
            };
            
            const clearError = (inputElement) => {
                inputElement.parentElement.classList.remove('invalid');
            };
            
            // Name validation
            if (!nameInput.value.trim()) {
                setError(nameInput);
            } else {
                clearError(nameInput);
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                setError(emailInput);
            } else {
                clearError(emailInput);
            }
            
            // Subject validation
            if (!subjectInput.value.trim()) {
                setError(subjectInput);
            } else {
                clearError(subjectInput);
            }
            
            // Message validation
            if (!messageInput.value.trim()) {
                setError(messageInput);
            } else {
                clearError(messageInput);
            }
            
            if (isValid) {
                // Show sending status
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const origBtnContent = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
                
                // Simulate HTTP request delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = origBtnContent;
                    
                    // Display success status
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Thank you! Your message was sent successfully.';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.className = 'form-status';
                    }, 5000);
                }, 1500);
            }
        });
        
        // Remove error styling on typing
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('invalid')) {
                    input.parentElement.classList.remove('invalid');
                }
            });
        });
    }

    /* ==========================================================================
       BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       MOUSE SCROLL DOWN BTN ACTION
       ========================================================================== */
    const scrollDownBtn = document.getElementById('scroll-down');
    const aboutSection = document.getElementById('about');
    
    if (scrollDownBtn && aboutSection) {
        scrollDownBtn.addEventListener('click', () => {
            aboutSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});
