// test that this produces reasonable results
import {
  BoardArray,
  boardIsValid,
  generateRandomSudoku,
} from './sudoku_generator'
import { hide } from './sudoku_generator'
import { boardIsComplete } from './sudoku_generator'

interface Action {
  type: string
  nextAction: PlayableAction | null

  isNullAction: () => this is NullAction
  isPlayableAction: () => this is PlayableAction
}

class NullAction implements Action {
  type = 'nullAction' as const
  nextAction = null

  isNullAction() {
    return true
  }

  isPlayableAction() {
    return false
  }
}

interface PlayableAction extends Action {
  prevAction: Action

  apply: (board: BoardArray) => void
  undo: (board: BoardArray) => void
}

class ResetAction implements PlayableAction {
  type = 'resetAction' as const

  prevAction: Action
  nextAction = null

  // You could even make save points!
  // (With some modifications)
  resettablePosition: BoardArray

  prevValue: BoardArray | null = null
  applied: boolean = false

  constructor(prevAction: Action, initialVisibleBoard: BoardArray) {
    this.resettablePosition = initialVisibleBoard
    this.prevAction = prevAction
  }

  public apply(board: BoardArray) {
    if (!this.applied) {
      this.prevValue = [...board]

      for (let i = 0; i < this.resettablePosition.length; i++) {
        board[i] = this.resettablePosition[i]
      }

      this.applied = true
    }
  }

  public undo(board: BoardArray) {
    if (this.applied && this.prevValue !== null) {
      for (let i = 0; i < this.prevValue.length; i++) {
        board[i] = this.prevValue[i]
      }

      this.applied = false
    }
  }

  public isNullAction() {
    return false
  }
  public isPlayableAction() {
    return true
  }
}
class NumberAction implements PlayableAction {
  type = 'numberAction' as const
  prevAction: Action
  nextAction = null
  private readonly idx: number
  private readonly value: number | null

  private previousValue: number | null = null
  private applied = false

  constructor(idx: number, value: number | null, prevAction: Action) {
    this.idx = idx
    this.value = value
    this.prevAction = prevAction
  }

  apply(board: Array<number | null>) {
    if (!this.applied) {
      this.previousValue = board[this.idx]
      board[this.idx] = this.value
      this.applied = true
    }
  }

  undo(board: Array<number | null>) {
    if (this.applied) {
      board[this.idx] = this.previousValue
      this.applied = false
    }
  }

  isNullAction() {
    return false
  }

  isPlayableAction() {
    return true
  }
}

export class SudokuGame {
  // These are assigned in randomizeBoard, called from constructor
  // private board!: BoardArray
  private initialVisibleBoard!: BoardArray
  private visibleBoard!: BoardArray
  private immutableIndices!: Set<number>

  private recentAction: Action = new NullAction()

  constructor() {
    this.initialize()
  }

  private initialize(visibleNumbers: number = 30) {
    // Could be used for later checking if this is indeed unique...
    // Some savings, definitely!
    const board = generateRandomSudoku()
    this.initialVisibleBoard = hide(board, 81 - visibleNumbers)
    this.visibleBoard = [...this.initialVisibleBoard]
    this.immutableIndices = new Set(
      this.initialVisibleBoard
        .map((e, i) => (e === null ? null : i))
        // type cast is safe -- type is 'number | null' and all null values are filtered out
        .filter((e) => e !== null) as number[]
    )
  }

  public valueAt(idx: number) {
    return this.visibleBoard[idx]
  }

  public getBoard(): BoardArray {
    return [...this.visibleBoard]
  }

  public gameIsFilled() {
    return this.visibleBoard.every((v) => v !== null)
  }

  public gameIsFailed() {
    return !boardIsValid(this.visibleBoard)
  }

  public gameIsWon() {
    return boardIsComplete(this.visibleBoard)
  }

  // Returns only whether a new action was successfully taken -- the new state must be explicitly fetched afterwards
  public writeValue(idx: number, val: number | null): boolean {
    // makes even sense to handle the value?
    if (val !== null && (val < 1 || val > 9)) {
      return false
    }

    // not rewriting the basis of the puzzle?
    const immutable = this.immutableIndices.has(idx)
    if (immutable) {
      return false
    }

    // not unnecessary duplicate action? (easier for the user to undo)
    if (this.visibleBoard[idx] === val) {
      return false
    }

    const newAction = new NumberAction(idx, val, this.recentAction)
    console.log('created action: ', newAction)
    this.addAction(newAction)

    return true
  }

  public emptyCell(idx: number): boolean {
    return false
  }

  public undo(): boolean {
    const action = this.recentAction

    if (action.isPlayableAction()) {
      action.undo(this.visibleBoard)
      this.recentAction = action.prevAction
      return true
    }

    return false
  }

  public redo(): boolean {
    const recent = this.recentAction
    if (recent.nextAction !== null) {
      this.recentAction = recent.nextAction
      recent.nextAction.apply(this.visibleBoard)
      return true
    }
    return false
  }

  private addAction(action: PlayableAction) {
    this.recentAction.nextAction = action
    this.recentAction = action
    action.apply(this.visibleBoard)
  }

  public reset() {
    const resetPoint = new ResetAction(
      this.recentAction,
      this.initialVisibleBoard
    )
    this.addAction(resetPoint)
    return true
  }
}
