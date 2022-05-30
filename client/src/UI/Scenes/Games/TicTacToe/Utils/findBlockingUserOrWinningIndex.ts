import { SquareState } from "../Components/Game";
import { findRandomEmptyIndex } from "./findRandomEmptyIndex";

export const findBlockingUserOrWinningIndex = (boardState: SquareState[]): number => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check winnning condiitions
    for (const line of lines) {
        const [a, b, c] = line;
        if (boardState[a] !== null || boardState[b] !== null || boardState[c] !== null) {
            if (boardState[a] === 'X' && boardState[b] === 'X' && boardState[c] === null) {
                return c;
            }

            if (boardState[a] === 'X' && boardState[c] === 'X' && boardState[b] === null) {
                return b;
            }

            if (boardState[b] === 'X' && boardState[c] === 'X' && boardState[a] === null) {
                return a;
            }
        }
    }

    // Check blocking condiitions
    for (const line of lines) {
        const [a, b, c] = line;
        if (boardState[a] !== null || boardState[b] !== null || boardState[c] !== null) {
            if (boardState[a] === boardState[b] && boardState[c] === null) {
                return c;
            }

            if (boardState[a] === boardState[c] && boardState[b] === null) {
                return b;
            }

            if (boardState[b] === boardState[c] && boardState[a] === null) {
                return a;
            }
        }
    }
    // Fallback to random empty index
    return findRandomEmptyIndex(boardState);
}