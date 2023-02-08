import { isBoardArray } from '../utils/type_checkers';
import { BoardArray, CellNumber, boardIsComplete, boardIsValid } from './logic';

export function generateBlankBoard(): BoardArray {
  const blank = [...new Array(81)].map((_) => null) as BoardArray;
  if (isBoardArray(blank)) return blank;
  throw new TypeError(`BoardArray seems to have changed definition`);
}

/*
Based on Fisher-Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
Produces more uniform results on different JS engines
*/

type shufflingAlgorithm = 'default' | 'fisher-yates';

function defaultAlgorithm(array: unknown[]) {
  array.sort(() => Math.random() - 0.5);
}

function fisherYatesAlgorithm(array: unknown[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const shufflingAlgorithmsByNames = new Map<
  shufflingAlgorithm,
  (arr: unknown[]) => void
>([
  ['default', defaultAlgorithm],
  ['fisher-yates', fisherYatesAlgorithm],
]);

export function getNumberPossibilities(
  shuffleAlgorithm: shufflingAlgorithm = 'fisher-yates'
): CellNumber[] {
  // Could get rid of the as, but...No interest right now for these details
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9] as CellNumber[];
  const algorithmFn = shufflingAlgorithmsByNames.get(shuffleAlgorithm);
  if (algorithmFn === undefined)
    throw new Error(
      `The implementation for ${shuffleAlgorithm} is missing from the map`
    );

  algorithmFn(array);

  return array;
}

export function formatBoard(board: BoardArray) {
  let formatted = '';
  for (let i = 0; i < 9; i++) {
    formatted +=
      board
        .slice(i * 9, i * 9 + 9)
        .map((e) => (e === null ? ' ' : e))
        .join('|') + '\n';
  }
  return formatted;
}

export function logBoard(board: BoardArray) {
  console.log(formatBoard(board));
}

export function fillNextNumber(board: BoardArray, idx: number): boolean {
  if (boardIsComplete(board)) {
    return true;
  }

  if (!boardIsValid(board)) return false;

  const possibilities = getNumberPossibilities();
  for (let i = 0; i < possibilities.length; i++) {
    board[idx] = possibilities[i];
    const works = fillNextNumber(board, idx + 1);
    if (works) return true;
  }
  board[idx] = null;
  return false;
}

/**
 * The actual important thing that's exported from the file
 *
 * @returns A valid sudoku board, should be (fairly) random
 */
export function generateRandomSudoku(): BoardArray {
  const board = generateBlankBoard();
  fillNextNumber(board, 0);
  return board;
}

export class UniquenessSolver {
  private foundSolutions!: number;
  private static options: CellNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  private board!: BoardArray;
  private static singleton: UniquenessSolver | undefined = undefined;

  public static getInstance() {
    if (UniquenessSolver.singleton === undefined) {
      UniquenessSolver.singleton = new UniquenessSolver();
    }
    return UniquenessSolver.singleton;
  }

  private constructor() {
    this.initialize();
  }

  private initialize(board: BoardArray | undefined = undefined) {
    this.foundSolutions = 0;
    this.board = board ?? generateBlankBoard();
  }

  public hasUniqueSolution(boardToSolve: BoardArray) {
    this.initialize([...boardToSolve]);
    return !this.hasTwoSolutions();
  }

  private hasTwoSolutions(): boolean {
    if (boardIsComplete(this.board)) {
      this.foundSolutions++;
      return this.foundSolutions > 1;
    }

    if (!boardIsValid(this.board)) {
      return false;
    }

    const idx = this.board.findIndex((val) => val === null);

    for (const val of UniquenessSolver.options) {
      this.board[idx] = val;
      const res = this.hasTwoSolutions();
      if (res) return res;
    }

    this.board[idx] = null;
    return false;
  }
}

function hasUniqueSolution(board: BoardArray): boolean {
  const solver = UniquenessSolver.getInstance();
  return solver.hasUniqueSolution(board);
}

function hideOne(board: BoardArray) {
  const possibleIndices: number[] = [];
  board.forEach((val, idx) => {
    if (val !== null) {
      possibleIndices.push(idx);
    }
  });

  while (possibleIndices.length > 0) {
    const i = Math.floor(Math.random() * possibleIndices.length);

    const chosenIdx = possibleIndices.splice(i, 1)[0];
    const prev = board[chosenIdx];
    board[chosenIdx] = null;

    if (hasUniqueSolution(board)) {
      return true;
    }

    board[chosenIdx] = prev;
  }

  return false;
}

/**
 *
 * @param fullBoard
 * @param cellsToHide
 * @returns A new copy with some values turned to null
 */
export function hide(fullBoard: BoardArray, cellsToHide: number): BoardArray {
  if (cellsToHide < 0 || cellsToHide > 81) {
    throw new RangeError(
      `Not possible to creat a Sudoku with ${cellsToHide} hidden numbers.`
    );
  }

  if (cellsToHide > 64) {
    console.log(
      'not possible to find unique solutions with this many hidden values'
    );
  }

  // In case we don't want to mutate the original board -- quick correctness checking could be done simply by comparing to the value in the full board

  const board = [...fullBoard] as BoardArray;

  // Strictly speaking, a sudoku with 17 numbers may have a unique solution.
  // So 64 hideable cells in that case. We'll push that limit if need be...

  for (let i = 0; i < cellsToHide; i++) {
    const success = hideOne(board);
    if (!success) {
      console.warn('Fail but stop :)x)');
      break;
    }
  }
  return board;
}

export function generateSudokuPuzzle(filledValues = 30): BoardArray {
  // 1. Geneerate
  // 2. Try to hide
  // 3. Fail?
  // a) try to hide different numbers (a few times)
  // or b) generate a whole new sudoku and repeat
  // return if successful... Otherwise throw an error? Or something?

  // Should these be precomputed? Might take some processing power on the device. Perhaps an option would be great
  // Might be optimization steps to find as well
  // A good project to use WebWorkers? Premium accounts with AWS lambda and parallelization?
  // Premium accounts?

  // Hard-coded for MVP
  const hiddenValues = 81 - filledValues;
  const board = generateRandomSudoku();
  return hide(board, hiddenValues);
}
