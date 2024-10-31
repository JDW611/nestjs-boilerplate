import { Global, Module } from '@nestjs/common';
import { LoggerService } from '@shared/services/logger.service';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { TransformInterceptor } from '@core/interceptors/transform.interceptor';
import { BaseValidationPipe } from '@core/pipes/validation/base-validation.pipe';

@Global()
@Module({
    imports: [],
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
            useClass: TransformInterceptor,
        },
        {
            provide: APP_PIPE,
            useClass: BaseValidationPipe,
        },
    ],
})
export class CoreModule {}
