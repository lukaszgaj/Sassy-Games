import {injectable} from 'inversify';
import {post, Response} from 'superagent';
import {BASIC_URL} from '../config/config';
import {AuthenticationService} from '../services/AuthenticationService';
import {RegisterUserRequest} from '../ApiModels/Requests/User/RegisterUserRequest';
import { LoginUserRequest } from '../ApiModels/Requests/User/LoginUserRequest';

const REGISTER_API_ENDPOINT = `${BASIC_URL}/user/register`;
const LOGIN_API_ENDPOINT = `${BASIC_URL}/user/authenticate`;

@injectable()
export class SuperAgentBasedAuthenticationService implements AuthenticationService {
    sendLoginRequest(request: LoginUserRequest): Promise<Response> {
        return post(LOGIN_API_ENDPOINT)
            .send(JSON.stringify(request))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(response => response)
            .catch(error => error.response);
    }

    sendRegisterRequest(request: RegisterUserRequest): Promise<Response> {
        return post(REGISTER_API_ENDPOINT)
            .send(JSON.stringify(request))
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .then(response => response)
            .catch(error => error.response);
    }
}