fetch('project_descriptions/projects.json')
  .then(res => res.json())
  .then(data => {
    const projectList   = document.getElementById('project-list');
    const infoContainer = document.getElementById('project-info-container');

    // Определяем начальный индекс по хэшу
    const currentHash = window.location.hash;
    let initialIndex = data.findIndex(p => p.hash === currentHash);
    if (initialIndex === -1) initialIndex = 0;

    // Рендерим карточки и контент
    const mdPromises = data.map((project, idx) => {
      const isActive = idx === initialIndex;
      const projectHash = project.hash;

      // 1) Карточка
      const cardHTML = `
        <div class="project ${isActive ? 'active' : ''}" 
             data-project="${project.id}" 
             data-hash="${projectHash}">
          <div class="project-up-wrapper">
            <div class="project-up">
              <div class="project-name">${project.title}</div>
              <div class="project-disc">${project.description}</div>
            </div>
            <button class="button-invis">Смотреть</button>
          </div>
          <div class="project-down-wrapper">
            <div class="project-down">
              <div class="project-date">${project.period}</div>
              <div class="project-position">${project.position}</div>
            </div>
            <div class="logo-placeholder">
              <img src="${project.logo}" alt="${project.title} logo">
            </div>
          </div>
        </div>
      `;
      projectList.insertAdjacentHTML('beforeend', cardHTML);

      // 2) Контент из Markdown
      return fetch(project.markdown)
        .then(r => r.text())
        .then(md => {
          const html = marked.parse(md);

          const imgs = (project.images || [])
            .map(src => `<img src="${src}" class="project-image" alt="" loading="lazy">`)
            .join('');

          const skillArray = Array.isArray(project.skill) ? project.skill : [];

          const skillsList = `
            <ul class="skill-list">
              ${skillArray
                .map(line => `<li>${line}</li>`)
                .join('')}
            </ul>`;

          const infoHTML = `
            <div class="project-info ${isActive ? 'active' : ''}" id="${project.id}">
              <div class="project-images">${imgs}</div>
              <div class="project-description">
                <div class="about">${html}</div>
                <div class="skill">
                  <b>Компетенции:</b>
                  ${skillsList}
                </div>
              </div>
            </div>
          `;
          infoContainer.insertAdjacentHTML('beforeend', infoHTML);
        });
    });

    // После загрузки всех markdown-файлов
    Promise.all(mdPromises).then(() => {
      const items = document.querySelectorAll('.project');
      const infos = document.querySelectorAll('.project-info');

      function activateById(id) {
        items.forEach(el => el.classList.remove('active'));
        infos.forEach(el => el.classList.remove('active'));
        document.querySelector(`.project[data-project="${id}"]`)
          ?.classList.add('active');
        document.getElementById(id)
          ?.classList.add('active');
      }

      items.forEach(item => {
        item.addEventListener('click', () => {
          const pid = item.dataset.project;
          const phash = item.dataset.hash;
          history.replaceState(null, '', phash);
          activateById(pid);
        });
      });

      window.addEventListener('hashchange', () => {
        const newHash = window.location.hash;
        const found = data.find(p => p.hash === newHash);
        if (found) activateById(found.id);
      });
    });
  })
  .catch(err => console.error(err));



// fetch('projects/index.json')
//   .then(res => res.json())
//   .then(fileList => {
//     // Загружаем все JSON-файлы проектов
//     return Promise.all(fileList.map(path =>
//       fetch(path).then(res => res.json())
//     ));
//   })
//   .then(projects => {
//     const projectList   = document.getElementById('project-list');
//     const infoContainer = document.getElementById('project-info-container');

//     const currentHash = window.location.hash;
//     let initialIndex = projects.findIndex(p => p.hash === currentHash);
//     if (initialIndex === -1) initialIndex = 0;

//     projects.forEach((project, idx) => {
//       const isActive = idx === initialIndex;

//       // --- Карточка проекта в списке ---
//       const cardHTML = `
//         <div class="project ${isActive ? 'active' : ''}" 
//              data-project="${project.id}" 
//              data-hash="${project.hash}">
//           <div class="project-up-wrapper">
//             <div class="project-up">
//               <div class="project-name">${project.title}</div>
//               <div class="project-disc">${project.description}</div>
//             </div>
//             <button class="button-invis">Смотреть</button>
//           </div>
//           <div class="project-down-wrapper">
//             <div class="project-down">
//               <div class="project-date">${project.period}</div>
//               <div class="project-position">${project.position}</div>
//             </div>
//             <div class="logo-placeholder">
//               <img src="${project.logo}" alt="${project.title} logo">
//             </div>
//           </div>
//         </div>
//       `;
//       projectList.insertAdjacentHTML('beforeend', cardHTML);

//       // --- Отладка изображений ---
//       console.log(`Проект: ${project.title}`);
//       console.log('Картинки:', project.images);

//       // --- Генерация блока изображений ---
//       const imgs = (project.images || [])
//         .map(src => `<img src="${src}" class="project-image" alt="">`)
//         .join('');

//       // --- Обработка skill: строка с <br> превращается в массив ---
//       const skillItems = (project.skill || '')
//         .split('<br>')
//         .map(line => `<li>${line.trim()}</li>`)
//         .join('');

//       const skillsList = `
//         <ul class="skill-list">
//           ${skillItems}
//         </ul>`;

//       // --- Основной блок информации о проекте ---
//       const infoHTML = `
//         <div class="project-info ${isActive ? 'active' : ''}" id="${project.id}">
//           <div class="project-images">${imgs}</div>
//           <div class="project-description">
//             ${project.about ? `<div class="about">${project.about}</div>` : ''}
//             <div class="skill">
//               <b>Компетенции:</b>
//               ${skillsList}
//             </div>
//           </div>
//         </div>
//       `;
//       infoContainer.insertAdjacentHTML('beforeend', infoHTML);
//     });

//     // --- Переключение активного проекта ---
//     const items = document.querySelectorAll('.project');
//     const infos = document.querySelectorAll('.project-info');

//     function activateById(id) {
//       items.forEach(el => el.classList.remove('active'));
//       infos.forEach(el => el.classList.remove('active'));
//       document.querySelector(`.project[data-project="${id}"]`)?.classList.add('active');
//       document.getElementById(id)?.classList.add('active');
//     }

//     // --- Обработчики кликов по карточкам ---
//     items.forEach(item => {
//       item.addEventListener('click', () => {
//         const pid = item.dataset.project;
//         const phash = item.dataset.hash;
//         history.replaceState(null, '', phash);
//         activateById(pid);
//       });
//     });

//     // --- Обработка смены хэша в адресе ---
//     window.addEventListener('hashchange', () => {
//       const newHash = window.location.hash;
//       const found = projects.find(p => p.hash === newHash);
//       if (found) activateById(found.id);
//     });
//   })
//   .catch(err => console.error('Ошибка загрузки проектов:', err));