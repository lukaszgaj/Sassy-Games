import express from 'express';
import { controller, httpGet, httpPost, principal, request, response } from 'inversify-express-utils';
import { GameEventsRepository } from '../../Domain/Repositories/GameEventsRepository';
import { Principal } from '../../Infrastructure/Auth/Principal';
import { LoggerService } from '../../Infrastructure/Services/LoggerService';
import { handleAuthenticationCheck } from '../Utils/handleAuthenticationCheck';

const path = '/game_event';

@controller(path)
export class GameEventController {
    constructor(
        private gameEventsRepository: GameEventsRepository,
        private loggerService: LoggerService,
    ) {
    }

    @httpGet('/get-all')
    async getAllUsers(
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ res, authPrincipal, loggerService: this.loggerService, parentFilename: __filename });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }
        const gameEvents = await this.gameEventsRepository.getAll();
        res.status(200).json(gameEvents);
    }

    @httpPost('/get-all-for')
    async getAllGamesEventsFor(
        @response() res: express.Response,
        @request() req: express.Request,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ res, authPrincipal, loggerService: this.loggerService, parentFilename: __filename });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }

        if (!req.body.gameId) {
            res.status(400).json({ message: 'PLEASE_PROVIDE_VALID_DATA' });
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'getAllGamesEventsFor -> wrong data provided',
            })
            return;
        }

        const games = await this.gameEventsRepository.getAllFor(req.body.gameId);
        res.status(200).json(games?.map(game => { return { ...game, payload: game.payload.toString() } }));
    }
}

