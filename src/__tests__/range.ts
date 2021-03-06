import { BasicEnumerable, Enumerable, range } from '..';

describe('range', () => {
  it.each([
    [0, 3, [0, 1, 2]],
    [-2, 3, [-2, -1, 0]],
    [-2, 0, []]
  ])('should return a Enumerable of numbers for the given range', (start, count, expected) => {
    const result = range(start, count);

    expect(result).toBeInstanceOf(BasicEnumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([
    [0, -1],
    [1, Number.MAX_SAFE_INTEGER]
  ])('should throw for invalid arguments', (start, count) => {
    expect(() => range(start, count)).toThrow();
  });
});

describe('Enumerable.range', () => {
  it.each([
    [0, 3, [0, 1, 2]],
    [-2, 3, [-2, -1, 0]],
    [-2, 0, []]
  ])('should return a Enumerable of numbers for the given range', (start, count, expected) => {
    const result = Enumerable.range(start, count);

    expect(result).toBeInstanceOf(BasicEnumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([
    [0, -1],
    [1, Number.MAX_SAFE_INTEGER]
  ])('should throw for invalid arguments', (start, count) => {
    expect(() => Enumerable.range(start, count)).toThrow();
  });
});
