import { BoardArray } from "../logic/logic";
import { promiseAwait } from "../utils/api_helpers";

function createEmptyBoard(){
    const res = []
    for (let i = 0; i < 81; i++) {
        res.push(null)
    }
    return res as BoardArray
}

async function postSudokuImageGENUINE(encodedImage: string): Promise<BoardArray> {
    throw new Error("Not implemented yet!")
}


export async function postSudokuImage(encodedImage: string): Promise<BoardArray> {
    console.log(`Fake posting...`)
    await promiseAwait(10000)
    const result = createEmptyBoard()
    result[3] = 6
    result[4] = 6
    result[5] = 6
    return result
}