import { TypeOrmModule as OrmModule } from '@nestjs/typeorm';
import { TypeOrmDataSourceOptions } from './types/typeorm.type';
import { DynamicModule } from '@nestjs/common';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';

const entityPath = path.join(__dirname, '../../../entities/*/*.entity.js');

export class TypeOrmModule {
    static forRoot(props: TypeOrmDataSourceOptions): DynamicModule {
        return OrmModule.forRoot({
            type: props.type,
            port: props.port,
            database: props.database,
            username: props.username,
            password: props.password,
            synchronize: props.synchronize,
            entities: [props.entityPath],
            autoLoadEntities: true,
            logging: process.env.NODE_ENV === 'production' ? ['error'] : true,
            namingStrategy: new SnakeNamingStrategy(),
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
    return TypeOrmModule.forRoot({
        type: 'postgres',
        database: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        synchronize: false,
        entityPath,
    });
};
