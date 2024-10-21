import { Injectable } from '@nestjs/common';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    private logger;

    constructor() {
        this.logger = createLogger({
            format: format.combine(format.timestamp(), format.json()),
            transports: [
                new DailyRotateFile({
                    filename: path.join(process.cwd(), 'logs', 'application-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
                new transports.Console({
                    format: format.combine(format.colorize(), format.simple()),
                }),
            ],
        });
    }

    log(message: string, context?: any) {
        this.logger.info(message, context);
    }
    error(message: string, trace: string, context?: any) {
        this.logger.error(message, { trace, ...context });
    }

    warn(message: string, context?: any) {
        this.logger.warn(message, context);
    }

    debug(message: string, context?: any) {
        this.logger.debug(message, context);
    }
}
