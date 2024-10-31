import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration, { validate } from '@config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '@config/db.config';
import { SwaggerConfig } from '@config/swagger.config';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validate,
        }),
        TypeOrmModule.forRootAsync({
            useClass: DatabaseConfig,
        }),
    ],
    providers: [DatabaseConfig, SwaggerConfig],
    exports: [DatabaseConfig, SwaggerConfig],
})
export class ConfigModule {}
