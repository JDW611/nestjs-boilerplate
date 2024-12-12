import { APP_ENTITY_MANAGER, asyncLocalStorage } from '@core/middleware/namespace.constant';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TransactionManager {
    getEntityManager(): EntityManager {
        const store = asyncLocalStorage.getStore();
        if (!store) {
            throw new InternalServerErrorException('Transaction context not active');
        }
        const manager = store.get(APP_ENTITY_MANAGER);
        if (!manager) {
            throw new InternalServerErrorException('EntityManager not found in context');
        }
        return manager;
    }
}
