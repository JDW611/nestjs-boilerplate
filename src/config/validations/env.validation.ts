import { plainToClass, Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsBoolean,
    ValidateNested,
    IsEnum,
    validateSync,
} from 'class-validator';
import { Environment } from '@common/enums/environment.enum';

class DatabaseConfigValidation {
    @IsString()
    host: string;

    @IsNumber()
    port: number;

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    database: string;

    @IsBoolean()
    synchronize: boolean;

    @IsBoolean()
    logging: boolean;
}

class AppConfigValidation {
    @IsNumber()
    port: number;

    @IsEnum(Environment)
    environment: Environment;
}

export class EnvironmentVariables {
    @ValidateNested()
    @Type(() => DatabaseConfigValidation)
    database: DatabaseConfigValidation;

    @ValidateNested()
    @Type(() => AppConfigValidation)
    app: AppConfigValidation;
}

export function validate(config: Record<string, unknown>) {
    const intermediateConfig = {
        database: {
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USERNAME,
            password: config.DB_PASSWORD,
            database: config.DB_DATABASE,
            synchronize: config.DB_SYNCHRONIZE,
            logging: config.DB_LOGGING,
        },
        app: {
            port: config.PORT,
            environment: config.NODE_ENV,
        },
    };

    const validatedConfig = plainToClass(EnvironmentVariables, intermediateConfig, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
