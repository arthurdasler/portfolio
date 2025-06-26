// gallery.js
document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  fetch('gallery/gallery.json')
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить gallery/gallery.json');
      return res.json();
    })
    .then(files => {
      files.forEach(filename => {
        const name = filename.replace(/\.[^/.]+$/, ''); // без расширения
        const src  = `gallery/${filename}`;

        const card = document.createElement('div');
        card.className = 'gallery-img';
        card.innerHTML = `
          <img src="${src}" class="img" alt="${name}">
          <div class="img-desc">
            <div class="img-comp">${name}</div>
            <div class="img-work">Описание работы для ${name}</div>
          </div>
        `;
        galleryGrid.append(card);
      });
    })
    .catch(err => {
      console.error('Ошибка при загрузке галереи:', err);
    });
});