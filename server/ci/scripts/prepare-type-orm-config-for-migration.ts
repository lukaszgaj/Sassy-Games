const fs = require('fs');
const ormConfig: OrmConfig = {
    cli: {
        migrationsDir: 'migration',
    },
    database: 'sassy_games_server_app',
    entities: [
        'src/Domain/Entities/*.ts',
        'src/Domain/Entities/*.js',
    ],
    host: 'localhost',
    logging: true,
    migrations: [
        'migration/*.ts',
        'migration/*.js',
    ],
    migrationsTableName: 'migration_versions',
    password: 'sassy_games_pw',
    port: 18202,
    synchronize: true,
    type: 'mysql',
    username: 'sassy_games_user',
};

try {
    fs.writeFileSync('./ormconfig.json', JSON.stringify(ormConfig));
    console.log('The ormconfig.json has been overwritten.');
} catch (e) {
    console.error(e);
    process.exit(1);
}

export interface OrmConfig {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    logging: boolean;
    synchronize: boolean;
    migrationsTableName: string;
    migrations: string[];
    cli: {
        migrationsDir: string;
    };
}
