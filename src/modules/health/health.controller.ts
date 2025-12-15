import { ErrorResponseDto, SuccessResponseDto } from '@common/response';
import { InvalidRequestBodyException } from '@common/exceptions/service.exception';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health Check API')
export class HealthController {
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Health Check API', description: '서비스 상태를 확인합니다.' })
    @ApiOkResponse({
        description: '서비스가 정상적으로 동작중입니다.',
        type: SuccessResponseDto,
    })
    healthCheck(): string {
        return '서비스가 정상적으로 동작중입니다.';
    }

    @Get('error')
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOperation({ summary: 'Error API', description: '에러를 발생시킵니다.' })
    @ApiOkResponse({
        description: '에러가 발생했습니다.',
        type: ErrorResponseDto,
    })
    errorCheck(): void {
        throw InvalidRequestBodyException('request body is invalid', {
            email: 'email is invalid',
        });
    }
}
