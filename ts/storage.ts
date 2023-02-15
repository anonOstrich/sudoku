import { SudokuInterface } from './game_interface';
import { BoardArray } from './logic/logic';
import { SavedAction } from './logic/sudoku_actions';
import { SudokuGame } from './logic/sudoku_game';

interface SaveData {
  initialBoard: BoardArray;
  takenActions: Array<SavedAction>;
}

export function saveGame(game: SudokuGame) {
  const initialBoard = game.getInitialBoard();

  const actions = game.getAllActions().map((a) => a.generateSaveAction());

  localStorage.setItem(
    'saveData',
    JSON.stringify({
      initialBoard,
      takenActions: actions,
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
  const { initialBoard, takenActions } = JSON.parse(saved) as SaveData;
  const game = new SudokuGame(initialBoard);
  for (const action of takenActions) {
    switch (action.type) {
      case 'numberAction':
        game.writeValue(action.index, action.value);
        break;
      case 'resetAction':
        game.reset();
        break;
      default:
        throw new Error(`Failed loading the action ${action}`);
    }
  }
  ui.setGame(game);
}
