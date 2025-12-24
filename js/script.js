/**
 * ==========================================================================
 * SCRIPT PRINCIPAL POUR BMS VENTOUSE v5.0 (ENTERPRISE EDITION)
 * ==========================================================================
 * Gère toutes les interactions du site avec une architecture modulaire,
 * performante et accessible (Focus Trap, Escape Key, etc.).
 */
/* Production logging gate: silence console in production unless window.DEBUG=true */
(function(){ try{ var DEBUG = !!(window.DEBUG); if(!DEBUG){ ['log','info','debug','warn'].forEach(function(k){ try{ console[k] = function(){}; }catch(e){} }); } window.__BMS_DEBUG__ = DEBUG; }catch(e){} })();

document.addEventListener('DOMContentLoaded', async () => {

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
  // MODULE: THÈME (mode sombre + préférences)
  // --------------------------------------------------------------------------
  const setupThemeMode = () => {
    try {
      const storageKey = (CONFIG.theme && CONFIG.theme.storageKey) || 'bms-theme-preference';

      const getStoredTheme = () => {
        try {
          const value = localStorage.getItem(storageKey);
          return value === 'dark' || value === 'light' ? value : null;
        } catch (_) {
          return null;
        }
      };

      const applyTheme = (theme) => {
        const isDark = theme === 'dark';
        document.body.classList.toggle('dark-theme', isDark);
        try {
          document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        } catch (_) {
          // non-bloquant
        }
      };

      const updateToggleState = (theme) => {
        const isDark = theme === 'dark';
        document.querySelectorAll('.theme-toggle').forEach((btn) => {
          btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        });
      };

      const stored = getStoredTheme();
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = stored || (prefersDark ? 'dark' : 'light');

      applyTheme(initialTheme);
      updateToggleState(initialTheme);

      const toggleTheme = () => {
        const nextTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(nextTheme);
        updateToggleState(nextTheme);
        try {
          localStorage.setItem(storageKey, nextTheme);
        } catch (_) {
          // non-bloquant
        }
      };

      const toggles = document.querySelectorAll('.theme-toggle');
      toggles.forEach((btn) => {
        if (!btn.hasAttribute('type')) {
          btn.setAttribute('type', 'button');
        }
        btn.addEventListener('click', toggleTheme);
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        });
      });

      // Suivre les changements système seulement si aucune préférence explicite n'est stockée
      if (!stored && window.matchMedia) {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const syncWithSystem = (e) => {
          const theme = e.matches ? 'dark' : 'light';
          applyTheme(theme);
          updateToggleState(theme);
        };
        if (typeof mq.addEventListener === 'function') {
          mq.addEventListener('change', syncWithSystem);
        } else if (typeof mq.addListener === 'function') {
          mq.addListener(syncWithSystem);
        }
      }
    } catch (_) {
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: SKIP LINK (Aller au contenu) pour accessibilité
  // --------------------------------------------------------------------------
  const setupSkipLink = () => {
    // Désactivé à la demande : plus de création automatique du bouton "Aller au contenu"
    return;
  };

  // --------------------------------------------------------------------------
  // MODULE: MENU HAMBURGER & ACCESSIBILITÉ
  // --------------------------------------------------------------------------
  const setupHamburgerMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    // Assurer que le bouton hamburger n'est pas traité comme submit dans des pages avec formulaire
    try {
      if (hamburger && !hamburger.hasAttribute('type')) {
        hamburger.setAttribute('type', 'button');
      }
    } catch (_) {}

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
      if (isActive && firstFocusableElement) {
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
      if (e.key === 'Tab' && hamburger.classList.contains('active') && firstFocusableElement && lastFocusableElement) {
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
  // MODULE: NAVIGATION PRINCIPALE UNIFIÉE (menu + sous-menu Services)
  // --------------------------------------------------------------------------
  const setupUnifiedHeaderNav = () => {
    try {
      const navLinks = document.getElementById('navLinks');
      if (!navLinks) return;

      const normalizePath = (p) => {
        if (!p) return '/';
        let out = p.split('#')[0].split('?')[0];
        if (out.length > 1 && out.endsWith('/')) {
          out = out.slice(0, -1);
        }
        return out || '/';
      };

      const current = normalizePath(window.location.pathname || '/');

      const inServicesSection = (() => {
        const prefixes = [
          '/services',
          '/ventousage',
          '/affichage-riverains',
          '/signalisation-barrierage',
          '/gardiennage',
          '/securite-plateaux',
          '/securite-gardiennage',
          '/convoyage-vehicules-decors',
          '/regie-materiel',
          '/loges-confort',
          '/cantine-catering',
          '/transport-materiel-audiovisuel-paris',
          '/autorisation-occupation-domaine-public-tournage-paris',
          '/ventousage-cinema',
          '/urban-regie'
        ];
        if (prefixes.some(prefix => current === prefix || current.startsWith(prefix + '/'))) return true;
        if (current.startsWith('/ventousage-')) return true;
        if (current.startsWith('/securite-tournage-')) return true;
        if (current.startsWith('/logistique-')) return true;
        return false;
      })();

      const isHome = current === '/';
      const isRealisations = current === '/realisations';
      const isDevis = current === '/devis';
      const isTarifs = current === '/prix-ventousage-paris' || isDevis;
      const isContact = current === '/contact';

      const navItems = [];

      // Accueil
      navItems.push(
        `<li><a href="/" class="nav-link${isHome ? ' active' : ''}">Accueil</a></li>`
      );

      // Services + sous-menu
      navItems.push(
        `<li class="has-submenu">
          <a href="/services/" class="nav-link submenu-trigger${inServicesSection ? ' active' : ''}">
            Services
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16">
              <path d="M1.5 5.5 8 12l6.5-6.5-1.4-1.4L8 9.2 2.9 4.1z"/>
            </svg>
          </a>
          <div class="nav-submenu">
            <div class="nav-submenu-group">
              <span class="group-title">Logistique &amp; ventousage</span>
              <ul class="group-list">
                <li><a href="/ventousage/">Ventousage &amp; autorisations</a></li>
                <li><a href="/ventousage-paris/">Ventousage Paris</a></li>
                <li><a href="/affichage-riverains/">Affichage riverains</a></li>
                <li><a href="/signalisation-barrierage/">Signalisation &amp; barriérage</a></li>
              </ul>
            </div>
            <div class="nav-submenu-group">
              <span class="group-title">Sécurité &amp; gardiennage</span>
              <ul class="group-list">
                <li><a href="/securite-plateaux/">Sécurité de plateaux</a></li>
                <li><a href="/gardiennage/">Gardiennage</a></li>
              </ul>
            </div>
            <div class="nav-submenu-group">
              <span class="group-title">Régie &amp; confort</span>
              <ul class="group-list">
                <li><a href="/regie-materiel/">Régie &amp; matériel</a></li>
                <li><a href="/loges-confort/">Loges &amp; confort</a></li>
                <li><a href="/cantine-catering/">Cantine &amp; catering</a></li>
              </ul>
            </div>
            <div class="nav-submenu-group">
              <span class="group-title">Transport</span>
              <ul class="group-list">
                <li><a href="/convoyage-vehicules-decors/">Convoyage véhicules &amp; décors</a></li>
                <li><a href="/transport-materiel-audiovisuel-paris/">Transport matériel audiovisuel</a></li>
              </ul>
            </div>
            <div class="nav-submenu-group">
              <span class="group-title">Tous les services</span>
              <ul class="group-list">
                <li><a href="/services/">Voir tous les services</a></li>
              </ul>
            </div>
          </div>
        </li>`
      );

      // Réalisations
      navItems.push(
        `<li><a href="/realisations/" class="nav-link${isRealisations ? ' active' : ''}">Réalisations</a></li>`
      );

      // Tarifs & devis
      navItems.push(
        `<li><a href="/prix-ventousage-paris/" class="nav-link${isTarifs ? ' active' : ''}">Tarifs &amp; devis</a></li>`
      );

      // Contact
      navItems.push(
        `<li><a href="/contact/" class="nav-link${isContact ? ' active' : ''}">Contact</a></li>`
      );

      // CTA Devis gratuit
      navItems.push(
        `<li><a href="/devis/" class="nav-link btn${isDevis ? ' active' : ''}">Devis gratuit</a></li>`
      );

      // Préférence gaucher / droitier
      navItems.push(
        `<li>
          <button class="hand-toggle" type="button" aria-label="Basculer en mode gaucher ou droitier">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16">
              <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046zm2.094 2.025"/>
            </svg>
          </button>
        </li>`
      );

      // Bouton mode sombre / clair
      navItems.push(
        `<li>
          <button class="theme-toggle" type="button" aria-label="Activer ou désactiver le mode sombre">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16">
              <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
              <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
          </button>
        </li>`
      );

      navLinks.innerHTML = navItems.join('');
    } catch (_) {
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: ANIMATIONS AU DÉFILEMENT (Intersection Observer)
  // --------------------------------------------------------------------------
  const setupScrollAnimations = () => {
    // Collecte des éléments à animer
    const animatedItemsSet = new Set(document.querySelectorAll('.animated-item'));
    // Ajoute les logos du carrousel pour des apparitions progressives
    document.querySelectorAll('.references-carousel .carousel-slide').forEach(el => {
      el.classList.add('animated-item');
      animatedItemsSet.add(el);
    });

    const animatedItems = Array.from(animatedItemsSet);
    if (animatedItems.length === 0) return;

    // Stagger: assigne un index par groupe (section/hero/footer)
    const groups = new Map();
    animatedItems.forEach(el => {
      const parent = el.closest('.section') || el.closest('.hero') || el.closest('.footer') || document.body;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach(items => {
      items.forEach((el, idx) => {
        el.dataset.staggerIndex = String(idx);
      });
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = parseInt(el.dataset.staggerIndex || '0', 10);
          if (!prefersReducedMotion) {
            el.style.transitionDelay = (idx * 0.15) + 's'; // 150 ms entre éléments
          }
          el.classList.add('is-visible');
          obs.unobserve(el);
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

      // Accessibilité
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
      answer.style.maxHeight = '0px';

      // Toggle avec transition fluide de la hauteur
      const toggleFAQ = () => {
        const isOpen = item.classList.contains('is-open');
        
        // Fermer les autres éléments
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('is-open');
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
            if (otherAnswer) {
              otherAnswer.style.maxHeight = '0px';
            }
          }
        });
        
        // Basculer l'élément actuel
        item.classList.toggle('is-open', !isOpen);
        question.setAttribute('aria-expanded', String(!isOpen));
        // Smooth expand/collapse
        if (!isOpen) {
          requestAnimationFrame(() => {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          });
        } else {
          requestAnimationFrame(() => {
            answer.style.maxHeight = '0px';
          });
        }
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

      // Création de la bannière (CSS via classes, pas de styles inline)
      const banner = document.createElement('div');
      banner.id = 'cookie-banner';
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-live', 'polite');
      banner.setAttribute('aria-label', 'Bannière de consentement aux cookies');

      banner.innerHTML = `
        <div class="cookie-banner__content">
          <p class="cookie-banner__text">
            Nous utilisons un cookie de mesure d’audience (Google Analytics) pour améliorer le site.
            Aucune publicité, et IP anonymisée. Vous pouvez refuser.
            <a class="cookie-banner__link" href="/mentions/">En savoir plus</a>.
          </p>
          <div class="cookie-banner__actions">
            <button id="cookie-decline" class="btn">Refuser</button>
            <button id="cookie-accept" class="btn btn-primary">Accepter</button>
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
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: ÉVÉNEMENTS ANALYTICS (GA4)
  // --------------------------------------------------------------------------
  const setupAnalyticsEvents = () => {
    // Envoi GA4 direct + dataLayer pour GTM
    const track = (eventName, params) => {
      const p = params || {};
      try {
        if (typeof gtag === 'function') {
          gtag('event', eventName, p);
        }
        if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push({ event: eventName, ...p });
        }
      } catch (e) {
        // non-bloquant
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

      // Construit le fil d'ariane (classes CSS, pas de styles inline)
      const nav = document.createElement('nav');
      nav.className = 'breadcrumb';
      nav.setAttribute('aria-label', "Fil d’Ariane");

      const container = document.createElement('div');
      container.className = 'container';

      const ol = document.createElement('ol');
      ol.className = 'breadcrumb-list';

      const homeLi = document.createElement('li');
      const homeA = document.createElement('a');
      homeA.href = '/';
      homeA.textContent = 'Accueil';
      homeA.className = 'breadcrumb-link';
      homeLi.appendChild(homeA);

      const sep = document.createElement('span');
      sep.textContent = '›';
      sep.className = 'breadcrumb-sep';

      const currentLi = document.createElement('li');
      currentLi.textContent = pageName;
      currentLi.className = 'breadcrumb-current';

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
            "item": "https://bmsventouse.fr/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": pageName,
            "item": `https://bmsventouse.fr${path}`
          }
        ]
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(ld);
      document.head.appendChild(script);
    } catch (e) {
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: CANONICAL FALLBACK (global, zéro maintenance)
  // --------------------------------------------------------------------------
  const setupCanonicalFallback = () => {
    try {
      // Ne rien faire si une canonical est déjà définie dans le <head>
      if (document.querySelector('link[rel="canonical"]')) return;
      const { protocol, hostname, pathname } = location;
      const proto = protocol === 'http:' ? 'https:' : protocol;
      let path = pathname || '/';
      // Ajoute un slash final pour les pages dossier (pas pour les fichiers .html, .txt, etc.)
      if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) {
        path += '/';
      }
      const url = proto + '//' + hostname.replace(/\/+$/, '') + path;
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = url;
      document.head.appendChild(link);
    } catch (_) {
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: PASSE ORTHOGRAPHIQUE (typographie FR) — global, non destructif
  // --------------------------------------------------------------------------
  const setupFrenchTypoCleaning = () => {
    try {
      const skipTags = new Set(['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','KBD','SAMP','VAR']);
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentNode;
        if (!parent || skipTags.has(parent.nodeName)) continue;
        let t = node.nodeValue;
        if (!t || !t.trim()) continue;
        // Espaces insécables avant ; : ? !
        t = t.replace(/(\S)\s([;:?!])/g, '$1\u00A0$2');
        // Nombre + heure -> NBSP
        t = t.replace(/(\d+)\s?h(?![a-zA-Z])/g, '$1\u00A0h');
        // Nombre + €
        t = t.replace(/(\d+)\s?€\b/g, '$1\u00A0€');
        // Ellipses
        t = t.replace(/\.{3}/g, '…');
        // Nettoyage espaces multiples
        t = t.replace(/\s{2,}/g, ' ');
        if (t !== node.nodeValue) node.nodeValue = t;
      }
    } catch (_) {
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: UNIFIER LE CHARGEMENT DU CSS (style.css)
  // --------------------------------------------------------------------------
  const unifyStylesheetLoading = () => {
    try {
      const head = document.head || document.getElementsByTagName('head')[0];
      if (!head) return;
      // Supprimer les preload redondants pour style.css
      head.querySelectorAll('link[rel="preload"][as="style"][href$="/css/style.css"]').forEach(link => {
        try { link.remove(); } catch (_) {}
      });
      // S'assurer qu'un seul link rel="stylesheet" vers style.css reste
      const sheets = head.querySelectorAll('link[rel="stylesheet"][href$="/css/style.css"]');
      if (sheets.length > 1) {
        for (let i = 1; i < sheets.length; i++) {
          try { sheets[i].remove(); } catch (_) {}
        }
      }
    } catch (_) {
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: PRÉFÉRENCE GAUCHER / DROITIER (placement des actions à une main)
  // --------------------------------------------------------------------------
  const setupHandPreference = () => {
    try {
      const STORAGE_KEY = 'bms_hand_pref';
      const btn = document.querySelector('.hand-toggle');
      const body = document.body;
      if (!btn || !body) return;

      const applyPref = (value) => {
        if (value === 'left') {
          body.classList.add('left-handed');
          btn.setAttribute('aria-pressed', 'true');
          btn.setAttribute('aria-label', 'Mode gaucher activé (actions principales accessibles à la main gauche)');
        } else {
          body.classList.remove('left-handed');
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('aria-label', 'Mode droitier activé (actions principales accessibles à la main droite)');
        }
      };

      let pref = 'right';
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'left' || stored === 'right') {
          pref = stored;
        }
      } catch (_) {}

      applyPref(pref);

      btn.addEventListener('click', () => {
        pref = (pref === 'right') ? 'left' : 'right';
        applyPref(pref);
        try {
          localStorage.setItem(STORAGE_KEY, pref);
        } catch (_) {}
      });
    } catch (_) {
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: MIGRATION DES ICÔNES FONT AWESOME -> SVG inline
  // --------------------------------------------------------------------------
  const removeFontAwesomeLink = () => {
    try {
      document.querySelectorAll('link[rel="stylesheet"][href*="font-awesome"]').forEach(link => {
        try { link.remove(); } catch (_) {}
      });
    } catch (_) { /* non-bloquant */ }
  };

  const migrateFAIconsToInlineSVG = () => {
    try {
      const map = {
        'fa-envelope': { vb: '0 0 512 512', d: 'M502.3 190.8L327.4 338.6c-15.6 13.3-39.2 13.3-54.8 0L9.7 190.8C3.9 186.2 0 178.8 0 171V104c0-26.5 21.5-48 48-48h416c26.5 0 48 21.5 48 48v67c0 7.8-3.9 15.2-9.7 19.8z' },
        'fa-whatsapp': {
          vb: '0 0 16 16',
          d: 'M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232'
        },
        'fa-phone-alt': { vb: '0 0 512 512', d: 'M511.1 382.9l-23.6 54.1c-6.3 14.3-20.9 23-36.6 22-61.3-3.8-120.6-24.8-171.2-60.6-45.1-31.9-83.7-73.4-113.7-121.1-25.1-39.6-43.3-83.2-53.6-128.7-3.5-15.7 5.8-31.6 21-36.5l56.2-18.2c12.6-4.1 26.4.9 33.6 12.1l31.8 49.3c6.8 10.6 5.7 24.4-2.7 33.7l-21.7 24.3c22.7 39.7 54.7 71.8 93.9 95.1l24.3-21.7c9.4-8.4 23.2-9.5 33.7-2.7l49.3 31.8c11.3 7.3 16.3 21.1 12.2 33.7z' },
        'fa-phone': { vb: '0 0 512 512', d: 'M511.1 382.9l-23.6 54.1c-6.3 14.3-20.9 23-36.6 22-61.3-3.8-120.6-24.8-171.2-60.6-45.1-31.9-83.7-73.4-113.7-121.1-25.1-39.6-43.3-83.2-53.6-128.7-3.5-15.7 5.8-31.6 21-36.5l56.2-18.2c12.6-4.1 26.4.9 33.6 12.1l31.8 49.3c6.8 10.6 5.7 24.4-2.7 33.7l-21.7 24.3c22.7 39.7 54.7 71.8 93.9 95.1l24.3-21.7c9.4-8.4 23.2-9.5 33.7-2.7l49.3 31.8c11.3 7.3 16.3 21.1 12.2 33.7z' },
        'fa-city': { vb: '0 0 448 512', d: 'M128 148v-40c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12v40h24c13.3 0 24 10.7 24 24v296H80V172c0-13.3 10.7-24 24-24h24zm64-28v36h64v-36h-64zM96 480h256v16c0 8.8-7.2 16-16 16H112c-8.8 0-16-7.2-16-16v-16z' },
        'fa-road': { vb: '0 0 640 512', d: 'M640 480H0l240-320 96 128 64-64 240 256z' },
        'fa-map': { vb: '0 0 512 512', d: 'M256 24C180 86 64 232 64 312c0 79.5 64.5 144 144 144s144-64.5 144-144C352 232 236 86 256 24z' },
        'fa-list': { vb: '0 0 512 512', d: 'M96 64h320c17.7 0 32 14.3 32 32v320c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm48 64v64h64v-64h-64zm160 0v64h64v-64h-64zM144 256v64h64v-64h-64zm160 0v64h64v-64h-64z' }
      };
      const isFA = (cls) => cls.startsWith('fa-') && cls !== 'fas' && cls !== 'far' && cls !== 'fab';
      let replaced = 0;
      document.querySelectorAll('i[class*="fa-"]').forEach(i => {
        try {
          const c = Array.from(i.classList).find(isFA);
          if (!c || !map[c]) return;
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', map[c].vb);
          svg.setAttribute('width', '1em');
          svg.setAttribute('height', '1em');
          svg.setAttribute('fill', 'currentColor');
          svg.setAttribute('aria-hidden', 'true');
          svg.setAttribute('focusable', 'false');
          svg.style.verticalAlign = 'middle';
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', map[c].d);
          svg.appendChild(path);
          i.replaceWith(svg);
          replaced++;
        } catch (_) { /* noop */ }
      });
      if (replaced > 0) {
        // Retirer la feuille FA pour éviter chargement inutile
        removeFontAwesomeLink();
      }
    } catch (_) { /* non-bloquant */ }
  };

  // --------------------------------------------------------------------------
  // MODULE: SOUS-MENU NAV — toutes les pages regroupées par sections
  // --------------------------------------------------------------------------
  const setupAllPagesSubmenu = async () => {
    // Version simplifiée / désactivée pour l’instant :
    // le site reste parfaitement utilisable sans ce sous-menu,
    // et on évite d’ajouter de la complexité JS inutile.
    return;
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
      const ratio = h > 0 ? (window.scrollY / h) : 0;
      bar.style.transform = 'scaleX(' + ratio + ')';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  };

  // --------------------------------------------------------------------------
  // MODULE: Microsoft Clarity (chargé après consentement analytics)
  // --------------------------------------------------------------------------
  const setupClarity = () => {
    try {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "tm9ex1xsa4");
      console.log('✅ Microsoft Clarity chargé');
    } catch (e) {
      // non-bloquant
    }
  };

  const loadClarityIfConsented = () => {
    try {
      const KEY = 'bms_cookie_consent';
      const saved = localStorage.getItem(KEY);
      if (saved === 'accepted') {
        setupClarity();
        return;
      }
      // Si l'utilisateur accepte via la bannière, on charge Clarity
      document.addEventListener('click', (e) => {
        const el = e.target;
        if (el && el.id === 'cookie-accept') {
          setTimeout(setupClarity, 0);
        }
      });
    } catch (_) {
      // non-bloquant
    }
  };

  // ==========================================================================
  // INITIALISATION DE TOUS LES MODULES
  // ==========================================================================
  try {
    setupThemeMode();
    setupCookieBanner();
    setupSkipLink();
    setupUnifiedHeader();
    setupUnifiedFooter();
    setupScrollAnimations();
    setupHeroParallax();
    setupFaqAccordion();
    setupReferencesCarousel();
    setupBackToTop();
    setupAnalyticsEvents();
    setupHandPreference();
    setupBreadcrumbs();
    await setupAllPagesSubmenu();
    // Barre de progression de scroll uniquement sur desktop pour limiter le travail JS sur mobile
    try {
      if (window.innerWidth >= 1024) {
        setupScrollProgress();
      }
    } catch (_) {
      // non-bloquant
    }
    loadClarityIfConsented();
    // Global canonical (fallback si manquante)
    setupCanonicalFallback();
    // Passe orthographique typographique FR reportée après le chargement initial
    try {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(setupFrenchTypoCleaning);
      } else {
        setTimeout(setupFrenchTypoCleaning, 1500);
      }
    } catch (_) {
      // non-bloquant
    }
    // Google Tag Manager (GTM) - chargement dynamique si un ID est fourni
    setupGTM();
    // Message de succès pour le formulaire Contact (?success=1)
    setupContactSuccessNotice();
    // Détails dynamiques selon service sur le formulaire Contact
    setupContactServiceDetails();
    // Capture des leads du formulaire Contact vers HubSpot (non bloquant)
    setupContactLeadCapture();
    // Harmonisation des emails: mécanisme legacy désormais désactivé (migration terminée)

    // PWA: enregistrement du Service Worker (pour PWA=100)
    setupServiceWorker();
    // Galerie Ventousage Paris (si la section est présente sur la page)
    setupVentousageParisGallery();
    // Perf: améliorer le lazy/decoding des images (hors héros)
    enhanceImages();

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

    // Lien "Gérer les cookies" en footer: permet de rouvrir la bannière de consentement
    try {
      document.querySelectorAll('.manage-cookies,[data-cookie="manage"]').forEach(link => {
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
  } finally {
    try {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(unifyStylesheetLoading);
      } else {
        setTimeout(unifyStylesheetLoading, 1500);
      }
    } catch (_) {
      // non-bloquant
    }
    try {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(migrateFAIconsToInlineSVG);
      } else {
        setTimeout(migrateFAIconsToInlineSVG, 1500);
      }
    } catch (_) {
      // non-bloquant
    }
  }
});

// --------------------------------------------------------------------------
// MODULE: FOOTER UNIFIÉ BMS VENTOUSE
// --------------------------------------------------------------------------
function setupUnifiedFooter() {
  try {
    const footerContent = document.querySelector('.footer .footer-content');
    const footerBottom = document.querySelector('.footer-bottom-content p');

    // Ne pas écraser le footer spécifique Urban Régie
    if (footerBottom && footerBottom.textContent && footerBottom.textContent.indexOf('Urban Régie') !== -1) {
      return;
    }

    if (!footerContent) return;

    const html = `
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/android-chrome-192x192.png" alt="BMS Ventouse" width="40" height="40" class="footer-logo-img">
            <div class="footer-brand-text">
              <span class="footer-bms">BMS</span><span class="footer-ventouse">Ventouse</span>
            </div>
          </div>
          <p class="footer-description">
            Votre partenaire logistique et sécurité pour des productions sereines et efficaces, partout en France.
          </p>
          <div class="footer-social">
            <span>Suivez-nous&nbsp;:&nbsp;</span>
            <a href="https://www.instagram.com/bmsventouse" target="_blank" rel="noopener noreferrer">Instagram</a>
            &nbsp;·&nbsp;
            <a href="https://x.com/bmsventouse" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/services/">Services</a></li>
              <li><a href="/ventousage-paris/">Ventousage Paris</a></li>
              <li><a href="/prix-ventousage-paris/">Tarifs &amp; devis</a></li>
              <li><a href="/affichage-riverains/">Affichage riverains</a></li>
              <li><a href="/signalisation-barrierage/">Signalisation &amp; barriérage</a></li>
              <li><a href="/realisations/">Réalisations</a></li>
              <li><a href="/contact/">Contact</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Territoires</h4>
            <ul>
              <li><a href="/ventousage-paris/">Paris</a></li>
              <li><a href="/ventousage-pantin/">Pantin</a></li>
              <li><a href="/ventousage-lyon/">Lyon</a></li>
              <li><a href="/ventousage-marseille/">Marseille</a></li>
              <li><a href="/ventousage-bordeaux/">Bordeaux</a></li>
              <li><a href="/ventousage-strasbourg/">Strasbourg</a></li>
              <li><a href="/ventousage-nice/">Nice</a></li>
              <li><a href="/ventousage-toulouse/">Toulouse</a></li>
              <li><a href="/ventousage-lille/">Lille</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Contact Direct</h4>
            <ul>
              <li>
                <a href="tel:+33646005642">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16" style="margin-right:8px">
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5"/>
                  </svg>
                  +33&nbsp;6&nbsp;46&nbsp;00&nbsp;56&nbsp;42
                </a>
              </li>
              <li>
                <a href="https://wa.me/33646005642" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251A6.56 6.56 0 0 1 1.12 7.926c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                  WhatsApp Direct
                </a>
              </li>
              <li>
                <a href="mailto:contact@bmsventouse.fr">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16" style="margin-right:8px">
                    <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
                    <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z"/>
                  </svg>
                  contact@bmsventouse.fr
                </a>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16" style="margin-right:8px">
                  <path d="M8 0a5.53 5.53 0 0 0-5.5 5.5C2.5 9.028 8 16 8 16s5.5-6.972 5.5-10.5A5.53 5.53 0 0 0 8 0m0 8a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5"/>
                </svg>
                10&nbsp;Rue de la République, 93700&nbsp;Drancy, France
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false" viewBox="0 0 16 16" style="margin-right:8px">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                </svg>
                Disponible&nbsp;24/7&nbsp;— France entière
              </li>
              
            </ul>
          </div>
          <div class="footer-column">
            <h4>Légal</h4>
            <ul>
              <li><a href="/mentions/">Mentions Légales</a></li>
              <li><a href="/politique-confidentialite/">Politique de confidentialité</a></li>
              <li><a href="/llms.txt">Infos IA (llms.txt)</a></li>
              <li><a href="/ai.txt">Infos IA (ai.txt)</a></li>
              <li><a href="/infos-ia/">Infos IA (page)</a></li>
              <li><a href="#" class="manage-cookies" data-cookie="manage">Gérer les cookies</a></li>
            </ul>
          </div>
        </div>
    `;

    footerContent.innerHTML = html;

    if (footerBottom) {
      footerBottom.innerHTML = '&copy; 2025 BMS Ventouse. Tous droits réservés. Site réalisé par <a href="https://smarterlogicweb.com" target="_blank" rel="noopener noreferrer">SmarterLogicWeb</a>.';
    }
  } catch (_) {
    // non-bloquant
  }
}

// --------------------------------------------------------------------------
// MODULE: PARALLAX HERO
// --------------------------------------------------------------------------
function setupHeroParallax() {
  const hero = document.querySelector('.hero');
  const img = hero ? hero.querySelector('.hero-bg img') : null;
  if (!hero || !img) return;

  // Désactive le parallax sur mobile pour limiter le travail JS au scroll
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || isMobile) return;

  img.style.willChange = 'transform';
  let ticking = false;

  const update = () => {
    const rect = hero.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const offset = -rect.top * 0.5; // vitesse 0.5x pour effet parallax léger
      img.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// --------------------------------------------------------------------------
// MODULE: Google Tag Manager (GTM) — chargement dynamique
// --------------------------------------------------------------------------
function setupGTM() {
  try {
    // Récupère l'ID GTM depuis une meta tag ou variable globale (window.GTM_ID)
    const meta = document.querySelector('meta[name="gtm-id"]');
    const id = (meta && meta.content || (window.GTM_ID || '')).trim();
    if (!id) {
      // Ne pas loguer en production
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  } catch (e) {
    // non-bloquant
  }
}

// --------------------------------------------------------------------------
// MODULE: Message de succès sur /contact/ après soumission du formulaire (?success=1)
// --------------------------------------------------------------------------
function setupContactSuccessNotice() {
  try {
    const qs = new URLSearchParams(window.location.search);
    const isSuccess = qs.get('success') === '1';
    if (!isSuccess) return;

    // Trouve le formulaire contact OU devis et son conteneur
    const form = document.querySelector('form[name="contact"], form[name="quote"]');
    const container = form ? form.closest('.container') : document.querySelector('main .container');
    if (!container) return;

    const note = document.createElement('div');
    note.className = 'coverage-note-card';
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');
    note.style.marginBottom = '1rem';
    note.innerHTML = '<strong>Merci !</strong> Votre demande a été envoyée. Nous revenons vers vous sous 24–48&nbsp;h ouvrées. Vous pouvez aussi nous joindre directement au <a href="tel:+33646005642">+33&nbsp;6&nbsp;46&nbsp;00&nbsp;56&nbsp;42</a>.';

    container.insertBefore(note, container.firstChild);
  } catch (e) {
    // non-bloquant
  }
}

// --------------------------------------------------------------------------
// MODULE: Affichage conditionnel des blocs de détails du formulaire Contact
// --------------------------------------------------------------------------
function setupContactServiceDetails() {
  try {
    const form = document.querySelector('form[name="contact"]');
    const serviceSel = document.getElementById('service');
    if (!form || !serviceSel) return;
    const groups = Array.from(form.querySelectorAll('.service-details'));
    const map = (val) => {
      const v = String(val || '').toLowerCase();
      if (v.includes('ventousage')) return 'ventousage';
      if (v.includes('sécurité') || v.includes('gardiennage')) return 'securite';
      if (v.includes('convoyage')) return 'convoyage';
      if (v.includes('régie')) return 'regie';
      if (v.includes('affichage')) return 'affichage';
      if (v.includes('signalisation')) return 'signalisation';
      if (v.includes('loges') || v.includes('confort')) return 'loges';
      if (v.includes('cantine') || v.includes('catering')) return 'cantine';
      return '';
    };
    const showRelevant = () => {
      const code = map(serviceSel.value);
      groups.forEach(g => {
        const s = g.getAttribute('data-service') || '';
        g.style.display = s === code ? '' : 'none';
      });
    };
    serviceSel.addEventListener('change', showRelevant);
    showRelevant();
  } catch (_) {}
}

function setupContactLeadCapture() {
  try {
    const form = document.querySelector('form[name="contact"]');
    if (!form) return;
    form.addEventListener('submit', () => {
      try {
        const payload = {
          fullname: (document.getElementById('name') || {}).value || '',
          role: (document.getElementById('role') || {}).value || '',
          company: (document.getElementById('company') || {}).value || '',
          email: (document.getElementById('email') || {}).value || '',
          phone: (document.getElementById('phone') || {}).value || '',
          service: (document.getElementById('service') || {}).value || '',
          package: (document.getElementById('package') || {}).value || '',
          location: (document.getElementById('location') || {}).value || '',
          address: (document.getElementById('address') || {}).value || '',
          schedule: (document.getElementById('schedule') || {}).value || '',
          urgent: ((document.getElementById('urgency') || {}).value || '') === 'urgent_24h' || ((document.getElementById('urgency') || {}).value || '') === 'urgent_72h',
          urgency: (document.getElementById('urgency') || {}).value || '',
          date_start: (document.getElementById('date_start') || {}).value || '',
          date_end: (document.getElementById('date_end') || {}).value || '',
          payment_preference: (document.getElementById('payment') || {}).value || '',
          budget: (document.getElementById('budget') || {}).value || '',
          details: (document.getElementById('details') || {}).value || '',
          consent: !!((document.getElementById('consent') || {}).checked),
          source: 'contact_form',
          // Champs spécifiques selon service
          svc_cantine_people: (document.getElementById('svc_cantine_people') || {}).value || '',
          svc_cantine_meals: (document.getElementById('svc_cantine_meals') || {}).value || '',
          svc_cantine_dietary: (document.getElementById('svc_cantine_dietary') || {}).value || '',
          svc_cantine_hours: (document.getElementById('svc_cantine_hours') || {}).value || '',
          svc_ventousage_streets: (document.getElementById('svc_ventousage_streets') || {}).value || '',
          svc_ventousage_zones: (document.getElementById('svc_ventousage_zones') || {}).value || '',
          svc_ventousage_hours: (document.getElementById('svc_ventousage_hours') || {}).value || '',
          svc_securite_agents: (document.getElementById('svc_securite_agents') || {}).value || '',
          svc_securite_hours: (document.getElementById('svc_securite_hours') || {}).value || '',
          svc_securite_ssiap: !!((document.getElementById('svc_securite_ssiap') || {}).checked),
          svc_convoyage_pickup: (document.getElementById('svc_convoyage_pickup') || {}).value || '',
          svc_convoyage_drop: (document.getElementById('svc_convoyage_drop') || {}).value || '',
          svc_convoyage_schedule: (document.getElementById('svc_convoyage_schedule') || {}).value || '',
          svc_convoyage_stops: (document.getElementById('svc_convoyage_stops') || {}).value || '',
          svc_convoyage_volume: (document.getElementById('svc_convoyage_volume') || {}).value || '',
          svc_regie_equipment: (document.getElementById('svc_regie_equipment') || {}).value || '',
          svc_regie_agents: (document.getElementById('svc_regie_agents') || {}).value || '',
          svc_regie_hours: (document.getElementById('svc_regie_hours') || {}).value || '',
          svc_signalisation_perimeter: (document.getElementById('svc_signalisation_perimeter') || {}).value || '',
          svc_signalisation_barriers: (document.getElementById('svc_signalisation_barriers') || {}).value || '',
          svc_signalisation_hours: (document.getElementById('svc_signalisation_hours') || {}).value || '',
          svc_affichage_streets: (document.getElementById('svc_affichage_streets') || {}).value || '',
          svc_affichage_posters: (document.getElementById('svc_affichage_posters') || {}).value || '',
          svc_loges_number: (document.getElementById('svc_loges_number') || {}).value || '',
          svc_loges_types: (document.getElementById('svc_loges_types') || {}).value || '',
          svc_loges_location: (document.getElementById('svc_loges_location') || {}).value || ''
        };
        // On stocke email/phone pour le suivi du lead côté /devis/ si l’utilisateur y va ensuite
        try {
          localStorage.setItem('bms_lead_email', payload.email || '');
          localStorage.setItem('bms_lead_phone', payload.phone || '');
          localStorage.setItem('bms_lead_fullname', payload.fullname || '');
          localStorage.setItem('bms_lead_company', payload.company || '');
        } catch (_){}

        // Envoi email géré par Netlify Forms côté serveur (notifications configurées dans Netlify)
        // Aucun appel API nécessaire côté front pour rester gratuit et sans maintenance.

        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'contact_submitted', ...payload });
        } catch(_){}
      } catch (_){}
    });
  } catch (_) {
    // non-bloquant
  }
}

// --------------------------------------------------------------------------
// UTIL LEGACY (remplacement d'anciens emails) — supprimé car migration terminée
// --------------------------------------------------------------------------
// La logique de migration d'anciens emails vers contact@bmsventouse.fr
// a été appliquée en dur dans le code HTML. Ce bloc est laissé vide
// pour éviter tout traitement inattendu côté front.

// --------------------------------------------------------------------------
// PWA: Service Worker registration
// --------------------------------------------------------------------------
function setupServiceWorker() {
  try {
    if ('serviceWorker' in navigator) {
      // N'enregistre pas le SW en local/CI (http://localhost) pour éviter d'interférer avec les tests (Pa11y/Lighthouse)
      const isLocal = (location.protocol !== 'https:') || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
      if (isLocal) return;
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  } catch (_) { /* non-bloquant */ }
}

// --------------------------------------------------------------------------
// Perf: améliorer les attributs des images (lazy/decoding) hors héros
// + normaliser les anciens SVG WhatsApp (Font Awesome) vers l’icône Bootstrap
// --------------------------------------------------------------------------
function enhanceImages() {
  try {
    // Optimisation des images
    document.querySelectorAll('img').forEach(img => {
      const inHero = img.closest('.hero-bg');
      if (!img.hasAttribute('loading') && !inHero) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });

    // Normalisation des anciens SVG WhatsApp (Font Awesome) vers l’icône Bootstrap 16x16
    const ns = 'http://www.w3.org/2000/svg';
    const WHATSAPP_PATH = 'M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232';

    document.querySelectorAll('svg[viewBox="0 0 448 512"] path').forEach(path => {
      const d = path.getAttribute('d') || '';
      // On cible uniquement le tracé WhatsApp Font Awesome (commence par M380.9 97.1C339-14.7)
      if (!d.startsWith('M380.9 97.1C339-14.7')) return;

      const svg = path.closest('svg');
      if (!svg) return;
      // Évite une double-normalisation éventuelle
      if (svg.dataset && svg.dataset.bmsWhatsappNormalized === '1') return;

      const width = svg.getAttribute('width') || '1em';
      const height = svg.getAttribute('height') || '1em';
      const style = svg.getAttribute('style') || '';
      const classes = svg.getAttribute('class') || '';
      const ariaHidden = svg.getAttribute('aria-hidden') || 'true';
      const focusable = svg.getAttribute('focusable') || 'false';

      const newSvg = document.createElementNS(ns, 'svg');
      newSvg.setAttribute('viewBox', '0 0 16 16');
      newSvg.setAttribute('fill', 'currentColor');
      newSvg.setAttribute('width', width);
      newSvg.setAttribute('height', height);
      newSvg.setAttribute('aria-hidden', ariaHidden);
      newSvg.setAttribute('focusable', focusable);
      if (style) newSvg.setAttribute('style', style);
      newSvg.setAttribute('class', (classes ? classes + ' ' : '') + 'bi bi-whatsapp');
      newSvg.dataset.bmsWhatsappNormalized = '1';

      const newPath = document.createElementNS(ns, 'path');
      newPath.setAttribute('d', WHATSAPP_PATH);
      newSvg.appendChild(newPath);

      if (svg.parentNode) {
        svg.parentNode.replaceChild(newSvg, svg);
      }
    });
  } catch (_) { /* non-bloquant */ }
}

// --------------------------------------------------------------------------
// MODULE: Galerie Ventousage (carrousel, affiché uniquement si des images sont déclarées)
// --------------------------------------------------------------------------
function setupVentousageParisGallery() {
  try {
    const track = document.getElementById('ventousageGallery');
    if (!track) return;

    const section = track.closest('.section');
    const wrapper = track.closest('.gallery-carousel');

    // Photos de ventousage (logo déjà intégré, plaques floutées, clients non identifiables)
    // Pour en ajouter ou en retirer :
    //  - déposer / supprimer les fichiers dans /images/ventousage-galerie/
    //  - ajuster la liste ci-dessous
    const IMAGES = [
      { src: '/images/ventousage-galerie/1.jpg', alt: 'Exemple de ventousage avec stationnement neutralisé et panneaux B6' },
      { src: '/images/ventousage-galerie/2.jpg', alt: 'Exemple de ventousage avec périmètre jalonné pour tournage' },
      { src: '/images/ventousage-galerie/3.jpg', alt: 'Exemple de ventousage avec signalisation réglementaire en place' },
      { src: '/images/ventousage-galerie/4.jpg', alt: 'Exemple de ventousage pour emplacement de véhicules techniques' },
      { src: '/images/ventousage-galerie/5.jpg', alt: 'Exemple de ventousage avec cônes et rubalise en voirie' },
      { src: '/images/ventousage-galerie/6.jpg', alt: 'Exemple de ventousage en amont d’un tournage' },
      { src: '/images/ventousage-galerie/7.jpg', alt: 'Exemple de ventousage en zone urbaine avec panneaux temporaires' },
      { src: '/images/ventousage-galerie/8.jpg', alt: 'Exemple de ventousage avec signalisation pour production audiovisuelle' },
      { src: '/images/ventousage-galerie/9.jpg', alt: 'Exemple de ventousage avec emplacement réservé pour l’équipe de tournage' },
      { src: '/images/ventousage-galerie/10.jpg', alt: 'Exemple de ventousage avec neutralisation de plusieurs places de stationnement' },
      { src: '/images/ventousage-galerie/11.jpg', alt: 'Exemple de ventousage montrant un dispositif complet de stationnement réservé' },
      { src: '/images/ventousage-galerie/12.jpg', alt: 'Exemple de ventousage avec panneaux et jalonnage sur trottoir et chaussée' },
      { src: '/images/ventousage-galerie/13.jpg', alt: 'Exemple de ventousage pour un tournage, avec périmètre matérialisé' }
    ];

    // Si aucune image n'est déclarée, on masque complètement la section
    if (!IMAGES.length) {
      if (section) {
        section.style.display = 'none';
      }
      return;
    }

    // Construire les slides du carrousel
    IMAGES.forEach((item) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide gallery-slide';

      const figure = document.createElement('figure');
      figure.className = 'service-card';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 800;
      img.height = 450;

      figure.appendChild(img);
      slide.appendChild(figure);
      track.appendChild(slide);
    });

    // Mise en place de la navigation carrousel (précédent / suivant)
    if (!wrapper) return;
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    if (!slides.length) return;

    const prevBtn = wrapper.querySelector('.carousel-control.prev');
    const nextBtn = wrapper.querySelector('.carousel-control.next');
    const counter = wrapper.querySelector('.gallery-counter');
    if (!prevBtn || !nextBtn) return;

    const total = slides.length;
    let currentIndex = 0;

    const getSlideWidth = () => {
      const slide = slides[0];
      if (!slide) return 0;
      const style = window.getComputedStyle(slide);
      const marginRight = parseFloat(style.marginRight) || 0;
      return slide.getBoundingClientRect().width + marginRight;
    };

    const endMsg = document.getElementById('galleryEndMessage');

    const updateCounter = () => {
      if (counter) {
        counter.textContent = 'Photo ' + (currentIndex + 1) + ' / ' + total;
      }
      if (endMsg) {
        const atEnd = currentIndex === total - 1;
        endMsg.hidden = !atEnd;
        if (atEnd) {
          endMsg.classList.add('is-visible');
        } else {
          endMsg.classList.remove('is-visible');
        }
      }
    };

    const updateControls = () => {
      if (!prevBtn || !nextBtn) return;
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === total - 1;
    };

    const scrollToIndex = (index) => {
      const width = getSlideWidth();
      if (!width) return;
      const maxIndex = slides.length - 1;
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      track.scrollTo({
        left: width * currentIndex,
        behavior: 'smooth'
      });
      updateCounter();
      updateControls();
    };

    // Clic sur une photo : scroll vers le CTA avec message
    // Initialiser compteur et états des boutons
    updateCounter();
    updateControls();

    nextBtn.addEventListener('click', () => {
      scrollToIndex(currentIndex + 1);
    });

    prevBtn.addEventListener('click', () => {
      scrollToIndex(currentIndex - 1);
    });
  } catch (_) {
    // non-bloquant
  }
}

