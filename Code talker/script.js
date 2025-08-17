 
// footer 
fetch('components/footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer-container').innerHTML = html;
    });

  
// banner

(function () {
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const carousel = document.querySelector('.carousel');
    const list = document.querySelector('.list');
    const runningTime = document.querySelector('.carousel .timeRunning');
    const timeRunning = 1200;
    const timeAutoNext = 7000;
    let runTimeOut;
    let runNextAuto;

    function resetTimeAnimation() {
        runningTime.style.animation = 'none';
        void runningTime.offsetHeight;
        runningTime.style.animation = `runningTime ${timeAutoNext / 1000}s linear 1 forwards`;
    }

    function showSlider(type) {
        const sliderItemsDom = list.querySelectorAll('.carousel .list .item');
        clearTimeout(runTimeOut);
        clearTimeout(runNextAuto);

        if (type === 'next') {
            list.appendChild(sliderItemsDom[0]);
            carousel.classList.add('next');
        } else {
            list.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
            carousel.classList.add('prev');
        }

        runTimeOut = setTimeout(() => {
            carousel.classList.remove('next');
            carousel.classList.remove('prev');
        }, timeRunning);

        runNextAuto = setTimeout(() => {
            nextBtn.click();
        }, timeAutoNext);
        resetTimeAnimation();
    }
    nextBtn.addEventListener('click', () => showSlider('next'));
    prevBtn.addEventListener('click', () => showSlider('prev'));

    document.addEventListener('DOMContentLoaded', () => {
        resetTimeAnimation();
        runNextAuto = setTimeout(() => {
            nextBtn.click();
        }, timeAutoNext);
    });
})();


// counter 
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');

    const startCounting = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                const targetCount = parseInt(statElement.getAttribute('data-count'));
                let currentCount = 0;
                const speed = 100;

                const updateCount = () => {
                    const increment = targetCount / speed;
                    if (currentCount < targetCount) {
                        currentCount += increment;
                        statElement.textContent = Math.ceil(currentCount);
                        setTimeout(updateCount, 15);
                    } else {
                        statElement.textContent = targetCount;
                    }
                };
                updateCount();
                observer.unobserve(statElement);
            }
        });
    };

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver(startCounting, observerOptions);

    stats.forEach(stat => {
        observer.observe(stat);
    });
});

// slider 

class TestimonialSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.autoPlayInterval = 5000;
        this.isAutoPlaying = true;
        this.progressInterval = null;
        this.autoPlayTimer = null;
        this.sliderWrapper = document.getElementById('sliderWrapper');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.progressBars = document.querySelectorAll('.progress-bar');
        this.init();
    }
    init() {
        this.createParticles();
        this.hideLoading();
        this.bindEvents();
        this.startAutoPlay();
        this.updateProgress();
    }
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particlesContainer.appendChild(particle);
        }
    }
    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1000);
    }
    bindEvents() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        let startX = 0;
        let endX = 0;
        this.sliderWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        this.sliderWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
        this.sliderWrapper.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        this.sliderWrapper.addEventListener('mouseleave', () => {
            this.resumeAutoPlay();
        });
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateSlider();
        this.updateNavigation();
        this.resetAutoPlay();
        this.updateProgress();
    }
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.updateNavigation();
        this.updateProgress();
    }
    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.updateNavigation();
        this.updateProgress();
    }
    updateSlider() {
        const translateX = -this.currentSlide * 100;
        this.sliderWrapper.style.transform = `translateX(${translateX}%)`;
        this.resetAnimations();
        setTimeout(() => {
            this.triggerAnimations();
        }, 100);
    }

    updateNavigation() {
        this.navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    resetAnimations() {
        const currentSlideElement = document.querySelectorAll('.slide')[this.currentSlide];
        const animatedElements = currentSlideElement.querySelectorAll('.slide-title, .slide-description, .cta-button, .testimonial-card');

        animatedElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
        });
    }

    triggerAnimations() {
        const currentSlideElement = document.querySelectorAll('.slide')[this.currentSlide];
        const title = currentSlideElement.querySelector('.slide-title');
        const description = currentSlideElement.querySelector('.slide-description');
        const button = currentSlideElement.querySelector('.cta-button');
        const card = currentSlideElement.querySelector('.testimonial-card');
        if (title) title.style.animation = 'slideUp 0.8s ease-out 0.3s forwards';
        if (description) description.style.animation = 'slideUp 0.8s ease-out 0.6s forwards';
        if (button) button.style.animation = 'slideUp 0.8s ease-out 0.9s forwards';
        if (card) card.style.animation = 'slideUp 0.8s ease-out 1.2s forwards';
    }
    updateProgress() {

        this.progressBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'none';
        });
        setTimeout(() => {
            const currentProgressBar = this.progressBars[this.currentSlide];
            if (currentProgressBar) {
                currentProgressBar.style.transition = `width ${this.autoPlayInterval}ms linear`;
                currentProgressBar.style.width = '100%';
            }
        }, 100);
    }

    startAutoPlay() {
        if (this.isAutoPlaying) {
            this.autoPlayTimer = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayInterval);
        }
    }

    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
        const currentProgressBar = this.progressBars[this.currentSlide];
        if (currentProgressBar) {
            const computedStyle = window.getComputedStyle(currentProgressBar);
            const currentWidth = computedStyle.width;
            currentProgressBar.style.width = currentWidth;
            currentProgressBar.style.transition = 'none';
        }
    }
    resumeAutoPlay() {
        this.startAutoPlay();
        const currentProgressBar = this.progressBars[this.currentSlide];
        if (currentProgressBar) {
            const currentWidth = parseFloat(currentProgressBar.style.width);
            const remainingTime = (100 - currentWidth) * this.autoPlayInterval / 100;

            currentProgressBar.style.transition = `width ${remainingTime}ms linear`;
            currentProgressBar.style.width = '100%';
        }
    }
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider();
});
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        console.log('CTA Button clicked:', this.textContent);
    });
});
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll('.section-header, .testimonial-card');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
});

