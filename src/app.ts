import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from '@config/swagger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = app.get(SwaggerConfig);
    swaggerConfig.setup(app);

    const port = process.env.PORT || 3000;

    await app.listen(port);
}
bootstrap();
