import { BasicEnumerable, from } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('concat', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).concat([4, 5, 6]);

    expect(result).toBeInstanceOf(BasicEnumerable);
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
  ])('should add elements to end of sequence', (first, second, expected) => {
    const result = enumerable(src<unknown>(first)).concat(src<unknown>(second)).toArray();

    expect(result).toEqual(expected);
  });

  it('should concat several collections', () => {
    const items = [1, 2, 3];

    const result = from(items).concat([4, 5], [], [6], [7, 8, 9]).toArray();

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
