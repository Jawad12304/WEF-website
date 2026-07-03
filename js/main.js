/* ============================================
   Worldwide Education Foundation — Main JS
   Slideshow, Scroll Animations, Counter, Lightbox
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSlideshow();
  initScrollReveal();
  initCounterAnimation();
  initMobileMenu();
  initGalleryLightbox();
  initSmoothScroll();
  initContactForm();
  initDonationTabs();
});

/* --- Header Scroll Effect --- */
function initHeader() {
  const header = document.getElementById('main-header');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
}

/* --- Hero Glass Slideshow --- */
function initSlideshow() {
  const slides = document.querySelectorAll('#hero-slideshow .hero-slide');
  const textSlides = document.querySelectorAll('.hero-text-slide');
  const dots = document.querySelectorAll('#hero-slide-dots .slide-dot');
  if (!slides.length) return;

  let current = 0;
  let interval;
  let activeTypewriterTimeout = null;

  function showSlide(index) {
    // Deactivate all image slides — resets their Ken Burns animation
    slides.forEach((s) => {
      s.classList.remove('active');
      // Force animation restart by re-triggering reflow
      void s.offsetWidth;
    });

    // Deactivate all text slides
    textSlides.forEach((ts) => {
      ts.classList.remove('active');
    });

    dots.forEach((d) => d.classList.remove('active'));

    // Activate new image slide
    slides[index].classList.add('active');

    // Activate new text slide
    if (textSlides[index]) {
      textSlides[index].classList.add('active');
      runSlideTypewriter(textSlides[index]);
    }

    if (dots[index]) dots[index].classList.add('active');
    current = index;
  }

  function runSlideTypewriter(activeSlide) {
    // Clear any pending typewriter timeout
    if (activeTypewriterTimeout) {
      clearTimeout(activeTypewriterTimeout);
    }

    const staticSpan = activeSlide.querySelector('.static-part');
    const highlightSpan = activeSlide.querySelector('.highlight-part');
    const cursorSpan = activeSlide.querySelector('.typed-cursor');
    if (!staticSpan || !highlightSpan || !cursorSpan) return;

    const staticText = staticSpan.getAttribute('data-text');
    const highlightText = highlightSpan.getAttribute('data-text');

    // Clear both text elements
    staticSpan.textContent = '';
    highlightSpan.textContent = '';

    // Deactivate typing state on all cursors first
    const allCursors = document.querySelectorAll('.typed-cursor');
    allCursors.forEach(c => c.classList.remove('is-typing'));

    // Move cursor after the static text span first
    staticSpan.after(cursorSpan);
    cursorSpan.classList.add('is-typing');

    let staticCharIndex = 0;
    let highlightCharIndex = 0;
    const typingSpeed = 35; // Snappy typing to complete full heading inside 3s loop

    function typeStatic() {
      if (staticCharIndex < staticText.length) {
        staticSpan.textContent += staticText.charAt(staticCharIndex);
        staticCharIndex++;
        activeTypewriterTimeout = setTimeout(typeStatic, typingSpeed);
      } else {
        // Move cursor after the highlight span and start typing it
        highlightSpan.after(cursorSpan);
        typeHighlight();
      }
    }

    function typeHighlight() {
      if (highlightCharIndex < highlightText.length) {
        highlightSpan.textContent += highlightText.charAt(highlightCharIndex);
        highlightCharIndex++;
        activeTypewriterTimeout = setTimeout(typeHighlight, typingSpeed);
      } else {
        cursorSpan.classList.remove('is-typing');
      }
    }

    // Start typing after slide settles (200ms delay)
    activeTypewriterTimeout = setTimeout(typeStatic, 200);
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function startAutoPlay() {
    interval = setInterval(nextSlide, 3000); // 3 seconds interval
  }

  function stopAutoPlay() {
    clearInterval(interval);
  }

  // Dot click navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      showSlide(parseInt(dot.dataset.slide, 10));
      startAutoPlay();
    });
  });

  // Pause on hover
  const hero = document.getElementById('home');
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoPlay);
    hero.addEventListener('mouseleave', startAutoPlay);
  }

  // Initialize
  showSlide(0);
  startAutoPlay();
}

/* --- Scroll Reveal Animations --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* --- Counter Animation --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((counter) => {
            const target = parseInt(counter.dataset.count, 10);
            const suffix = counter.dataset.suffix || '';
            const prefix = counter.dataset.prefix || '';
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;

            function update() {
              current += step;
              if (current >= target) {
                current = target;
                counter.textContent = prefix + current.toLocaleString() + suffix;
                return;
              }
              counter.textContent = prefix + current.toLocaleString() + suffix;
              requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  // Observe both old and new impact sections
  const impactSection = document.getElementById('impact');
  const impactBar = document.getElementById('impact-bar');
  if (impactSection) observer.observe(impactSection);
  if (impactBar) observer.observe(impactBar);
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('mobile-overlay');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Handle dropdown toggles on mobile
  const dropdownToggles = navMenu ? navMenu.querySelectorAll('.dropdown-toggle') : [];
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault(); // Prevent navigating to the link immediately
        const parent = toggle.parentElement;
        parent.classList.toggle('active');
        
        // Close other open dropdowns
        dropdownToggles.forEach((otherToggle) => {
          if (otherToggle !== toggle) {
            otherToggle.parentElement.classList.remove('active');
          }
        });
      }
    });
  });

  navLinks.forEach((link) => {
    if (!link.classList.contains('dropdown-toggle')) {
      link.addEventListener('click', closeMenu);
    }
  });
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentIndex = 0;
  const images = [];

  galleryItems.forEach((item, i) => {
    const img = item.querySelector('img');
    if (img) {
      images.push(img.src);
      item.addEventListener('click', () => {
        currentIndex = i;
        openLightbox(images[currentIndex]);
      });
    }
  });

  const globalMap = document.getElementById('globally-map-img');
  if (globalMap) {
    const mapWrapper = globalMap.closest('.globally-map-wrapper');
    const trigger = mapWrapper || globalMap;
    trigger.addEventListener('click', () => {
      openLightbox(globalMap.src);
    });
  }

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex];
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      lightboxImg.src = images[currentIndex];
    }
  });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Active nav link highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  window.addEventListener(
    'scroll',
    () => {
      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    },
    { passive: true }
  );
}

/* --- Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #3a7d44, #52b788)';
      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

/* --- Interactive Donation Amount Selector --- */
function initDonationTabs() {
  const tabs = document.querySelectorAll('.donate-amount-tab');
  const impactText = document.getElementById('donation-impact-text');
  const ctaBtn = document.getElementById('donate-cta-btn');
  if (!tabs.length || !impactText || !ctaBtn) return;

  const impacts = {
    '25': 'Funds learning supplies and reading books for one child in Chitral.',
    '50': 'Funds technology licenses and English learning software for two students.',
    '100': 'Funds Montessori classroom materials and learning resources for a learning center.',
    '250': 'Funds professional training certification for one local teacher at the university hub.',
    '500': 'Funds a partial undergraduate scholarship for a student at UCA or AUCA.'
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');

      const amount = tab.getAttribute('data-amount');
      impactText.textContent = impacts[amount];

      // Update CTA mailto link with chosen amount
      ctaBtn.href = `mailto:info@worldwideeducationfoundation.org?subject=Donation Inquiry ($${amount})&body=Hello, I would like to make a donation of $${amount} to support the Worldwide Education Foundation. Please provide the bank transfer details.`;
    });
  });
}


