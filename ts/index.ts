import { SudokuBoard } from './logic'
import {
  ElementsByTagNames,
  TagName,
  isElementWithTag,
} from './utils/type_checkers'

/**
 * Find references to all the relevant components
 */
const gameMenuBtn = getElementWithId('game-menu-btn', 'BUTTON')
const gameMenuDiv = getElementWithId('game-menu', 'DIV')
const infoTextEl = getElementWithId('info-text', 'P')
const startEasyBtn = getElementWithId('start-easy', 'BUTTON')
const boardEl = getElementWithId('sudoku-board', 'DIV')

function updateInfo(text: string) {
  infoTextEl.innerText = text
}

const gameMenuHandler = {
  init: () => {
    gameMenuHandler.menuBtn.onclick = gameMenuHandler.toggleVisibility
  },
  menuBtn: gameMenuBtn,
  menu: gameMenuDiv,
  visible: false,
  toggleVisibility: () => {
    console.log('Toggling!')
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

function getElementWithId<T extends TagName>(
  id: string,
  tagName: T
): ElementsByTagNames[T] {
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

function drawBoard(board: SudokuBoard) {
  console.log('Here 1???')
  const visibleBoard = board.getBoard()
  console.log('Here?')
  const cells = boardEl.children
  for (let i = 0; i < 81; i++) {
    cells[i].textContent =
      visibleBoard[i] === null ? '' : String(visibleBoard[i])
  }
}

type difficulty = 'easy'

function beginNewGame(diff: difficulty) {
  updateInfo(`Beginning new game (${diff})`)
  const board = new SudokuBoard()
  drawBoard(board)
  console.log(`Board: `, board)
  // reveal board
}

function attachEventListeners() {
  gameMenuHandler.init()
  startEasyBtn.onclick = () => {
    gameMenuHandler.toggleVisibility()
    beginNewGame('easy')
  }
  const cells = boardEl.children
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('keydown', (event: KeyboardEventInit) => {
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
        ].includes(event.code!)
      ) {
        const char = event.code!.charAt(5)
        cells[i].textContent = char
      }
    })
  }
}

function main() {
  attachEventListeners()
  updateInfo('Welcome to the game!')
}

main()
