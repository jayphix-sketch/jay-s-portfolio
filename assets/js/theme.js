const STORAGE_KEY = 'jayphix-theme';

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    setTheme(saved);
    return;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}
