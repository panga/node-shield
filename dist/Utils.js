"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static isPlainObject(obj) {
        return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
    }
    static isString(val) {
        return typeof val === 'string';
    }
}
exports.default = Utils;
