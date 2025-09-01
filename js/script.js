/* eslint-disable no-console */
/**
 * ==========================================================================
 * SCRIPT PRINCIPAL POUR BMS VENTOUSE v5.0 (ENTERPRISE EDITION)
 * ==========================================================================
 * Gère toutes les interactions du site avec une architecture modulaire,
 * performante et accessible (Focus Trap, Escape Key, etc.).
 */
document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // CONFIGURATION CENTRALISÉE
  // --------------------------------------------------------------------------
  const CONFIG = {
    theme: {
      storageKey: 'bms-theme-preference'
    },
    animations: {
      threshold: 0.1,
      rootMargin: '0px'
    },
    scrollspy: {
      rootMargin: '-50% 0px -50% 0px'
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: MENU HAMBURGER & ACCESSIBILITÉ
  // --------------------------------------------------------------------------
  const setupHamburgerMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (!hamburger || !navLinks || !navOverlay) {
      console.warn("Éléments du menu mobile non trouvés. Le module ne sera pas initialisé.");
      return;
    }

    const focusableElements = navLinks.querySelectorAll('a[href], button');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    const toggleMenu = (isActive) => {
      hamburger.classList.toggle('active', isActive);
      navLinks.classList.toggle('active', isActive);
      navOverlay.classList.toggle('active', isActive);
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
      if (isActive) {
        firstFocusableElement.focus();
      }
    };

    const handleMenuClick = () => {
      const isActive = !hamburger.classList.contains('active');
      toggleMenu(isActive);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('active')) {
        toggleMenu(false);
      }
      // Focus Trap
      if (e.key === 'Tab' && hamburger.classList.contains('active')) {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    hamburger.addEventListener('click', handleMenuClick);
    navOverlay.addEventListener('click', () => toggleMenu(false));
    document.addEventListener('keydown', handleKeyDown);

    // Fermer le menu quand on clique sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          toggleMenu(false);
        }
      });
    });
  };

  // --------------------------------------------------------------------------
  // MODULE: DARK MODE TOGGLE
  // --------------------------------------------------------------------------
  const setupThemeToggle = () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    const storageKey = CONFIG.theme.storageKey;
    const getPreferredTheme = () => {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    };

    const applyTheme = theme => {
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.documentElement.classList.add('dark-theme');
        themeToggleBtn.setAttribute('aria-pressed', 'true');
        themeToggleBtn.setAttribute('aria-label', 'Activer le thème clair');
        themeToggleBtn.title = 'Activer le thème clair';
      } else {
        document.body.classList.remove('dark-theme');
        document.documentElement.classList.remove('dark-theme');
        themeToggleBtn.setAttribute('aria-pressed', 'false');
        themeToggleBtn.setAttribute('aria-label', 'Activer le thème sombre');
        themeToggleBtn.title = 'Activer le thème sombre';
      }
    };

    // Initial
    let theme = getPreferredTheme();
    applyTheme(theme);

    // On click toggle
    themeToggleBtn.addEventListener('click', () => {
      theme = (document.body.classList.contains('dark-theme')) ? 'light' : 'dark';
      localStorage.setItem(storageKey, theme);
      applyTheme(theme);
    });
  };

  // --------------------------------------------------------------------------
  // MODULE: ANIMATIONS AU DÉFILEMENT (Intersection Observer)
  // --------------------------------------------------------------------------
  const setupScrollAnimations = () => {
    const animatedItems = document.querySelectorAll('.animated-item');
    if (animatedItems.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: CONFIG.animations.rootMargin,
      threshold: CONFIG.animations.threshold
    });

    animatedItems.forEach(item => observer.observe(item));
  };

  // --------------------------------------------------------------------------
  // MODULE: FAQ INTERACTIVE
  // --------------------------------------------------------------------------
  const setupFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
      console.warn("Aucun élément FAQ trouvé.");
      return;
    }

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (!question || !answer) return;

      // Ajouter les attributs d'accessibilité
      const questionId = `faq-question-${Math.random().toString(36).substr(2, 9)}`;
      const answerId = `faq-answer-${Math.random().toString(36).substr(2, 9)}`;
      
      question.setAttribute('id', questionId);
      question.setAttribute('aria-expanded', 'false');
      question.setAttribute('aria-controls', answerId);
      question.setAttribute('role', 'button');
      question.setAttribute('tabindex', '0');
      
      answer.setAttribute('id', answerId);
      answer.setAttribute('aria-labelledby', questionId);
      answer.setAttribute('role', 'region');

      // Gestionnaire de clic
      const toggleFAQ = () => {
        const isOpen = item.classList.contains('is-open');
        
        // Fermer tous les autres éléments FAQ
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Basculer l'élément actuel
        item.classList.toggle('is-open', !isOpen);
        question.setAttribute('aria-expanded', !isOpen);
      };

      // Événements
      question.addEventListener('click', toggleFAQ);
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFAQ();
        }
      });
    });

    console.log(`✅ FAQ interactive initialisée pour ${faqItems.length} éléments`);
  };

  // --------------------------------------------------------------------------
  // MODULE: CARROUSEL DES RÉFÉRENCES
  // --------------------------------------------------------------------------
  const setupReferencesCarousel = () => {
    const track = document.querySelector('.references-carousel .carousel-track');
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = document.querySelector('.references-carousel .carousel-control.prev');
    const nextBtn = document.querySelector('.references-carousel .carousel-control.next');
    const status = document.getElementById('carouselStatus');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!track || slides.length === 0 || !prevBtn || !nextBtn) {
      console.warn("Éléments du carrousel non trouvés.");
      return;
    }

    let currentIndex = 0;
    
    const getSlideWidth = () => {
      const slide = slides[0];
      const slideStyle = window.getComputedStyle(slide);
      const marginRight = parseFloat(slideStyle.marginRight) || 0;
      return slide.getBoundingClientRect().width + marginRight;
    };
    
    const scrollToIndex = (index) => {
      currentIndex = index;
      const slideWidth = getSlideWidth();
      const position = slideWidth * index;
      track.scrollTo({ left: position, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      // ARIA live region
      if (status) { status.textContent = `Logo ${index+1} sur ${slides.length}`; }
      // aria-current
      slides.forEach((s, i) => s.setAttribute('aria-current', i === index ? 'true' : 'false'));
    };
    
    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      scrollToIndex(nextIndex);
    });
    
    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      scrollToIndex(prevIndex);
    });

    // Keyboard support
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextBtn.click();
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        prevBtn.click();
        e.preventDefault();
      }
    });
    prevBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextBtn.click(); e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        prevBtn.click(); e.preventDefault();
      }
    });
    nextBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevBtn.click(); e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        nextBtn.click(); e.preventDefault();
      }
    });

    // Swipe support
    let startX = null;
    track.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
      }
    });
    track.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const endX = (e.changedTouches && e.changedTouches.length) ? e.changedTouches[0].clientX : null;
      if (endX !== null) {
        const delta = endX - startX;
        if (Math.abs(delta) > 30) {
          if (delta > 0) {
            prevBtn.click();
          } else {
            nextBtn.click();
          }
        }
      }
      startX = null;
    });

    // Initialize state
    scrollToIndex(0);
    console.log(`✅ Carrousel initialisé avec ${slides.length} éléments`);
  };

  // --------------------------------------------------------------------------
  // MODULE: BOUTON "RETOUR EN HAUT"
  // --------------------------------------------------------------------------
  const setupBackToTop = () => {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    };

    const scrollToTop = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    };

    window.addEventListener('scroll', toggleBackToTop);
    backToTopButton.addEventListener('click', scrollToTop);
  };

  // --------------------------------------------------------------------------
  // MODULE: ANALYTICS (Plausible conversions tracking: CTA, WhatsApp, phone, email)
  // --------------------------------------------------------------------------
  const setupAnalytics = () => {
    // Utility to get context: find nearest section id or class (e.g. hero)
    const getContext = (el) => {
      let node = el;
      while (node && node !== document.body) {
        if (node.id) return node.id;
        if (node.classList && Array.from(node.classList).some(c => c.includes('hero'))) return node.className;
        node = node.parentElement;
      }
      return '';
    };

    // Utility: send Plausible event with callback support
    const sendPlausible = (type, label, href, location, callback) => {
      if (typeof window.plausible !== 'function') return false;
      const props = { type, label, href, location };
      window.plausible('CTA Click', { props, callback });
      return true;
    };

    document.addEventListener('click', (e) => {
      const el = e.target.closest('a');
      if (!el) return;

      let type, label;
      const href = el.getAttribute('href') || '';
      // 1) data-cta
      if (el.dataset.cta) {
        type = el.dataset.cta;
        label = el.dataset.ctaLabel || el.textContent.trim();
      }
      // 2) WhatsApp link
      else if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
        type = 'whatsapp';
        label = el.textContent.trim() || 'WhatsApp';
      }
      // 3) Phone link
      else if (href.startsWith('tel:')) {
        type = 'phone';
        label = href.replace('tel:', '');
      }
      // 4) Email link
      else if (href.startsWith('mailto:')) {
        type = 'email';
        label = href.replace('mailto:', '');
      }
      // Otherwise: do not track
      else {
        return;
      }

      const locationContext = getContext(el);

      // If plausible is not loaded, do not block navigation
      if (typeof window.plausible !== 'function') return;

      // Open in new tab or with modifier: do not block navigation, just send event
      if (
        el.target === '_blank' ||
        e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1
      ) {
        sendPlausible(type, label, href, locationContext);
        return;
      }

      // Regular navigation: prevent, send event, then navigate
      e.preventDefault();
      let navigated = false;
      const go = () => {
        if (!navigated) {
          navigated = true;
          window.location.href = el.href;
        }
      };
      sendPlausible(type, label, href, locationContext, go);
      // Fallback in case Plausible callback doesn't fire
      setTimeout(go, 250);
    });
  };

  // ==========================================================================
  // INITIALISATION DE TOUS LES MODULES
  // ==========================================================================
  try {
    setupHamburgerMenu();
    setupScrollAnimations();
    setupFaqAccordion();
    setupReferencesCarousel();
    setupBackToTop();
    setupThemeToggle();
    setupAnalytics();
    console.log('🚀 BMS Ventouse - Tous les modules initialisés avec succès');
  } catch (error) {
    console.error("Erreur lors de l'initialisation des scripts du site :", error);
  }
});

