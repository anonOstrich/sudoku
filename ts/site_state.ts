import { SudokuInterface } from './game_interface';
import loadWithAnimation from './loader';
import { createNewSudoku, difficulty } from './sudoku_creator';
import {
  getElementWithId,
  getElementsWithClassName,
} from './utils/dom_wrangling';

const gameMenuBtn = getElementWithId('game-menu-btn', 'BUTTON');
const gameMenuDiv = getElementWithId('game-menu-container', 'DIV');
const gameMenuBg = getElementWithId('game-menu-bg', 'DIV');

const gameOptionsBtn = getElementWithId('game-options-btn', 'BUTTON');
const gameOptionsBg = getElementWithId('game-options__background', 'DIV');
const gameOptionsContainerEl = getElementsWithClassName(
  'game-options__container',
  'DIV'
)[0];

const startEasyBtn = getElementWithId('start-easy', 'BUTTON');
const startMediumBtn = getElementWithId('start-medium', 'BUTTON');
const startHardBtn = getElementWithId('start-hard', 'BUTTON');
const startExpertBtn = getElementWithId('start-expert', 'BUTTON');

function showElement(el: HTMLElement) {
  el.className = el.className.replace('invisible', 'visible');
}

function hideElement(el: HTMLElement) {
  if (!el.className.includes('invisible')) {
    el.className = el.className.replace('visible', 'invisible');
  }
}

function toggleVisibility(el: HTMLElement) {
  if (el.className.includes('invisible')) {
    showElement(el);
  } else if (el.className.includes('visible')) {
    hideElement(el);
  }
}

function setupMenuVisibility() {
  gameMenuBtn.onclick = function visibilityToggleCreator() {
    toggleVisibility(gameMenuDiv);
    hideElement(gameOptionsContainerEl);
  };

  // TODO: setup an invisible filter outside the modal, add listener to hide the menu by clicking it.
  gameMenuBg.onclick = function visibilityToggleCreator() {
    toggleVisibility(gameMenuDiv);
  };
}

function newGameHandlerCreator(diff: difficulty, gameUI: SudokuInterface) {
  return async function newGameHandler() {
    hideElement(gameMenuDiv);
    const gameCreationTask = async () => {
      const game = await createNewSudoku(diff);
      gameUI.setGame(game);
    };
    await loadWithAnimation(gameCreationTask);
  };
}

function setupNewGames(gameUI: SudokuInterface) {
  startEasyBtn.onclick = newGameHandlerCreator('easy', gameUI);
  startMediumBtn.onclick = newGameHandlerCreator('medium', gameUI);
  startHardBtn.onclick = newGameHandlerCreator('hard', gameUI);
  startExpertBtn.onclick = newGameHandlerCreator('expert', gameUI);
}

function setupOptionsVisibility() {
  gameOptionsBtn.onclick = () => {
    toggleVisibility(gameOptionsContainerEl);
    hideElement(gameMenuDiv);
  };
  gameOptionsBg.onclick = () => hideElement(gameOptionsContainerEl);
}

export function setupMenus(gameUI: SudokuInterface) {
  setupMenuVisibility();
  setupOptionsVisibility();
  setupNewGames(gameUI);
}
