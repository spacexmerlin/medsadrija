// YouTube-Einbettungen: Vorschaubild zuerst, das Video (youtube-nocookie) lädt erst beim Klick.
// Nutzung: <div class="yt-embed" data-id="VIDEO_ID" data-title="Titel" data-meta="Untertitel"></div>
(function () {
  document.querySelectorAll('.yt-embed').forEach((el) => {
    const id = el.dataset.id;
    const title = el.dataset.title || 'YouTube-Video';
    const meta = el.dataset.meta || '';
    if (!id) return;

    el.innerHTML =
      '<button class="yt-embed__poster" aria-label="Video abspielen: ' + title.replace(/"/g, '&quot;') + '">' +
        '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy">' +
        '<span class="yt-embed__play"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 5.5V18.5L19 12L8 5.5Z" fill="currentColor"/></svg></span>' +
      '</button>' +
      '<div class="yt-embed__meta"><strong></strong><span></span></div>';
    el.querySelector('strong').textContent = title;
    el.querySelector('.yt-embed__meta span').textContent = meta;

    el.querySelector('.yt-embed__poster').addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.title = title;
      frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      el.querySelector('.yt-embed__poster').replaceWith(frame);
    });
  });
})();
