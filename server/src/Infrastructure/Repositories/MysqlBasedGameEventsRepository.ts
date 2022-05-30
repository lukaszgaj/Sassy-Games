import { injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { GameEvent } from '../../Domain/Entities/GameEvent';
import { GameEventsRepository } from '../../Domain/Repositories/GameEventsRepository';

@injectable()
export class MysqlBasedGameEventsRepository implements GameEventsRepository {
    constructor(
        private dataSource: DataSource,
    ) {
    }

    async getGameEventById(gameEventId: string): Promise<GameEvent | null> {
        return this.dataSource.createEntityManager()
            .createQueryBuilder(GameEvent, 'game_event')
            .where('id = :gameEventId', {gameEventId})
            .limit(1)
            .getOne()
            .then(result => result || null)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }


    async store(gameEvent: GameEvent): Promise<void> {
        return this.dataSource
            .getRepository(GameEvent)
            .save(gameEvent)
            .then(() => void 0)
            .catch(e => {
                if (e.code === 'ER_DUP_ENTRY') {
                    return void 0;
                }
                throw new Error(`Repository error: ${e}`);
            });
    }

    async getAll(): Promise<GameEvent[] | undefined> {
        return this.dataSource
            .getRepository(GameEvent)
            .createQueryBuilder('game_event')
            .getMany()
            .then(gameEvents => gameEvents)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }

    async getAllFor(gameId: string): Promise<GameEvent[] | undefined> {
        return this.dataSource
            .getRepository(GameEvent)
            .createQueryBuilder('game_event')
            .where('gameId = :gameId', {gameId})
            .getMany()
            .then(gameEvents => gameEvents)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }
}
