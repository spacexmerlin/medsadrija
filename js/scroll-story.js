document.addEventListener('DOMContentLoaded', () => {
  const railItems = document.querySelectorAll('.story-rail__item');
  if (!railItems.length || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const setActive = (id) => {
    railItems.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.storyTarget === id);
    });
  };

  railItems.forEach((item) => {
    const section = document.getElementById(item.dataset.storyTarget);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) setActive(item.dataset.storyTarget);
      },
    });
  });
});
