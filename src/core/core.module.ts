import { ClassProvider, Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerService } from '@shared/services/logger.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { TransformInterceptor } from '@core/interceptors/transform.interceptor';
import { getTypeOrmModule } from './database/typeorm/typeorm.module';
import { TransactionMiddleware } from './middleware/transaction.middleware';
import { TransactionManager } from './database/typeorm/transaction-manager';
import { ShutDownManager } from './util/shutdown.manager';

const providers = [TransactionManager];
const interceptors: ClassProvider[] = [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
];
const filters: ClassProvider[] = [{ provide: APP_FILTER, useClass: HttpExceptionFilter }];

@Global()
@Module({
    imports: [getTypeOrmModule()],
    providers: [ShutDownManager, LoggerService, ...providers, ...interceptors, ...filters, ,],
    exports: [...providers],
})
export class CoreModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TransactionMiddleware).forRoutes('*');
    }
}
