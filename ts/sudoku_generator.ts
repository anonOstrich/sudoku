type CellNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
import { SudokuBoard } from './logic'
type CellValue = CellNumber | null

export type BoardArray = [
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,

  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue,
  CellValue
]

function isCellValue(value: number | null): value is CellValue {
  return value === null || [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(value)
}

export function isBoardArray(
  dataArray: Array<number | null>
): dataArray is BoardArray {
  return (
    dataArray.length === 81 && dataArray.every((datum) => isCellValue(datum))
  )
}

function partIsValid(values: CellValue[]) {
  if (values.length !== 9) return false

  const encountered = new Set()

  return values.every((v) => {
    if (v === null) return true

    if (encountered.has(v)) {
      return false
    }
    encountered.add(v)
    return true
  })
}

// indexing: 0-8
export function columnIsValid(board: BoardArray, idx: number) {
  const arr = [...new Array(9)].map((_, index) => index * 9 + idx)

  const indices = new Set(arr)
  const column = board.filter((_, index) => indices.has(index))
  return partIsValid(column)
}

export function rowIsValid(board: BoardArray, idx: number) {
  const row = board.filter(
    (_, index) => idx * 9 <= index && index < idx * 9 + 9
  )
  return partIsValid(row)
}

export function squareIsValid(board: BoardArray, idx: number) {
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

export function boardIsValid(board: BoardArray) {
  // Absolutely not the best way to write this... But wanted to freshen up reduce and be Very Functional
  // Faster even to go with a loop that can terminate early
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

export function boardIsComplete(board: BoardArray) {
  return board.every((v) => v !== null) && boardIsValid(board)
}

export function generateBlankBoard(): BoardArray {
  const blank = [...new Array(81)].map((_) => null)
  if (isBoardArray(blank)) return blank
  throw new TypeError(`BoardArray seems to have changed definition`)
}

/*
Based on Fisher-Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
Produces more uniform results on different JS engines
*/

type shufflingAlgorithm = 'default' | 'fisher-yates'

function defaultAlgorithm(array: unknown[]) {
  array.sort(() => Math.random() - 0.5)
}

function fisherYatesAlgorithm(array: unknown[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const shufflingAlgorithmsByNames = new Map<
  shufflingAlgorithm,
  (arr: unknown[]) => void
>([
  ['default', defaultAlgorithm],
  ['fisher-yates', fisherYatesAlgorithm],
])

export function getNumberPossibilities(
  shuffleAlgorithm: shufflingAlgorithm = 'fisher-yates'
): CellNumber[] {
  // Could get rid of the as, but...No interest right now for these details
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9] as CellNumber[]
  const algorithmFn = shufflingAlgorithmsByNames.get(shuffleAlgorithm)
  if (algorithmFn === undefined)
    throw new Error(
      `The implementation for ${shuffleAlgorithm} is missing from the map`
    )

  algorithmFn(array)

  return array
}

export function formatBoard(board: BoardArray) {
  let formatted = ''
  for (let i = 0; i < 9; i++) {
    formatted +=
      board
        .slice(i * 9, i * 9 + 9)
        .map((e) => (e === null ? ' ' : e))
        .join('|') + '\n'
  }
  return formatted
}

export function logBoard(board: BoardArray) {
  console.log(formatBoard(board))
}

export function fillNextNumber(board: BoardArray, idx: number): boolean {
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

/**
 * The actual important thing that's exported from the file
 *
 * @returns A valid sudoku board, should be (fairly) random
 */
export function generateRandomSudoku(): BoardArray {
  const board = generateBlankBoard()
  fillNextNumber(board, 0)
  return board
}

function hasUniqueSolution(board: BoardArray): boolean {
  return true
  throw new Error('Not implemented xD')
}

function hideOne(board: BoardArray) {
  const possibleIndices: number[] = []
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
  throw new Error(
    'Not possible to remove any number without making the puzzle ambiguous'
  )
  return false
}

export function hide(fullBoard: BoardArray, cellsToHide: number): BoardArray {
  // In case we don't want to mutate the original board -- quick correctness checking could be done simply by comparing to the value in the full board

  const board = [...fullBoard] as BoardArray

  // Strictly speaking, a sudoku with 17 numbers may have a unique solution.
  // So 64 hideable cells in that case. We'll push that limit if need be...
  if (cellsToHide < 0 || cellsToHide > 60) {
    throw new RangeError(
      `Not possible to creat a Sudoku with ${cellsToHide} hidden numbers.`
    )
  }
  for (let i = 0; i < cellsToHide; i++) {
    hideOne(board)
  }
  return board
}
