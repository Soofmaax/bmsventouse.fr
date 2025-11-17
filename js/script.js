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
  // MODULE: SKIP LINK (Aller au contenu) pour accessibilité
  // --------------------------------------------------------------------------
  const setupSkipLink = () => {
    try {
      // Si déjà présent, ne rien faire
      if (document.querySelector('.skip-link')) return;
      const main = document.getElementById('main-content');
      if (!main) return;

      const link = document.createElement('a');
      link.className = 'skip-link';
      link.href = '#main-content';
      link.textContent = 'Aller au contenu';
      // Ajoute en tout début du body
      document.body.insertBefore(link, document.body.firstChild);
    } catch (_) {
      // non-bloquant
    }
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
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0px';
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
      // non-bloquant
    }
  };

  // --------------------------------------------------------------------------
  // MODULE: SOUS-MENU NAV — toutes les pages regroupées par sections
  // --------------------------------------------------------------------------
  const setupAllPagesSubmenu = async () => {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    // Crée uniquement l'item et le bouton au chargement
    const li = document.createElement('li');
    li.className = 'has-submenu';

    const btn = document.createElement('button');
    btn.className = 'nav-link submenu-trigger';
    btn.type = 'button';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Pages';

    const submenu = document.createElement('ul');
    submenu.className = 'nav-submenu';

    // Construction paresseuse du contenu au premier clic pour réduire la taille du DOM initial
    let built = false;
    const buildSubmenu = async () => {
      if (built) return;
      built = true;

      // Récupère et parse le sitemap
      let urls = [];
      try {
        const res = await fetch('/sitemap.xml', { cache: 'no-store' });
        const xml = await res.text();
        const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
        urls = matches.map(m => m[1].trim()).filter(Boolean);
      } catch (e) {
        console.warn('Sitemap non récupéré, sous-menu non généré:', e);
        return;
      }

      // Utils
      const seen = new Set();
      const normalizePath = (p) => (p || '').replace(/\/+$/, '/') || '/';
      const slugToTitle = (url) => {
        try {
          const u = new URL(url);
          let path = u.pathname.replace(/\/$/, '');
          if (path === '' || path === '/') return 'Accueil';
          const parts = path.split('/').filter(Boolean);
          const slug = parts.pop();
          return slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
        } catch {
          return url;
        }
      };

      // Groupes
      const groups = {
        'Services': [],
        'Ventousage': [],
        'Sécurité': [],
        'Villes': [],
        'Autres': []
      };

      // Listes/regex pour classer
      const servicePaths = new Set([
        '/services/',
        '/affichage-riverains/',
        '/signalisation-barrierage/',
        '/convoyage-vehicules-decors/',
        '/regie-materiel/',
        '/transport-materiel-audiovisuel-paris/',
        '/gardiennage/'
      ]);

      const ventousagePaths = new Set([
        '/ventousage/',
        '/ventousage-cinema/',
        '/definition-ventousage/',
        '/autorisation-occupation-domaine-public-tournage-paris/'
      ]);

      const reVilleVentousage = /^\/ventousage-[^/]+\/$/;
      const reLogistiqueDept = /^\/logistique-(seine-saint-denis|seine-et-marne|val-d-oise)\/$/;
      const reSecurite = /^\/securite-(plateaux|tournage-[^/]+)\/$/;

      // Classement
      urls.forEach(url => {
        try {
          const u = new URL(url);
          const hostA = (u.hostname || '').replace(/^www\./, '');
          const hostB = (window.location.hostname || '').replace(/^www\./, '');
          if (hostA && hostB && hostA !== hostB) return;
          const path = normalizePath(u.pathname);
          if (seen.has(path)) return;
          seen.add(path);

          const label = slugToTitle(url);
          const item = { path, label };

          if (reVilleVentousage.test(path) || reLogistiqueDept.test(path)) {
            groups['Villes'].push(item);
          } else if (reSecurite.test(path)) {
            groups['Sécurité'].push(item);
          } else if (ventousagePaths.has(path)) {
            groups['Ventousage'].push(item);
          } else if (servicePaths.has(path)) {
            groups['Services'].push(item);
          } else {
            groups['Autres'].push(item);
          }
        } catch (_) { /* noop */ }
      });

      // Tri alphabétique
      Object.keys(groups).forEach(k => {
        groups[k].sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));
      });

      // Rendu
      const order = ['Services', 'Ventousage', 'Sécurité', 'Villes', 'Autres'];
      order.forEach(groupName => {
        const items = groups[groupName];
        if (!items || items.length === 0) return;

        const groupLi = document.createElement('li');
        groupLi.className = 'nav-submenu-group';

        const title = document.createElement('span');
        title.className = 'group-title';
        title.textContent = groupName;

        const groupUl = document.createElement('ul');
        groupUl.className = 'group-list';

        items.forEach(({ path, label }) => {
          const liItem = document.createElement('li');
          const a = document.createElement('a');
          a.href = path;
          a.className = 'nav-submenu-link';
          a.textContent = label;
          liItem.appendChild(a);
          groupUl.appendChild(liItem);
        });

        groupLi.appendChild(title);
        groupLi.appendChild(groupUl);
        submenu.appendChild(groupLi);
      });
    };

    const toggle = async (open) => {
      if (open) await buildSubmenu();
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    btn.addEventListener('click', async () => {
      const isOpen = li.classList.contains('open');
      await toggle(!isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!li.contains(e.target)) toggle(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggle(false);
    });

    li.appendChild(btn);
    li.appendChild(submenu);
    navLinks.appendChild(li);
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
    setupCookieBanner();
    setupSkipLink();
    setupHamburgerMenu();
    setupScrollAnimations();
    setupHeroParallax();
    setupFaqAccordion();
    setupReferencesCarousel();
    setupBackToTop();
    setupAnalyticsEvents();
    setupBreadcrumbs();
    await setupAllPagesSubmenu();
    setupScrollProgress();
    loadClarityIfConsented();
    // Google Tag Manager (GTM) - chargement dynamique si un ID est fourni
    setupGTM();
    // Message de succès pour le formulaire Contact (?success=1)
    setupContactSuccessNotice();
    // Capture des leads du formulaire Contact vers Zoho (non bloquant)
    setupContactLeadCapture();
    // Harmonisation des emails (remplacement Gmail -> contact@bmsventouse.fr)
    replaceLegacyEmail();
    // PWA: enregistrement du Service Worker (pour PWA=100)
    setupServiceWorker();
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
  }
});

// --------------------------------------------------------------------------
// MODULE: PARALLAX HERO
// --------------------------------------------------------------------------
function setupHeroParallax() {
  const hero = document.querySelector('.hero');
  const img = hero ? hero.querySelector('.hero-bg img') : null;
  if (!hero || !img) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

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
// MODULE: Message de succès sur /contact/ après soumission Netlify (?success=1)
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
// MODULE: Capture du formulaire Contact vers Zoho CRM (non bloquant)
// --------------------------------------------------------------------------
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
          urgent: !!((document.getElementById('urgent') || {}).checked),
          date_start: (document.getElementById('date_start') || {}).value || '',
          date_end: (document.getElementById('date_end') || {}).value || '',
          payment_preference: (document.getElementById('payment') || {}).value || '',
          budget: (document.getElementById('budget') || {}).value || '',
          details: (document.getElementById('details') || {}).value || '',
          consent: !!((document.getElementById('consent') || {}).checked),
          source: 'contact_form'
        };
        // On stocke email/phone pour le check d’éligibilité -15% côté /devis/ si l’utilisateur y va ensuite
        try {
          localStorage.setItem('bms_lead_email', payload.email || '');
          localStorage.setItem('bms_lead_phone', payload.phone || '');
        } catch (_){}

        fetch('/.netlify/functions/zoho_lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(()=>{});

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
// UTIL: Remplacer l'ancien email Gmail par le nouveau email pro
// --------------------------------------------------------------------------
function replaceLegacyEmail() {
  try {
    const OLD = 'bms.ventouse@gmail.com';
    const NEW = 'contact@bmsventouse.fr';
    // Remplace les liens mailto
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      try {
        const href = a.getAttribute('href') || '';
        if (href.toLowerCase().includes(OLD)) {
          a.setAttribute('href', `mailto:${NEW}`);
        }
        // Met à jour le texte visible si l'ancien email est affiché
        if ((a.textContent || '').includes(OLD)) {
          a.textContent = (a.textContent || '').replaceAll(OLD, NEW);
        }
      } catch(_){}
    });
    // Remplace occurrences textuelles basiques dans des spans/p/li (non destructif)
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const toChange = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && node.nodeValue.includes(OLD)) {
        toChange.push(node);
      }
    }
    toChange.forEach(node => {
      node.nodeValue = node.nodeValue.replaceAll(OLD, NEW);
    });
  } catch (_) {
    // non-bloquant
  }
}

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
// --------------------------------------------------------------------------
function enhanceImages() {
  try {
    document.querySelectorAll('img').forEach(img => {
      const inHero = img.closest('.hero-bg');
      if (!img.hasAttribute('loading') && !inHero) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  } catch (_) { /* non-bloquant */ }
}

