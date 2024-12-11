import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerService } from '@config/services/swagger.service';
import { ConfigService } from '@config/services/config.service';
import { LoggerService } from '@shared/services/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = app.get(SwaggerService);
    const env = app.get(ConfigService);
    const logger = app.get(LoggerService);

    swaggerConfig.setup(app);

    await app.listen(env.app.port, function appMain() {
        logger.log(`----------------------------------------------------------------------------`);
        logger.log(`🚀 App listening on the port ${env.app.port}`);
        logger.log(`============================================================================`);
    });
}
bootstrap();
