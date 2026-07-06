export function initImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const imageButtons = document.querySelectorAll('.project-thumb');

  if (!modal || !modalImage || !modalTitle || !modalCategory) return;

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
  }

  imageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const imageUrl = button.dataset.full;
      const title = button.dataset.title;
      const category = button.dataset.category;
      if (!imageUrl) return;
      modalImage.src = imageUrl;
      modalTitle.textContent = title;
      modalCategory.textContent = category;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
}

export function initProjectSliders() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sliders = document.querySelectorAll('.project-slider');
  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.project-slide'));
    const controls = slider.querySelectorAll('.project-slider-btn');
    const count = slider.querySelector('.project-slider-count');
    let activeIndex = slides.findIndex((slide) => slide.classList.contains('active'));
    let timer;

    if (!slides.length) return;
    if (activeIndex < 0) activeIndex = 0;

    function updateSlide(nextIndex) {
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === activeIndex);
      });
      if (count) count.textContent = `${activeIndex + 1} / ${slides.length}`;
    }

    function startAutoPlay() {
      window.clearInterval(timer);
      if (slides.length <= 1) return;
      timer = window.setInterval(() => updateSlide(activeIndex + 1), 3600);
    }

    controls.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const direction = button.dataset.direction === 'prev' ? -1 : 1;
        updateSlide(activeIndex + direction);
        startAutoPlay();
      });
    });

    slider.addEventListener('mouseenter', () => window.clearInterval(timer));
    slider.addEventListener('mouseleave', startAutoPlay);
    updateSlide(activeIndex);
    startAutoPlay();
  });
}

export function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterButtons.length || !projectCards.length) return;

  function filterProjects(filter) {
    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const isVisible = filter === 'all' || category === filter;
      card.classList.toggle('is-hidden', !isVisible);
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      filterProjects(button.dataset.filter);
    });
  });

  filterProjects('all');
}
