import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const getPostgresqlTypeOrmModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (env: ConfigService): Promise<DataSourceOptions> => ({
        type: 'postgres',
        host: env.get<string>('db.host'),
        port: env.get<number>('db.port'),
        username: env.get<string>('db.username'),
        password: env.get<string>('db.password'),
        database: env.get<string>('db.schema'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
    }),
});
