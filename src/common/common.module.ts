import { ClassProvider, Global, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ShutDownManager } from './utils/shutdown.manager';
import { MikroOrmLoggerAdapter } from './utils/mikroorm-logger.adapter';

const providers = [LoggerService, MikroOrmLoggerAdapter];
const interceptors: ClassProvider[] = [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
];
const filters: ClassProvider[] = [{ provide: APP_FILTER, useClass: HttpExceptionFilter }];

@Global()
@Module({
    imports: [],
    providers: [ShutDownManager, ...providers, ...interceptors, ...filters],
    exports: [...providers],
})
export class CommonModule {}
