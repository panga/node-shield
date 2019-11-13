"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ShieldError extends Error {
    constructor(message, code, payload) {
        super(message);
        this.code = code;
        this.payload = payload;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.default = ShieldError;
