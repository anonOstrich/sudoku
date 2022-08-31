import { SudokuGame } from './logic'
import { logBoard } from './sudoku_generator'

async function sleep(time: number) {
  return new Promise((res) => setTimeout(res, time))
}

async function main() {
  self.postMessage('Starting...')
  const game = new SudokuGame()
  self.postMessage(`Finished! The game is ${game.getBoard()}`)
}

main()
