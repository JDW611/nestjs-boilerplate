import { LogContext, Logger, LoggerNamespace } from '@mikro-orm/core';
import { LoggerService } from '@core/services/logger.service';
import sqlFormatter from 'sql-formatter';

export class MikroOrmLoggerAdapter implements Logger {
    private slowQueryThreshold = 300;
    private debugMode: boolean | LoggerNamespace[] = true;

    constructor(private readonly logger: LoggerService) {}

    setDebugMode(mode: boolean | LoggerNamespace[]): void {
        this.debugMode = mode;
    }

    isEnabled(namespace: LoggerNamespace): boolean {
        if (this.debugMode === true) {
            return true;
        }
        if (Array.isArray(this.debugMode)) {
            return this.debugMode.includes(namespace);
        }
        return false;
    }

    log(namespace: LoggerNamespace, message: string, context?: LogContext): void {
        if (!this.isEnabled(namespace)) {
            return;
        }
        this.logger.log(message, { ...context, logNamespace: namespace });
    }

    warn(namespace: LoggerNamespace, message: string, context?: LogContext): void {
        if (!this.isEnabled(namespace)) {
            return;
        }
        this.logger.warn(message, { ...context, logNamespace: namespace });
    }

    error(namespace: LoggerNamespace, message: string, context?: LogContext): void {
        if (!this.isEnabled(namespace)) {
            return;
        }

        if (namespace === 'query' && context?.query) {
            const sql = context.query as string;
            const params = context.params as any[] | undefined;
            this.logger.logQueryError(message, this.prettySql(sql), params);
        } else {
            this.logger.error(message, { ...context, logNamespace: namespace });
        }
    }

    logQuery(context: LogContext): void {
        const sql = context.query as string;
        const params = context.params as any[] | undefined;
        const took = context.took as number | undefined;

        const formatted = this.prettySql(sql);
        this.logger.logQuery(formatted, params);

        if (took != null && took > this.slowQueryThreshold) {
            this.logger.logQuerySlow(took, formatted, params);
        }
    }

    private prettySql(sql: string): string {
        try {
            return sqlFormatter.format(sql, { language: 'sql' });
        } catch {
            return sql;
        }
    }
}
