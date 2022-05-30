import {GameType} from '../Enums/GameType';

export interface GameEventDetails {
    id: string;
    gameType: GameType;
    userId: string;
    createdAt: string;
    payload: string;
    gameId: string;
}
