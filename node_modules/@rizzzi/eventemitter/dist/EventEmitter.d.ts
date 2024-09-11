export interface EventInterface {
    [key: string]: Array<any>;
}
export type EventMap<T extends EventInterface> = {
    [K in keyof T]: Array<{
        once: boolean;
        listener: (...args: T[K]) => Promise<void> | void;
    }>;
};
export interface EventEmitterOptions {
    requireErrorHandling: boolean;
}
export declare class EventEmitter<T extends EventInterface, ReturnObj extends any = undefined> {
    constructor(options?: Partial<EventEmitterOptions>, returnObj?: ReturnObj);
    readonly options: EventEmitterOptions;
    readonly listeners: EventMap<T>;
    readonly returnObj: ReturnObj;
    on<K extends keyof T>(event: K, listener: (...args: T[K]) => Promise<void> | void, once?: boolean): ReturnObj;
    once<K extends keyof T>(event: K, listener: (...args: T[K]) => Promise<void> | void): ReturnObj;
    off<K extends keyof T>(event: K, listener: (...args: T[K]) => Promise<void> | void): ReturnObj;
    emit<K extends keyof T>(event: K, ...args: T[K]): Promise<boolean>;
    waitEvent<K extends keyof T>(event: K): Promise<T[K]>;
    bind(): {
        on: <K extends keyof T>(event: K, listener: (...args: T[K]) => void | Promise<void>, once?: boolean) => ReturnObj;
        once: <K_1 extends keyof T>(event: K_1, listener: (...args: T[K_1]) => void | Promise<void>) => ReturnObj;
        off: <K_2 extends keyof T>(event: K_2, listener: (...args: T[K_2]) => void | Promise<void>) => ReturnObj;
        emit: <K_3 extends keyof T>(event: K_3, ...args: T[K_3]) => Promise<boolean>;
    };
}
