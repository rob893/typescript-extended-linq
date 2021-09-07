import { Enumerable } from '..';

describe('repeat', () => {
  it.each([
    [0, 3, [0, 0, 0]],
    [{}, 3, [{}, {}, {}]],
    [-2, 3, [-2, -2, -2]],
    [-2, 0, []]
  ])('should return a Enumerable of repeated items for the given count', (item, count, expected) => {
    const result = Enumerable.repeat(item, count);

    expect(result).toBeInstanceOf(Enumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it('should throw for invalid arguments', () => {
    expect(() => Enumerable.repeat(1, -1)).toThrow();
  });
});
