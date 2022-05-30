import express from 'express';
import { controller, httpGet, httpPost, principal, request, response } from 'inversify-express-utils';
import { GamesRepository } from '../../Domain/Repositories/GamesRepository';
import { Principal } from '../../Infrastructure/Auth/Principal';
import { LoggerService } from '../../Infrastructure/Services/LoggerService';
import { SocketServerService } from '../../Infrastructure/Services/SocketServerService';
import { handleAuthenticationCheck } from '../Utils/handleAuthenticationCheck';

const path = '/game';

@controller(path)
export class GameController {
    constructor(
        private gamesRepository: GamesRepository,
        private socketServerService: SocketServerService,
        private loggerService: LoggerService,
    ) { }

    @httpGet('/get-all')
    async getAllGames(
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ res, authPrincipal, loggerService: this.loggerService, parentFilename: __filename });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }
        const games = await this.gamesRepository.getAll();
        res.status(200).json(games);
    }

    @httpGet('/get-all-count')
    async getAllGamesCount(
        @response() res: express.Response,
    ) {
        const games = await this.gamesRepository.getAll();
        res.status(200).json(games?.length);
    }

    @httpPost('/get-all-for')
    async getAllGamesFor(
        @response() res: express.Response,
        @request() req: express.Request,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ res, authPrincipal, loggerService: this.loggerService, parentFilename: __filename });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }

        if (!req.body.login) {
            res.status(400).json({ message: 'PLEASE_PROVIDE_VALID_DATA' });
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'getAllGamesFor -> wrong data provided',
            })
            return;
        }

        const games = await this.gamesRepository.getAllFor(req.body.login);
        res.status(200).json(games);
    }


    @httpGet('/get-all-ongoing-count')
    async getAllGamesOngoingCount(
        @response() res: express.Response,
    ) {
        const gamesCount = this.socketServerService.getActiveGamesCount();
        res.status(200).json(gamesCount);
    }
}
