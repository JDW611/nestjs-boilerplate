import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health Check')
export class HealthController {
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Health Check API' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Application is healthy',
    })
    healthCheck() {
        return;
    }
}
