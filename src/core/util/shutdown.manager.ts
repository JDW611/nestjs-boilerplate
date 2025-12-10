import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { LoggerService } from '@core/services/logger.service';
import { MikroORM } from '@mikro-orm/core';

/**
 * 애플리케이션 종료 시 리소스를 안전하게 정리하는 매니저
 *
 * @description
 * - 무중단 배포 시 기존 서버 종료
 * - 서버 재시작 시
 * - 기타 종료 상황에서 실행됨
 */
@Injectable()
export class ShutDownManager implements OnApplicationShutdown {
    constructor(private readonly logger: LoggerService, private readonly orm: MikroORM) {}

    async onApplicationShutdown(signal: string) {
        this.logger.log(
            `----------------------------------------------------------------------------`,
        );
        this.logger.log(`🚀 Application shutdown initiated with signal: ${signal}`);
        this.logger.log(
            `============================================================================`,
        );
        await Promise.resolve().then(async () => {
            // database
            if (this.orm) {
                await this.orm.close(true);
                this.logger.log('Closed MikroORM :)');
            }
            this.logger.log('Finish Resources Close...');
        });
    }
}
