import { from } from '../functions/from';

describe('endsWith', () => {
  it.each([
    [[1, 2, 3], [2, 3], true],
    [[1, 2, 3], [], true],
    [[], [], true],
    [[1], [1], true],
    [[1, 2, 3], new Set([1, 1, 2, 2, 3, 3]), true],
    ['abc', 'bc', true],
    ['abv', 'bc', false],
    [[], [1], false]
  ])('should return true if src ends with second and false if not', (src, second, expected) => {
    const result = from<unknown>(src).endsWith(second);

    expect(result).toBe(expected);
  });
});
