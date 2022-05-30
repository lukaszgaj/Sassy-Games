import { injectable } from "inversify";
import * as winston from "winston";


@injectable()
export class LoggerService {
    private logger: winston.Logger;

    constructor() {
        const { combine, timestamp, json } = winston.format;
        this.logger = winston.createLogger({
            format: combine(
                timestamp(),
                json(),
            ),
            transports: [
                new winston.transports.Console({ level: 'info' }),
                new winston.transports.File({ filename: 'combined.log', level: 'error' }),
            ],
        });
    }

    log(log: LoggerService.Log) {
        this.logger.log(log.level, { message: log.message, filename: log.filename, payload: log.payload });
    }
}


export namespace LoggerService {
    export interface Log {
        level: string,
        filename: string,
        message: string,
        payload?: any,
    }
}
