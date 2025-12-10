import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
    private appLogger;
    private dbLogger;

    constructor(private readonly cls: ClsService) {
        const nodeEnv = process.env.NODE_ENV;
        const isLocalEnv = ['local', 'dev', undefined].includes(nodeEnv);
        const level = isLocalEnv ? 'debug' : 'info';

        this.appLogger = createLogger({
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

        this.dbLogger = createLogger({
            level,
            transports: [
                new DailyRotateFile({
                    filename: path.join(process.cwd(), 'logs', 'db-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: this.getJsonFormat(),
                }),
                ...(isLocalEnv
                    ? [
                          new transports.Console({
                              format: this.getTextFormat(),
                          }),
                      ]
                    : []),
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

    private addContext(context?: any) {
        try {
            const tid = this.cls.getId();
            return { ...context, tid };
        } catch {
            return context;
        }
    }
    // ----------------------
    // APP LOG
    // ----------------------
    log(message: string, context?: any) {
        this.appLogger.info(message, this.addContext(context));
    }

    error(message: string, context?: any) {
        this.appLogger.error(message, this.addContext(context));
    }

    warn(message: string, context?: any) {
        this.appLogger.warn(message, this.addContext(context));
    }

    debug(message: string, context?: any) {
        this.appLogger.debug(message, this.addContext(context));
    }

    // ----------------------
    // DB LOG AWARE
    // ----------------------
    logQuery(query: string, parameters?: any[]): void {
        this.dbLogger.debug('Database query', {
            type: 'DB_QUERY',
            query,
            parameters: this.sanitizeParams(parameters),
        });
    }

    logQueryError(error: string | Error, query: string, parameters?: any[]): void {
        this.dbLogger.error('Database query error', {
            type: 'DB_QUERY_ERROR',
            query,
            parameters: this.sanitizeParams(parameters),
            error: error instanceof Error ? error.stack : error,
        });
    }

    logQuerySlow(time: number, query: string, parameters?: any[]): void {
        this.dbLogger.warn('Slow query', {
            type: 'DB_SLOW_QUERY',
            executionTime: time,
            query,
            parameters: this.sanitizeParams(parameters),
        });
    }

    logMigration(message: string): void {
        this.dbLogger.info(message, { type: 'DB_MIGRATION' });
    }

    logSchemaBuild(message: string): void {
        this.dbLogger.info(message, { type: 'DB_SCHEMA' });
    }

    private sanitizeParams(params?: any[]) {
        if (!params) return params;

        return params.map(v =>
            typeof v === 'string' && v.length > 200 ? '[LargeString omitted]' : v,
        );
    }
}
