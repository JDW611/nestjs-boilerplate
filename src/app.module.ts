import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/HttpException.filter';
import { ResponseInterceptor } from './common/interceptors/Response.interceptor';
import { LoggerService } from './shared/services/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { getPostgresqlTypeOrmModule } from './config/db.config';
import { ConfigModule } from '@nestjs/config';
import configuration, { validate } from './config/env.validation';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validate,
        }),
        getPostgresqlTypeOrmModule,
    ],
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
