export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

export function initMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function setMenuOpen(open) {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  }

  menuToggle?.addEventListener('click', () => setMenuOpen(true));
  menuClose?.addEventListener('click', () => setMenuOpen(false));
  mobileLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
}

export function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  function updateBackToTop() {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', updateBackToTop);
  updateBackToTop();
}

export function initReveals() {
  const revealed = document.querySelectorAll('.reveal, .reveal-stagger');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealed.forEach((section) => observer.observe(section));
}

export function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.addEventListener('pointermove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

export function initTypewriter() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const target = document.querySelector('.typewriter-text');
  if (!target) return;

  const words = ['GRAPHIC Design,', 'Branding identity'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function updateText() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      target.textContent = currentWord.slice(0, charIndex + 1);
      charIndex += 1;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(updateText, 1400);
        return;
      }
    } else {
      target.textContent = currentWord.slice(0, charIndex - 1);
      charIndex -= 1;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(updateText, 400);
        return;
      }
    }

    setTimeout(updateText, isDeleting ? 55 : 90);
  }

  updateText();
}
