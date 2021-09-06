import { from } from '..';

describe('sequenceEqual', () => {
  it.each([
    [
      [1, 2, 3],
      [1, 2, 3]
    ],
    [[], []],
    [new Set([1, 2, 2]), [1, 2]]
  ])('should return true when sequence is equal', (src, second) => {
    const result = from<unknown>(src).sequenceEqual(second);

    expect(result).toBe(true);
  });

  it('should should return true when sequence is equal when using custom comparer', () => {
    const src = [
      { id: 1, foo: 'foo' },
      { id: 2, foo: 'foo' }
    ];

    const second = [
      { id: 1, foo: 'foo' },
      { id: 2, foo: 'foo' }
    ];

    const result = from(src).sequenceEqual(second, (a, b) => a.id === b.id);

    expect(result).toBe(true);
  });

  it.each([
    [
      [1, 2, 3],
      [2, 1, 3]
    ],
    [[], [1]],
    [new Set([1, 2, 2]), new Set([1, 3, 2])]
  ])('should return false when sequence is not equal', (src, second) => {
    const result = from<unknown>(src).sequenceEqual(second);

    expect(result).toBe(false);
  });
});
