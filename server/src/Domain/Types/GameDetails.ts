import {GameType} from '../Enums/GameType';

export interface GameDetails {
    id: string;
    gameType: GameType;
    winnerId: string | null;
    loserId: string | null;
    isCancelled: boolean;
    roomId: string;
}
