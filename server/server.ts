import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import './config/controllers';
import { initializeContainer } from './config/inversify.config';
import { JWTBasedAuthProvider } from './src/Infrastructure/Auth/JWTBasedAuthProvider';
import { SocketServerService } from './src/Infrastructure/Services/SocketServerService';
import { LoggerService } from './src/Infrastructure/Services/LoggerService';

const expressApp = express();
expressApp.use(cors());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(express.json());

initializeContainer().then(container => {
    const inversifyExpressServer = new InversifyExpressServer(
        container,
        null,
        null,
        expressApp,
        JWTBasedAuthProvider,
    ).build();

    const serverInstance = inversifyExpressServer.listen(8000, () => {
        container.get(LoggerService).log({filename: __filename, level: 'info', message: 'App started'});
    })
    container.get(SocketServerService).initializerServer(serverInstance);
}).catch(e => {
    console.error(e);
});
