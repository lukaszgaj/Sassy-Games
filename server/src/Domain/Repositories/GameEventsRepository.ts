import {GameEvent} from '../Entities/GameEvent';

export abstract class GameEventsRepository {
    abstract getGameEventById(id: string): Promise<GameEvent | null>;
    abstract store(gameEvent: GameEvent): Promise<void>;
    abstract getAll(): Promise<GameEvent[] | undefined>;
    abstract getAllFor(gameId: string): Promise<GameEvent[] | undefined>;
}
