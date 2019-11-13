import ShieldError from './ShieldError';
import Utils from './Utils';

export interface ShieldOptions {
  mongo?: boolean;
  proto?: boolean;
}

export class Shield {
  private static traverse(obj: any, opts: ShieldOptions): ShieldError | undefined {
    let error;
    for (const k in obj) {
      if (opts.mongo && Utils.isString(k) && k.indexOf('$') === 0) {
        error = new ShieldError('Mongo $ injection found', 'mongo_error', obj);
        break;
      }
      if (Utils.isPlainObject(obj[k])) {
        if (opts.proto && (k === '__proto__' || k === 'constructor')) {
          error = new ShieldError('Prototype pollution found', 'proto_error', obj);
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

  static evaluate(obj: any, opts: ShieldOptions, callback: (err?: ShieldError) => void) {
    if (Utils.isPlainObject(obj)) {
      callback(this.traverse(obj, opts));
    } else {
      callback();
    }
  }

  static evaluateAsync(obj: any, opts: ShieldOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (Utils.isPlainObject(obj)) {
        const error = this.traverse(obj, opts);
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }
}
