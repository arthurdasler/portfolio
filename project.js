// fetch('project_descriptions/projects.json')
//   .then(res => res.json())
//   .then(data => {
//     const projectList   = document.getElementById('project-list');
//     const infoContainer = document.getElementById('project-info-container');

//     // Определяем начальный индекс по хэшу
//     const currentHash = window.location.hash;
//     let initialIndex = data.findIndex(p => p.hash === currentHash);
//     if (initialIndex === -1) initialIndex = 0;

//     // Рендерим карточки и контент
//     const mdPromises = data.map((project, idx) => {
//       const isActive = idx === initialIndex;
//       const projectHash = project.hash;

//       // 1) Карточка (без <a>🔗)
//       const cardHTML = `
//         <div class="project ${isActive?'active':''}" 
//              data-project="${project.id}" 
//              data-hash="${projectHash}">
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

//       // 2) Контент из Markdown
//       return fetch(project.markdown)
//         .then(r => r.text())
//         .then(md => {
//           const html = marked.parse(md);
//           const imgs = (project.images||[])
//             .map(src => `<img src="${src}" class="project-image" alt="">`)
//             .join('');
//           const infoHTML = `
//             <div class="project-info ${isActive?'active':''}" id="${project.id}">
//               ${imgs}
//               <div class="project-description">
//                 <div class="about">${html}</div>
//                 <div class="skill">  <b>Компетенции:</b><br>${project.skill} </div>
//               </div>
              
//             </div>
//           `;
//           infoContainer.insertAdjacentHTML('beforeend', infoHTML);
//         });
//     });

//     Promise.all(mdPromises).then(() => {
//       const items = document.querySelectorAll('.project');
//       const infos = document.querySelectorAll('.project-info');

//       // Функция активации по id
//       function activateById(id) {
//         items.forEach(el => el.classList.remove('active'));
//         infos.forEach(el => el.classList.remove('active'));
//         document.querySelector(`.project[data-project="${id}"]`)
//           ?.classList.add('active');
//         document.getElementById(id)
//           ?.classList.add('active');
//       }

//       // Клик по карточке: обновляем хэш и активируем
//       items.forEach(item => {
//         item.addEventListener('click', () => {
//           const pid  = item.dataset.project;
//           const phash = item.dataset.hash;
//           history.replaceState(null, '', phash);
//           activateById(pid);
//         });
//       });

//       // Если хэш в адресной строке меняют вручную
//       window.addEventListener('hashchange', () => {
//         const newHash = window.location.hash;
//         const found = data.find(p => p.hash === newHash);
//         if (found) activateById(found.id);
//       });
//     });
//   })
//   .catch(err => console.error(err));


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
            .map(src => `<img src="${src}" class="project-image" alt="">`)
            .join('');

          // Преобразуем skill-строку в <ul><li>...</li></ul>
          const skillsList = `
            <ul class="skill-list">
              ${project.skill
                .split('<br>')
                .map(line => `<li>${line}</li>`)
                .join('')}
            </ul>`;

          const infoHTML = `
            <div class="project-info ${isActive ? 'active' : ''}" id="${project.id}">
              ${imgs}
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