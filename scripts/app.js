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

function tooglePopup() {
  const popup = document.querySelector('.cover');
  if (popup.classList.contains('cover__hidden')) {
    popup.classList.remove('cover__hidden');
  } else {
    popup.classList.add('cover__hidden');
  }
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
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

/* work with days*/
function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get('comment');
  form['comment'].classList.remove('error');
  if (!comment) {
    form['comment'].classList.add('error');
  }
  habbits = habbits.map(habbit => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }])
      }
    }
    return habbit;
  });
  saveData()
  form['comment'].value = '';
  rerender(globalActiveHabbitId);
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
  document.querySelector('.cover__field input[name="icon"]')
  const activeIcon = document.querySelector('.active')
  activeIcon.classList.remove('active')
  context.classList.add('active');
}


/* init */
(() => {
  loadData();
  rerender(habbits[0].id)
})();

