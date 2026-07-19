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
  initActiveNav();
  initNewsletterForm();
  initCompareSlider();
});

/* --- Current-Page Nav Indicator ---
   index.html highlights nav items by scroll position instead (see
   initSmoothScroll's scroll-spy) since it's a single-page section flow.
   Everywhere else, mark the nav link(s) matching the current file, and
   the parent dropdown toggle, as active. Program detail pages aren't in
   the nav directly, so they map up to their category's hub page. */
function initActiveNav() {
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!currentPage || currentPage === 'index.html') return;

  const categoryParent = {
    'bright-beginnings.html': 'early-childhood.html',
    'learning-centers.html': 'early-childhood.html',
    'model-schools.html': 'early-childhood.html',
    'language-labs.html': 'programs.html',
    'teacher-training.html': 'programs.html',
    'research-hub.html': 'programs.html',
    'skills-development.html': 'programs.html',
    'secondary-scholarships.html': 'scholarships.html',
    'rising-stars.html': 'scholarships.html',
  };
  const effectivePage = categoryParent[currentPage] || currentPage;

  const navLinks = document.querySelectorAll(
    '.nav-menu > a, .nav-dropdown > .dropdown-toggle, .dropdown-menu a'
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const hrefPage = href.split('#')[0].toLowerCase();
    if (!hrefPage || hrefPage === 'index.html') return;
    if (hrefPage === currentPage || hrefPage === effectivePage) {
      link.classList.add('active');
      const dropdown = link.closest('.nav-dropdown');
      if (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
    }
  });
}

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

/* --- Smooth Scroll ---
   Nav/footer links use both bare "#hash" and "page.html#hash" forms
   (dropdown links need the page prefix so they work from other pages).
   Only intercept a click when the hash target actually exists on the
   current page — otherwise let the browser navigate there normally. */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href*="#"]');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;
    const hash = href.slice(hashIndex);
    if (hash === '#') return;

    let target;
    try {
      target = document.querySelector(hash);
    } catch (err) {
      return;
    }
    if (!target) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    });
  });

  // Active nav link highlighting (scroll-spy), matched by hash fragment
  // alone so it works regardless of the "page.html#hash" prefix.
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href*="#"]');

  if (sections.length && navLinks.length) {
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
          const linkHash = link.getAttribute('href').split('#')[1];
          link.classList.toggle('active', Boolean(current) && linkHash === current);
        });
      },
      { passive: true }
    );
  }
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

/* --- Footer Newsletter Form --- */
function initNewsletterForm() {
  const form = document.querySelector('.footer-newsletter-form');
  if (!form) return;

  const input = form.querySelector('input[type="email"]');
  const button = form.querySelector('button');
  if (!input || !button) return;

  const originalLabel = button.textContent;
  const errorColor = getComputedStyle(document.documentElement).getPropertyValue('--clr-error').trim() || '#e02424';

  button.addEventListener('click', () => {
    const email = input.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      input.focus();
      input.style.borderColor = errorColor;
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }

    button.disabled = true;
    button.textContent = '…';

    setTimeout(() => {
      button.textContent = '✓';
      input.value = '';
      input.placeholder = 'Thanks for subscribing!';

      setTimeout(() => {
        button.textContent = originalLabel;
        button.disabled = false;
        input.placeholder = 'Your email address';
      }, 2500);
    }, 800);
  });
}

/* --- Before / After Comparison Slider ---
   Builds itself from a bare <div class="compare-slider" data-before="..."
   data-before-label="Before" data-after="..." data-after-label="After">.
   Drag, click, or use the Left/Right arrow keys (Home/End for the ends). */
function initCompareSlider() {
  const sliders = document.querySelectorAll('.compare-slider');
  if (!sliders.length) return;

  sliders.forEach((el) => {
    const beforeSrc = el.dataset.before;
    const afterSrc = el.dataset.after;
    if (!beforeSrc || !afterSrc) return;

    const beforeLabel = el.dataset.beforeLabel || 'Before';
    const afterLabel = el.dataset.afterLabel || 'After';
    const beforeAlt = el.dataset.beforeAlt || beforeLabel;
    const afterAlt = el.dataset.afterAlt || afterLabel;

    el.innerHTML = `
      <img class="compare-slider-img" src="${afterSrc}" alt="${afterAlt}" loading="lazy">
      <div class="compare-slider-before-wrap">
        <img class="compare-slider-img" src="${beforeSrc}" alt="${beforeAlt}" loading="lazy">
      </div>
      <span class="compare-slider-label compare-slider-label-before">${beforeLabel}</span>
      <span class="compare-slider-label compare-slider-label-after">${afterLabel}</span>
      <div class="compare-slider-handle">
        <div class="compare-slider-handle-line"></div>
        <div class="compare-slider-handle-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>
          </svg>
        </div>
      </div>
    `;

    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', `Before and after comparison: ${beforeLabel} versus ${afterLabel}`);
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');

    let pos = 50;

    function setPos(value) {
      pos = Math.min(100, Math.max(0, value));
      el.style.setProperty('--compare-pos', pos + '%');
      el.setAttribute('aria-valuenow', String(Math.round(pos)));
    }

    function posFromClientX(clientX) {
      const rect = el.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    let dragging = false;

    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      setPos(posFromClientX(e.clientX));
    });

    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      setPos(posFromClientX(e.clientX));
    });

    ['pointerup', 'pointercancel', 'pointerleave'].forEach((evt) => {
      el.addEventListener(evt, () => { dragging = false; });
    });

    el.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 20 : 5;
      if (e.key === 'ArrowLeft') { setPos(pos - step); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { setPos(pos + step); e.preventDefault(); }
      else if (e.key === 'Home') { setPos(0); e.preventDefault(); }
      else if (e.key === 'End') { setPos(100); e.preventDefault(); }
    });

    setPos(50);
  });
}

/* --- Interactive Donation Amount Selector --- */
function initDonationTabs() {
  const tabs = document.querySelectorAll('.donate-amount-tab');
  const customToggle = document.getElementById('donate-custom-toggle');
  const customWrap = document.getElementById('donate-custom-amount');
  const customInput = document.getElementById('donate-custom-input');
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
  const customImpactDefault = 'Choose your own amount — every dollar goes directly toward WEF\'s active programs in Chitral and Central Asia.';

  function updateDonation(amount) {
    const value = Math.max(1, Math.round(Number(amount) || 0));
    impactText.textContent = impacts[String(value)] || customImpactDefault;
    ctaBtn.href = `mailto:info@worldwideeducationfoundation.org?subject=Donation Inquiry ($${value})&body=Hello, I would like to make a donation of $${value} to support the Worldwide Education Foundation. Please provide the bank transfer details.`;
  }

  function deactivateCustom() {
    if (customToggle) customToggle.classList.remove('active');
    if (customWrap) customWrap.classList.remove('active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active class to clicked tab
      tab.classList.add('active');
      deactivateCustom();

      updateDonation(tab.getAttribute('data-amount'));
    });
  });

  if (customToggle && customWrap && customInput) {
    customToggle.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      customToggle.classList.add('active');
      customWrap.classList.add('active');
      customInput.focus();

      if (customInput.value && Number(customInput.value) > 0) {
        updateDonation(customInput.value);
      } else {
        impactText.textContent = customImpactDefault;
        ctaBtn.href = 'mailto:info@worldwideeducationfoundation.org?subject=Donation Inquiry&body=Hello, I would like to make a donation to support the Worldwide Education Foundation. Please provide the bank transfer details.';
      }
    });

    customInput.addEventListener('input', () => {
      if (customInput.value && Number(customInput.value) > 0) {
        updateDonation(customInput.value);
      } else {
        impactText.textContent = customImpactDefault;
      }
    });
  }
}


