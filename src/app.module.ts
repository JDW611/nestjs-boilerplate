import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { ConfigModule } from '@config/config.module';
import { HealthModule } from '@modules/health/health.module';
import { ClsModule } from 'nestjs-cls';
import { MikroOrmCustomModule } from '@config/database/mikroorm/mikroorm.module';

@Module({
    imports: [
        ClsModule.forRoot({ global: true, middleware: { mount: true, generateId: true } }),
        CommonModule,
        ConfigModule,
        MikroOrmCustomModule,
        HealthModule,
    ],
})
export class AppModule {}
