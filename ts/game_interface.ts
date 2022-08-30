import { SudokuGame } from './logic'
import { CellValue, isCellValue } from './sudoku_generator'
import { isElementWithTag } from './utils/type_checkers'
import { getElementWithId, updateInfo } from './index'

export class SudokuInterface {
  private cellEls: HTMLElement[]
  private game: SudokuGame
  private controlEls: HTMLElement[]

  constructor(
    cellEls: HTMLElement[],
    controlEls: HTMLElement[],
    game: SudokuGame
  ) {
    this.cellEls = cellEls
    this.game = game
    this.controlEls = controlEls
    this.attachEventListeners()
  }

  private attachEventListeners() {
    // CONTROL BUTTONS, OUTSIDE OF THE SUDOKU BOARD

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
            const activeIdx = this.cellEls.findIndex((e) => e === active)
            this.insertValue(activeIdx, buttonValue)
          }
        }
      })
    })

    // THE CELLS OF THE BOARD ITSELF
    const cells = this.cellEls
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
            'Numpad1',
            'Numpad2',
            'Numpad3',
            'Numpad4',
            'Numpad5',
            'Numpad6',
            'Numpad7',
            'Numpad8',
            'Numpad9',
          ].includes(event.code!)
        ) {
          const char = event.code!.charAt(5)
          const conversion = char === '' ? null : Number(char)
          console.log('converted: ', conversion)
          if (isCellValue(conversion)) {
            this.insertValue(i, conversion)
          }
        }
        if (['Backspace', 'Space', 'Delete'].includes(event.code!)) {
          this.insertValue(i, null)
        }
        this.changeFocusWithArrows(i, event)
      })
    }

    // UNDO button (should apply DI to this as well -- let's just make it work at first)
    const undoBtn = getElementWithId('undo-btn', 'BUTTON')
    undoBtn.addEventListener('click', () => {
      this.undo()
    })

    // Same for REDO and
    const redoBtn = getElementWithId('redo-btn', 'BUTTON')
    redoBtn.addEventListener('click', () => {
      this.redo()
    })

    // And RESET (could also be placed better)
    const resetBtn = getElementWithId('reset-btn', 'BUTTON')
    resetBtn.addEventListener('click', () => {
      this.reset()
    })
  }

  private changeFocusWithArrows(idx: number, event: KeyboardEventInit) {
    if (
      ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code!)
    ) {
      let newIdx: number | null = null
      switch (event.code!) {
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
          ;(el as HTMLElement).focus()
        }
      }
    }
  }

  private updateEl(idx: number) {
    const rawValue = this.game.valueAt(idx)
    console.log('raw Value: ', rawValue)
    const displayedValue = rawValue === null ? '' : String(rawValue)
    this.cellEls[idx].textContent = displayedValue
  }

  public insertValue(idx: number, value: CellValue) {
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

  private undo() {
    this.game.undo()
    this.drawWholeBoard()
  }

  private redo() {
    this.game.redo()
    this.drawWholeBoard()
  }

  private reset() {
    this.game.reset()
    this.drawWholeBoard()
  }

  public drawWholeBoard() {
    for (let i = 0; i < 81; i++) {
      this.updateEl(i)
    }
  }
}
