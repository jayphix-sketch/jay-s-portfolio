import { loadTheme, initTheme } from './theme.js';
import {
  initMobileMenu,
  initBackToTop,
  initReveals,
  initCursorGlow,
  initTypewriter,
} from './ui.js';
import { initImageModal, initProjectFilters, initProjectSliders } from './projects.js';
import { initForm } from './form.js';

window.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  initTheme();
  initMobileMenu();
  initBackToTop();
  initReveals();
  initCursorGlow();
  initTypewriter();
  initForm();
  initProjectFilters();
  initProjectSliders();
  initImageModal();
});
