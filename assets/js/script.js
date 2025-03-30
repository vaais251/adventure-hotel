/**
 * Adventure Saria Hotel Website JavaScript
 * Provides functionality for navigation, animations, currency conversion, and more
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            // Move the background image at a slower rate than the scroll
            heroSection.style.backgroundPosition = `center ${50 + (scrollPosition * 0.05)}%`;
        });
    }

    // Mobile Navigation - FIXED & ENHANCED
    const initMobileNav = function() {
        // Updated selector that works with both div and button elements
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (!hamburger || !navLinks) {
            console.log("Mobile menu elements not found!");
            return;
        }
        
        // Directly add event listener to hamburger button
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle classes for both elements
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Add/remove body class to prevent scrolling when menu is open
            if (this.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
            
            console.log("Hamburger clicked, nav state:", navLinks.classList.contains('active'));
        });
        
        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const target = event.target;
            
            // If click is outside navbar and menu is open, close it
            if (!target.closest('.navbar') && 
                !target.closest('.hamburger') && 
                navLinks.classList.contains('active')) {
                
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    };
    
    // Initialize mobile navigation
    initMobileNav();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animated counter for stats (when in viewport)
    const counters = document.querySelectorAll('.counter-value');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // ms
                    const increment = target / (duration / 30); // Update every 30ms
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            setTimeout(updateCounter, 30);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.8 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Currency Converter Functionality
    const currencySelect = document.getElementById('currency-select');
    const conversionRate = document.getElementById('conversion-rate');
    const selectedCurrency = document.getElementById('selected-currency');

    if (currencySelect && conversionRate && selectedCurrency) {
        const exchangeRates = {
            'USD': 0.0036, // 1 PKR = 0.0036 USD (example rate)
            'EUR': 0.0033, // 1 PKR = 0.0033 EUR (example rate)
            'GBP': 0.0028  // 1 PKR = 0.0028 GBP (example rate)
        };

        currencySelect.addEventListener('change', function() {
            const currency = this.value;
            const rate = exchangeRates[currency];
            
            // Add animation to rate display
            conversionRate.classList.add('pulse');
            setTimeout(() => conversionRate.classList.remove('pulse'), 1000);
            
            conversionRate.textContent = rate.toFixed(4);
            selectedCurrency.textContent = currency;
            
            // Update all price elements on the page if they exist
            updatePrices(currency, rate);
        });
    }

    // Function to update prices based on selected currency
    function updatePrices(currency, rate) {
        const priceElements = document.querySelectorAll('.price');
        
        priceElements.forEach(element => {
            const originalText = element.getAttribute('data-original') || element.textContent;
            
            // Store original text if not already stored
            if (!element.getAttribute('data-original')) {
                element.setAttribute('data-original', originalText);
            }
            
            // Extract PKR values
            const pkrMatch = originalText.match(/(\d+,?)+(-(\d+,?)+)?\s*PKR/);
            
            if (pkrMatch) {
                let priceText = originalText;
                
                // Simple case: single price (e.g., "8000 PKR")
                if (pkrMatch[0].indexOf('-') === -1) {
                    const pkrValue = parseInt(pkrMatch[0].replace(/[^\d]/g, ''));
                    const convertedValue = (pkrValue * rate).toFixed(2);
                    priceText = `${pkrMatch[0]} (${convertedValue} ${currency})`;
                } 
                // Range case: price range (e.g., "5000-6000 PKR")
                else {
                    const range = pkrMatch[0].split('-');
                    const lowerPkr = parseInt(range[0].replace(/[^\d]/g, ''));
                    const upperPkr = parseInt(range[1].replace(/[^\d]/g, ''));
                    
                    const lowerConverted = (lowerPkr * rate).toFixed(2);
                    const upperConverted = (upperPkr * rate).toFixed(2);
                    
                    priceText = `${pkrMatch[0]} (${lowerConverted}-${upperConverted} ${currency})`;
                }
                
                // Add animation when price changes
                element.classList.add('pulse');
                setTimeout(() => element.classList.remove('pulse'), 1000);
                
                element.textContent = priceText;
            }
        });
    }

    // Date validation for booking
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    const checkButton = document.querySelector('.check-btn');

    if (checkInInput && checkOutInput && checkButton) {
        // Set minimum date to today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayString = `${yyyy}-${mm}-${dd}`;
        
        checkInInput.min = todayString;
        
        // Update checkout min date when checkin changes
        checkInInput.addEventListener('change', function() {
            checkOutInput.min = this.value;
            
            // If checkout date is before new checkin date, reset it
            if (checkOutInput.value && checkOutInput.value < this.value) {
                checkOutInput.value = '';
            }
            
            // Highlight checkout input to prompt user to fill it
            checkOutInput.classList.add('highlight-input');
            setTimeout(() => checkOutInput.classList.remove('highlight-input'), 1500);
        });
        
        // Check button functionality
        checkButton.addEventListener('click', function() {
            if (!checkInInput.value) {
                alert('Please select a check-in date');
                checkInInput.focus();
                return;
            }
            
            if (!checkOutInput.value) {
                alert('Please select a check-out date');
                checkOutInput.focus();
                return;
            }
            
            // Calculate number of nights
            const checkIn = new Date(checkInInput.value);
            const checkOut = new Date(checkOutInput.value);
            const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            
            // Create a styled notification
            const notification = document.createElement('div');
            notification.className = 'booking-notification';
            notification.innerHTML = `
                <div class="booking-notification-content">
                    <i class="fas fa-check-circle"></i>
                    <p>You've selected a <strong>${nights}-night stay</strong>. Continue to our Booking page to reserve your room.</p>
                    <a href="booking.html" class="cta-button">Book Now</a>
                    <button class="close-notification"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Add slide-in animation
            setTimeout(() => notification.classList.add('show'), 10);
            
            // Add close functionality
            notification.querySelector('.close-notification').addEventListener('click', function() {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        });
    }

    // Image hover zoom effect
    const zoomImages = document.querySelectorAll('.zoom-image');
    zoomImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Gallery filtering animation
    const filterBtns = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Animate gallery items
                galleryItems.forEach(item => {
                    // First set all to fade out
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.classList.remove('hidden');
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.classList.add('hidden');
                        }
                    }, 300);
                });
            });
        });
    }

    // Weather widget (placeholder - would use actual API in production)
    const weatherDisplay = document.getElementById('weather-display');
    
    if (weatherDisplay) {
        // Simulated weather data (would be replaced with API call)
        const weatherData = {
            temperature: 22,
            condition: 'Sunny',
            forecast: [
                { day: 'Monday', high: 24, low: 12, condition: 'Sunny' },
                { day: 'Tuesday', high: 22, low: 10, condition: 'Partly Cloudy' },
                { day: 'Wednesday', high: 20, low: 9, condition: 'Cloudy' },
                { day: 'Thursday', high: 18, low: 8, condition: 'Light Rain' },
                { day: 'Friday', high: 19, low: 7, condition: 'Sunny' },
                { day: 'Saturday', high: 21, low: 9, condition: 'Sunny' },
                { day: 'Sunday', high: 23, low: 11, condition: 'Sunny' }
            ]
        };
        
        // Create weather HTML with icons and animations
        let weatherHTML = `
            <div class="current-weather" data-aos="fade-up">
                <h4>Today in Gilgit-Baltistan</h4>
                <div class="weather-icon">
                    <i class="fas fa-sun pulse"></i>
                </div>
                <p class="temperature">${weatherData.temperature}°C</p>
                <p class="condition">${weatherData.condition}</p>
            </div>
            <div class="forecast" data-aos="fade-up" data-aos-delay="200">
                <h4>7-Day Forecast</h4>
                <div class="forecast-days">
        `;
        
        // Add forecast days with appropriate weather icons
        weatherData.forecast.forEach((day, index) => {
            let iconClass = 'fa-sun';
            
            if (day.condition.includes('Cloud')) {
                iconClass = 'fa-cloud-sun';
            } else if (day.condition.includes('Rain')) {
                iconClass = 'fa-cloud-rain';
            }
            
            weatherHTML += `
                <div class="forecast-day" data-aos="fade-up" data-aos-delay="${200 + (index * 50)}">
                    <span class="day">${day.day}</span>
                    <i class="fas ${iconClass}"></i>
                    <span class="high-low">${day.high}°/${day.low}°</span>
                    <span class="day-condition">${day.condition}</span>
                </div>
            `;
        });
        
        weatherHTML += `
                </div>
            </div>
        `;
        
        weatherDisplay.innerHTML = weatherHTML;
    }

    // Newsletter subscription with improved animation
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            
            // Create success animation
            const formContainer = this.closest('.newsletter-container');
            formContainer.innerHTML = `
                <div class="success-animation">
                    <div class="checkmark-circle">
                        <div class="checkmark draw"></div>
                    </div>
                    <h3>Thank You!</h3>
                    <p>You have successfully subscribed to our newsletter with <strong>${email}</strong></p>
                    <p>We'll keep you updated with the latest offers and events at Adventure Saria.</p>
                </div>
            `;
        });
    }

    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const testimonials = testimonialSlider.querySelectorAll('.testimonial');
        const prevBtn = testimonialSlider.querySelector('.prev-btn');
        const nextBtn = testimonialSlider.querySelector('.next-btn');
        const dots = testimonialSlider.querySelectorAll('.slider-dot');
        let currentIndex = 0;
        const animationDuration = 600; // ms - should match CSS transition
        let isAnimating = false;
        
        // Set initial positions of testimonials
        function updateSlider() {
            testimonials.forEach((testimonial, index) => {
                if (index === currentIndex) {
                    testimonial.style.transform = 'translateX(0)';
                    testimonial.style.opacity = '1';
                    testimonial.style.zIndex = '2';
                } else if (index < currentIndex) {
                    testimonial.style.transform = 'translateX(-100%)';
                    testimonial.style.opacity = '0';
                    testimonial.style.zIndex = '1';
                } else {
                    testimonial.style.transform = 'translateX(100%)';
                    testimonial.style.opacity = '0';
                    testimonial.style.zIndex = '1';
                }
            });
            
            // Update active dot
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Initialize slider
        updateSlider();
        
        // Next slide
        function nextSlide() {
            if (isAnimating) return;
            isAnimating = true;
            
            currentIndex = (currentIndex + 1) % testimonials.length;
            updateSlider();
            
            setTimeout(() => {
                isAnimating = false;
            }, animationDuration);
        }
        
        // Previous slide
        function prevSlide() {
            if (isAnimating) return;
            isAnimating = true;
            
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            updateSlider();
            
            setTimeout(() => {
                isAnimating = false;
            }, animationDuration);
        }
        
        // Event listeners for buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (isAnimating || index === currentIndex) return;
                isAnimating = true;
                
                currentIndex = index;
                updateSlider();
                
                setTimeout(() => {
                    isAnimating = false;
                }, animationDuration);
            });
        });
        
        // Auto-slide functionality
        let slideInterval = setInterval(nextSlide, 6000);
        
        // Pause auto-slide on hover
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume auto-slide when mouse leaves
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 6000);
        });
        
        // Touch swipe functionality for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        testimonialSlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            // Minimum swipe distance (in px) to trigger slide change
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left: next slide
                nextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right: previous slide
                prevSlide();
            }
        }
    }

    // Text reveal animation for special sections
    const revealElements = document.querySelectorAll('.text-reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const letters = entry.target.textContent.split('');
                    entry.target.textContent = '';
                    
                    letters.forEach((letter, index) => {
                        const span = document.createElement('span');
                        span.textContent = letter;
                        span.style.animationDelay = `${index * 0.05}s`;
                        span.style.opacity = '0';
                        entry.target.appendChild(span);
                        
                        setTimeout(() => {
                            span.style.opacity = '1';
                            span.classList.add('revealed');
                        }, index * 50);
                    });
                    
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }
});

// Handle pre-loader animation
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-finish');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    }
    
    // Add entrance animations to hero elements
    const heroTitle = document.querySelector('.hero h2');
    const heroText = document.querySelector('.hero p');
    const heroBtn = document.querySelector('.hero .cta-button');
    
    if (heroTitle) heroTitle.classList.add('fade-in');
    if (heroText) {
        heroText.classList.add('fade-in');
        heroText.style.animationDelay = '0.3s';
    }
    if (heroBtn) {
        heroBtn.classList.add('fade-in');
        heroBtn.style.animationDelay = '0.6s';
    }
});
