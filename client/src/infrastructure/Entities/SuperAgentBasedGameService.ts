import { injectable } from 'inversify';
import superagent, { get, post } from 'superagent';
import { BASIC_URL } from '../../config/config';
import { GameService } from '../../services/Entities/GameService';
import { StoreProvider } from '../../services/Store/StoreProvider';
import { decodeToken } from '../../util/token/decodeToken';

const GET_ALL_GAMES_ENDPOINT = `${BASIC_URL}/game/get-all`;
const GET_ALL_GAMES_COUNT_ENDPOINT = `${BASIC_URL}/game/get-all-count`;
const GET_ALL_ONGOING_GAMES_COUNT_ENDPOINT = `${BASIC_URL}/game/get-all-ongoing-count`;
const GET_ALL_GAMES_FOR_LOGGED_USER_ENDPOINT = `${BASIC_URL}/game/get-all-for`;

@injectable()
export class SuperAgentBasedGameService implements GameService {
    constructor(
       private storeProvider: StoreProvider,
    ) {}

    sendGetAllGamesRequest(): Promise<superagent.Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling getAllGames request');
        }
        return get(GET_ALL_GAMES_ENDPOINT)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then(response => response)
            .catch(error => error.response);
    }   
    
    sendGetAllGamesForLoggedUserRequest(): Promise<superagent.Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling getAllGames request');
        }
        return post(GET_ALL_GAMES_FOR_LOGGED_USER_ENDPOINT)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(JSON.stringify({login: decodeToken(token).login}))
            .then(response => response)
            .catch(error => error.response);
    }

    sendGetAllGamesCountRequest(): Promise<superagent.Response | undefined> {
        return get(GET_ALL_GAMES_COUNT_ENDPOINT)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(response => response)
            .catch(error => error.response);
    }   

    sendGetAllOngoingGamesCountRequest(): Promise<superagent.Response | undefined> {
        return get(GET_ALL_ONGOING_GAMES_COUNT_ENDPOINT)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(response => response)
            .catch(error => error.response);
    }   
}