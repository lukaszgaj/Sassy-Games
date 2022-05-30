import {injectable} from 'inversify';
import {Response} from 'superagent';
import { UpdateUserRequest } from '../../ApiModels/Requests/User/UpdateUserRequest';

@injectable()
export abstract class UserService {
    abstract sendGetAllUsersRequest(): Promise<Response | undefined>;
    abstract sendRemoveUserRequest(id: string): Promise<Response | undefined>;
    abstract sendUnbanUserRequest(id: string): Promise<Response | undefined>;
    abstract sendBanUserRequest(id: string): Promise<Response | undefined>;
    abstract sendUpdateUserRequest(req: UpdateUserRequest): Promise<Response | undefined>;
}