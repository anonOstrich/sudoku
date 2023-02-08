import { BoardArray } from './logic';

export interface Action {
  type: string;
  nextAction: PlayableAction | null;

  isNullAction: () => this is NullAction;
  isPlayableAction: () => this is PlayableAction;
}

export class NullAction implements Action {
  type = 'nullAction' as const;
  nextAction = null;

  isNullAction() {
    return true;
  }

  isPlayableAction() {
    return false;
  }
}

export interface PlayableAction extends Action {
  prevAction: Action;

  apply: (board: BoardArray) => void;
  undo: (board: BoardArray) => void;
}

export class ResetAction implements PlayableAction {
  type = 'resetAction' as const;

  prevAction: Action;
  nextAction = null;

  // You could even make save points!
  // (With some modifications)
  resettablePosition: BoardArray;

  prevValue: BoardArray | null = null;
  applied = false;

  constructor(prevAction: Action, initialVisibleBoard: BoardArray) {
    this.resettablePosition = initialVisibleBoard;
    this.prevAction = prevAction;
  }

  public apply(board: BoardArray) {
    if (!this.applied) {
      this.prevValue = [...board];

      for (let i = 0; i < this.resettablePosition.length; i++) {
        board[i] = this.resettablePosition[i];
      }

      this.applied = true;
    }
  }

  public undo(board: BoardArray) {
    if (this.applied && this.prevValue !== null) {
      for (let i = 0; i < this.prevValue.length; i++) {
        board[i] = this.prevValue[i];
      }

      this.applied = false;
    }
  }

  public isNullAction() {
    return false;
  }
  public isPlayableAction() {
    return true;
  }
}

export class NumberAction implements PlayableAction {
  type = 'numberAction' as const;
  prevAction: Action;
  nextAction = null;
  private readonly idx: number;
  private readonly value: number | null;

  private previousValue: number | null = null;
  private applied = false;

  constructor(idx: number, value: number | null, prevAction: Action) {
    this.idx = idx;
    this.value = value;
    this.prevAction = prevAction;
  }

  apply(board: Array<number | null>) {
    if (!this.applied) {
      this.previousValue = board[this.idx];
      board[this.idx] = this.value;
      this.applied = true;
    }
  }

  undo(board: Array<number | null>) {
    if (this.applied) {
      board[this.idx] = this.previousValue;
      this.applied = false;
    }
  }

  isNullAction() {
    return false;
  }

  isPlayableAction() {
    return true;
  }
}
