import { Game } from "./Game";

export interface GameEvent {
    id: string;
    gameType: Game.GameType;
    userId: string;
    createdAt: string;
    payload: string;
    gameId: string;
}