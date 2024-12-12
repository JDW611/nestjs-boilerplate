import { TypeOrmModule as OrmModule } from '@nestjs/typeorm';
import { TypeOrmDataSourceOptions } from './types/typeorm.type';
import { DynamicModule } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';
import { ConfigService } from '@config/services/config.service';
import { ConfigModule } from '@config/config.module';
import { LoggerService } from '@shared/services/logger.service';

const entityPath = path.join(__dirname, '../../../entities/*/*.entity.js');

export class TypeOrmModule {
    constructor() {}
    static forRoot(props: TypeOrmDataSourceOptions, logger: LoggerService): DynamicModule {
        return OrmModule.forRoot({
            type: props.type,
            host: props.host,
            port: props.port,
            database: props.database,
            username: props.username,
            password: props.password,
            synchronize: props.synchronize,
            entities: [props.entityPath],
            logging: process.env.NODE_ENV === 'production' ? ['error'] : true,
            logger: logger,
            namingStrategy: new SnakeNamingStrategy(),
            autoLoadEntities: true,
            extra: {
                max: 10,
                min: 3,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
                maxUses: 7500,
            },
        });
    }
}

export const getTypeOrmModule = (): DynamicModule => {
    return {
        module: TypeOrmModule,
        imports: [ConfigModule],
        providers: [
            {
                provide: 'DATABASE_CONFIG',
                useFactory: (configService: ConfigService, logger: LoggerService) => {
                    const dbConfig = configService.getDatabaseConfig();
                    return TypeOrmModule.forRoot(
                        {
                            type: 'postgres',
                            host: dbConfig.host,
                            port: dbConfig.port,
                            username: dbConfig.username,
                            password: dbConfig.password,
                            database: dbConfig.database,
                            synchronize: dbConfig.synchronize,
                            entityPath,
                        },
                        logger,
                    );
                },
                inject: [ConfigService, LoggerService],
            },
        ],
    };
};
