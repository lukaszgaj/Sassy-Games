import jwt_decode from 'jwt-decode';
import {UserToken} from '../../DTOs/UserToken';

export const decodeToken = (token: string): UserToken => {
    return jwt_decode(token) as UserToken;
};