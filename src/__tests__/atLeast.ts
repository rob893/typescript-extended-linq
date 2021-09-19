import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('atLeast', (src, enumerable) => {
  it.each([1, 3, 5])('should return true when the sequence contains at least as many elements', count => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atLeast(count);

    expect(result).toBe(true);
  });

  it('should return true when the sequence contains at least as many elements that match a condition', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atLeast(2, x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it.each([10, 30, 50])('should return false when the sequence does not contain at least as many elements', count => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atLeast(count);

    expect(result).toBe(false);
  });

  it('should return false when the sequence does not contain at least as many elements that match a condition', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atLeast(3, x => x % 2 === 0);

    expect(result).toBe(false);
  });

  it('should return false when collection is empty', () => {
    const items = src<number>([]);

    const result = enumerable(items).atLeast(1, x => x % 2 === 0);

    expect(result).toBe(false);
  });

  it.each([0, -1])('should throw', count => {
    expect(() => enumerable([1, 2, 3]).atLeast(count, x => x > 0)).toThrow();
  });
});
