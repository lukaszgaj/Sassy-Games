import {Column, Entity} from 'typeorm';
import {PrimaryColumn} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import { GameType } from '../Enums/GameType';
import {GameEventDetails} from '../Types/GameEventDetails';

@Entity({name: 'game_event'})
export class GameEvent {
    static create(data: Omit<GameEventDetails, 'id' | 'createdAt'>): GameEvent {
        return new GameEvent(data);
    }

    // uuid
    @PrimaryColumn({type: 'char', length: 36})
    readonly id: string;

    @Column({type: 'longtext'})
    readonly gameType: GameType;

    @Column({type: 'longtext'})
    readonly gameId: string;

    @Column({type: 'longtext'})
    readonly createdAt: string;

    @Column({type: 'longtext'})
    readonly userId: string;

    @Column({type: 'blob'})
    readonly payload: string;

    private constructor(data?: Omit<GameEventDetails, 'id' | 'createdAt'>) {
        if (!data) {
            return;
        }

        this.id = uuidv4();
        this.createdAt = new Date().toISOString();
        this.gameType = data.gameType;
        this.userId = data.userId;
        this.payload = data.payload;
        this.gameId = data.gameId;
    }
}
