// Navigation scroll effect
const nav = document.querySelector('nav');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links a');

// Add scroll effect to navigation
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu when clicking on a link
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Set active navigation link based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinkItems.forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
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

// Observe cards and timeline items
const animateElements = document.querySelectorAll('.card, .timeline-item, .skill-category');
animateElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Form submission handling (for contact page)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    //  Logic to handle form submission (e.g., send email), just now alert!!!
    alert(`Thank you ${name}! Your message has been received. I'll get back to you at ${email} soon.`);
    
    // Reset form
    contactForm.reset();
  });
}

// Typing effect for hero subtitle (only on index page)
// This will run on initial page load
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle && (currentPage === 'index.html' || currentPage === '')) {
  // Wait a bit for language.js to load and set the initial language
  setTimeout(() => {
    const text = heroSubtitle.textContent;
    if (text) {
      heroSubtitle.textContent = '';
      heroSubtitle.style.opacity = '1';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroSubtitle.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      
      setTimeout(typeWriter, 100);
    }
  }, 200);
}

// Add hover effect to skill tags
const skillTags = document.querySelectorAll('.skill-tag');
skillTags.forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px) scale(1.05)';
  });
  
  tag.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

let ticking = false;
let scrollY = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const bgGrid = document.querySelector('.bg-grid');
      if (bgGrid) {
        bgGrid.style.transform = `translate(${scrollY * 0.05}px, ${scrollY * 0.05}px)`;
      }
      ticking = false;
    });
    
    ticking = true;
  }
});

// Console easter egg
console.log('%c👋 Hello Developer!', 'color: #A91D3A; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the source!', 'color: #EEEEEE; font-size: 14px;');
console.log('%cBuilt with HTML, CSS, and vanilla JavaScript', 'color: #999; font-size: 12px;');