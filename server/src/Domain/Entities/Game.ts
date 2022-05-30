import {Column, Entity} from 'typeorm';
import {PrimaryColumn} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import { GameType } from '../Enums/GameType';
import {GameDetails} from '../Types/GameDetails';

@Entity({name: 'game'})
export class Game {
    static create(data: Omit<GameDetails, 'id'>): Game {
        return new Game(data);
    }

    // uuid
    @PrimaryColumn({type: 'char', length: 36})
    readonly id: string;

    @Column({type: 'longtext'})
    readonly gameType: GameType;

    @Column({type: 'longtext'})
    readonly roomId: string;

    @Column({type: 'longtext', default: null, nullable: true})
    winnerId: string;

    @Column({type: 'longtext', default: null, nullable: true})
    loserId: string;

    @Column({type: 'boolean'})
    isCancelled: boolean;

    private constructor(data?: Omit<GameDetails, 'id'>) {
        if (!data) {
            return;
        }

        this.id = uuidv4();
        this.gameType = data.gameType;
        this.isCancelled = false;
        this.roomId = data.roomId;
    }
}
