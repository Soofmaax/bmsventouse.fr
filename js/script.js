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
      const slideWidth = getSlideWidth();
      const position = slideWidth * index;
      track.scrollTo({ left: position, behavior: 'smooth' });
    };
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      scrollToIndex(currentIndex);
    });
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      scrollToIndex(currentIndex);
    });

    console.log(`✅ Carrousel initialisé avec ${slides.length} éléments`);
  };

  // --------------------------------------------------------------------------
  // MODULE: BOUTON "RETOUR EN HAUT"
  // --------------------------------------------------------------------------
  const setupBackToTop = () => {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

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
        behavior: 'smooth'
      });
    };

    window.addEventListener('scroll', toggleBackToTop);
    backToTopButton.addEventListener('click', scrollToTop);
  };

  // --------------------------------------------------------------------------
  // MODULE: COOKIE BANNER (Consent Mode v2) - Analytics uniquement
  // --------------------------------------------------------------------------
  const setupCookieBanner = () => {
    try {
      const KEY = 'bms_cookie_consent';

      const applyConsent = (value) => {
        // Met à jour uniquement le stockage analytics (pas de pubs)
        if (typeof gtag === 'function') {
          gtag('consent', 'update', {
            analytics_storage: value === 'accepted' ? 'granted' : 'denied'
          });
        }
      };

      const saved = localStorage.getItem(KEY);
      if (saved) {
        applyConsent(saved);
        return;
      }

      // Création de la bannière
      const banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-live', 'polite');
      banner.setAttribute('aria-label', 'Bannière de consentement aux cookies');
      banner.style.position = 'fixed';
      banner.style.left = '1rem';
      banner.style.right = '1rem';
      banner.style.bottom = '1rem';
      banner.style.zIndex = '3000';
      banner.style.background = 'var(--color-light)';
      banner.style.color = 'var(--color-dark)';
      banner.style.border = '1px solid var(--color-border)';
      banner.style.borderRadius = '12px';
      banner.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
      banner.style.padding = '1rem';
      banner.style.maxWidth = '900px';
      banner.style.margin = '0 auto';

      banner.innerHTML = `
        <div style="display:flex; gap:1rem; align-items:center; justify-content:space-between; flex-wrap:wrap;">
          <p style="margin:0; flex:1; min-width:260px;">
            Nous utilisons un cookie de mesure d’audience (Google Analytics) pour améliorer le site. 
            Aucune publicité, et IP anonymisée. Vous pouvez refuser.
            <a href="/mentions/" style="text-decoration:underline; color:var(--color-primary);">En savoir plus</a>.
          </p>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button id="cookie-decline" class="btn" style="background:#f3f4f6; color:#111827; border:1px solid #e5e7eb; padding:.6rem 1rem; border-radius:8px;">Refuser</button>
            <button id="cookie-accept" class="btn btn-primary" style="padding:.6rem 1rem; border-radius:8px;">Accepter</button>
          </div>
        </div>
      `;

      document.body.appendChild(banner);

      const acceptBtn = banner.querySelector('#cookie-accept');
      const declineBtn = banner.querySelector('#cookie-decline');

      acceptBtn.addEventListener('click', () => {
        localStorage.setItem(KEY, 'accepted');
        applyConsent('accepted');
        banner.remove();
      });

      declineBtn.addEventListener('click', () => {
        localStorage.setItem(KEY, 'denied');
        applyConsent('denied');
        banner.remove();
      });
    } catch (e) {
      console.warn('Cookie banner non initialisé:', e);
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: ÉVÉNEMENTS ANALYTICS (GA4)
  // --------------------------------------------------------------------------
  const setupAnalyticsEvents = () => {
    if (typeof gtag !== 'function') return;

    const track = (eventName, params) => {
      try {
        gtag('event', eventName, params || {});
      } catch (e) {
        // Pas d'erreur bloquante
      }
    };

    // Clics téléphone
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.addEventListener('click', () => {
        track('phone_click', {
          event_category: 'Contact',
          event_label: a.getAttribute('href')
        });
      });
    });

    // Clics WhatsApp
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
      a.addEventListener('click', () => {
        track('whatsapp_click', {
          event_category: 'Contact',
          event_label: a.getAttribute('href')
        });
      });
    });

    // Clics vers la page Contact
    document.querySelectorAll('a[href="/contact/"]').forEach(a => {
      a.addEventListener('click', () => {
        track('cta_contact_click', {
          event_category: 'CTA',
          event_label: a.textContent.trim() || 'Contact'
        });
      });
    });

    // Clics email
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.addEventListener('click', () => {
        track('email_click', {
          event_category: 'Contact',
          event_label: a.getAttribute('href')
        });
      });
    });
  };

  // --------------------------------------------------------------------------
  // MODULE: BREADCRUMB visible + JSON-LD (basique)
  // --------------------------------------------------------------------------
  const setupBreadcrumbs = () => {
    try {
      const path = window.location.pathname;
      if (path === '/' || path === '') return; // Pas de breadcrumb sur la home

      const header = document.querySelector('header.header');
      if (!header) return;

      const h1 = document.querySelector('main h1');
      const pageName = h1 ? h1.textContent.trim() : (document.title || 'Page');

      // Construit le fil d'ariane
      const nav = document.createElement('nav');
      nav.className = 'breadcrumb';
      nav.setAttribute('aria-label', "Fil d’Ariane");
      nav.style.background = 'var(--color-light-alt)';
      nav.style.borderBottom = '1px solid var(--color-border)';
      nav.style.fontSize = '.95rem';
      nav.style.padding = '.6rem 0';

      const container = document.createElement('div');
      container.className = 'container';

      const ol = document.createElement('ol');
      ol.style.listStyle = 'none';
      ol.style.margin = '0';
      ol.style.padding = '0';
      ol.style.display = 'flex';
      ol.style.flexWrap = 'wrap';
      ol.style.gap = '.5rem';

      const homeLi = document.createElement('li');
      const homeA = document.createElement('a');
      homeA.href = '/';
      homeA.textContent = 'Accueil';
      homeA.style.textDecoration = 'none';
      homeA.style.color = 'var(--color-primary)';
      homeLi.appendChild(homeA);

      const sep = document.createElement('span');
      sep.textContent = '›';
      sep.style.opacity = '.6';
      sep.style.margin = '0 .2rem';

      const currentLi = document.createElement('li');
      currentLi.textContent = pageName;
      currentLi.style.color = 'var(--color-text-muted)';

      ol.appendChild(homeLi);
      ol.appendChild(sep);
      ol.appendChild(currentLi);
      container.appendChild(ol);
      nav.appendChild(container);

      header.insertAdjacentElement('afterend', nav);

      // JSON-LD BreadcrumbList
      const ld = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Accueil",
            "item": "https://www.bmsventouse.fr/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": pageName,
            "item": `https://www.bmsventouse.fr${path}`
          }
        ]
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(ld);
      document.head.appendChild(script);
    } catch (e) {
      console.warn('Breadcrumb non initialisé:', e);
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: THEME CLAIR/SOMBRE (toggle + persistance)
  // --------------------------------------------------------------------------
  const setupThemeToggle = () => {
    const KEY = CONFIG.theme.storageKey;
    const apply = (mode) => {
      document.body.classList.toggle('dark-theme', mode === 'dark');
      try { localStorage.setItem(KEY, mode); } catch (_) {}
    };
    let initial = 'light';
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) initial = saved;
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) initial = 'dark';
    } catch (_) {}
    apply(initial);

    const nav = document.querySelector('.nav');
    if (!nav) return;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Basculer clair/sombre');
    btn.type = 'button';
    btn.innerHTML = initial === 'dark' ? '🌙' : '☀️';
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      apply(next);
      btn.innerHTML = next === 'dark' ? '🌙' : '☀️';
    });
    nav.appendChild(btn);
  };

  // --------------------------------------------------------------------------
  // MODULE: BARRE DE PROGRESSION DE SCROLL
  // --------------------------------------------------------------------------
  const setupScrollProgress = () => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  };

  // ==========================================================================
  // INITIALISATION DE TOUS LES MODULES
  // ==========================================================================
  try {
    setupCookieBanner();
    setupHamburgerMenu();
    setupScrollAnimations();
    setupFaqAccordion();
    setupReferencesCarousel();
    setupBackToTop();
    setupAnalyticsEvents();
    setupBreadcrumbs();
    setupThemeToggle();
    setupScrollProgress();

    // Debug/override consent via query string: ?consent=granted|denied
    try {
      const qs = new URLSearchParams(window.location.search);
      const consentParam = qs.get('consent');
      if (consentParam && typeof gtag === 'function') {
        gtag('consent', 'update', {
          analytics_storage: consentParam === 'granted' ? 'granted' : 'denied'
        });
        console.log('Consent override via query param:', consentParam);
      }
    } catch (e) {
      // non-bloquant
    }

    // Lien \"Gérer les cookies\" en footer: permet de rouvrir la bannière de consentement
    try {
      document.querySelectorAll('.manage-cookies,[data-cookie=\"manage\"]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          // Réinitialise le consentement et réaffiche la bannière
          try {
            localStorage.removeItem('bms_cookie_consent');
          } catch (_) {}
          setupCookieBanner();
        });
      });
    } catch (_) {
      // non-bloquant
    }

    console.log('🚀 BMS Ventouse - Tous les modules initialisés avec succès');
  } catch (error) {
    console.error("Erreur lors de l'initialisation des scripts du site :", error);
  }
});

