import { Injectable, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { BadRequestException } from '@common/exceptions/bad-request.exception';

@Injectable()
export class BaseValidationPipe extends ValidationPipe {
    constructor(options?: ValidationPipeOptions) {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            validateCustomDecorators: true,

            exceptionFactory: exceptions => {
                const validationExceptions = exceptions.map(exception => ({
                    field: exception.property,
                    value: exception.value,
                    constraints: Object.values(exception.constraints || {}),
                }));

                return new BadRequestException('Validation failed', {
                    validation: {
                        exception: validationExceptions,
                        count: validationExceptions.length,
                    },
                });
            },
            ...options,
        });
    }
}
