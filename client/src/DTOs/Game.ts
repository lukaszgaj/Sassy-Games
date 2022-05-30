export interface Game {
    id: string;
    gameType: Game.GameType;
    winnerId: string | null;
    loserId: string | null;
    isCancelled: boolean;
    roomId: string;
}

export namespace Game {
    export enum GameType {
        TicTacToe,
    }
}