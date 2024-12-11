import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './config.service';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        const dbConfig = this.configService.getDatabaseConfig();

        return {
            type: 'postgres',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            synchronize: dbConfig.synchronize,
            logging: dbConfig.logging,
            namingStrategy: new SnakeNamingStrategy(),
            autoLoadEntities: true,
            entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
        };
    }
}
