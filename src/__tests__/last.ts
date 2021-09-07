import { from } from '..';

describe('last', () => {
  it.each([
    [[1, 2, 3], 3],
    [new Set([1, 2, 3]), 3],
    ['asdf', 'f']
  ])('should return last element in sequence', (collection, expected) => {
    const result = from<unknown>(collection).last();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should throw for empty collection', collection => {
    expect(() => from<unknown>(collection).last()).toThrow();
  });

  it('should return last element matching condition', () => {
    const items = [1, 2, 3];

    const result = from(items).last(x => x % 2 === 1);

    expect(result).toBe(3);
  });

  it('should throw if no elements match condition', () => {
    const items = [1, 2, 3];

    expect(() => from(items).last(x => x > 5)).toThrow();
  });
});

describe('lastOrDefault', () => {
  it.each([
    [[1, 2, 3], 3],
    [new Set([1, 2, 3]), 3],
    ['asdf', 'f']
  ])('should return last element in sequence', (collection, expected) => {
    const result = from<unknown>(collection).lastOrDefault();
    expect(result).toEqual(expected);
  });

  it.each([[[]], [new Set([])], [''], [new Map()]])('should return null for empty collection', collection => {
    const result = from<unknown>(collection).lastOrDefault();
    expect(result).toBeNull();
  });

  it('should return last element matching condition', () => {
    const items = [1, 2, 3];

    const result = from(items).lastOrDefault(x => x % 2 === 1);

    expect(result).toBe(3);
  });

  it('should return null if no elements match condition', () => {
    const items = [1, 2, 3];

    const result = from(items).lastOrDefault(x => x > 5);

    expect(result).toBeNull();
  });
});
