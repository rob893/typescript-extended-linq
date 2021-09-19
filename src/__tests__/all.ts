import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('all', (src, enumerable) => {
  it('should return true when all elements match predicate', () => {
    const items = src([2, 4, 6, 8, 10]);

    const result = enumerable(items).all(x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it('should return true for empty collection', () => {
    const items = src<number>([]);

    const result = enumerable(items).all(x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it('should return false when any element does not match', () => {
    const items = src([2, 4, 6, 8, 10]);

    const result = enumerable(items).all(x => x % 2 === 1);

    expect(result).toBe(false);
  });
});
