import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('any', (src, enumerable) => {
  it('should return true when any elements match predicate', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).any(x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it('should return true when any elements are in the collection', () => {
    const items = src([1]);

    const result = enumerable(items).any();

    expect(result).toBe(true);
  });

  it('should return false for empty collection', () => {
    const items = src<number>([]);

    const result = enumerable(items).any();

    expect(result).toBe(false);
  });

  it('should return false when all elements does not match', () => {
    const items = src([2, 4, 6, 8, 10]);

    const result = enumerable(items).any(x => x > 20);

    expect(result).toBe(false);
  });
});
