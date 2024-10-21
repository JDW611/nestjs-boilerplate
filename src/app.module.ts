import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/HttpException.filter';
import { ResponseInterceptor } from './common/interceptors/Response.interceptor';
import { LoggerService } from './shared/services/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

@Module({
    providers: [
        LoggerService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
    ],
})
export class AppModule {}
