import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseEntity } from '../response/ResponseEntity';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();

        const httpStatus = exception.getStatus();
        console.log('httpStatus', httpStatus);

        const response = ResponseEntity.fail(exception).toJSON();

        httpAdapter.reply(ctx.getResponse(), response, httpStatus);
    }
}
