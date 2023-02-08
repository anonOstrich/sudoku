// test that this produces reasonable results
export type CellNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = CellNumber | null;

// Explicitly: a tuple of 81 values, not an array of any length
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
];

export function boardIsComplete(board: BoardArray) {
  return board.every((v) => v !== null) && boardIsValid(board);
}

function partIsValid(values: CellValue[]) {
  if (values.length !== 9) return false;

  const encountered = new Set();

  return values.every((v) => {
    if (v === null) return true;

    if (encountered.has(v)) {
      return false;
    }
    encountered.add(v);
    return true;
  });
}

// indexing: 0-8
export function columnIsValid(board: BoardArray, idx: number) {
  const arr = [...new Array(9)].map((_, index) => index * 9 + idx);

  const indices = new Set(arr);
  const column = board.filter((_, index) => indices.has(index));
  return partIsValid(column);
}

export function rowIsValid(board: BoardArray, idx: number) {
  const row = board.filter(
    (_, index) => idx * 9 <= index && index < idx * 9 + 9
  );
  return partIsValid(row);
}

export function squareIsValid(board: BoardArray, idx: number) {
  const left_top = 3 * idx + Math.floor(idx / 3) * (2 * 9);
  const left_center = left_top + 9;
  const left_bottom = left_center + 9;
  const square = board.filter((_, index) => {
    return (
      (left_top <= index && index < left_top + 3) ||
      (left_center <= index && index < left_center + 3) ||
      (left_bottom <= index && index < left_bottom + 3)
    );
  });
  return partIsValid(square);
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
      return false;
    }
  }
  return true;
}
