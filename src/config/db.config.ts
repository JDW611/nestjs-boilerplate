import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

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
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
        };
    }
}
