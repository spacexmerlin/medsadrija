// Startseite: der Platzhalter im Hero wechselt durch die Bilder aus Bilder/web.
// Herz = Favorit (nur im Browser gespeichert), Pfeile/Punkte = selbst blättern, Hover = Pause.
(function () {
  const root = document.querySelector('[data-hero-slider]');
  if (!root) return;

  const COUNT = 17;
  const INTERVAL = 4500;
  const KEY = 'medsadrija-favoriten-' + (root.dataset.heroSlider || 'home');
  const pad = (n) => String(n).padStart(2, '0');
  const src = (n) => 'Bilder/web/bild-' + pad(n) + '.jpg';
  const HEART = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 20.5C12 20.5 3.5 15 3.5 9A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 2c0 6-8.5 11.5-8.5 11.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';

  let favs;
  try { favs = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { favs = new Set(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify([...favs])); } catch (e) { /* egal */ } };

  let slides = '';
  for (let n = 1; n <= COUNT; n++) {
    slides += '<img class="hero-slider__img" src="' + src(n) + '" alt="Bild ' + n + '"' + (n > 1 ? ' loading="lazy"' : '') + ' decoding="async">';
  }
  root.innerHTML =
    slides +
    '<div class="hero-slider__shade"></div>' +
    '<div class="hero-slider__ui">' +
      '<span class="hero-slider__count"></span>' +
      '<div class="hero-slider__controls">' +
        '<button class="hero-slider__btn" data-act="prev" aria-label="Vorheriges Bild">&#8249;</button>' +
        '<button class="hero-slider__btn" data-act="next" aria-label="Nächstes Bild">&#8250;</button>' +
        '<button class="hero-slider__btn hero-slider__fav" data-act="fav" aria-label="Als Favorit markieren" aria-pressed="false">' + HEART + '</button>' +
      '</div>' +
    '</div>' +
    '<p class="hero-slider__favs" aria-live="polite"></p>';

  const imgs = root.querySelectorAll('.hero-slider__img');
  const count = root.querySelector('.hero-slider__count');
  const favBtn = root.querySelector('.hero-slider__fav');
  const favList = root.querySelector('.hero-slider__favs');
  let i = 0;
  let timer = null;

  const render = () => {
    imgs.forEach((img, k) => img.classList.toggle('is-active', k === i));
    count.textContent = pad(i + 1) + ' / ' + COUNT;
    const on = favs.has(i + 1);
    favBtn.classList.toggle('is-on', on);
    favBtn.setAttribute('aria-pressed', String(on));
    const list = [...favs].sort((a, b) => a - b);
    favList.textContent = list.length ? 'Favoriten: ' + list.map((n) => 'Bild ' + n).join(', ') : '';
  };
  const go = (d) => { i = (i + d + COUNT) % COUNT; render(); };
  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stop();
    timer = setInterval(() => go(1), INTERVAL);
  };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    if (act === 'prev') go(-1);
    if (act === 'next') go(1);
    if (act === 'fav') {
      const n = i + 1;
      if (favs.has(n)) favs.delete(n); else favs.add(n);
      save();
      render();
    }
    start(); // Intervall nach manueller Aktion neu starten
  });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  render();
  start();
})();
