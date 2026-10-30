/* ========================================
   MAIN JAVASCRIPT - FINAL PRODUCTION VERSION
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Portfolio Ultimate Version Loaded Successfully!');
  
  // Initialize all components
  initNavigation();
  initSmoothScroll();
  initScrollAnimations();
  initProjectModal();
  initCustomCursor();
  initSkillsAnimation();
  initContactForm();
  initBackToTop();
  updateFooterYear();
  initHeroTilt();
  initTypingEffect();
  initLightbox();
  initMagneticButtons();
  initParallaxScroll();
  initCardTilt();
  initLiveTimeWidget();
  initActiveNavIndicator();
});

/* ========================================
   1. NAVIGATION & ACTIVE INDICATOR
   ======================================== */
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar-floating');
  const backToTopBtn = document.getElementById('backToTop');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      navbar.classList.toggle('scrolled', scrollY > 50);
      if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollY > 500);
    }, { passive: true });
  }
}

function initActiveNavIndicator() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY; // Fixed: menggunakan window.scrollY
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        }
      }
    });
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Hemat resource setelah animasi selesai
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ========================================
   2. MODALS & LIGHTBOX
   ======================================== */
function initProjectModal() {
  const triggers = document.querySelectorAll('[data-modal-target]');
  const closeBtns = document.querySelectorAll('.modal-close');
  const overlays = document.querySelectorAll('.modal-overlay');

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) { 
      modal.classList.add('active'); 
      document.body.style.overflow = 'hidden'; 
    }
  };
  
  const closeModal = (modal) => {
    if (modal) { 
      modal.classList.remove('active'); 
      document.body.style.overflow = ''; 
    }
  };

  triggers.forEach(t => t.addEventListener('click', e => { 
    e.preventDefault(); 
    openModal(t.getAttribute('data-modal-target')); 
  }));
  
  closeBtns.forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay'))));
  
  overlays.forEach(ov => ov.addEventListener('click', e => { 
    if (e.target === ov) closeModal(ov); 
  }));
  
  document.addEventListener('keydown', e => { 
    if (e.key === 'Escape') {
      overlays.forEach(ov => { if (ov.classList.contains('active')) closeModal(ov); });
    }
  });
}

function initLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  if (!lightbox) return;
  
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  
  document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      const card = img.closest('.achievement-card');
      if (card) {
        const title = card.querySelector('.achievement-title').textContent;
        const year = card.querySelector('.achievement-year').textContent;
        lightboxCaption.textContent = `${year} - ${title}`;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => { 
    lightbox.classList.remove('active'); 
    document.body.style.overflow = ''; 
  };
  
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  
  document.addEventListener('keydown', e => { 
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); 
  });
}

/* ========================================
   3. INTERACTIONS (Cursor, Tilt, Magnetic, Typing)
   ======================================== */
function initCustomCursor() {
  if (window.matchMedia("(hover: none)").matches) return;
  const dot = document.querySelector('[data-cursor-dot]');
  const outline = document.querySelector('[data-cursor-outline]');
  if (!dot || !outline) return;

  let mx = 0, my = 0, ox = 0, oy = 0;
  
  const updateCursor = () => {
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    
    ox += (mx - ox) * 0.15;
    oy += (my - oy) * 0.15;
    outline.style.left = ox + 'px';
    outline.style.top = oy + 'px';
    
    requestAnimationFrame(updateCursor);
  };
  
  window.addEventListener('mousemove', e => { 
    mx = e.clientX; 
    my = e.clientY; 
  });
  
  updateCursor();

  const hoverElements = document.querySelectorAll('a, button, .project-card, .stat-card, .skill-item, .contact-item, .lightbox-trigger, .tilt-enabled');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => { 
      dot.classList.add('hovering'); 
      outline.classList.add('hovering'); 
    });
    el.addEventListener('mouseleave', () => { 
      dot.classList.remove('hovering'); 
      outline.classList.remove('hovering'); 
    });
  });
}

function initHeroTilt() {
  const wrapper = document.getElementById('heroTiltWrapper');
  const card = document.getElementById('heroTiltCard');
  if (!wrapper || !card || window.matchMedia("(hover: none)").matches) return;

  wrapper.addEventListener('mousemove', e => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    const cx = rect.width / 2; 
    const cy = rect.height / 2;
    card.style.transform = `rotateX(${((y - cy) / cy) * -15}deg) rotateY(${((x - cx) / cx) * 15}deg)`;
  });
  
  wrapper.addEventListener('mouseleave', () => { 
    card.style.transform = `rotateX(0) rotateY(0)`; 
  });
}

function initCardTilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  const cards = document.querySelectorAll('.tilt-enabled');
  
  cards.forEach(card => {
    if (!card.querySelector('.tilt-inner')) {
      const inner = document.createElement('div');
      inner.className = 'tilt-inner';
      inner.style.height = '100%';
      while (card.firstChild) inner.appendChild(card.firstChild);
      card.appendChild(inner);
    }

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -6;
      const ry = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    });
  });
}

function initTypingEffect() {
  const textElement = document.querySelector('.typing-text');
  if (!textElement) return;
  
  const words = ["Mahasiswa Sistem Informasi", "Rajin Sholat", "Hafal Nadhoman Kitab Aqidatul Awam"];
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  const type = () => {
    const currentWord = words[wordIndex];
    textElement.textContent = isDeleting ? currentWord.substring(0, charIndex--) : currentWord.substring(0, charIndex++);
    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) { 
      isDeleting = true; 
      speed = 2000; 
    } else if (isDeleting && charIndex === 0) { 
      isDeleting = false; 
      wordIndex = (wordIndex + 1) % words.length; 
      speed = 500; 
    }
    setTimeout(type, speed);
  };
  setTimeout(type, 1000);
}

function initMagneticButtons() {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll('.btn, .project-link-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.3}px, ${(e.clientY - rect.top - rect.height / 2) * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { 
      btn.style.transform = `translate(0, 0)`; 
    });
  });
}

/* ========================================
   4. UTILITIES (Skills, Form, Footer, Time, Parallax)
   ======================================== */
function initSkillsAnimation() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const p = entry.target.querySelector('.skill-progress');
        setTimeout(() => { p.style.width = p.getAttribute('data-progress') + '%'; }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.skill-item').forEach(i => obs.observe(i));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('.btn-submit');
  
  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled = true;
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loading').style.display = 'inline';
    status.style.display = 'none';
    
    // Simulasi pengiriman (bisa diganti dengan Netlify Forms nanti)
    await new Promise(r => setTimeout(r, 1500));
    
    status.textContent = '✅ Pesan berhasil dikirim! Saya akan segera membalas.';
    status.className = 'form-status success';
    form.reset();
    
    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'inline';
    btn.querySelector('.btn-loading').style.display = 'none';
  });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (btn) {
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

function updateFooterYear() {
  const y = document.getElementById('currentYear');
  if (y) y.textContent = new Date().getFullYear();
}

function initLiveTimeWidget() {
  const timeElement = document.getElementById('liveTime');
  if (!timeElement) return;
  
  const updateTime = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false };
    timeElement.textContent = now.toLocaleTimeString('id-ID', options) + ' WIB';
  };
  
  updateTime();
  setInterval(updateTime, 1000 * 60); // Update setiap 1 menit
}

function initParallaxScroll() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length === 0) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        parallaxElements.forEach(el => {
          const speed = el.getAttribute('data-parallax');
          if (scrolled < window.innerHeight * 1.5) { // Optimasi: hanya jalankan jika dekat viewport
            el.style.transform = `translateY(${scrolled * (speed / 100)}px)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}