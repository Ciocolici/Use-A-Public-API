"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    constructor(options, returnObj = undefined) {
        this.options = {
            requireErrorHandling: false,
            ...options
        };
        this.listeners = {};
        this.returnObj = returnObj;
    }
    options;
    listeners;
    returnObj;
    on(event, listener, once = false) {
        (this.listeners[event] || (this.listeners[event] = [])).push({ once, listener });
        return this.returnObj;
    }
    once(event, listener) {
        return this.on(event, listener, true);
    }
    off(event, listener) {
        const listeners = this.listeners[event] || (this.listeners[event] = []);
        const listenerIndex = listeners.findIndex((entry) => entry.listener === listener);
        if (listenerIndex > -1) {
            listeners.splice(listenerIndex, 1);
        }
        return this.returnObj;
    }
    async emit(event, ...args) {
        const listeners = this.listeners[event];
        if (listeners?.length) {
            const promises = [];
            for (let i = 0; listeners.length > i; i++) {
                const { [i]: { once, listener } } = listeners;
                if (once) {
                    listeners.splice(i, 1);
                    i--;
                }
                const output = listener(...args);
                if (output instanceof Promise) {
                    promises.push(output);
                }
            }
            await Promise.all(promises);
            return true;
        }
        if (this.options.requireErrorHandling && (event === 'error')) {
            throw args[0];
        }
        return false;
    }
    waitEvent(event) {
        return new Promise((resolve) => this.once(event, (...args) => resolve(args)));
    }
    bind() {
        return {
            on: this.on.bind(this),
            once: this.once.bind(this),
            off: this.off.bind(this),
            emit: this.emit.bind(this)
        };
    }
}
exports.EventEmitter = EventEmitter;
