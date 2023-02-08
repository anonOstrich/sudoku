/*
import { SudokuGame } from './logic/sudoku_game';
import { createNewSudoku, difficulty } from './sudoku_creator';

function gameCommandHandler() {
  var game: SudokuGame | null = null;

  return {
    beginGame: async function (diff: difficulty) {
      game = await createNewSudoku(diff);
      console.log(`beginning game with diff ${diff}`);
    },
    place: function (idx: number, value: number) {
      console.log(`Trying to place value ${value} at idx ${idx}`);
    },
    undo: function() {
        game?.undo()
    },
    redo: function(){
        game?.redo()
    },
    reset: function() {
        game.
    },
  };
}

*/
