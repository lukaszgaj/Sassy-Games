import {injectable} from 'inversify';
import {Response} from 'superagent'
import { LoginUserRequest } from '../ApiModels/Requests/User/LoginUserRequest';
import {RegisterUserRequest} from '../ApiModels/Requests/User/RegisterUserRequest';

@injectable()
export abstract class AuthenticationService {
    abstract sendLoginRequest(request: LoginUserRequest): Promise<Response>;
    abstract sendRegisterRequest(request: RegisterUserRequest): Promise<Response>;
}