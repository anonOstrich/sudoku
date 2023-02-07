import { expect } from 'chai';
import {
  BoardArray,
  boardIsComplete,
  boardIsValid,
  columnIsValid,
  isBoardArray,
  rowIsValid,
  squareIsValid,
  generateBlankBoard,
  formatBoard,
  fillNextNumber,
  logBoard,
  hide,
  generateRandomSudoku,
  UniquenessSolver,
} from '../ts/sudoku_generator';

describe('Sudoku board validity checks', () => {
  describe('should structurally', () => {
    it('return false when the number of cells is not 81');
    it('return true when the number of cells is 81');
    it('return false when when there are non-numbers or nulls');
    it('return false when there are numbers in the wrong range');
    it('return true when the cell values are in correct domain');
  });

  describe('should detect by the contents', () => {
    it('when a row may be valid', () => {
      const emptyBoard = generateBlankBoard();
      expect(rowIsValid(emptyBoard, 0), 'Empty row should be valid but was not')
        .to.be.true;

      const board = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        ...emptyBoard.slice(9),
      ] as BoardArray;
      expect(rowIsValid(board, 0)).to.be.true;

      const validBoard2 = [
        ...emptyBoard.slice(0, 9),
        1,
        3,
        2,
        9,
        8,
        5,
        4,
        6,
        7,
        ...emptyBoard.slice(18),
      ] as BoardArray;
      expect(rowIsValid(validBoard2, 1)).to.be.true;

      const falseBoard = Array(81).map(
        (_) => 1 + Math.floor(Math.random() * 4)
      ) as BoardArray;
      expect(rowIsValid(falseBoard, 4)).to.be.false;
    });
    it('when a column may be valid', () => {
      const emptyBoard = generateBlankBoard();
      expect(columnIsValid(emptyBoard, 3), 'Empty board should be valid').to.be
        .true;

      const validBoard = [
        null,
        null,
        null,
        1,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        9,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        8,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        2,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        3,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        7,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        6,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        4,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        5,
        null,
        null,
        null,
        null,
        null,
      ];

      expect(isBoardArray(validBoard) && columnIsValid(validBoard, 3)).to.be
        .true;
    });
    it('when a 3x3 grid may be valid', () => {
      const emptyBoard = generateBlankBoard();
      expect(squareIsValid(emptyBoard, 8)).to.be.true;

      const validBoard = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        1,
        3,
        8,
        null,
        null,
        null,
        null,
        null,
        null,
        8,
        5,
        2,
        null,
        null,
        null,
        null,
        null,
        null,
        4,
        7,
        9,
      ];

      expect(isBoardArray(validBoard) && squareIsValid(validBoard, 8));
    });
    it('when an entire board may be valid', () => {
      expect(boardIsValid(generateBlankBoard())).to.be.true;

      const validBoard = [
        7, 9, 2, 1, 5, 4, 3, 8, 6, 6, 4, 3, 8, 2, 7, 1, 5, 9, 8, 5, 1, 3, 9, 6,
        7, 2, 4, 2, 6, 5, 9, 7, 3, 8, 4, 1, 4, 8, 9, 5, 6, 1, 2, 7, 3, 3, 1, 7,
        4, 8, 2, 9, 6, 5, 1, 3, 6, 7, 4, 8, 5, 9, 2, 9, 7, 4, 2, 1, 5, 6, 3, 8,
        5, 2, 8, 6, 3, 9, 4, 1, 7,
      ];
      expect(isBoardArray(validBoard) && boardIsValid(validBoard)).to.be.true;
    });
  });

  it('should detect a fully complete sudoku', () => {
    const board: (number | null)[] = [
      7, 9, 2, 1, 5, 4, 3, 8, 6, 6, 4, 3, 8, 2, 7, 1, 5, 9, 8, 5, 1, 3, 9, 6, 7,
      2, 4, 2, 6, 5, 9, 7, 3, 8, 4, 1, 4, 8, 9, 5, 6, 1, 2, 7, 3, 3, 1, 7, 4, 8,
      2, 9, 6, 5, 1, 3, 6, 7, 4, 8, 5, 9, 2, 9, 7, 4, 2, 1, 5, 6, 3, 8, 5, 2, 8,
      6, 3, 9, 4, 1, 7,
    ];
    expect(
      isBoardArray(board) && boardIsComplete(board),
      'Valid should be valid'
    ).to.be.true;

    board[40] = null;
    expect(boardIsComplete(board as BoardArray), 'Invalid should be invalid').to
      .be.false;
  });
});

describe('misc', () => {
  describe('graphical output', () => {
    it('values described ok', () => {
      const empty = generateBlankBoard();
      console.log(formatBoard(empty));

      const something = [...Array(81)].map(
        () => 1 + Math.floor(Math.random() * 9)
      );
      console.log(formatBoard(something as BoardArray));
    });
  });
});

describe('Sudoku generation', () => {
  describe.only('in broader strokes', () => {
    it('manages to create something', () => {
      const generatedBoard = generateBlankBoard();

      const result = fillNextNumber(generatedBoard, 0);
      console.log(`A valid sudoku was supposted to be created?: `, result);
      logBoard(generatedBoard);
    });
  });

  describe('randomness', () => {
    it('does not produce uniform results with the simple shuffle');

    it('produces uniform results with the Fisher-Yates shuffle');
  });

  describe('validity checks', () => {
    it('should XXX');
  });
});

describe.only('Uniqueness solver', () => {
  const solver = UniquenessSolver.getInstance();

  it('determines that empty sudoku has no unique solution', () => {
    const empty = generateBlankBoard();
    expect(
      solver.hasUniqueSolution(empty),
      'Empty sudoku definitely should not have a unique solution'
    ).to.be.false;
  });

  it('determines that completed sudoku has unique solution', () => {
    const board = generateRandomSudoku();
    expect(
      solver.hasUniqueSolution(board),
      'Filled board should definitely have a unique solution'
    ).to.be.true;
  });

  it('recognizes the uniqueness with some in-between cases', () => {
    const solvedBoard = generateRandomSudoku();
    const oneMissing = hide(solvedBoard, 1);
    const fewMissing = hide(solvedBoard, 10);

    expect(solver.hasUniqueSolution(oneMissing)).to.be.true;
    expect(solver.hasUniqueSolution(fewMissing)).to.be.true;
  });

  it('extreme cases', () => {
    const solvedBoard = generateRandomSudoku();

    const moreMissing = hide(solvedBoard, 40);
    logBoard(moreMissing);
    const maxMissing = hide(solvedBoard, 60);
    logBoard(maxMissing);

    expect(
      solver.hasUniqueSolution(moreMissing),
      '40 missing should always work (probably?)'
    ).to.be.true;
    expect(
      solver.hasUniqueSolution(maxMissing),
      '60 missing does not work always'
    ).to.be.true;

    const certainlyNotUnique = hide(solvedBoard, 80);
    console.log('following: only one shown value (hopefully...)');
    logBoard(certainlyNotUnique);
    expect(
      solver.hasUniqueSolution(certainlyNotUnique),
      'with 1 visible value has many solutions'
    ).to.be.false;
  });
});

describe('Sudoku hiding', () => {
  it('can hide one number', () => {
    const genBoard = generateRandomSudoku();
    const hiddenBoard = hide(genBoard, 1);

    let diffNumbers = 0;
    for (let i = 0; i < genBoard.length; i++) {
      diffNumbers += genBoard[i] === hiddenBoard[i] ? 0 : 1;
    }
    expect(diffNumbers).to.equal(1);
    expect(hiddenBoard.filter((el) => el === null)).to.have.lengthOf(1);
  });

  it('can hide reasonable numbers', () => {
    const genBoard = generateRandomSudoku();
    const HIDS = 30;
    const hiddenBoard = hide(genBoard, HIDS);

    let diffNumbers = 0;
    for (let i = 0; i < genBoard.length; i++) {
      diffNumbers += genBoard[i] === hiddenBoard[i] ? 0 : 1;
    }

    expect(diffNumbers).to.equal(HIDS);
    expect(hiddenBoard.filter((el) => el === null)).to.have.lengthOf(HIDS);
  });

  it('can handle the max number of hidden numbers', () => {
    const genBoard = generateRandomSudoku();
    const HIDS = 60;
    const hiddenBoard = hide(genBoard, HIDS);

    let diffNumbers = 0;
    for (let i = 0; i < genBoard.length; i++) {
      diffNumbers += genBoard[i] === hiddenBoard[i] ? 0 : 1;
    }

    expect(diffNumbers).to.equal(HIDS);
    expect(hiddenBoard.filter((el) => el === null)).to.have.lengthOf(HIDS);
    logBoard(hiddenBoard);
  });
});
