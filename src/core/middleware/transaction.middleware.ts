import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { APP_ENTITY_MANAGER, asyncLocalStorage } from './namespace.constant';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
    constructor(private readonly em: EntityManager) {}

    use(_req: Request, _res: Response, next: NextFunction) {
        const store = new Map<string, any>();

        return asyncLocalStorage.run(store, () => {
            return Promise.resolve()
                .then(() => this.setEntityManager())
                .then(next);
        });
    }

    private setEntityManager() {
        const store = asyncLocalStorage.getStore();
        if (!store) {
            throw new Error('AsyncLocalStorage store not found');
        }
        store.set(APP_ENTITY_MANAGER, this.em);
    }
}
