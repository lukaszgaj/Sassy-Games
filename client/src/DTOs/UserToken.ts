import { User } from "./User";

export interface UserToken {
    id: string;
    login: string;
    isBanned: boolean;
    userRole: User.UserRole;
    exp: number;
    iat: number;
}
