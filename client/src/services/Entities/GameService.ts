import { injectable } from 'inversify';
import { Response } from 'superagent';

@injectable()
export abstract class GameService {
    abstract sendGetAllGamesRequest(): Promise<Response | undefined>;
    abstract sendGetAllGamesForLoggedUserRequest(): Promise<Response | undefined>;
    abstract sendGetAllGamesCountRequest(): Promise<Response | undefined>;
    abstract sendGetAllOngoingGamesCountRequest(): Promise<Response | undefined>;
}