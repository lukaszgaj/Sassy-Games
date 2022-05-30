import { SquareState } from "../Components/Game";

export const findRandomEmptyIndex = (boardState: SquareState[]): number =>  {
    const indexes = Array.from(Array(boardState.length).keys());
    const availableIndexes = indexes.filter((index) => boardState[index] == null);
    const selectedIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    return selectedIndex;
}