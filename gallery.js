// document.addEventListener('DOMContentLoaded', () => {
//   const galleryGrid = document.querySelector('.gallery-grid');
//   if (!galleryGrid) return;

//   fetch('gallery/gallery.json')
//     .then(res => {
//       if (!res.ok) throw new Error('Не удалось загрузить gallery/gallery.json');
//       return res.json();
//     })
//     .then(items => {
//       items.forEach(item => {
//         const name = item.file.replace(/\.[^/.]+$/, '');
//         const src  = `gallery/${item.file}`;

//         const card = document.createElement('div');
//         card.className = 'gallery-img';
//         card.innerHTML = `
//           <img src="${src}" class="img" alt="${name}" loading="lazy">
//           <div class="img-desc">
//             <div class="img-comp">${item.comp}</div>
//             <div class="img-work">${item.work}</div>
//           </div>
//         `;
//         galleryGrid.append(card);
//       });
//     })
//     .catch(err => {
//       console.error('Ошибка при загрузке галереи:', err);
//     });
// });




document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  // 1) Подтягиваем данные галереи
  fetch('gallery/gallery.json')
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить gallery/gallery.json');
      return res.json();
    })
    .then(items => {
      items.forEach(item => {
        const name = item.file.replace(/\.[^/.]+$/, '');
        const src  = `gallery/${item.file}`;

        const card = document.createElement('div');
        card.className = 'gallery-img';
        card.innerHTML = `
          <img src="${src}" class="img" alt="${name}" loading="lazy">
          <div class="img-desc">
            <div class="img-comp">${item.comp ?? ''}</div>
            <div class="img-work">${item.work ?? ''}</div>
          </div>
        `;
        galleryGrid.append(card);
      });

      // 2) Инициализируем лайтбокс после рендера карточек
      initLightbox(galleryGrid);
    })
    .catch(err => {
      console.error('Ошибка при загрузке галереи:', err);
    });

  // === ЛАЙТБОКС ===
  function initLightbox(container) {
    // a) Стили (инжектим один раз)
    const style = document.createElement('style');
    style.textContent = `
      .lb-backdrop{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.92);z-index:9999}
      .lb-backdrop.lb-show{display:flex}
      .lb-inner{position:relative;max-width:92vw;max-height:92vh}
      .lb-img{max-width:92vw;max-height:80vh;display:block;margin:0 auto;box-shadow:0 8px 32px rgba(0,0,0,.6);border-radius:12px}
      .lb-caption{margin-top:12px;text-align:center;color:#fff;font:500 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial}
      .lb-btn{position:absolute;top:50%;transform:translateY(-50%);border:0;background:rgba(255,255,255,.08);backdrop-filter:blur(4px);color:#fff;cursor:pointer;font-size:28px;width:44px;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;user-select:none}
      .lb-btn:hover{background:rgba(255,255,255,.18)}
      .lb-prev{left:-56px}
      .lb-next{right:-56px}
      .lb-close{position:absolute;top:-56px;right:-8px;border:0;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;font-size:26px;width:42px;height:42px;border-radius:999px}
      @media (max-width:700px){
        .lb-prev{left:8px} .lb-next{right:8px}
        .lb-close{top:8px;right:8px}
      }
      /* опционально: курсор-лупа */
      .gallery-img img{cursor:zoom-in}
    `;
    document.head.appendChild(style);

    // b) Разметка оверлея
    const backdrop = document.createElement('div');
    backdrop.className = 'lb-backdrop';
    backdrop.innerHTML = `
      <div class="lb-inner" role="dialog" aria-modal="true">
        <img class="lb-img" alt="">
        <div class="lb-caption"></div>
        <button class="lb-btn lb-prev" aria-label="Previous">‹</button>
        <button class="lb-btn lb-next" aria-label="Next">›</button>
        <button class="lb-close" aria-label="Close">×</button>
      </div>
    `;
    document.body.appendChild(backdrop);

    const imgEl     = backdrop.querySelector('.lb-img');
    const captionEl = backdrop.querySelector('.lb-caption');
    const prevBtn   = backdrop.querySelector('.lb-prev');
    const nextBtn   = backdrop.querySelector('.lb-next');
    const closeBtn  = backdrop.querySelector('.lb-close');

    // c) Собираем список изображений по мере появления (live-выборка не нужна — возьмём с контейнера при открытии)
    let currentIndex = -1;
    let items = [];

    function refreshItems() {
      items = Array.from(container.querySelectorAll('.gallery-img img'));
    }

    function captionFor(img) {
      // Берём подпись из соседних .img-comp / .img-work или из alt
      const card = img.closest('.gallery-img');
      const comp = card?.querySelector('.img-comp')?.textContent?.trim();
      const work = card?.querySelector('.img-work')?.textContent?.trim();
      const parts = [comp, work].filter(Boolean);
      return parts.length ? parts.join(' — ') : (img.alt || '');
    }

    function srcFor(img) {
      // Если будет data-full — используем его, иначе src
      return img.dataset.full || img.src;
    }

    function show(index) {
      refreshItems();
      if (!items.length) return;

      // Нормализуем индекс по кругу
      currentIndex = (index + items.length) % items.length;

      const target = items[currentIndex];
      imgEl.src = srcFor(target);
      imgEl.alt = target.alt || '';
      captionEl.textContent = captionFor(target);

      backdrop.classList.add('lb-show');
      document.documentElement.style.overflow = 'hidden'; // lock scroll
    }

    function hide() {
      backdrop.classList.remove('lb-show');
      document.documentElement.style.overflow = '';
      imgEl.src = '';
      captionEl.textContent = '';
      currentIndex = -1;
    }

    function next() { if (items.length) show(currentIndex + 1); }
    function prev() { if (items.length) show(currentIndex - 1); }

    // d) Делегирование кликов по превью
    container.addEventListener('click', (e) => {
      const img = e.target.closest('.gallery-img img');
      if (!img) return;
      e.preventDefault();
      refreshItems();
      const idx = items.indexOf(img);
      if (idx !== -1) show(idx);
    });

    // e) Управление кнопками
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); hide(); });

    // f) Клик по фону — закрыть (но не по самой картинке/кнопкам)
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) hide();
    });

    // g) Клавиши
    document.addEventListener('keydown', (e) => {
      if (!backdrop.classList.contains('lb-show')) return;
      if (e.key === 'Escape') hide();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft')  prev();
    });

    // h) Простой свайп для мобильных
    let touchStartX = 0, touchEndX = 0;
    imgEl.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, {passive:true});
    imgEl.addEventListener('touchend',   (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const dx = touchEndX - touchStartX;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    }, {passive:true});
  }
});