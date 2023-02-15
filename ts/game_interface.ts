import { isCellValue, isElementWithTag } from './utils/type_checkers';
import { CellValue } from './logic/logic';
import { SudokuGame } from './logic/sudoku_game';
import {
  getElementWithId,
  getElementsWithClassName,
} from './utils/dom_wrangling';
import { createInfoUpdater } from './dom_interface';

export interface UIDOMElements {
  sudokuCells: HTMLElement[];
  controlGridCells: HTMLElement[];
  textDisplayElement: HTMLParagraphElement;
  undoButton: HTMLButtonElement;
  redoButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
}

/*
For forwarding inputs to the game and for displaying the game state changes in the UI (i.e. DOM)
*/
export class SudokuInterface {
  game: SudokuGame | null;

  private sudokuCells: HTMLElement[];
  private controlGridCells: HTMLElement[];

  private undoButton: HTMLButtonElement;
  private redoButton: HTMLButtonElement;
  private resetButton: HTMLButtonElement;

  private updateInfo: (text: string) => void;

  constructor(uiElements: UIDOMElements, game: SudokuGame | null) {
    this.game = game;

    this.undoButton = uiElements.undoButton;
    this.redoButton = uiElements.redoButton;
    this.resetButton = uiElements.resetButton;

    this.sudokuCells = uiElements.sudokuCells;
    this.controlGridCells = uiElements.controlGridCells;
    this.updateInfo = createInfoUpdater(uiElements.textDisplayElement);

    this.attachEventListeners();
    if (game != null) {
      this.setAddedElementStyles();
    }
  }

  public setGame(game: SudokuGame) {
    this.game = game;
    this.setAddedElementStyles();
    this.drawWholeBoard();
  }

  private setAddedElementStyles() {
    if (this.game == null) {
      throw new Error('Not callable with null board');
      this.updateInfo(`Tried to initialize with an empty game :(`);
    }
    this.sudokuCells.forEach((el, idx) => {
      if (!this.game?.isOriginalValue(idx)) {
        el.classList.add('content__cell--added');
      }
    });
  }

  private attachEventListeners() {
    // CONTROL BUTTONS, OUTSIDE OF THE SUDOKU BOARD

    const buttons = this.controlGridCells;

    buttons.forEach((button) => {
      const buttonValue =
        button.innerText === 'X' ? null : Number(button.innerText);

      button.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      button.addEventListener('mouseup', (e) => {
        const active = document.activeElement;
        if (
          active !== null &&
          isElementWithTag(active, 'BUTTON') &&
          active.classList.contains('content__cell')
        ) {
          if (isCellValue(buttonValue)) {
            const activeIdx = this.sudokuCells.findIndex((e) => e === active);
            this.insertValue(activeIdx, buttonValue);
          }
        }
      });
    });

    // THE CELLS OF THE BOARD ITSELF
    const cells = this.sudokuCells;
    for (let i = 0; i < cells.length; i++) {
      // Without this the cell doesn't remain active on iOS browsers.... xD
      cells[i].onclick = () => {
        cells[i].focus();
      };

      cells[i].addEventListener('keydown', (event: KeyboardEventInit) => {
        this.updateInfo(`keydown! ${event.code}`);
        if (
          [
            'Digit1',
            'Digit2',
            'Digit3',
            'Digit4',
            'Digit5',
            'Digit6',
            'Digit7',
            'Digit8',
            'Digit9',
            'Numpad1',
            'Numpad2',
            'Numpad3',
            'Numpad4',
            'Numpad5',
            'Numpad6',
            'Numpad7',
            'Numpad8',
            'Numpad9',
          ].includes(event.code!)
        ) {
          const char = event.code!.charAt(5);
          const conversion = char === '' ? null : Number(char);
          if (isCellValue(conversion)) {
            this.insertValue(i, conversion);
          }
        }
        if (['Backspace', 'Space', 'Delete'].includes(event.code!)) {
          this.insertValue(i, null);
        }
        this.changeFocusWithArrows(i, event);
      });
    }

    this.undoButton.addEventListener('click', () => {
      this.undo();
    });

    this.redoButton.addEventListener('click', () => {
      this.redo();
    });

    // And RESET (could also be placed better)
    this.resetButton.addEventListener('click', () => {
      this.reset();
    });
  }

  private changeFocusWithArrows(idx: number, event: KeyboardEventInit) {
    if (
      ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code!)
    ) {
      let newIdx: number | null = null;
      switch (event.code!) {
        case 'ArrowUp':
          if (idx > 8) {
            newIdx = idx - 9;
          }
          break;
        case 'ArrowDown':
          if (idx < 72) {
            newIdx = idx + 9;
          }
          break;
        case 'ArrowLeft':
          if (idx % 9 !== 0) {
            newIdx = idx - 1;
          }
          break;
        case 'ArrowRight':
          if (idx % 9 !== 8) {
            newIdx = idx + 1;
          }
          break;
      }

      if (newIdx !== null) {
        const el = this.sudokuCells[newIdx];

        if ('focus' in el) {
          (el as HTMLElement).focus();
        }
      }
    }
  }

  private updateEl(idx: number) {
    if (this.game == null) return;
    const rawValue = this.game.valueAt(idx);
    const displayedValue = rawValue === null ? '' : String(rawValue);
    this.sudokuCells[idx].textContent = displayedValue;
  }

  public insertValue(idx: number, value: CellValue) {
    if (this.game == null) return;

    const success = this.game.writeValue(idx, value);
    if (success) {
      this.updateEl(idx);
      if (this.game.gameIsFilled()) {
        if (this.game.gameIsWon()) {
          this.updateInfo('CONGRATULATIONS! You solved the sudoku');
        } else {
          this.updateInfo('OH NO! Something went awry');
        }
      }
    }
  }

  private undo() {
    if (this.game == null) return;

    this.game.undo();
    this.drawWholeBoard();
  }

  private redo() {
    if (this.game == null) return;

    this.game.redo();
    this.drawWholeBoard();
  }

  private reset() {
    if (this.game == null) return;

    this.game.reset();
    this.drawWholeBoard();
  }

  public drawWholeBoard() {
    for (let i = 0; i < 81; i++) {
      this.updateEl(i);
    }
  }
}

const controlGridCells = getElementsWithClassName('content__option', 'LI').map(
  (el) => el.children[0]
) as HTMLButtonElement[];

// RIght now: component responsible for fetching DOM elements, connecting them
const undoButton = getElementWithId('undo-btn', 'BUTTON');
const redoButton = getElementWithId('redo-btn', 'BUTTON');
const resetButton = getElementWithId('reset-btn', 'BUTTON');

const boardEl = getElementWithId('sudoku-board', 'DIV');
const sudokuCells = [...boardEl.children] as HTMLElement[];

const textDisplayElement = getElementWithId('info-text', 'P');

const data: UIDOMElements = {
  controlGridCells,
  redoButton,
  resetButton,
  sudokuCells,
  textDisplayElement,
  undoButton,
};

let gameUI: SudokuInterface | null = null;

export default function createGameInterface(game: SudokuGame | null) {
  if (gameUI == null) {
    gameUI = new SudokuInterface(data, game);
  } else if (game != null) {
    gameUI.setGame(game);
  }

  return gameUI;
}
