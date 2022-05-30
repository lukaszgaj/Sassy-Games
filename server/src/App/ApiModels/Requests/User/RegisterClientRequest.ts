import {injectable} from 'inversify';

@injectable()
export class RegisterClientRequest  {
    login: string;
    password: string;
}
