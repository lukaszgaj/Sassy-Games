import {Game} from '../Entities/Game';
import { GameDetails } from '../Types/GameDetails';

export abstract class GamesRepository {
    abstract getGameById(id: string): Promise<Game | null>;
    abstract store(game: Game): Promise<void>;
    abstract getAll(): Promise<Game[] | undefined>;
    abstract getAllFor(login: string): Promise<Game[] | undefined>;
    abstract getGameByRoomId(roomId: string): Promise<Game | null>;
    abstract update(id: string, data: Partial<Omit<GameDetails, 'id'>>): Promise<void>;
}
