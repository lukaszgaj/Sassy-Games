import { SquareState } from "../Components/Game";
import { findRandomEmptyIndex } from "./findRandomEmptyIndex";

export const findEmptyCrossIndex = (boardState: SquareState[]): number => {
    let returnValue: number | undefined = undefined;
    [4, 1, 3, 5, 7].every(index => {
        if (boardState[index] === null) {
            returnValue = index;
            return false;
        }
        return true;
    })

    if (returnValue !== undefined) {
        return returnValue;
    }

    return findRandomEmptyIndex(boardState);
}