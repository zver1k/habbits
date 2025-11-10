'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;

/* page */
const page = {
  menu: document.querySelector('.panel__category-list'),
  header: {
    h1: document.querySelector('.main__header-h1'),
    progressPercent: document.querySelector('.main__progress-percent'),
    progressFillBar: document.querySelector('.main__progress-bar-fill')
  },
  content: {
    daysContainer: document.querySelector('.main__content-list'),
    nextDay: document.querySelector('.content__day'),
  },
  popup: {
    index: document.getElementById('add-habbit-popup'),
    iconField: document.querySelector('.cover__field input[name="icon"]')
  }
}

// utils

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function togglePopup() {
  if (page.popup.index.classList.contains('cover__hidden')) {
    page.popup.index.classList.remove('cover__hidden');
  } else {
    page.popup.index.classList.add('cover__hidden');
  }
}

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = '';
  }
}

function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove('error');
    if (!fieldValue) {
      form[field].classList.add('error');
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

// render

function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement('button');
      element.setAttribute('menu-habbit-id', habbit.id);
      element.classList.add('panel__category-button');
      element.addEventListener('click', () => rerender(habbit.id));
      element.innerHTML = `<img class="panel__category-icon" src="./images/${habbit.icon}.svg" alt="${habbit.name}"/>`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add('active');
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add('active');
    } else {
      existed.classList.remove('active');
    }
  }
}

function rerenderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress = activeHabbit.days.length / activeHabbit.target > 1
    ? 100
    : activeHabbit.days.length / activeHabbit.target * 100
  page.header.progressPercent.innerText = progress.toFixed(0) + '%';
  page.header.progressFillBar.setAttribute(`style`, `width: ${progress}%`)
}

function rerenderContent(activeHabbit) {
  page.content.daysContainer.innerHTML = '';
  for (const index in activeHabbit.days) {
    const element = document.createElement('div')
    element.classList.add('main__content-item');
    element.innerHTML = `<div class="main__content-item">
      <div class="content__day">День ${Number(index) + 1}</div>
      <div class="content__title">${activeHabbit.days[index].comment}</div>
      <button 
      onclick="deleteDay(${index})"
      class="content__delete" 
      type="submit"
      >
        <img
        src="./images/delete.svg"
        alt="Удалить день ${Number(index) + 1}"
        >
      </button>
    </div>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + '#' + activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

/* work with days*/
function addDays(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['comment']);
  if (!data) {
    return;
  }
  habbits = habbits.map(habbit => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }])
      }
    }
    return habbit;
  });
  resetForm(event.target, ['comment']);
  rerender(globalActiveHabbitId);
  saveData();
}

/* delete work */
function deleteDay(index) {
  habbits = habbits.map(habbit => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days
      }
    }
    return habbit;
  })
  rerender(globalActiveHabbitId);
  saveData()
}

/* work icons */
function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector('.icon.icon_active');
  activeIcon.classList.remove('icon_active');
  context.classList.add('icon_active');
}

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: []
  });
  resetForm(event.target, ['name', 'target']);
  togglePopup();
  saveData();
  rerender(maxId + 1);
}


/* init */
(() => {
  loadData();
  const hashId = Number(document.location.hash.replace('#', ''));
  const urlHabbit = habbits.find(habbit => habbit.id === hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id)
  } else {
    rerender(habbits[0].id);
  }
})();
