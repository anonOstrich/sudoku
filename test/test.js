'use strict'
;(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      var rejected = (value) => {
        try {
          step(generator.throw(value))
        } catch (e) {
          reject(e)
        }
      }
      var step = (x) =>
        x.done
          ? resolve(x.value)
          : Promise.resolve(x.value).then(fulfilled, rejected)
      step((generator = generator.apply(__this, __arguments)).next())
    })
  }

  // ts/sudoku_generator.ts
  function isCellValue(value) {
    return value === null || [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(value)
  }
  function isBoardArray(dataArray) {
    return (
      dataArray.length === 81 && dataArray.every((datum) => isCellValue(datum))
    )
  }
  function partIsValid(values) {
    if (values.length !== 9) return false
    const encountered = /* @__PURE__ */ new Set()
    return values.every((v) => {
      if (v === null) return true
      if (encountered.has(v)) {
        return false
      }
      encountered.add(v)
      return true
    })
  }
  function columnIsValid(board, idx) {
    const arr = [...new Array(9)].map((_, index) => index * 9 + idx)
    const indices = new Set(arr)
    const column = board.filter((_, index) => indices.has(index))
    return partIsValid(column)
  }
  function rowIsValid(board, idx) {
    const row = board.filter(
      (_, index) => idx * 9 <= index && index < idx * 9 + 9
    )
    return partIsValid(row)
  }
  function squareIsValid(board, idx) {
    const left_top = 3 * idx + Math.floor(idx / 3) * (2 * 9)
    const left_center = left_top + 9
    const left_bottom = left_center + 9
    const square = board.filter((_, index) => {
      return (
        (left_top <= index && index < left_top + 3) ||
        (left_center <= index && index < left_center + 3) ||
        (left_bottom <= index && index < left_bottom + 3)
      )
    })
    return partIsValid(square)
  }
  function boardIsValid(board) {
    for (let i = 0; i < 9; i++) {
      if (
        !(
          rowIsValid(board, i) &&
          columnIsValid(board, i) &&
          squareIsValid(board, i)
        )
      ) {
        return false
      }
    }
    return true
  }
  function boardIsComplete(board) {
    return board.every((v) => v !== null) && boardIsValid(board)
  }
  function generateBlankBoard() {
    const blank = [...new Array(81)].map((_) => null)
    if (isBoardArray(blank)) return blank
    throw new TypeError(`BoardArray seems to have changed definition`)
  }
  function defaultAlgorithm(array) {
    array.sort(() => Math.random() - 0.5)
  }
  function fisherYatesAlgorithm(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }
  var shufflingAlgorithmsByNames = /* @__PURE__ */ new Map([
    ['default', defaultAlgorithm],
    ['fisher-yates', fisherYatesAlgorithm],
  ])
  function getNumberPossibilities(shuffleAlgorithm = 'fisher-yates') {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const algorithmFn = shufflingAlgorithmsByNames.get(shuffleAlgorithm)
    if (algorithmFn === void 0)
      throw new Error(
        `The implementation for ${shuffleAlgorithm} is missing from the map`
      )
    algorithmFn(array)
    return array
  }
  function fillNextNumber(board, idx) {
    if (boardIsComplete(board)) {
      return true
    }
    if (!boardIsValid(board)) return false
    const possibilities = getNumberPossibilities()
    for (let i = 0; i < possibilities.length; i++) {
      board[idx] = possibilities[i]
      const works = fillNextNumber(board, idx + 1)
      if (works) return true
    }
    board[idx] = null
    return false
  }
  function generateRandomSudoku() {
    const board = generateBlankBoard()
    fillNextNumber(board, 0)
    return board
  }
  var _UniquenessSolver = class {
    static getInstance() {
      if (_UniquenessSolver.singleton === void 0) {
        _UniquenessSolver.singleton = new _UniquenessSolver()
      }
      return _UniquenessSolver.singleton
    }
    constructor() {
      this.initialize()
    }
    initialize(board = void 0) {
      this.foundSolutions = 0
      this.board = board != null ? board : generateBlankBoard()
    }
    hasUniqueSolution(boardToSolve) {
      this.initialize([...boardToSolve])
      return !this.hasTwoSolutions()
    }
    hasTwoSolutions() {
      if (boardIsComplete(this.board)) {
        this.foundSolutions++
        return this.foundSolutions > 1
      }
      if (!boardIsValid(this.board)) {
        return false
      }
      const idx = this.board.findIndex((val) => val === null)
      for (let val of _UniquenessSolver.options) {
        this.board[idx] = val
        const res = this.hasTwoSolutions()
        if (res) return res
      }
      this.board[idx] = null
      return false
    }
  }
  var UniquenessSolver = _UniquenessSolver
  UniquenessSolver.options = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  UniquenessSolver.singleton = void 0
  function hasUniqueSolution(board) {
    const solver = UniquenessSolver.getInstance()
    return solver.hasUniqueSolution(board)
  }
  function hideOne(board) {
    const possibleIndices = []
    board.forEach((val, idx) => {
      if (val !== null) {
        possibleIndices.push(idx)
      }
    })
    while (possibleIndices.length > 0) {
      const i = Math.floor(Math.random() * possibleIndices.length)
      const chosenIdx = possibleIndices.splice(i, 1)[0]
      const prev = board[chosenIdx]
      board[chosenIdx] = null
      if (hasUniqueSolution(board)) {
        return true
      }
      board[chosenIdx] = prev
    }
    return false
  }
  function hide(fullBoard, cellsToHide) {
    if (cellsToHide < 0 || cellsToHide > 81) {
      throw new RangeError(
        `Not possible to creat a Sudoku with ${cellsToHide} hidden numbers.`
      )
    }
    if (cellsToHide > 64) {
      console.log(
        'not possible to find unique solutions with this many hidden values'
      )
    }
    const board = [...fullBoard]
    for (let i = 0; i < cellsToHide; i++) {
      const success = hideOne(board)
      if (!success) {
        console.warn('Fail but stop :)x)')
        break
      }
    }
    return board
  }

  // ts/utils/type_checkers.ts
  function isElementWithTag(el, name) {
    if (el === null) {
      return false
    }
    return el.tagName === name
  }

  // ts/game_interface.ts
  var SudokuInterface = class {
    constructor(cellEls, controlEls, game) {
      this.cellEls = cellEls
      this.game = game
      this.controlEls = controlEls
      this.attachEventListeners()
    }
    attachEventListeners() {
      const buttons = this.controlEls
      buttons.forEach((button) => {
        const buttonValue =
          button.innerText === 'X' ? null : Number(button.innerText)
        button.addEventListener('mousedown', (e) => {
          e.preventDefault()
        })
        button.addEventListener('mouseup', (e) => {
          const active = document.activeElement
          if (
            active !== null &&
            isElementWithTag(active, 'BUTTON') &&
            active.classList.contains('content__cell')
          ) {
            if (isCellValue(buttonValue)) {
              const activeIdx = this.cellEls.findIndex((e2) => e2 === active)
              this.insertValue(activeIdx, buttonValue)
            }
          }
        })
      })
      const cells = this.cellEls
      for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('keydown', (event) => {
          if (
            [
              'Digit1',
              'Digit2',
              'Digit3',
              'Digit4',
              'Digit5',
              'Digit6',
              'Digit7',
              'Digit8',
              'Digit9',
              'Numpad1',
              'Numpad2',
              'Numpad3',
              'Numpad4',
              'Numpad5',
              'Numpad6',
              'Numpad7',
              'Numpad8',
              'Numpad9',
            ].includes(event.code)
          ) {
            const char = event.code.charAt(5)
            const conversion = char === '' ? null : Number(char)
            console.log('converted: ', conversion)
            if (isCellValue(conversion)) {
              this.insertValue(i, conversion)
            }
          }
          if (['Backspace', 'Space', 'Delete'].includes(event.code)) {
            this.insertValue(i, null)
          }
          this.changeFocusWithArrows(i, event)
        })
      }
      const undoBtn = getElementWithId('undo-btn', 'BUTTON')
      undoBtn.addEventListener('click', () => {
        this.undo()
      })
      const redoBtn = getElementWithId('redo-btn', 'BUTTON')
      redoBtn.addEventListener('click', () => {
        this.redo()
      })
      const resetBtn = getElementWithId('reset-btn', 'BUTTON')
      resetBtn.addEventListener('click', () => {
        this.reset()
      })
    }
    changeFocusWithArrows(idx, event) {
      if (
        ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)
      ) {
        let newIdx = null
        switch (event.code) {
          case 'ArrowUp':
            if (idx > 8) {
              newIdx = idx - 9
            }
            break
          case 'ArrowDown':
            if (idx < 72) {
              newIdx = idx + 9
            }
            break
          case 'ArrowLeft':
            if (idx % 9 !== 0) {
              newIdx = idx - 1
            }
            break
          case 'ArrowRight':
            if (idx % 9 !== 8) {
              newIdx = idx + 1
            }
            break
        }
        if (newIdx !== null) {
          const el = this.cellEls[newIdx]
          if ('focus' in el) {
            el.focus()
          }
        }
      }
    }
    updateEl(idx) {
      const rawValue = this.game.valueAt(idx)
      console.log('raw Value: ', rawValue)
      const displayedValue = rawValue === null ? '' : String(rawValue)
      this.cellEls[idx].textContent = displayedValue
    }
    insertValue(idx, value) {
      const success = this.game.writeValue(idx, value)
      if (success) {
        console.log('SUCCESS')
        this.updateEl(idx)
        if (this.game.gameIsFilled()) {
          if (this.game.gameIsWon()) {
            updateInfo('CONGRATULATIONS! You solved the sudoku')
          } else {
            updateInfo('OH NO! Something went awry')
          }
        }
      }
    }
    undo() {
      this.game.undo()
      this.drawWholeBoard()
    }
    redo() {
      this.game.redo()
      this.drawWholeBoard()
    }
    reset() {
      this.game.reset()
      this.drawWholeBoard()
    }
    drawWholeBoard() {
      for (let i = 0; i < 81; i++) {
        this.updateEl(i)
      }
    }
  }

  // ts/logic.ts
  var NullAction = class {
    constructor() {
      this.type = 'nullAction'
      this.nextAction = null
    }
    isNullAction() {
      return true
    }
    isPlayableAction() {
      return false
    }
  }
  var ResetAction = class {
    constructor(prevAction, initialVisibleBoard) {
      this.type = 'resetAction'
      this.nextAction = null
      this.prevValue = null
      this.applied = false
      this.resettablePosition = initialVisibleBoard
      this.prevAction = prevAction
    }
    apply(board) {
      if (!this.applied) {
        this.prevValue = [...board]
        for (let i = 0; i < this.resettablePosition.length; i++) {
          board[i] = this.resettablePosition[i]
        }
        this.applied = true
      }
    }
    undo(board) {
      if (this.applied && this.prevValue !== null) {
        for (let i = 0; i < this.prevValue.length; i++) {
          board[i] = this.prevValue[i]
        }
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
  var NumberAction = class {
    constructor(idx, value, prevAction) {
      this.type = 'numberAction'
      this.nextAction = null
      this.previousValue = null
      this.applied = false
      this.idx = idx
      this.value = value
      this.prevAction = prevAction
    }
    apply(board) {
      if (!this.applied) {
        this.previousValue = board[this.idx]
        board[this.idx] = this.value
        this.applied = true
      }
    }
    undo(board) {
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
  var SudokuGame = class {
    constructor() {
      this.recentAction = new NullAction()
      this.initialize()
    }
    initialize(visibleNumbers = 30) {
      const board = generateRandomSudoku()
      this.initialVisibleBoard = hide(board, 81 - visibleNumbers)
      this.visibleBoard = [...this.initialVisibleBoard]
      this.immutableIndices = new Set(
        this.initialVisibleBoard
          .map((e, i) => (e === null ? null : i))
          .filter((e) => e !== null)
      )
    }
    valueAt(idx) {
      return this.visibleBoard[idx]
    }
    getBoard() {
      return [...this.visibleBoard]
    }
    gameIsFilled() {
      return this.visibleBoard.every((v) => v !== null)
    }
    gameIsFailed() {
      return !boardIsValid(this.visibleBoard)
    }
    gameIsWon() {
      return boardIsComplete(this.visibleBoard)
    }
    writeValue(idx, val) {
      if (val !== null && (val < 1 || val > 9)) {
        return false
      }
      const immutable = this.immutableIndices.has(idx)
      if (immutable) {
        return false
      }
      if (this.visibleBoard[idx] === val) {
        return false
      }
      const newAction = new NumberAction(idx, val, this.recentAction)
      console.log('created action: ', newAction)
      this.addAction(newAction)
      return true
    }
    emptyCell(idx) {
      return false
    }
    undo() {
      const action = this.recentAction
      if (action.isPlayableAction()) {
        action.undo(this.visibleBoard)
        this.recentAction = action.prevAction
        return true
      }
      return false
    }
    redo() {
      const recent = this.recentAction
      if (recent.nextAction !== null) {
        this.recentAction = recent.nextAction
        recent.nextAction.apply(this.visibleBoard)
        return true
      }
      return false
    }
    addAction(action) {
      this.recentAction.nextAction = action
      this.recentAction = action
      action.apply(this.visibleBoard)
    }
    reset() {
      const resetPoint = new ResetAction(
        this.recentAction,
        this.initialVisibleBoard
      )
      this.addAction(resetPoint)
      return true
    }
  }

  // node_modules/mitt/dist/mitt.mjs
  function mitt_default(n) {
    return {
      all: (n = n || /* @__PURE__ */ new Map()),
      on: function (t, e) {
        var i = n.get(t)
        i ? i.push(e) : n.set(t, [e])
      },
      off: function (t, e) {
        var i = n.get(t)
        i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []))
      },
      emit: function (t, e) {
        var i = n.get(t)
        i &&
          i.slice().map(function (n2) {
            n2(e)
          }),
          (i = n.get('*')) &&
            i.slice().map(function (n2) {
              n2(t, e)
            })
      },
    }
  }

  // node_modules/typed-worker/dist/index.mjs
  var uuid = () => globalThis.crypto.randomUUID()
  var WORKER_READY_MESSAGE_ID = 'typed-worker-ready'
  var IFRAME_ID_ATTR = 'data-typed-worker'
  var createWorker = (create, options = {}) => {
    const emitter = mitt_default()
    let resolveReady
    const ready = new Promise((resolve) => (resolveReady = resolve))
    let worker
    if (typeof document !== 'undefined') {
      worker = create()
      const readyMessageId =
        worker instanceof Worker
          ? WORKER_READY_MESSAGE_ID
          : options.readyMessageId || uuid()
      const handleMessage = (e) => {
        const data = e.data
        if (!data || typeof data !== 'object') return
        const { id, result } = data
        if (id === readyMessageId) {
          resolveReady()
          return
        }
        emitter.emit(id, result)
      }
      if (worker instanceof Worker) {
        worker.addEventListener('message', handleMessage)
      } else {
        worker.setAttribute(IFRAME_ID_ATTR, readyMessageId)
        window.addEventListener('message', handleMessage)
      }
    }
    const run = async (type, ...args) => {
      const id = uuid()
      await ready
      const result = new Promise((resolve) => {
        var _a
        emitter.on(id, (result2) => {
          emitter.off(id)
          resolve(result2)
        })
        const message = { id, type, args }
        if (worker instanceof Worker) {
          worker == null ? void 0 : worker.postMessage(message)
        } else if (worker) {
          ;(_a = worker == null ? void 0 : worker.contentWindow) == null
            ? void 0
            : _a.postMessage(message, '*')
        }
      })
      return result
    }
    const destroy = () => {
      if (worker && worker instanceof Worker) {
        worker.terminate()
      }
      worker = void 0
    }
    return { run, destroy }
  }

  // ts/index.ts
  var import_meta = {}
  var gameMenuBtn = getElementWithId('game-menu-btn', 'BUTTON')
  var gameMenuDiv = getElementWithId('game-menu', 'DIV')
  var infoTextEl = getElementWithId('info-text', 'P')
  var startEasyBtn = getElementWithId('start-easy', 'BUTTON')
  var boardEl = getElementWithId('sudoku-board', 'DIV')
  function updateInfo(text) {
    infoTextEl.innerText = text
  }
  var gameMenuHandler = {
    init: () => {
      gameMenuHandler.menuBtn.onclick = gameMenuHandler.toggleVisibility
    },
    menuBtn: gameMenuBtn,
    menu: gameMenuDiv,
    visible: false,
    toggleVisibility: () => {
      if (gameMenuHandler.menu.className.includes('invisible')) {
        gameMenuHandler.menu.className = gameMenuHandler.menu.className.replace(
          'invisible',
          'visible'
        )
      } else {
        gameMenuHandler.menu.className = gameMenuHandler.menu.className.replace(
          'visible',
          'invisible'
        )
      }
    },
  }
  function getElementWithId(id, tagName) {
    const el = document.getElementById(id)
    if (el !== null && isElementWithTag(el, tagName)) {
      return el
    } else {
      console.error(`Element with id ${id} is not of type ${tagName}`)
    }
    console.error(
      `Was not able to find element with id ${id}. The type checks might be at fault.`
    )
    throw new Error('Cannot continue without the element.')
  }
  function isHTMLElement(el) {
    return 'style' in el
  }
  function getElementsWithClassName(className, tag) {
    const els = [...document.getElementsByClassName(className)]
    if (!els.every(isHTMLElement)) throw new Error('Voi itku')
    const res = []
    for (let el of els) {
      if (isElementWithTag(el, tag)) res.push(el)
    }
    return res
  }
  function beginNewGame(diff) {
    updateInfo(`Beginning new game (${diff})`)
    const game = new SudokuGame()
    const controls = getElementsWithClassName('content__option', 'LI').map(
      (el) => el.children[0]
    )
    const ui = new SudokuInterface([...boardEl.children], controls, game)
    ui.drawWholeBoard()
  }
  function main() {
    gameMenuHandler.init()
    startEasyBtn.onclick = () => {
      gameMenuHandler.toggleVisibility()
      beginNewGame('easy')
    }
    updateInfo('Welcome to the game!')
  }
  main()
  function testWorker() {
    return __async(this, null, function* () {
      const bgWorker = createWorker(
        () =>
          new Worker(new URL('./worker.ts', import_meta.url), {
            type: 'module',
          })
      )
      const result = yield bgWorker.run('sum', 1, 2)
    })
  }
  testWorker()
})()
