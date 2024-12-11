import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './services/database.service';
import { SwaggerService } from './services/swagger.service';
import { ConfigService } from './services/config.service';
import { validate } from './validations/env.validation';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validate,
        }),
        TypeOrmModule.forRootAsync({
            useClass: DatabaseService,
        }),
    ],
    providers: [ConfigService, SwaggerService, DatabaseService],
    exports: [ConfigService, SwaggerService, DatabaseService],
})
export class ConfigModule {}
