import { BoardArray, boardIsComplete, boardIsValid } from './logic';
import {
  Action,
  CheatAllNumbersAction,
  CheatNumberAction,
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
  // Could be readonly...
  private filledBoard: BoardArray;

  public recentAction: Action = new NullAction();

  constructor(data: BoardArray, completed: BoardArray) {
    if (completed == null) {
      console.log('In constructor, this seems impossible...?');
      throw new Error('WTF');
    }
    // Constructor not meant to be callable
    this.filledBoard = completed;
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

  public getInitialBoard(): BoardArray {
    return [...this.initialVisibleBoard];
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

  public isOriginalValue(idx: number) {
    return this.immutableIndices.has(idx);
  }

  // Returns only whether a new action was successfully taken -- the new state must be explicitly fetched afterwards
  public writeValue(idx: number, val: number | null,
    // To generate different actions, which might be fun later on at the end...
    cheated = false): boolean {
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

    const newAction = cheated ? new CheatNumberAction(idx, val, this.recentAction) :  new NumberAction(idx, val, this.recentAction);
    this.addAndApplyAction(newAction);

    return true;
  }


  public solveAll() {
    if (this.gameIsFilled()) {
      return false
    }
    const newAction = new CheatAllNumbersAction(this.recentAction, this.filledBoard)
    this.addAndApplyAction(newAction)
    return true
  }


  public emptyCell(idx: number): boolean {
    return this.visibleBoard[idx] == null
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

  public getAllActions() {
    const actions: Array<Action> = [];

    let action: null | Action = this.recentAction;
    while (action.isPlayableAction()) {
      // actions.push(action);
      action = action.prevAction;
    }
    // don't add the first null action, which is applied automatically on game creation
    action = action.nextAction;
    while (action != null) {
      actions.push(action);
      action = action.nextAction;
    }
    return actions;
  }

  public getSolvedBoard() {
    return this.filledBoard;
  }

  public getRecentActionIdx() {
    const mostRecentAction = this.recentAction;
    let action = mostRecentAction;
    let i = 0;
    while (action.isPlayableAction()) {
      action = action.prevAction;
      i++;
    }
    return i;
  }

  public undoUntil(action: Action) {
    while (this.recentAction != action) {
      this.undo();
    }
  }


  public undoUntilBeginning(){
    while (!this.recentAction.isNullAction()) {
      this.undo()
    }
  }

  public incorrectIndices(): number[] {
    return this.visibleBoard.reduce((acc, el, idx) => {
      if (el == null) return acc;
      if (this.filledBoard == null) {
        console.log(this);
      }
      if (el != this.filledBoard[idx]) return [...acc, idx];
      return acc;
    }, [] as number[]);
  }
}
