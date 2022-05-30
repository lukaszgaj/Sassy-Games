import {injectable} from 'inversify';
import superagent, {get, Response} from 'superagent';
import { UpdateUserRequest } from '../../ApiModels/Requests/User/UpdateUserRequest';
import {BASIC_URL} from '../../config/config';
import {UserService} from '../../services/Entities/UserService';
import {StoreProvider} from '../../services/Store/StoreProvider';

const GET_ALL_USERS_ENDPOINT = `${BASIC_URL}/user/get-all`;
const DELETE_USER_ENDPOINT = `${BASIC_URL}/user/delete`;
const BAN_USER_ENDPOINT = `${BASIC_URL}/user/ban`;
const UNBAN_USER_ENDPOINT = `${BASIC_URL}/user/unban`;
const UPDATE_USER_ENDPOINT = `${BASIC_URL}/user/update`;


@injectable()
export class SuperAgentBasedUserService implements UserService {
    constructor(
       private storeProvider: StoreProvider,
    ) {}

    sendGetAllUsersRequest(): Promise<Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling getAllUsers request');
        }
        return get(GET_ALL_USERS_ENDPOINT)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then(response => response)
            .catch(error => error.response);
    }

    sendRemoveUserRequest(id: string): Promise<Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling sendRemoveUserRequest request');
        }
        return superagent.delete(DELETE_USER_ENDPOINT)
            .send(JSON.stringify({id}))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then(response => response)
            .catch(error => error.response);
    }
    
    sendBanUserRequest(id: string): Promise<Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling sendRemoveUserRequest request');
        }
        return superagent.post(BAN_USER_ENDPOINT)
            .send(JSON.stringify({id}))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then(response => response)
            .catch(error => error.response);
    }    
    
    sendUnbanUserRequest(id: string): Promise<Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling sendRemoveUserRequest request');
        }
        return superagent.post(UNBAN_USER_ENDPOINT)
            .send(JSON.stringify({id}))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then(response => response)
            .catch(error => error.response);
    }

    sendUpdateUserRequest(request: UpdateUserRequest): Promise<Response | undefined> {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling sendRemoveUserRequest request');
        }
        return superagent.patch(UPDATE_USER_ENDPOINT)
            .send(JSON.stringify(request))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .then(response => response)
            .catch(error => error.response);
    }
}