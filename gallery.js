// gallery.js
document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

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
          <img src="${src}" class="img" alt="${name}">
          <div class="img-desc">
            <div class="img-comp">${item.comp}</div>
            <div class="img-work">${item.work}</div>
          </div>
        `;
        galleryGrid.append(card);
      });
    })
    .catch(err => {
      console.error('Ошибка при загрузке галереи:', err);
    });
});