import {Container} from 'inversify';
import { SuperAgentBasedGameEventService } from '../infrastructure/Entities/SuperAgentBasedGameEventService';
import { SuperAgentBasedGameService } from '../infrastructure/Entities/SuperAgentBasedGameService';
import {SuperAgentBasedUserService} from '../infrastructure/Entities/SuperAgentBasedUserService';
import {SuperAgentBasedAuthenticationService} from '../infrastructure/SuperAgentBasedAuthenticationService';
import {StoreConfigurator} from '../redux/StoreConfigurator';
import {AuthenticationService} from '../services/AuthenticationService';
import { GameEventService } from '../services/Entities/GameEventService';
import { GameService } from '../services/Entities/GameService';
import {UserService} from '../services/Entities/UserService';
import {LocalStorageService} from '../services/LocalStorageService';
import {ResponseHandler} from '../services/ResponseHandler';
import { SocketService } from '../services/SocketService';
import {StoreProvider} from '../services/Store/StoreProvider';
import {TokenProvider} from '../services/Store/TokenProvider';

export function initializeContainer(): Container {
    const container = new Container({
        defaultScope: 'Singleton',
    });

    container.bind(LocalStorageService).toSelf();
    container.bind(ResponseHandler).toSelf();
    container.bind(AuthenticationService).to(SuperAgentBasedAuthenticationService);

    container.bind(UserService).to(SuperAgentBasedUserService);
    container.bind(GameService).to(SuperAgentBasedGameService);
    container.bind(GameEventService).to(SuperAgentBasedGameEventService);

    container.bind(StoreConfigurator).toSelf();
    container.bind(StoreProvider).toSelf();
    container.bind(TokenProvider).toSelf();
    container.bind(SocketService).toSelf();
    return container;
}