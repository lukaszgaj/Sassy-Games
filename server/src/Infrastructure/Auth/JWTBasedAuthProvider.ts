import express from 'express';
import {injectable} from 'inversify';
import {interfaces} from 'inversify-express-utils';
import {verify} from 'jsonwebtoken';
import {UserDetails} from '../../Domain/Types/UserDetails';
import {Principal} from './Principal';

@injectable()
export class JWTBasedAuthProvider implements interfaces.AuthProvider {
    async getUser(
        req: express.Request,
    ): Promise <interfaces.Principal> {
        const tokenString = req.headers.authorization || req.query._token;
        if (typeof tokenString !== 'string') {
            return new Principal();
        }
        if (!process.env.JWT_KEY) {
            throw new Error('Missing JWT_KEY');
        }
        try {
            const token = verify(tokenString, process.env.JWT_KEY);
            return new Principal(token as UserDetails, tokenString);
        } catch (e) {
            return new Principal();
        }
    }
}
