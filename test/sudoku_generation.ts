import * as assert from 'assert'
import { expect } from 'chai'
import { BoardArray, generate, rowIsValid } from '../ts/sudoku_generator'


function generateBlankBoard(): BoardArray {
    return [
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null,
    ]
}

describe('Sudoku board validity checks', () => {
    describe('should structurally', () => {
        it('return false when the number of cells is not 81')
        it('return true when the number of cells is 81')
        it('return false when when there are non-numbers or nulls')
        it('return false when there are numbers in the wrong range')
        it('return true when the cell values are in correct domain')
    })

    describe('should detect by the contents', () => {
        it('when a row may be valid', () => {
            expect(rowIsValid(generateBlankBoard(), 0), "Empty row should be valid but was not").to.be.true
        })
        it('when a column may be valid')
        it('when a 3x3 grid may be valid')
        it('when an entire board may be valid')
    })

    it('should detect a fully complete sudoku')
})

describe('Sudoku generation', () => {
    describe('validity checks', () => {
        it('should XXX', () => {
            expect(generate(), "No no no no").to.have.lengthOf(0)
        })
    })
})