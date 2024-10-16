import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';

export class ResponseEntity<T> {
    @Exclude() private readonly _statusCode: HttpStatus;
    @Exclude() private readonly _message: string;
    @Exclude() private readonly _data?: T;
    @Exclude() private readonly _exception?: any;

    private constructor(status: HttpStatus, message: string, data?: T, exception?: any) {
        this._statusCode = status;
        this._message = message;
        this._data = data;
        this._exception = exception;
    }

    @ApiProperty({ enum: HttpStatus, description: 'HTTP status code' })
    @Expose()
    get statusCode(): HttpStatus {
        return this._statusCode;
    }

    @ApiProperty({ description: 'Response message' })
    @Expose()
    get message(): string {
        return this._message;
    }

    @ApiProperty({ description: 'Response data', type: 'object' })
    @Expose()
    @Type(() => Object)
    get data(): T | undefined {
        return this._data;
    }

    static OK(): ResponseEntity<null> {
        return new ResponseEntity<null>(HttpStatus.OK, 'OK');
    }

    static OK_WITH<T>(data: T): ResponseEntity<T> {
        return new ResponseEntity<T>(HttpStatus.OK, 'OK', data);
    }

    static ERROR(exception: any): ResponseEntity<null> {
        return new ResponseEntity<null>(
            exception.getStatus(),
            exception.message,
            undefined,
            exception,
        );
    }

    static ERROR_WITH<T>(exception: any, data: T): ResponseEntity<T> {
        return new ResponseEntity<T>(exception.getStatus(), exception.message, data, exception);
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
            detail: this._exception ? this._exception.detail : undefined,
            tid: this._exception ? this._exception.tid : undefined,
        };
    }
}
