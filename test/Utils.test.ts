import Utils from '../src/Utils';

describe('Utils', () => {
  describe('isPlainObject', () => {
    it('object is true', () => {
      expect(Utils.isPlainObject({})).toBe(true);
    });
    it('array is false', () => {
      expect(Utils.isPlainObject([])).toBe(false);
    });
    it('null is false', () => {
      expect(Utils.isPlainObject(null)).toBe(false);
    });
    it('undefined is false', () => {
      expect(Utils.isPlainObject(undefined)).toBe(false);
    });
    it('string is false', () => {
      expect(Utils.isPlainObject('')).toBe(false);
    });
    it('number is false', () => {
      expect(Utils.isPlainObject(1)).toBe(false);
    });
    it('boolean is false', () => {
      expect(Utils.isPlainObject(true)).toBe(false);
    });
    it('symbol is false', () => {
      expect(Utils.isPlainObject(Symbol('id'))).toBe(false);
    });
  });

  describe('isString', () => {
    it('string is true', () => {
      expect(Utils.isString('')).toBe(true);
    });
    it('object is false', () => {
      expect(Utils.isString({})).toBe(false);
    });
    it('array is false', () => {
      expect(Utils.isString([])).toBe(false);
    });
    it('null is false', () => {
      expect(Utils.isString(null)).toBe(false);
    });
    it('undefined is false', () => {
      expect(Utils.isString(undefined)).toBe(false);
    });
    it('number is false', () => {
      expect(Utils.isString(1)).toBe(false);
    });
    it('boolean is false', () => {
      expect(Utils.isString(true)).toBe(false);
    });
    it('symbol is false', () => {
      expect(Utils.isString(Symbol('id'))).toBe(false);
    });
  });
});
