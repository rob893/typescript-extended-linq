import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('endsWith', (src, enumerable) => {
  it.each([
    [[1, 2, 3], [2, 3], true],
    [[1, 2, 3], [], true],
    [[], [], true],
    [[1], [1], true],
    [[1, 2, 3], new Set([1, 1, 2, 2, 3, 3]), true],
    ['abc', 'bc', true],
    ['abv', 'bc', false],
    [[], [1], false]
  ])('should return true if src ends with second and false if not', (first, second, expected) => {
    const result = enumerable(src<unknown>(first)).endsWith(src<unknown>(second));

    expect(result).toBe(expected);
  });
});
