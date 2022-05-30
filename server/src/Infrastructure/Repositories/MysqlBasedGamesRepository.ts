import { injectable } from 'inversify';
import { DataSource } from 'typeorm';
import { Game } from '../../Domain/Entities/Game';
import { GamesRepository } from '../../Domain/Repositories/GamesRepository';
import { GameDetails } from '../../Domain/Types/GameDetails';

@injectable()
export class MysqlBasedGamesRepository implements GamesRepository {
    constructor(
        private dataSource: DataSource,
    ) {
    }

    async getGameById(gameId: string): Promise<Game | null> {
        return this.dataSource.createEntityManager()
            .createQueryBuilder(Game, 'game')
            .where('id = :gameId', { gameId })
            .limit(1)
            .getOne()
            .then(result => result || null)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }


    async store(game: Game): Promise<void> {
        return this.dataSource
            .getRepository(Game)
            .save(game)
            .then(() => void 0)
            .catch(e => {
                if (e.code === 'ER_DUP_ENTRY') {
                    return void 0;
                }
                throw new Error(`Repository error: ${e}`);
            });
    }

    async getAll(): Promise<Game[] | undefined> {
        return this.dataSource
            .getRepository(Game)
            .createQueryBuilder('game')
            .getMany()
            .then(games => games)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }

    async getAllFor(login: string): Promise<Game[] | undefined> {
        return this.dataSource
            .getRepository(Game)
            .createQueryBuilder('game')
            .where('winnerId = :login', { login })
            .orWhere('loserId = :login', { login })
            .getMany()
            .then(games => games)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }


    async getGameByRoomId(roomId: string): Promise<Game | null> {
        return this.dataSource.createEntityManager()
            .createQueryBuilder(Game, 'game')
            .where('roomId = :roomId', { roomId })
            .limit(1)
            .getOne()
            .then(result => result || null)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }

    async update(id: GameDetails['id'], data: Partial<Omit<GameDetails, 'id'>>): Promise<void> {
        const game = await this.getGameById(id);
        if (!game) {
            throw new Error(`Repository error: user with id: ${id} not found`);
        }

        if (data.loserId) {
            game.loserId = data.loserId;
        }

        if (data.winnerId) {
            game.winnerId = data.winnerId;
        }

        if (data.isCancelled) {
            game.isCancelled = data.isCancelled;
        }

        return this.dataSource
            .getRepository(Game)
            .update(game.id, game)
            .then(() => void 0)
            .catch(e => {
                if (e.code === 'ER_DUP_ENTRY') {
                    return void 0;
                }
                throw new Error(`Repository error: ${e}`);
            });
    }
}
