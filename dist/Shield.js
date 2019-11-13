"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ShieldError_1 = require("./ShieldError");
const Utils_1 = require("./Utils");
class Shield {
    static traverse(obj, opts) {
        let error;
        Object.keys(obj).some((k) => {
            if (opts.mongo && Utils_1.default.isString(k) && k.indexOf('$') === 0) {
                error = new ShieldError_1.default('Mongo $ injection found', 'mongo_error', obj);
                return true;
            }
            if (Utils_1.default.isPlainObject(obj[k])) {
                if (opts.proto && (k === '__proto__' || k === 'constructor')) {
                    error = new ShieldError_1.default('Prototype pollution found', 'proto_error', obj);
                    return true;
                }
                error = this.traverse(obj[k], opts);
                if (error) {
                    return true;
                }
            }
            return false;
        });
        return error;
    }
    static evaluate(obj, opts, callback) {
        callback(this.traverse(obj, opts));
    }
    static evaluateAsync(obj, opts) {
        return new Promise((resolve, reject) => {
            const error = this.traverse(obj, opts);
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    }
}
exports.Shield = Shield;
