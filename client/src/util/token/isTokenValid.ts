import {decodeToken} from './decodeToken';

export const isTokenValid = (token: string): boolean => {
    return Date.now() < decodeToken(token).exp * 1000;
};