import { NestFactory } from '@nestjs/core';
import { SwaggerConfig } from '@config/swagger.config';
import { AppModule } from '@/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = app.get(SwaggerConfig);
    swaggerConfig.setup(app);

    const port = process.env.PORT || 3000;

    await app.listen(port);
}
bootstrap();
