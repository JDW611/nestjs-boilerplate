import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { ConfigModule } from '@config/config.module';
import { HealthModule } from '@modules/health/health.module';
import { ClsModule } from 'nestjs-cls';
@Module({
    imports: [
        ClsModule.forRoot({ global: true, middleware: { mount: true, generateId: true } }),
        CoreModule,
        ConfigModule,
        HealthModule,
    ],
})
export class AppModule {}
