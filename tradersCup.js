function startLiveUpdates() {
    // Initial load of participant count
    updateParticipantCount();

    // Update participant count every 30 seconds (adjust as needed)
    setInterval(updateParticipantCount, 30000);

    // Keep your existing trophy animation
    setTimeout(() => {
        animateTrophyFill(PRIZE_AMOUNT, MAX_AMOUNT);
    }, 2000);
}


const PRIZE_AMOUNT = 2000; // Change this value to whatever amount you want
const MAX_AMOUNT = 1000; // Change this value to set your maximum amount

function animateTrophyFill(currentAmount, maxAmount) {
    const fillLevel = document.getElementById('prize-fill-level');
    const coinContainer = document.getElementById('prize-coin-container');
    const amountDisplay = document.getElementById('prize-current-amount');

    // Calculate fill percentage (max 85% to look realistic)
    const fillPercentage = Math.min((currentAmount / maxAmount) * 85, 85);

    // Animate the fill level
    setTimeout(() => {
        fillLevel.style.height = fillPercentage + '%';
    }, 500);

    // Calculate how many coins can fit in the fill level
    const maxHeight = 120;
    const actualFillHeight = (fillPercentage / 100) * maxHeight;
    const coinsPerRow = 5;
    const maxRows = Math.floor(actualFillHeight / 12);
    const totalCoins = maxRows * coinsPerRow;

    for (let i = 0; i < totalCoins; i++) {
        setTimeout(() => {
            createAnimatedCoin(coinContainer, i);
        }, i * 150 + 1000); // Stagger coin drops
    }

    // Animate the amount counter
    animateAmount(amountDisplay, currentAmount);
}

function createAnimatedCoin(container, index) {
    const coin = document.createElement('div');
    coin.className = 'prize-coin';

    // Calculate row and position within row
    const coinsPerRow = 5; // Fixed number of coins per row
    const rowIndex = Math.floor(index / coinsPerRow);
    const positionInRow = index % coinsPerRow;

    // Calculate height based on row
    // Calculate height based on current fill level
    const fillLevel = document.getElementById('prize-fill-level');
    const currentFillHeight = fillLevel ? parseFloat(fillLevel.style.height) || 0 : 0;
    const maxHeight = 120; // Container height
    const actualFillHeight = (currentFillHeight / 100) * maxHeight;

    // Calculate height based on row, but don't exceed fill level
    const baseHeight = 8 + (rowIndex * 12);
    const coinHeight = Math.min(baseHeight, actualFillHeight - 12); // Keep coins below fill level

    // Use consistent width for coin placement
    const availableWidth = 110; // Consistent width percentage
    const centerOffset = -8; // Center the coins

    // Evenly distribute coins across available width
    const coinSpacing = availableWidth / (coinsPerRow + 1);
    const leftPosition = centerOffset + (coinSpacing * (positionInRow + 1));

    coin.style.left = leftPosition + '%';
    coin.style.bottom = coinHeight + 'px';
    coin.style.animationDelay = '0s';

    container.appendChild(coin);

    setTimeout(() => {
        if (coin.parentNode) {
            coin.style.opacity = '0.9';
            coin.style.transform = 'scale(0.9)';
        }
    }, 1500);
}

function animateAmount(element, targetAmount) {
    const duration = 2000;
    const startAmount = 0;
    const increment = targetAmount / (duration / 50);
    let currentAmount = startAmount;

    const counter = setInterval(() => {
        currentAmount += increment;
        if (currentAmount >= targetAmount) {
            currentAmount = targetAmount;
            clearInterval(counter);
        }
        element.textContent = '€' + Math.floor(currentAmount);
    }, 50);
}


function updateParticipantCount() {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSsdCzLkSE7aAH_RxeI_JZWsPXEWsa5eb-ah0317diWWGmfHKEAcT18OkOdSL-gPP4_wWwEXiTeYhO0/pub?output=csv")
        .then(res => res.text())
        .then(text => {
            const rows = text.trim().split("\n");
            const count = rows.length - 1;
            document.getElementById('participants').textContent = count.toLocaleString();
        })
        .catch(err => {
            console.error('Error loading participant data:', err);
            document.getElementById('participants').textContent = "Error";
        });
}

// ADD THIS TO YOUR DOMContentLoaded EVENT:
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing code ...

    // Clear any existing coins on page load
    const coinContainer = document.getElementById('prize-coin-container');
    if (coinContainer) {
        coinContainer.innerHTML = '';
    }
    startLiveUpdates();
});


function updateCountdown() {
    // Set end date to August 12, 2025 12:00 AM GMT (midnight)
    const endDate = new Date('2025-08-12T00:00:00Z').getTime();

    // Get current time in GMT
    const currentTime = new Date().getTime();
    const timeDifference = endDate - currentTime;

    const countdownElement = document.getElementById('countdown');
    const labelElement = document.querySelector('#countdown').nextElementSibling;

    if (timeDifference <= 0) {
        countdownElement.textContent = '0';
        labelElement.textContent = 'Registration Closed';
        return;
    }

    // Calculate time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Determine what to display based on time remaining
    if (days > 0) {
        countdownElement.textContent = days;
        labelElement.textContent = days === 1 ? 'Day Until Registration Closes' : 'Days Until Registration Closes';
    } else if (hours > 0) {
        countdownElement.textContent = hours;
        labelElement.textContent = hours === 1 ? 'Hour Until Registration Closes' : 'Hours Until Registration Closes';
    } else if (minutes > 0) {
        countdownElement.textContent = minutes;
        labelElement.textContent = minutes === 1 ? 'Minute Until Registration Closes' : 'Minutes Until Registration Closes';
    } else {
        countdownElement.textContent = seconds;
        labelElement.textContent = seconds === 1 ? 'Second Until Registration Closes' : 'Seconds Until Registration Closes';
    }
}

// Start the countdown
function startCountdown() {
    updateCountdown(); // Run immediately
    setInterval(updateCountdown, 1000); // Update every second
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
});


let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const originalTestimonials = Array.from(testimonials);
const totalTestimonials = originalTestimonials.length;
const track = document.getElementById('testimonialsTrack');
const indicatorsContainer = document.getElementById('carouselIndicators');
let isTransitioning = false;

// Auto-scroll control variables
let autoScrollInterval;
let isUserInteracting = false;
let interactionTimeout;

// Function to get testimonials per view based on screen size
function getTestimonialsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1200) return 2;
    return 2; // Show 2 on desktop, not more
}

let testimonialsPerView = getTestimonialsPerView();
let maxSlides = totalTestimonials; // Show all testimonials individually

// Create seamless loop by duplicating testimonials
function createSeamlessLoop() {
    // Clear existing track
    track.innerHTML = '';

    // Add testimonials for backward seamless scroll (add all testimonials at beginning)
    originalTestimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        track.appendChild(clone);
    });

    // Add all original testimonials
    originalTestimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        track.appendChild(clone);
    });

    // Add testimonials for forward seamless scroll (add all testimonials at end)
    originalTestimonials.forEach(testimonial => {
        const clone = testimonial.cloneNode(true);
        track.appendChild(clone);
    });

    // Set initial position to the first original testimonial (middle section)
    currentTestimonial = 0; // Start at 0 for the original testimonials
    updateCarouselPosition();
}

// Create indicator dots (only for original testimonials)
function createIndicators() {
    indicatorsContainer.innerHTML = '';

    // Create one indicator per testimonial
    for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        if (i === 0) dot.classList.add('active');

        dot.onclick = () => {
            handleUserInteraction();
            goToTestimonial(i);
        };
        indicatorsContainer.appendChild(dot);
    }
}

// Handle user interaction - pause auto-scroll temporarily
function handleUserInteraction() {
    isUserInteracting = true;

    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }

    if (interactionTimeout) {
        clearTimeout(interactionTimeout);
    }

    interactionTimeout = setTimeout(() => {
        isUserInteracting = false;
        startAutoSlide();
    }, 5000);
}

// Move carousel with seamless loop
function moveCarousel(direction) {
    // Prevent multiple rapid calls
    if (track.style.transition === 'none') return;

    if (direction === 1) {
        // Moving forward
        currentTestimonial++;
        updateCarouselPosition();

        // Reset to beginning seamlessly when we reach the end
        if (currentTestimonial >= totalTestimonials) {
            setTimeout(() => {
                if (track.style.transition !== 'none') { // Double check
                    track.style.transition = 'none';
                    currentTestimonial = 0;
                    updateCarouselPosition();
                    // Use requestAnimationFrame for smoother transition
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                        });
                    });
                }
            }, 450); // Slightly longer delay
        }
    } else {
        // Moving backward
        currentTestimonial--;
        updateCarouselPosition();

        // Reset to end seamlessly when we go before the beginning
        if (currentTestimonial < 0) {
            setTimeout(() => {
                if (track.style.transition !== 'none') { // Double check
                    track.style.transition = 'none';
                    currentTestimonial = totalTestimonials - 1;
                    updateCarouselPosition();
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                        });
                    });
                }
            }, 450);
        }
    }

    updateIndicators();
}

// Go to specific testimonial
function goToTestimonial(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentTestimonial = index;
    updateCarouselPosition();
    updateIndicators();
    setTimeout(() => {
        isTransitioning = false;
    }, 500);
}

// Update carousel position
function updateCarouselPosition() {
    const carousel = document.querySelector('.testimonials-carousel');
    const containerWidth = carousel.offsetWidth;
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1200;
    const isSmallMobile = window.innerWidth <= 480;
    const isTinyMobile = window.innerWidth <= 360;

    let cardWidth, gap;

    if (isTinyMobile) {
        // For very small screens
        cardWidth = containerWidth - 20; // Account for carousel padding (5px * 2) + some margin
        gap = 8;
    } else if (isSmallMobile) {
        // For small mobile screens
        cardWidth = containerWidth - 30; // Account for carousel padding (10px * 2) + some margin
        gap = 10;
    } else if (isMobile) {
        // For mobile screens
        cardWidth = containerWidth - 40; // Account for carousel padding (15px * 2) + some margin
        gap = 15;
    } else if (isTablet) {
        cardWidth = 480;
        gap = 20;
    } else {
        cardWidth = 550;
        gap = 30;
    }

    // Apply the width to all cards
    const allCards = track.querySelectorAll('.testimonial-card');
    allCards.forEach(card => {
        card.style.width = cardWidth + 'px';
        card.style.maxWidth = cardWidth + 'px';
        card.style.minWidth = cardWidth + 'px';
    });

    // Calculate position: add totalTestimonials to skip the first set of clones
    const actualPosition = currentTestimonial + totalTestimonials;
    const moveDistance = actualPosition * (cardWidth + gap);

    track.style.transform = `translateX(-${moveDistance}px)`;
}



// Update indicators based on current position
function updateIndicators() {
    // Handle the current testimonial position for indicators
    let indicatorIndex = currentTestimonial;

    // Normalize the indicator index to be within bounds
    if (indicatorIndex < 0) {
        indicatorIndex = totalTestimonials - 1;
    } else if (indicatorIndex >= totalTestimonials) {
        indicatorIndex = 0;
    }

    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === indicatorIndex);
    });
}

// Handle window resize
function handleResize() {
    const oldTestimonialsPerView = testimonialsPerView;
    testimonialsPerView = getTestimonialsPerView();

    // Always recreate on resize to ensure proper sizing
    createSeamlessLoop();
    createIndicators();

    // Add a small delay to ensure DOM is updated
    setTimeout(() => {
        updateCarouselPosition();
        updateIndicators();
    }, 50);
}

// Improved mobile touch handling
function addTouchSupport() {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;

    track.addEventListener('touchstart', (e) => {
        if (isTransitioning) return;
        startX = e.touches[0].clientX;
        startTime = Date.now();
        isDragging = true;
        handleUserInteraction();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging || isTransitioning) return;

        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;

        // Prevent horizontal scroll on smaller movements
        if (Math.abs(deltaX) > 5) {
            e.preventDefault();
        }
    }, { passive: false });

    track.addEventListener('touchend', (e) => {
        if (!isDragging || isTransitioning) return;

        isDragging = false;

        const deltaX = currentX - startX;
        const deltaTime = Date.now() - startTime;
        const velocity = Math.abs(deltaX) / deltaTime;

        // Adjusted sensitivity for mobile
        const isMobile = window.innerWidth <= 768;
        const threshold = isMobile ? 30 : 50; // Lower threshold for mobile
        const velocityThreshold = isMobile ? 0.2 : 0.3; // Lower velocity threshold for mobile

        if (Math.abs(deltaX) > threshold || velocity > velocityThreshold) {
            isTransitioning = true;
            if (deltaX > 0) {
                moveCarousel(-1);
            } else {
                moveCarousel(1);
            }
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }

        startX = 0;
        currentX = 0;
    }, { passive: true });
}

// Initialize controls
function initializeControls() {
    document.getElementById('prevBtn').onclick = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        handleUserInteraction();
        moveCarousel(-1);
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    };

    document.getElementById('nextBtn').onclick = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        handleUserInteraction();
        moveCarousel(1);
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    };
}

function startAutoSlide() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }

    if (!isUserInteracting) {
        autoScrollInterval = setInterval(() => {
            if (!isUserInteracting && !isTransitioning) {
                isTransitioning = true;
                moveCarousel(1);
                setTimeout(() => {
                    isTransitioning = false;
                }, 500);
            }
        }, 4000);
    }
}

// FAQ toggle function
function toggleFAQ(questionElement) {
    const answer = questionElement.nextElementSibling;
    const icon = questionElement.querySelector('.faq-icon');

    // Close all other FAQs
    document.querySelectorAll('.faq-answer').forEach(faq => {
        if (faq !== answer) {
            faq.classList.remove('active');
            faq.previousElementSibling.querySelector('.faq-icon').classList.remove('rotated');
        }
    });

    // Toggle current FAQ
    answer.classList.toggle('active');
    icon.classList.toggle('rotated');
}

// Floating particles animation
function createFloatingParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}


// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    createSeamlessLoop();
    createIndicators();
    initializeControls();
    addTouchSupport(); // Add this line
    // Create floating particles
    createFloatingParticles();

    // Delay auto-start to ensure everything is loaded
    setTimeout(() => {
        startAutoSlide();
    }, 500);

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(handleResize, 150);
    });

    // Pause auto-scroll on hover (desktop only)
    if (window.innerWidth > 768) {
        const carousel = document.querySelector('.testimonials-carousel');

        carousel.addEventListener('mouseenter', () => {
            isUserInteracting = true;
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
        });

        carousel.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!isUserInteracting) {
                    startAutoSlide();
                }
            }, 500);
        });
    }
});