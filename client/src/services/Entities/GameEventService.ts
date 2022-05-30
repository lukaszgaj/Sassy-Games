import { injectable } from 'inversify';
import { Response } from 'superagent';

@injectable()
export abstract class GameEventService {
    abstract sendGetAllGamesForLoggedUserRequest(gameId: string): Promise<Response | undefined>;
}