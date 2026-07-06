import { showToast } from './ui.js';

export function initForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    if (!name || !email) {
      event.preventDefault();
      showToast('Please enter your name and email.');
    } else {
      showToast('Your message is sending. Check email soon.');
    }
  });
}
