import { BaseException } from '@core/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends BaseException {
    constructor(message: string = 'Bad Request', detail?: any) {
        super(HttpStatus.BAD_REQUEST, message, detail);
    }
}
