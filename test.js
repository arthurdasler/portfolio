fetch('desc/projects.md')
  .then(res => res.text())
  .then(mdFile => {
    const parts = mdFile.split(/^---\s*$/m).filter(Boolean); // делим по "---"
    const projects = [];

    for (let i = 0; i < parts.length; i += 2) {
      const front = parts[i];
      const content = parts[i + 1] || '';
      const parsed = matter(`---\n${front}\n---\n${content}`);
      projects.push({
        ...parsed.data,
        html: marked.parse(parsed.content)
      });
    }

    const projectList = document.getElementById('project-list');
    const infoContainer = document.getElementById('project-info-container');

    projects.forEach((project, index) => {
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
              <img src="${project.logo}" alt="${project.title}">
            </div>
          </div>
        </div>
      `;
      projectList.insertAdjacentHTML('beforeend', projectHTML);

      // Правая колонка
      const imagesHTML = (project.images || []).map(src => `<img src="${src}" class="project-image" alt="">`).join('');
      const projectInfoHTML = `
        <div class="project-info ${index === 0 ? 'active' : ''}" id="${project.id}">
          ${imagesHTML}
          <div class="project-description">${project.html}</div>
        </div>
      `;
      infoContainer.insertAdjacentHTML('beforeend', projectInfoHTML);
    });

    // Переключение
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
  })
  .catch(err => {
    console.error('Ошибка загрузки проекта:', err);
  });