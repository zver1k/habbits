'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

/* page */
const page = {
  menu: document.querySelector('.panel__category-list'),
  header: {
    h1: document.querySelector('.main__header-h1'),
    progressPercent: document.querySelector('.main__progress-percent'),
    progressFillBar: document.querySelector('.main__progress-bar-fill')
  },
  content: {
    day: document.querySelector('.content__day'),
    title: document.querySelector('.content__title'),
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
  page.content.title.innerText = activeHabbit.days;
  console.log(activeHabbit.days)
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderContent(activeHabbit);
}

/* init */
(() => {
  loadData();
  rerender(habbits[0].id)
})();

