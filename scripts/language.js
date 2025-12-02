class LanguageSwitcher {
  constructor() {
    this.currentLang = this.getInitialLanguage();
    this.init();
  }

  getInitialLanguage() {
    // Check if language is stored in localStorage
    const stored = localStorage.getItem('preferredLanguage');
    if (stored && (stored === 'en' || stored === 'fi')) {
      return stored;
    }
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;    
    // If browser is set to Finnish, use Finnish, otherwise default to English
    if (browserLang.startsWith('fi')) {
      return 'fi';
    }
    
    return 'en';
  }

  init() {
    this.applyLanguage();
    this.createLanguageToggle();
    this.attachEventListeners();
  }

  createLanguageToggle() {
    const nav = document.querySelector('nav .container');
    if (!nav) return;

    const langToggle = document.createElement('div');
    langToggle.className = 'lang-toggle';
    langToggle.innerHTML = `
      <button class="lang-btn ${this.currentLang === 'fi' ? 'active' : ''}" data-lang="fi">FI</button>
      <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
    `;

    // Insert before nav-links
    const navLinks = nav.querySelector('.nav-links');
    if (navLinks) {
      nav.insertBefore(langToggle, navLinks);
    }
  }

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('lang-btn')) {
        const newLang = e.target.dataset.lang;
        if (newLang !== this.currentLang) {
          this.switchLanguage(newLang);
        }
      }
    });
  }

  switchLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Apply new language
    this.applyLanguage();
  }

  applyLanguage() {
    const t = translations[this.currentLang];
    if (!t) return;

    // Get current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    // Update navigation
    this.updateNav(t.nav);

    // Update footer
    this.updateFooter(t.footer);

    // Update page-specific content
    if (t[currentPage]) {
      this.updatePageContent(currentPage, t[currentPage]);
    }

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;
  }

  updateNav(nav) {
    const navLinks = document.querySelectorAll('.nav-links a');
    const linkKeys = ['home', 'experience', 'skills', 'education', 'contact'];
    
    navLinks.forEach((link, index) => {
      if (linkKeys[index] && nav[linkKeys[index]]) {
        link.textContent = nav[linkKeys[index]];
      }
    });
  }

  updateFooter(footer) {
    const copyright = document.querySelector('.copyright');
    if (copyright && footer.copyright) {
      copyright.textContent = footer.copyright;
    }
  }

  updatePageContent(page, content) {
    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      if (content[key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = content[key];
        } else {
          element.textContent = content[key];
        }
      }
    });
    
    // Trigger typing effect for hero subtitle on index page
    if (page === 'index') {
      const heroSubtitle = document.querySelector('.hero-subtitle');
      if (heroSubtitle && content.subtitle) {
        this.typeWriter(heroSubtitle, content.subtitle);
      }
    }
  }

  // Typing effect function
  typeWriter(element, text) {
    // Cancel any existing typing animation
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.typingAnimation) {
      clearTimeout(this.typingAnimation);
    }
    
    element.textContent = '';
    element.style.opacity = '1';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        this.typingAnimation = setTimeout(type, 50);
      }
    };
    
    this.typingTimeout = setTimeout(type, 100);
  }

  // Helper method to get translated text
  t(key) {
    const keys = key.split('.');
    let value = translations[this.currentLang];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value;
  }
}

// Initialize language switcher when DOM is ready
let langSwitcher;

// Wait for both DOM and navigation to be loaded
function initLanguageSwitcher() {
  if (!langSwitcher && document.querySelector('nav')) {
    langSwitcher = new LanguageSwitcher();
  }
}

// Try to initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initLanguageSwitcher, 150); // Wait for nav to be loaded
  });
} else {
  setTimeout(initLanguageSwitcher, 150);
}