// test that this produces reasonable results
function randomInteger(min: number, max: number) {
  const width = Math.random() * (max - min + 1)
  const translated = min + width
  return Math.floor(translated)
}

class NullAction {
  type: ActionType = 'nullAction'
  nextAction: BoardAction | null = null

  isNullAction(): this is NullAction {
    return true
  }

  isBoardAction(): this is BoardAction {
    return false
  }
}

type Action = BoardAction | NullAction

type ActionType = 'boardAction' | 'nullAction'

class BoardAction {
  type: ActionType = 'boardAction'
  prevAction: Action
  nextAction: BoardAction | null = null
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

  isNullAction(): this is NullAction {
    return false
  }

  isBoardAction(): this is BoardAction {
    return true
  }
}

export class SudokuBoard {
  // These are assigned in randomizeBoard, called from constructor
  private board!: Array<number>
  private initialVisibleBoard!: Array<number | null>
  private visibleBoard!: Array<number | null>

  private recentAction: Action = new NullAction()

  constructor() {
    this.randomizeBoard()
  }

  private randomizeBoard() {
    this.board = [...Array(81)].map((_) => randomInteger(1, 9))
    let indices = [...Array(81)].map((_, idx) => idx)
    const chosenIdx = new Set()

    for (let i = 0; i < 30; i++) {
      const n = indices.length
      const chosen = randomInteger(0, n - 1)
      indices = indices.filter((_, idx) => idx !== chosen)
      chosenIdx.add(chosen)
    }

    this.initialVisibleBoard = this.board.map((val, idx) =>
      chosenIdx.has(idx) ? val : null
    )
    this.visibleBoard = [...this.initialVisibleBoard]
  }

  public getBoard() {
    return [...this.visibleBoard]
  }

  // Returns only whether a new action was successfully taken -- the new state must be explicitly fetched afterwards
  public takeAction(idx: number, val: number): boolean {
    if (val < 1 || val > 9) {
      return false
    }
    const newAction = new BoardAction(idx, val, this.recentAction)
    if (this.recentAction !== null) {
      this.recentAction.nextAction = newAction
    }
    this.recentAction = newAction

    newAction.apply(this.board)

    return true
  }

  public undo(): boolean {
    const action = this.recentAction

    if (action.isBoardAction()) {
      action.undo(this.board)
      this.recentAction = action.prevAction
      return true
    }

    return false
  }

  public redo(): boolean {
    const recent = this.recentAction
    if (recent.nextAction !== null) {
      this.recentAction = recent.nextAction
      recent.nextAction.apply(this.board)
      return true
    }
    return false
  }
}
