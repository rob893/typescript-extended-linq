import { Enumerable, from } from '..';

describe('concat', () => {
  it('should return an Enumerable', () => {
    const result = from([1, 2, 3]).concat([4, 5, 6]);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it.each([
    [
      [1, 2, 3],
      [4, 5],
      [1, 2, 3, 4, 5]
    ],
    [[1, 2, 3], new Set([4, 4, 5, 5]), [1, 2, 3, 4, 5]],
    ['ab', 'cd', ['a', 'b', 'c', 'd']],
    [[], [], []],
    [[], [1, 1], [1, 1]],
    [[1, 1], [], [1, 1]]
  ])('should add elements to end of sequence', (src, second, expected) => {
    const result = from<unknown>(src).concat(second).toArray();

    expect(result).toEqual(expected);
  });
});
