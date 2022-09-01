import { SudokuGame } from './logic'
import {
  BoardArray,
  generateRandomSudoku,
  generateSudokuPuzzle,
} from './sudoku_generator'

export type WorkerMessage = GenerateMessage | TestMessage

export interface GenerateMessage {
  type: 'generate-sudoku'
  visibleNumbers: number
}

export interface TestMessage {
  type: 'test'
}

generateSudokuPuzzle

type HandlerType = {
  [t in WorkerMessage['type']]: (data: WorkerMessage) => void
}

export type WorkerResponse<T> = {
  data: T
  processingTime: number
  id: number
}

let id = 1

export type ResponseThinker<T extends WorkerMessage> = T extends GenerateMessage
  ? WorkerResponse<BoardArray>
  : WorkerResponse<string>

function wrapWorkerFunction<T>(fn: () => T): WorkerResponse<T> {
  const start = self.performance.now()
  const result = fn()
  const end = self.performance.now()

  return {
    data: result,
    processingTime: end - start,
    id: id++,
  }
}

const handlers: HandlerType = {
  'generate-sudoku': (something) => {
    // There is definitely a cleaner work to infer the type of the message, but will need the internet to find it...
    if (something.type === 'generate-sudoku') {
      const { visibleNumbers } = something
      const datum = wrapWorkerFunction(() =>
        generateSudokuPuzzle(visibleNumbers)
      )
      self.postMessage(datum)
    }
  },
  test: () => {
    const datum = wrapWorkerFunction(() => 'Test successful!')
    self.postMessage(datum)
  },
}

function handleMessage(e: MessageEvent<WorkerMessage>) {
  console.debug('received message: ', e)
  const { data } = e
  const handler = handlers[data.type]
  handler(data)
}

async function main() {
  self.onmessage = handleMessage
}

main()
