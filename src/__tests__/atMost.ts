import { from } from '..';

describe('atMost', () => {
  it.each([5, 6, 7])('should return true when the sequence contains at most as many elements', count => {
    const items = [1, 2, 3, 4, 5];

    const result = from(items).atMost(count);

    expect(result).toBe(true);
  });

  it('should return true when the sequence contains at most as many elements that match a condition', () => {
    const items = [1, 2, 3, 4, 5];

    const result = from(items).atMost(2, x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it.each([1, 3, 4])('should return false when the sequence does not contain at most as many elements', count => {
    const items = [1, 2, 3, 4, 5];

    const result = from(items).atMost(count);

    expect(result).toBe(false);
  });

  it('should return false when the sequence does not contain at most as many elements that match a condition', () => {
    const items = [1, 2, 3, 4, 5];

    const result = from(items).atMost(1, x => x % 2 === 0);

    expect(result).toBe(false);
  });

  it('should return true when collection is empty', () => {
    const items: number[] = [];

    const result = from(items).atMost(1, x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it.each([0, -1])('should throw', count => {
    expect(() => from([1, 2, 3]).atMost(count, x => x > 0)).toThrow();
  });
});
