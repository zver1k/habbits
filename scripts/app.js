'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';

/* page */
const page = {
  menu: document.querySelector('.panel__category-list'),
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
  if (!activeHabbit) {
    return;
  }
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

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
}

/* init */
(() => {
  loadData();
  rerender(habbits[0].id)
})();

