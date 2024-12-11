import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    private logger;

    constructor(private readonly env: ConfigService) {
        const nodeEnv = this.env.get('NODE_ENV');
        const isLocalEnv = ['local', 'dev', undefined].includes(nodeEnv);
        const level = isLocalEnv ? 'debug' : 'info';

        this.logger = createLogger({
            level,
            transports: [
                new DailyRotateFile({
                    filename: path.join(process.cwd(), 'logs', 'app-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: this.getJsonFormat(),
                }),
                new transports.Console({
                    format: this.getTextFormat(),
                }),
            ],
        });
    }

    private getTextFormat() {
        return format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.ms(),
            format.prettyPrint(),
        );
    }

    private getJsonFormat() {
        return format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.ms(),
            format.json(),
        );
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
