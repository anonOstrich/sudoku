import { BoardArray, boardIsComplete, boardIsValid } from './logic';
import {
  Action,
  NullAction,
  NumberAction,
  PlayableAction,
  ResetAction,
} from './sudoku_actions';

export class SudokuGame {
  // These are assigned for certain when a new game is created
  private initialVisibleBoard: BoardArray;
  private visibleBoard: BoardArray;
  private immutableIndices: Set<number>;

  private recentAction: Action = new NullAction();

  constructor(data: BoardArray) {
    // Constructor not meant to be callable
    const board = data;
    this.initialVisibleBoard = board;
    this.visibleBoard = [...this.initialVisibleBoard];

    this.immutableIndices = new Set(
      this.initialVisibleBoard
        .map((e, i) => (e === null ? null : i))
        // type cast is safe -- type is 'number | null' and all null values are filtered out
        .filter((e) => e !== null) as number[]
    );
  }

  public valueAt(idx: number) {
    return this.visibleBoard[idx];
  }

  public getBoard(): BoardArray {
    return [...this.visibleBoard];
  }

  public gameIsFilled() {
    return this.visibleBoard.every((v) => v !== null);
  }

  public gameIsFailed() {
    return !boardIsValid(this.visibleBoard);
  }

  public gameIsWon() {
    return boardIsComplete(this.visibleBoard);
  }

  // Returns only whether a new action was successfully taken -- the new state must be explicitly fetched afterwards
  public writeValue(idx: number, val: number | null): boolean {
    // makes even sense to handle the value?
    if (val !== null && (val < 1 || val > 9)) {
      return false;
    }

    // not allowed to replace the numbers on initial sudoku
    const immutable = this.immutableIndices.has(idx);
    if (immutable) {
      return false;
    }

    // prevent invisible actions so the undo functions more clearly
    if (this.visibleBoard[idx] === val) {
      return false;
    }

    const newAction = new NumberAction(idx, val, this.recentAction);
    this.addAndApplyAction(newAction);

    return true;
  }

  public emptyCell(idx: number): boolean {
    return false;
  }

  public undo(): boolean {
    const action = this.recentAction;

    if (action.isPlayableAction()) {
      action.undo(this.visibleBoard);
      this.recentAction = action.prevAction;
      return true;
    }

    return false;
  }

  public redo(): boolean {
    const recent = this.recentAction;
    if (recent.nextAction !== null) {
      this.recentAction = recent.nextAction;
      recent.nextAction.apply(this.visibleBoard);
      return true;
    }
    return false;
  }

  private addAndApplyAction(action: PlayableAction) {
    this.recentAction.nextAction = action;
    this.recentAction = action;
    action.apply(this.visibleBoard);
  }

  public reset() {
    const resetPoint = new ResetAction(
      this.recentAction,
      this.initialVisibleBoard
    );
    this.addAndApplyAction(resetPoint);
    return true;
  }
}