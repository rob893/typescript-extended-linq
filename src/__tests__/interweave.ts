import { BasicEnumerable, from } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('interweave', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).interweave([4, 5, 6]);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it.each([
    [
      [1, 2, 3],
      [4, 5],
      [1, 4, 2, 5, 3]
    ],
    [[1, 2, 3], new Set([4, 4, 5, 5]), [1, 4, 2, 5, 3]],
    ['ab', 'cd', ['a', 'c', 'b', 'd']],
    [[], [], []],
    [[], [1, 1], [1, 1]],
    [[1, 1], [], [1, 1]]
  ])('should interweave the elements', (first, second, expected) => {
    const result = enumerable(src<unknown>(first)).interweave(src<unknown>(second)).toArray();

    expect(result).toEqual(expected);
  });

  it('should interweave several collections', () => {
    const items = [1, 2, 3];

    const result = from(items).interweave([4, 5], [], [6], [7, 8, 9]).toArray();

    expect(result).toEqual([1, 4, 6, 7, 2, 5, 8, 3, 9]);
  });
});
