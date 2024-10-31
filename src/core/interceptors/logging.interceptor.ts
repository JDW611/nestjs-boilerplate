import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@shared/services/logger.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers } = request;
        const tid = uuidv4();
        const userAgent = headers['user-agent'] || '';
        const ip = request.ip;

        const startTime = Date.now();

        this.logger.log('Request received', {
            tid,
            type: 'REQUEST',
            method,
            url,
            body,
            userAgent,
            ip,
        });

        return next.handle().pipe(
            tap({
                next: data => {
                    const responseTime = Date.now() - startTime;
                    this.logger.log('Request completed', {
                        tid,
                        type: 'RESPONSE',
                        method,
                        url,
                        responseTime,
                        response: data,
                    });
                },
                error: error => {
                    const responseTime = Date.now() - startTime;
                    this.logger.error('Request failed', error.stack, {
                        tid,
                        type: 'ERROR',
                        method,
                        url,
                        responseTime,
                        error: error.message,
                    });
                },
            }),
        );
    }
}
