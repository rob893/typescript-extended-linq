import { from } from '..';

describe('first', () => {
  it.each([
    [[1, 2, 3], 1],
    [new Set([1, 2, 3]), 1],
    ['asdf', 'a']
  ])('should return first element in sequence', (collection, expected) => {
    const result = from<unknown>(collection).first();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should throw for empty collection', collection => {
    expect(() => from<unknown>(collection).first()).toThrow();
  });

  it('should return first element matching condition', () => {
    const items = [1, 2, 3];

    const result = from(items).first(x => x % 2 === 0);

    expect(result).toBe(2);
  });

  it('should throw if no elements match condition', () => {
    const items = [1, 2, 3];

    expect(() => from(items).first(x => x > 5)).toThrow();
  });
});

describe('firstOrDefault', () => {
  it.each([
    [[1, 2, 3], 1],
    [new Set([1, 2, 3]), 1],
    ['asdf', 'a']
  ])('should return first element in sequence', (collection, expected) => {
    const result = from<unknown>(collection).firstOrDefault();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should return null for empty collection', collection => {
    const result = from<unknown>(collection).firstOrDefault();
    expect(result).toBeNull();
  });

  it('should return first element matching condition', () => {
    const items = [1, 2, 3];

    const result = from(items).firstOrDefault(x => x % 2 === 0);

    expect(result).toBe(2);
  });

  it('should return null if no elements match condition', () => {
    const items = [1, 2, 3];

    const result = from(items).firstOrDefault(x => x > 5);

    expect(result).toBeNull();
  });
});
