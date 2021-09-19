import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('elementAt', (src, enumerable) => {
  it.each([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5]
  ])('should return the element at the given index', (index, expected) => {
    const items = src([1, 2, 3, 4, 5]);

    expect(enumerable(items).elementAt(index)).toBe(expected);
  });

  it.each([-1, 5, 6])('should throw', index => {
    const items = src([1, 2, 3, 4, 5]);

    expect(() => enumerable(items).elementAt(index)).toThrow();
  });
});

describe.each([...getEnumerables()])('elementAtOrDefault', (src, enumerable) => {
  it.each([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5]
  ])('should return the element at the given index', (index, expected) => {
    const items = src([1, 2, 3, 4, 5]);

    expect(enumerable(items).elementAtOrDefault(index)).toBe(expected);
  });

  it('should return null of out of bounds', () => {
    const items = src([1, 2, 3, 4, 5]);

    expect(enumerable(items).elementAtOrDefault(5)).toBeNull();
  });

  it.each([-1, -2])('should throw', index => {
    const items = src([1, 2, 3, 4, 5]);

    expect(() => enumerable(items).elementAtOrDefault(index)).toThrow();
  });
});
