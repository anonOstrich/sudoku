type CellNumber = 1|2|3|4|5|6|7|8|9
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
    CellValue,
]

function isCellValue(value: number | null): value is CellValue {
    return value === null || [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(value)
}

export function isBoardArray(dataArray: Array<number|null>): dataArray is BoardArray {
    return dataArray.length === 81 && 
            dataArray.every(datum => isCellValue(datum))
}

function partIsValid(values: CellValue[]) {
    if (values.length !== 9) return false

    const encountered = new Set()
    values.forEach(v => {
        if (v !== null) {
            if (encountered.has(v)) return false
            encountered.add(v)
        }
    })
    return true
}

// indexing: 0-8
export function columnIsValid(board: BoardArray, idx: number) {
    const indices = new Set(Array(9).map((_, index) => index * 9 + idx))
    const column = board.filter((_, index) => indices.has(index))
    return partIsValid(column)
}

export function rowIsValid(board: BoardArray, idx: number) {
    const row = board.filter((_, index) => idx * 9 <= index && index < idx*9 + 9)
    return partIsValid(row)
}

export function squareIsValid(board: BoardArray, idx: number) {
    const left_top = 3 * idx;
    const left_center = left_top + 9
    const left_bottom = left_center + 9
    const square = board.filter((_, index) => {
        return (left_top <= index && index < left_top + 3) ||
        (left_center <= index && index < left_center + 3) ||
        (left_bottom <= index && index < left_bottom + 3)
    })
    return partIsValid(square)
}

export function generate(): Array<number> {
    return []
}


function hide(fullBoard: Array<number>): Array<number|null>{
    return []
}