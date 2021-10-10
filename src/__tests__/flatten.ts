import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('flatten', (src, enumerable) => {
  it('should flatten the sequence one level deep', () => {
    const items = [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, []]]]], 8, [7, 6], [5, [4]]];

    const res = enumerable(src(items)).flatten().toArray();

    expect(res).toEqual([1, 2, 3, 4, 5, [6, 7, [8, 9, [10, []]]], 8, 7, 6, 5, [4]]);
  });

  it.each([
    [0, [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, []]]]], 8, [7, 6], [5, [4]]]],
    [1, [1, 2, 3, 4, 5, [6, 7, [8, 9, [10, []]]], 8, 7, 6, 5, [4]]],
    [2, [1, 2, 3, 4, 5, 6, 7, [8, 9, [10, []]], 8, 7, 6, 5, 4]],
    [3, [1, 2, 3, 4, 5, 6, 7, 8, 9, [10, []], 8, 7, 6, 5, 4]],
    [1000000, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 8, 7, 6, 5, 4]],
    [Infinity, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 8, 7, 6, 5, 4]]
  ])('should flatten the sequence to a depth', (depth, expected) => {
    const items = [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, []]]]], 8, [7, 6], [5, [4]]];

    const res = enumerable(src(items)).flatten(depth).toArray();

    expect(res).toEqual(expected);
  });

  it.each([NaN, -1])('should throw', depth => {
    const items = [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, []]]]], 8, [7, 6], [5, [4]]];

    expect(() => enumerable(src(items)).flatten(depth).toArray()).toThrow();
  });
});
