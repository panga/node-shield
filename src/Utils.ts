export default class Utils {
  static isPlainObject(obj: any) {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
  }

  static isString(val: any) {
    return typeof val === 'string';
  }
}
