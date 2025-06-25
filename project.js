fetch('projects.json')
  .then(res => res.json())
  .then(data => {
    const projectList = document.getElementById('project-list');
    const infoContainer = document.getElementById('project-info-container');

    const markdownPromises = [];

    data.forEach((project, index) => {
      // Левая карточка
      const projectHTML = `
        <div class="project ${index === 0 ? 'active' : ''}" data-project="${project.id}">
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
              <img src="${project.logo}" alt="${project.title} logo" />
            </div>
          </div>
        </div>
      `;
      projectList.insertAdjacentHTML('beforeend', projectHTML);

      // Добавим fetch markdown в список промисов
      const markdownPromise = fetch(project.markdown)
        .then(res => res.text())
        .then(md => {
          const html = marked.parse(md);
          const imagesHTML = project.images.map(src => `<img src="${src}" alt="" class="project-image">`).join('');
          const projectInfoHTML = `
            <div class="project-info ${index === 0 ? 'active' : ''}" id="${project.id}">
              ${imagesHTML}
              <div class="project-description">${html}</div>
            </div>
          `;
          infoContainer.insertAdjacentHTML('beforeend', projectInfoHTML);
        });

      markdownPromises.push(markdownPromise);
    });

    // Когда все markdown загружены
    Promise.all(markdownPromises).then(() => {
      // Вставим блок контактов в КОНЕЦ
      const contactsHTML = `
        <div class="contacts-mob">
          <a href="https://t.me/arthurborsokov" class="contact-link" target="_blank">Телеграм</a> • 
          <a href="https://instagram.com/arthurborsokov" class="contact-link" target="_blank">Нельзяграм</a> • 
          <a href="https://www.behance.net/arthurdasler" class="contact-link" target="_blank">Behance</a> <br>
          email: <a href="mailto:arthurdasler@gmail.com" class="contact-link">arthurdasler@gmail.com</a>
        </div>
      `;
      infoContainer.insertAdjacentHTML('beforeend', contactsHTML);

      // Подключаем логику кликов
      const projectItems = document.querySelectorAll('.project');
      const projectInfos = document.querySelectorAll('.project-info');

      projectItems.forEach(item => {
        item.addEventListener('click', () => {
          const projectId = item.dataset.project;

          projectItems.forEach(p => p.classList.remove('active'));
          projectInfos.forEach(i => i.classList.remove('active'));

          item.classList.add('active');
          document.getElementById(projectId)?.classList.add('active');
        });
      });
    });
  });