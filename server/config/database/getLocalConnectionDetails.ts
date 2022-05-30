import {DataSourceOptions} from 'typeorm';
import {entities} from '../entities';

export function getLocalConnectionDetails(): DataSourceOptions {
    return {
        database: 'sassy_games_server_app',
        entities,
        host: 'localhost',
        logging: false,
        password: 'sassy_games_pw',
        port: 18202,
        synchronize: true,
        type: 'mysql',
        username: 'sassy_games_user',
    };
}
