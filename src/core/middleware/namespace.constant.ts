import { AsyncLocalStorage } from 'async_hooks';

export const APP_NAMESPACE = 'namespace/app';
export const APP_ENTITY_MANAGER = 'namespace/entity-manager';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();
