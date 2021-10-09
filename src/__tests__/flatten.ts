import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('flatten', (src, enumerable) => {
  it('should flatten the sequence', () => {
    const items = [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, []]]]]];

    const res = enumerable(src(items)).flatten().toArray();

    expect(res).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it.each([
    [1, [1, 2, 3, 4, 5, [6, 7, [8, 9, [10, []]]]]],
    [2, [1, 2, 3, 4, 5, 6, 7, [8, 9, [10, []]]]],
    [3, [1, 2, 3, 4, 5, 6, 7, 8, 9, [10, []]]],
    [1000000, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
  ])('should flatten the sequence to a depth', (depth, expected) => {
    const items = [1, 2, 3, [4, 5, [6, 7, [8, 9, [10, []]]]]];

    const res = enumerable(src(items)).flatten(depth).toArray();

    expect(res).toEqual(expected);
  });
});
