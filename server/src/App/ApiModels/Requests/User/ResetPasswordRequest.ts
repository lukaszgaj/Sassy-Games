import {injectable} from 'inversify';

@injectable()
export class ResetPasswordRequest {
    currentPassword: string;
    newPassword: string;
}
