import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('atMost', (src, enumerable) => {
  it.each([5, 6, 7])('should return true when the sequence contains at most as many elements', count => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atMost(count);

    expect(result).toBe(true);
  });

  it('should return true when the sequence contains at most as many elements that match a condition', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atMost(2, x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it.each([1, 3, 4])('should return false when the sequence does not contain at most as many elements', count => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atMost(count);

    expect(result).toBe(false);
  });

  it('should return false when the sequence does not contain at most as many elements that match a condition', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).atMost(1, x => x % 2 === 0);

    expect(result).toBe(false);
  });

  it('should return true when collection is empty', () => {
    const items = src<number>([]);

    const result = enumerable(items).atMost(1, x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it.each([0, -1])('should throw', count => {
    expect(() => enumerable([1, 2, 3]).atMost(count, x => x > 0)).toThrow();
  });
});
