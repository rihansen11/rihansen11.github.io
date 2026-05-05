// ===========================
// RIHANSEN PORTFOLIO — main.js
// ===========================

(function () {
  'use strict';

  // ---- Custom Cursor ----
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, .skill-card, .project-card, .design-item, .video-card').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---- Mobile Nav ----
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  hamburger?.addEventListener('click', () => mobileNav.classList.add('open'));
  mobileNavClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  // ---- Scroll reveal ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.07}s`;
    observer.observe(el);
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) link.classList.add('active');
        });
      }
    });
  });

  // ---- Typed role effect ----
  const roles = ['Frontend Developer', 'UI/UX Enthusiast', 'Creative Designer', 'WordPress Developer'];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-role');

  function typeRole() {
    if (!typedEl) return;
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { deleting = true; setTimeout(typeRole, 2200); return; }
    } else {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    setTimeout(typeRole, deleting ? 45 : 95);
  }
  typeRole();

  // ---- Counter animation ----
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const duration = 1600;
    (function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    })(performance.now());
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ---- Contact form ----
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
    btn.style.background = 'var(--accent-teal)';
    setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; form.reset(); }, 3000);
  });

  // ==================================
  // DESIGN GALLERY — TAB FILTERING
  // ==================================
  const designTabs = document.querySelectorAll('.design-tab');
  const designItems = document.querySelectorAll('.design-item');

  function filterDesign(filter) {
    designItems.forEach(item => {
      const cat = item.dataset.category;
      const match = filter === 'all' || cat === filter;
      if (match) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
    // Reflow the grid after filtering
    const grid = document.getElementById('design-grid');
    if (grid) {
      grid.style.display = 'none';
      requestAnimationFrame(() => { grid.style.display = ''; });
    }
  }

  designTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      designTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterDesign(tab.dataset.filter);
    });
  });

  // ==================================
  // LIGHTBOX
  // ==================================
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxCap   = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev  = document.getElementById('lightbox-prev');
  const lightboxNext  = document.getElementById('lightbox-next');

  // Build an index of visible (non-hidden) design items
  let lightboxItems = [];
  let currentLightboxIdx = 0;

  function buildLightboxItems() {
    lightboxItems = Array.from(document.querySelectorAll('.design-item:not(.hidden)'));
  }

  function openLightbox(idx) {
    buildLightboxItems();
    if (!lightboxItems.length) return;
    currentLightboxIdx = idx;
    const item = lightboxItems[currentLightboxIdx];
    const img = item.querySelector('img');
    lightboxImg.src = img ? img.src : '';
    lightboxImg.alt = img ? img.alt : '';
    lightboxCap.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  function stepLightbox(dir) {
    buildLightboxItems();
    currentLightboxIdx = (currentLightboxIdx + dir + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[currentLightboxIdx];
    const img = item.querySelector('img');
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img ? img.src : '';
      lightboxImg.alt = img ? img.alt : '';
      lightboxCap.textContent = item.dataset.caption || '';
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  lightboxImg.style.transition = 'opacity 0.15s ease';

  // Attach click to every design item
  designItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      buildLightboxItems();
      const visibleIdx = lightboxItems.indexOf(item);
      if (visibleIdx !== -1) openLightbox(visibleIdx);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => stepLightbox(-1));
  lightboxNext?.addEventListener('click', () => stepLightbox(1));

  // Click backdrop to close
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });

  // ==================================
  // VIDEO PLACEHOLDERS
  // Hide placeholder div when video src resolves
  // ==================================
  document.querySelectorAll('.video-wrap').forEach(wrap => {
    const video = wrap.querySelector('video');
    const placeholder = wrap.querySelector('.video-placeholder');
    if (!video || !placeholder) return;

    video.addEventListener('loadeddata', () => {
      placeholder.style.display = 'none';
    });

    video.addEventListener('error', () => {
      // Keep placeholder visible if video fails to load
      placeholder.style.display = '';
    });
  });

  // ==================================
  // FIELD ASSIGNMENTS — HORIZONTAL SLIDER
  // ==================================
  (function () {
    const track    = document.getElementById('fieldTrack');
    const prevBtn  = document.getElementById('fieldPrev');
    const nextBtn  = document.getElementById('fieldNext');
    const progress = document.getElementById('fieldProgress');
    const counter  = document.getElementById('fieldCounter');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.field-card'));
    const total = cards.length;
    let current = 0;

    function getVisible() {
      const w = track.parentElement.offsetWidth;
      if (w < 640) return 1;
      if (w < 960) return 2;
      return 3;
    }

    function getCardWidth() {
      const visible = getVisible();
      const gap = 24;
      return (track.parentElement.offsetWidth - gap * (visible - 1)) / visible;
    }

    function maxIndex() {
      return Math.max(0, total - getVisible());
    }

    function update(animate) {
      if (animate === false) track.style.transition = 'none';
      else track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

      const cardW = getCardWidth();
      const gap = 24;
      track.style.transform = `translateX(-${current * (cardW + gap)}px)`;

      const pct = total <= getVisible()
        ? 100
        : (current / maxIndex()) * (100 - (getVisible() / total * 100)) + (getVisible() / total * 100);
      progress.style.width = Math.min(100, pct) + '%';

      const last = Math.min(current + getVisible(), total);
      counter.textContent = `${current + 1}–${last} / ${total}`;

      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= maxIndex();
    }

    prevBtn.addEventListener('click', () => { if (current > 0) { current--; update(); } });
    nextBtn.addEventListener('click', () => { if (current < maxIndex()) { current++; update(); } });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        current = Math.min(current, maxIndex());
        update(false);
        requestAnimationFrame(() => { track.style.transition = ''; update(); });
      }, 100);
    });

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0 && current < maxIndex()) { current++; update(); }
        else if (diff < 0 && current > 0) { current--; update(); }
      }
    });

    cards.forEach(card => {
      card.addEventListener('mouseenter', () => { const f = document.querySelector('.cursor-follower'); if (f) f.classList.add('hovered'); });
      card.addEventListener('mouseleave', () => { const f = document.querySelector('.cursor-follower'); if (f) f.classList.remove('hovered'); });
    });

    update(false);
  })();

})();