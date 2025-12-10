import { ConfigService } from '@config/services/config.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MikroOrmLoggerAdapter } from '@core/util/mikroorm-logger.adapter';
import { LoggerService } from '@core/services/logger.service';

@Module({
    imports: [
        MikroOrmModule.forRootAsync({
            inject: [ConfigService, LoggerService],
            useFactory: (env: ConfigService, logger: LoggerService) => {
                const dbConfig = env.getDatabaseConfig();
                return {
                    host: dbConfig.host,
                    port: dbConfig.port,
                    user: dbConfig.username,
                    password: dbConfig.password,
                    dbName: dbConfig.database,
                    loggerFactory: () => new MikroOrmLoggerAdapter(logger),
                    debug: true,
                    entitiesTs: ['src/**/*.entity.ts'],
                    entities: ['dist/**/*.entity.js'],
                    metadataProvider: TsMorphMetadataProvider,
                    driver: PostgreSqlDriver,
                };
            },
        }),
    ],
})
export class MikroOrmCustomModule {}
