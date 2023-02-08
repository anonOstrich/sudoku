import { SudokuGame } from './logic/sudoku_game';
import { WorkerThreadManager } from './worker_thread_utils';

const numbersByDifficulty: Map<difficulty, number> = new Map();
numbersByDifficulty.set('easy', 50);
numbersByDifficulty.set('medium', 40);
numbersByDifficulty.set('hard', 30);
numbersByDifficulty.set('expert', 20);

export type difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// TODO: Expert takes lots of time. Get from API or start generating as soon as the user enters the site?
export async function createNewSudoku(diff: difficulty) {
  const { data, processingTime } = await WorkerThreadManager.postMessage({
    type: 'generate-sudoku',
    visibleNumbers: numbersByDifficulty.get(diff) ?? 50,
  });
  return new SudokuGame(data);
}
