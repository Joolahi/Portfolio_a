import { translations } from './translations.js';

function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('fi') ? 'fi' : 'en';
}

function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);   
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let text = translations[lang];

        // Safely traverse nested translation keys. If any step is missing, fall back to empty string.
        for (const key of keys) {
            if (text && Object.prototype.hasOwnProperty.call(text, key)) {
                text = text[key];
            } else {
                text = '';
                break;
            }
        }

        if (element.tagName === 'H1') {
            // allow HTML in headings (e.g. <span class="highlight">)
            element.innerHTML = text;
        } else {
            element.textContent = text;
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    document.documentElement.lang = lang;
}

const savedLang = localStorage.getItem('preferredLanguage');
const initialLang = savedLang || getBrowserLanguage();
setLanguage(initialLang);

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang'));
    });
});

window.toggleMenu = function() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

window.closeMenu = function() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
}

document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('navLinks');
    const navbar = document.querySelector('.navbar');
    
    if (!navbar.contains(event.target) && navLinks.classList.contains('active')) {
        window.closeMenu();
    }
});