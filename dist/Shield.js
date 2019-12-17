"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShieldError_1 = require("./ShieldError");
const Utils_1 = require("./Utils");
class Shield {
    static traverse(obj, opts) {
        let error;
        for (const k in obj) {
            if (opts.mongo && Utils_1.default.isString(k) && k.indexOf('$') === 0 && k.length > 1) {
                error = new ShieldError_1.default('Mongo $ injection found', 'mongo_error', obj);
                break;
            }
            if (Utils_1.default.isPlainObject(obj[k])) {
                if (opts.proto && (k === '__proto__' || k === 'constructor')) {
                    error = new ShieldError_1.default('Prototype pollution found', 'proto_error', obj);
                    break;
                }
                error = this.traverse(obj[k], opts);
                if (error) {
                    break;
                }
            }
        }
        return error;
    }
    static evaluate(obj, opts, callback) {
        if (Utils_1.default.isPlainObject(obj)) {
            callback(this.traverse(obj, opts));
        }
        else {
            callback();
        }
    }
    static evaluateAsync(obj, opts) {
        return new Promise((resolve, reject) => {
            if (Utils_1.default.isPlainObject(obj)) {
                const error = this.traverse(obj, opts);
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            }
            else {
                resolve();
            }
        });
    }
}
exports.Shield = Shield;
