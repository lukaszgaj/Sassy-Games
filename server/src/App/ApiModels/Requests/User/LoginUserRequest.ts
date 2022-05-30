import {injectable} from 'inversify';

@injectable()
export class LoginUserRequest  {
    login: string;
    password: string;
}
