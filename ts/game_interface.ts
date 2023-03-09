import { isCellValue, isElementWithTag } from './utils/type_checkers';
import { CellValue } from './logic/logic';
import { SudokuGame } from './logic/sudoku_game';
import {
  getElementWithId,
  getElementsWithClassName,
} from './utils/dom_wrangling';
import { createInfoUpdater } from './dom_interface';
import { Settings, getDefaultSettings } from './settings';
import { setIntervalRenderFunction, startTimer, renderTime, setTimeSpent } from './timer';

export interface UIDOMElements {
  sudokuCells: HTMLElement[];
  controlGridCells: HTMLElement[];
  textDisplayElement: HTMLParagraphElement;
  undoButton: HTMLButtonElement;
  redoButton: HTMLButtonElement;
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
  private settings!: Settings;

  private updateInfo: (text: string) => void;

  constructor(uiElements: UIDOMElements, game: SudokuGame | null) {
    this.game = game;

    this.undoButton = uiElements.undoButton;
    this.redoButton = uiElements.redoButton;

    this.sudokuCells = uiElements.sudokuCells;
    this.controlGridCells = uiElements.controlGridCells;
    this.updateInfo = createInfoUpdater(uiElements.textDisplayElement);

    this.setSettings(getDefaultSettings());
    this.attachEventListeners();
    if (game != null) {
      this.setAddedElementStyles();
    }
  }

  public setGame(game: SudokuGame) {
    this.game = game;
    this.setAddedElementStyles();
    if (this.settings.displayErrors) {
      this.styleIncorrectNumbers()
    }

    this.drawWholeBoard();
  }

  public startNewGame() {
    setTimeSpent(0)
    this.startGame()
  }

  public startGame(){
    if (this.game == null){
      return
    }

    startTimer()
    renderTime((time) => this.updateInfo(time))

  }

  public setSettings(settings: Settings) {
    this.settings = settings;
    this.applySettings();
  }

  private styleIncorrectNumbers() {
    const incorrectIndices = this.game?.incorrectIndices();
    if (incorrectIndices != null) {
      this.sudokuCells.forEach((el, idx) => {
        if (incorrectIndices.includes(idx)) {
          el.classList.add('content__cell--incorrect');
        } else el.classList.remove('content__cell--incorrect');
      });
    }
  }

  private unstyleIncorrectNumbers() {
    this.sudokuCells.forEach((e) =>
      e.classList.remove('content__cell--incorrect')
    );
  }

  private applySettings() {
    // check all the previous errors
    if (this.settings.displayErrors) {
      this.styleIncorrectNumbers();
    } else {
      this.unstyleIncorrectNumbers();
    }

    if (this.settings.displayTimer) {
        setIntervalRenderFunction((time) => {
          this.updateInfo(time)
        })
        // Instant refresh on checkbox toggling, 
        // no need to wait for the next second to turn :3
        renderTime((time) => this.updateInfo(time))
    } else {
      setIntervalRenderFunction(null)
      this.updateInfo('')
    }
  }

  private setAddedElementStyles() {
    if (this.game == null) {
      throw new Error('Not callable with null board');
      this.updateInfo(`Tried to initialize with an empty game :(`);
    }
    this.sudokuCells.forEach((el, idx) => {
      if (!this.game?.isOriginalValue(idx)) {
        el.classList.add('content__cell--added');
      } else {
        el.classList.remove('content__cell--added');
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

  public solveOne() {
    if (this.game == null) return
    let firstEmptyIdx = -1
    for(let i = 0; i < 81; i++) {
      if (this.game.emptyCell(i)) {
        firstEmptyIdx = i;
        break
      }
    }
    if (firstEmptyIdx == -1) {
      throw new Error("There are no empty cells to fill")
    }

    this.insertSolvedValue(firstEmptyIdx, this.game.getSolvedBoard()[firstEmptyIdx])
  }

  public solveAll(){
    if (this.game == null) return

    const success = this.game.solveAll()
    if (!success) {
      console.error('failed to solve the board')
    } else {
      if (this.game.gameIsWon()) {
        this.updateInfo('CONGRATULATIONS! You solved the sudoku');
      } else {
        this.updateInfo('OH NO! Something went awry');
      }

      for (let i = 0; i < 81; i++) {
        this.updateEl(i)
      }
    }
  }

  private updateEl(idx: number) {
    if (this.game == null) return;
    const rawValue = this.game.valueAt(idx);
    const displayedValue = rawValue === null ? '' : String(rawValue);
    this.sudokuCells[idx].textContent = displayedValue;

    if (this.settings.displayErrors) {
      this.styleIncorrectNumbers();
    }
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

  public insertSolvedValue(idx: number, value: CellValue) {
    if (this.game == null) return;

    const success = this.game.writeValue(idx, value, true);
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

  public reset() {
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

const boardEl = getElementWithId('sudoku-board', 'DIV');
const sudokuCells = [...boardEl.children] as HTMLElement[];

const textDisplayElement = getElementWithId('info-text', 'P');

const data: UIDOMElements = {
  controlGridCells,
  redoButton,
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
