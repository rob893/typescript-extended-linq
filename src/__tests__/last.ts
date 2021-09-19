import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('last', (src, enumerable) => {
  it.each([
    [[1, 2, 3], 3],
    [new Set([1, 2, 3]), 3],
    ['asdf', 'f']
  ])('should return last element in sequence', (collection, expected) => {
    const result = enumerable(src<unknown>(collection)).last();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should throw for empty collection', collection => {
    expect(() => enumerable(src<unknown>(collection)).last()).toThrow();
  });

  it('should return last element matching condition', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).last(x => x % 2 === 1);

    expect(result).toBe(3);
  });

  it('should throw if no elements match condition', () => {
    const items = src([1, 2, 3]);

    expect(() => enumerable(items).last(x => x > 5)).toThrow();
  });
});

describe.each([...getEnumerables()])('lastOrDefault', (src, enumerable) => {
  it.each([
    [[1, 2, 3], 3],
    [new Set([1, 2, 3]), 3],
    ['asdf', 'f']
  ])('should return last element in sequence', (collection, expected) => {
    const result = enumerable(src<unknown>(collection)).lastOrDefault();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should return null for empty collection', collection => {
    const result = enumerable(src<unknown>(collection)).lastOrDefault();
    expect(result).toBeNull();
  });

  it('should return last element matching condition', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).lastOrDefault(x => x % 2 === 1);

    expect(result).toBe(3);
  });

  it('should return null if no elements match condition', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).lastOrDefault(x => x > 5);

    expect(result).toBeNull();
  });
});
