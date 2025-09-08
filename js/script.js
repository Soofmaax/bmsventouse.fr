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

  /* EXPLICATION (2025): Flag DEBUG
     - Empêche toute sortie console en production.
     - À activer ponctuellement en QA pour diagnostiquer localement. */
  const DEBUG = false;

  // --------------------------------------------------------------------------
  // MODULE: MENU HAMBURGER & ACCESSIBILITÉ
  // --------------------------------------------------------------------------
  /* EXPLICATION (2025): Menu mobile accessible
     - Gère l'ouverture/fermeture du menu, l'overlay et aria-expanded.
     - Met en place un Focus Trap (Tab / Shift+Tab) pour rester dans le menu ouvert.
     - Bloque le scroll du body pour éviter le "scroll bleed" quand le menu est ouvert. */
  const setupHamburgerMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (!hamburger || !navLinks || !navOverlay) {
      
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
  /* EXPLICATION (2025): Thème sombre/clair
     - Préférence lue via localStorage, sinon via prefers-color-scheme.
     - Met à jour body/html + aria-pressed/aria-label pour l’accessibilité. */
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
  /* EXPLICATION (2025): Révélation progressive
     - IntersectionObserver avec threshold léger pour déclencher l'animation d'apparition.
     - Désinscription après première visibilité pour limiter le coût. */
  const setupScrollAnimations = () => {
    // Auto-mark elements for reveal if not already marked
    const selectors = [
      '.stat-item',
      '.city-card',
      '.process-step',
      '.faq-item',
      '.content-block',
      '.engagement-card',
      '.service-connexe',
      '.service-card',
      '.reference-card',
      '.contact-card',
      '.zone-card'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.classList.add('animated-item'));
    });

    const animatedItems = document.querySelectorAll('.animated-item');
    if (animatedItems.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible', 'animate-in');
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
  /* EXPLICATION (2025): Accordéon accessible
     - Génère des IDs uniques pour relier question/réponse (aria-controls/aria-labelledby).
     - Rôle "button" sur la question + gestion clavier (Enter/Espace).
     - Fermeture des autres items lors de l’ouverture d’un item. */
  const setupFaqAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
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

    
  };

  // --------------------------------------------------------------------------
  // MODULE: CARROUSEL DES RÉFÉRENCES
  // --------------------------------------------------------------------------
  /* EXPLICATION (2025): Carrousel accessible & respect motion
     - Respecte prefers-reduced-motion (scroll auto vs smooth).
     - Calcule la largeur en tenant compte de la marge (getComputedStyle).
     - Met à jour aria-current et une région live (status) au changement.
     - Support clavier (flèches) et swipe tactile. */
  const setupReferencesCarousel = () => {
    const track = document.querySelector('.references-carousel .carousel-track');
    const slides = track ? Array.from(track.children) : [];
    const prevBtn = document.querySelector('.references-carousel .carousel-control.prev');
    const nextBtn = document.querySelector('.references-carousel .carousel-control.next');
    const status = document.getElementById('carouselStatus');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!track || slides.length === 0 || !prevBtn || !nextBtn) {
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
    
  };

  // --------------------------------------------------------------------------
  // MODULE: BOUTON "RETOUR EN HAUT"
  // --------------------------------------------------------------------------
  /* EXPLICATION (2025): Retour en haut
     - Affichage conditionnel > 300px de scroll.
     - Défilement doux sauf si prefers-reduced-motion est activé. */
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
  /* EXPLICATION (2025): Plausible (si présent)
     - Détecte les clics CTA (data-cta / tel / mail / WhatsApp).
     - En navigation classique, empêche puis envoie l’event avec callback puis redirige.
     - Si Plausible indisponible ou nouvel onglet/modificateur, n’entrave pas la navigation. */
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

  // --------------------------------------------------------------------------
  // MODULE: GOOGLE ANALYTICS 4 (CTA tracking non bloquant, Consent Mode compatible)
  // --------------------------------------------------------------------------
  /* EXPLICATION (2025): GA4 CTA non-bloquant
     - Écoute en capture pour fiabilité, mais n'empêche jamais la navigation.
     - Heuristique de contexte (hero, cta-section, footer, etc.) pour cta_location.
     - Compatible Consent Mode v2: aucun cookie si refus, events "silencieux". */
  const setupGAEvents = () => {
    const isGAReady = () => typeof window.gtag === 'function';

    const getLocation = (el) => {
      // Try to infer a meaningful location from context
      let node = el;
      while (node && node !== document.body) {
        if (node.classList) {
          if (node.classList.contains('hero')) return 'hero';
          if (node.classList.contains('cta-section')) return 'cta-section';
          if (node.classList.contains('footer')) return 'footer';
          if (node.classList.contains('header')) return 'header';
          if (node.classList.contains('service-card')) return 'services-card';
          if (node.classList.contains('reference-card')) return 'references-card';
        }
        if (node.id) return node.id;
        node = node.parentElement;
      }
      return 'generic';
    };

    // CTA clicks
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a, button');
      if (!a) return;

      // Detect CTA-like elements
      const isButton = a.classList && a.classList.contains('btn');
      const inHeroButtons = a.closest && a.closest('.hero-buttons');
      const inCTASection = a.closest && a.closest('.cta-section');

      const href = a.getAttribute && a.getAttribute('href') || '';
      const isWA = /wa\.me|api\.whatsapp\.com/i.test(href || '');
      const isTel = (href || '').startsWith('tel:');
      const isMail = (href || '').startsWith('mailto:');

      // Extra: specific 'devis' event for links containing devis/contact
      const isDevis = /devis|contact/i.test((href || '') + (a.textContent || ''));

      if (!isButton && !inHeroButtons && !inCTASection && !isWA && !isTel && !isMail && !isDevis) {
        return; // not a CTA
      }

      if (!isGAReady()) return;

      const cta_label = (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120);
      const cta_location = getLocation(a);
      const cta_url = href || (a.tagName === 'BUTTON' ? '' : '');

      try {
        // Generic CTA event
        window.gtag('event', 'cta_click', {
          cta_label,
          cta_location,
          cta_url
        });

        // Specific conversion marker for devis/contact
        if (isDevis) {
          window.gtag('event', 'devis_click', {
            event_category: 'conversion',
            event_label: cta_label
          });
        }
      } catch (_) {
        // swallow to avoid breaking UX
      }
    }, { capture: true });

    // Scroll depth (25%, 50%, 75%, 100%)
    let maxScrollSent = 0;
    const sendScrollDepth = (val) => {
      if (!isGAReady()) return;
      try {
        window.gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          value: val
        });
      } catch (_) {}
    };
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = Math.round((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100);
      const checkpoints = [25, 50, 75, 100];
      for (const cp of checkpoints) {
        if (scrolled >= cp && cp > maxScrollSent) {
          maxScrollSent = cp;
          sendScrollDepth(cp);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      if (!isGAReady()) return;
      try {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        window.gtag('event', 'time_on_page', {
          event_category: 'engagement',
          value: timeSpent
        });
      } catch (_) {}
    });
  };

  // ==========================================================================
  // INITIALISATION DE TOUS LES MODULES
  // ==========================================================================
  /* EXPLICATION (2025): Initialisation résiliente
     - Chaque module est autonome; une erreur dans l’un ne bloque pas les autres.
     - En production, on n’expose pas les erreurs (DEBUG=false). */
  // --------------------------------------------------------------------------
  // MODULE: LAZY LOAD IMAGES (Intersection Observer)
  // --------------------------------------------------------------------------
  const setupLazyLoad = () => {
    const imgs = document.querySelectorAll('img.lazy-load');
    if (imgs.length === 0) return;

    const loadImg = (img) => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
      }
      img.classList.remove('lazy-load');
      img.classList.add('loaded');
    };

    if (!('IntersectionObserver' in window)) {
      imgs.forEach(loadImg);
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImg(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 200px 0px', threshold: 0.01 });

    imgs.forEach(img => io.observe(img));
  };

  // --------------------------------------------------------------------------
  // MODULE: COMPTEURS ANIMÉS (stat-number[data-count])
  // --------------------------------------------------------------------------
  const setupCounters = () => {
    const numbers = document.querySelectorAll('.stat-number[data-count]');
    if (numbers.length === 0) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200;
      const step = Math.max(1, Math.ceil(target / (duration / 16)));
      let current = 0;
      const tick = () => {
        current += step;
        if (current >= target) {
          current = target;
          el.textContent = `${current}${suffix}`;
        } else {
          el.textContent = `${current}${suffix}`;
          requestAnimationFrame(tick);
        }
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    numbers.forEach(n => io.observe(n));
  };

  try {
    setupHamburgerMenu();
    setupScrollAnimations();
    setupFaqAccordion();
    setupReferencesCarousel();
    setupBackToTop();
    setupThemeToggle();
    setupAnalytics();
    setupGAEvents();
    setupLazyLoad();
    setupCounters();
    
  } catch (error) {
    if (DEBUG) {
      console.error("Erreur lors de l'initialisation des scripts du site :", error);
    }
  }
});

