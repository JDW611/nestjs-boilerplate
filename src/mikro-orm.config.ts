import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV || 'local';
const envFile = `.env.${nodeEnv}`;
dotenv.config({ path: envFile });

export default defineConfig({
    driver: PostgreSqlDriver,
    dbName: process.env.DB_DATABASE!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    metadataProvider: TsMorphMetadataProvider,
    entitiesTs: ['src/**/*.entity.ts'],
    entities: ['dist/**/*.entity.js'],
    migrations: {
        path: 'src/migrations',
        tableName: 'mikro_orm_migrations',
    },
});
