import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import { GameEventsRepository } from '../src/Domain/Repositories/GameEventsRepository';
import { GamesRepository } from '../src/Domain/Repositories/GamesRepository';
import { UsersRepository } from '../src/Domain/Repositories/UsersRepository';
import { MysqlBasedGameEventsRepository } from '../src/Infrastructure/Repositories/MysqlBasedGameEventsRepository';
import { MysqlBasedGamesRepository } from '../src/Infrastructure/Repositories/MysqlBasedGamesRepository';
import { MysqlBasedUsersRepository } from '../src/Infrastructure/Repositories/MysqlBasedUsersRepository';
import { LoggerService } from '../src/Infrastructure/Services/LoggerService';
import { SocketServerService } from '../src/Infrastructure/Services/SocketServerService';
import { getDockerConnectionDetails } from './database/getDockerConnectionDetails';
import { getLocalConnectionDetails } from './database/getLocalConnectionDetails';
import { promisify } from 'util';

export async function initializeContainer() {
    const container = new Container({ defaultScope: 'Singleton' });

    container.bind(UsersRepository).to(MysqlBasedUsersRepository);
    container.bind(GameEventsRepository).to(MysqlBasedGameEventsRepository);
    container.bind(GamesRepository).to(MysqlBasedGamesRepository);
    container.bind(LoggerService).toSelf();
    const loggerService = container.get(LoggerService);

    const dataSource = await new DataSource(process.env.APP_ENV === 'docker' ? getDockerConnectionDetails() : getLocalConnectionDetails());

    for (let i = 0; i <= 100; i++) {
        try {
            await dataSource.initialize();
            loggerService.log({ filename: __filename, level: 'info', message: 'Successfully connected to database.' });
            break;
        } catch (e) {
            if (i === 100) {
                loggerService.log({ filename: __filename, level: 'error', message: 'Unable to connect to database.' });
                throw new Error('Unable to connect to database.')
            }
            loggerService.log({ filename: __filename, level: 'error', message: `Failed to connect to database, attempt: ${i}. Retrying in 10 seconds.` });
            await promisify(setTimeout)(10000);
        }
    }

    container.bind(DataSource).toConstantValue(dataSource);
    container.bind(SocketServerService).toSelf();

    return container;
}
