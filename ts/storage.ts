import { SudokuInterface } from './game_interface';
import { BoardArray } from './logic/logic';
import { Action, SavedAction } from './logic/sudoku_actions';
import { SudokuGame } from './logic/sudoku_game';
import loadSettings, { setDarkTheme } from './settings';

interface SaveData {
  initialBoard: BoardArray;
  takenActions: Array<SavedAction>;
  prevActionIdx: number;
  solvedBoard: BoardArray;
}

export function saveGame(game: SudokuGame) {
  const initialBoard = game.getInitialBoard();
  const solvedBoard = game.getSolvedBoard();

  const actions = game.getAllActions().map((a) => a.generateSaveAction());
  const prevActionIdx = game.getRecentActionIdx();

  localStorage.setItem(
    'saveData',
    JSON.stringify({
      initialBoard,
      takenActions: actions,
      prevActionIdx,
      solvedBoard,
    })
  );

  console.log(`Saving the game in local storage!`);
}

export function loadGame(ui: SudokuInterface) {
  const saved = localStorage.getItem('saveData');
  if (saved == null) {
    console.log(`No data is saved`);
    return;
  }
  const { initialBoard, takenActions, prevActionIdx, solvedBoard } = JSON.parse(
    saved
  ) as SaveData;
  const game = new SudokuGame(initialBoard, solvedBoard);
  let i = 0;
  let recentAction: Action | null = null;
  for (const action of takenActions) {
    switch (action.type) {
      case 'numberAction':
        game.writeValue(action.index, action.value);
        break;
      case 'resetAction':
        game.reset();
        break;
      case 'cheatNumberAction':
        game.writeValue(action.index, action.value, true)
        break
      case 'cheatAllNumbersAction':
        game.solveAll()
        break
      case 'nullAction':
        console.log(
          `tried to apply null action -- ignoring this, since it's already done`
        );
        break;
      default:
        throw new Error(`Failed loading the action ${action}`);
    }
    // Due to inconsistency of the null action being first and not stored...
    if (i == (prevActionIdx - 1)) {
      recentAction = game.recentAction;
    }
    i++;
  }

  // If there was a non-null action
  if (recentAction != null) {
    game.undoUntil(recentAction);
  } else {
    game.undoUntilBeginning()
  }

  const settings = loadSettings()
  ui.setSettings(settings);
  setDarkTheme(settings.useDarkTheme)

  ui.setGame(game);
}
