import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
    constructor(private env: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.env.get<string>('db.host'),
            port: this.env.get<number>('db.port'),
            username: this.env.get<string>('db.username'),
            password: this.env.get<string>('db.password'),
            database: this.env.get<string>('db.schema'),
            entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
            synchronize: this.env.get<boolean>('db.synchronize'),
            logging: this.env.get<boolean>('db.logging'),
            namingStrategy: new SnakeNamingStrategy(),
            autoLoadEntities: true,
        };
    }
}
