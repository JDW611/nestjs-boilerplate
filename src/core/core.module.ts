import { ClassProvider, Global, Module } from '@nestjs/common';
import { LoggerService } from '@core/services/logger.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { TransformInterceptor } from '@core/interceptors/transform.interceptor';
// import { ShutDownManager } from './util/shutdown.manager';
// import { AlsModule } from './cls/cls.module';
// import { TransactionManager } from './database/typeorm/transaction-manager';
import { MikroOrmCustomModule } from './database/mikroorm/mikroorm.module';
import { MikroOrmLoggerAdapter } from './util/mikroorm-logger.adapter';

const providers = [LoggerService, MikroOrmLoggerAdapter];
const interceptors: ClassProvider[] = [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
];
const filters: ClassProvider[] = [{ provide: APP_FILTER, useClass: HttpExceptionFilter }];

@Global()
@Module({
    imports: [MikroOrmCustomModule],
    providers: [...providers, ...interceptors, ...filters],
    exports: [...providers],
})
export class CoreModule {}
