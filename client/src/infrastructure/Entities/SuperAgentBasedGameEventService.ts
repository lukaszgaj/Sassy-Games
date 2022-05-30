import { injectable } from 'inversify';
import superagent, { post } from 'superagent';
import { BASIC_URL } from '../../config/config';
import { GameEventService } from '../../services/Entities/GameEventService';
import { StoreProvider } from '../../services/Store/StoreProvider';

const GET_ALL_GAME_EVENTS_FOR_GAME_ID_ENDPOINT = `${BASIC_URL}/game_event/get-all-for`;

@injectable()
export class SuperAgentBasedGameEventService implements GameEventService {
    constructor(
       private storeProvider: StoreProvider,
    ) {}
    
    sendGetAllGamesForLoggedUserRequest(gameId: string): Promise<superagent.Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling getAllGames request');
        }
        return post(GET_ALL_GAME_EVENTS_FOR_GAME_ID_ENDPOINT)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify({gameId}))
            .then(response => response)
            .catch(error => error.response);
    }
}