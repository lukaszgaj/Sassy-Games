import { SquareState } from "../Components/Game";
import { findRandomEmptyIndex } from "./findRandomEmptyIndex";

export const findEmptyCornerIndex = (boardState: SquareState[]): number => {
    let returnValue: number | undefined = undefined;
    [4, 0, 2, 6, 8].every(index => {
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