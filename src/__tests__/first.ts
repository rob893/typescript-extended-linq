import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('first', (src, enumerable) => {
  it.each([
    [[1, 2, 3], 1],
    [new Set([1, 2, 3]), 1],
    ['asdf', 'a']
  ])('should return first element in sequence', (collection, expected) => {
    const result = enumerable(src<unknown>(collection)).first();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should throw for empty collection', collection => {
    expect(() => enumerable(src<unknown>(collection)).first()).toThrow();
  });

  it('should return first element matching condition', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).first(x => x % 2 === 0);

    expect(result).toBe(2);
  });

  it('should throw if no elements match condition', () => {
    const items = src([1, 2, 3]);

    expect(() => enumerable(items).first(x => x > 5)).toThrow();
  });
});

describe.each([...getEnumerables()])('firstOrDefault', (src, enumerable) => {
  it.each([
    [[1, 2, 3], 1],
    [new Set([1, 2, 3]), 1],
    ['asdf', 'a']
  ])('should return first element in sequence', (collection, expected) => {
    const result = enumerable(src<unknown>(collection)).firstOrDefault();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should return null for empty collection', collection => {
    const result = enumerable(src<unknown>(collection)).firstOrDefault();
    expect(result).toBeNull();
  });

  it('should return first element matching condition', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).firstOrDefault(x => x % 2 === 0);

    expect(result).toBe(2);
  });

  it('should return null if no elements match condition', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).firstOrDefault(x => x > 5);

    expect(result).toBeNull();
  });
});
