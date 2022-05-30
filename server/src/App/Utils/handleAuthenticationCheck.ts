import express from 'express';
import { Principal } from "../../Infrastructure/Auth/Principal";
import { LoggerService } from '../../Infrastructure/Services/LoggerService';
import { checkAuthentication } from "./checkAuthentication";

export async function handleAuthenticationCheck({ authPrincipal, res, loggerService, parentFilename }: {
    authPrincipal: Principal,
    res: express.Response,
    loggerService: LoggerService,
    parentFilename: string,
}): Promise<'fail' | 'success'> {
    try {
        await checkAuthentication(authPrincipal);
        return 'success';
    } catch (e) {
        loggerService.log({
            filename: __filename,
            level: 'error',
            message: 'Failed to authenticate',
            payload: {
                parentFilename,
            },
        })
        res.status(403).json({ message: 'FORBIDDEN' });
        return 'fail';
    }
}