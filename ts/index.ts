import { SudokuInterface } from './game_interface'
import { SudokuGame } from './logic'
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

export function updateInfo(text: string) {
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

export function getElementWithId<T extends TagName>(
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

// I think only HTML elements have style
function isHTMLElement(el: Element): el is HTMLElement {
  return 'style' in el
}

export function getElementsWithClassName<T extends TagName>(
  className: string,
  tag: T
): Array<ElementsByTagNames[T]> {
  const els = [...document.getElementsByClassName(className)]

  if (!els.every(isHTMLElement)) throw new Error('Voi itku')

  const res: Array<ElementsByTagNames[T]> = []

  for (let el of els) {
    if (isElementWithTag(el, tag)) res.push(el)
  }

  return res
}

type difficulty = 'easy'

function beginNewGame(diff: difficulty) {
  updateInfo(`Beginning new game (${diff})`)

  const game = new SudokuGame()
  const controls = getElementsWithClassName('content__option', 'LI').map(
    (el) => el.children[0]
  ) as HTMLButtonElement[]
  const ui = new SudokuInterface(
    [...boardEl.children] as HTMLElement[],
    controls,
    game
  )
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

async function testWorker() {
  const bgWorker = new Worker('js/worker_code.js')

  bgWorker.onmessage = (e) => {
    const { data } = e
    console.log('received! ', data)
  }
}

testWorker()
