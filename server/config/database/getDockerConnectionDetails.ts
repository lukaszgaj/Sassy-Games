import {DataSourceOptions} from 'typeorm';
import {entities} from '../entities';

export function getDockerConnectionDetails(): DataSourceOptions {
    return {
        database: 'sassy_games_server_app',
        entities,
        host: 'db',
        logging: false,
        password: 'sassy_games_pw',
        synchronize: true,
        type: 'mysql',
        username: 'sassy_games_user',
    };
}
