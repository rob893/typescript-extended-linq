import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('startsWith', (src, enumerable) => {
  it.each([
    [
      [1, 2, 3, 4],
      [1, 2, 3, 4]
    ],
    ['abc', ['a', 'b']],
    [[1, 2, 3], []]
  ])('should return true when sequence starts with another sequence', (sequence, starts) => {
    expect(enumerable(src<unknown>(sequence)).startsWith(starts)).toBe(true);
  });

  it.each([
    [
      [1, 2, 3, 4],
      [1, 2, 3, 4]
    ],
    ['abc', ['a', 'b']],
    [[1, 2, 3], []]
  ])('should return true when sequence starts with another sequence using comparer', (sequence, starts) => {
    expect(enumerable(src<unknown>(sequence)).startsWith(starts, (a, b) => a === b)).toBe(true);
  });

  it.each([
    [
      [1, 2, 3, 4],
      [4, 3, 2, 1]
    ],
    [
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5]
    ],
    ['abc', ['b']]
  ])('should return false when sequence does not start with another sequence', (sequence, starts) => {
    expect(enumerable(src<unknown>(sequence)).startsWith(starts)).toBe(false);
  });

  it.each([
    [
      [1, 2, 3, 4],
      [4, 3, 2, 1]
    ],
    [
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5]
    ],
    ['abc', ['b']]
  ])('should return false when sequence does not start with another sequence using comparer', (sequence, starts) => {
    expect(enumerable(src<unknown>(sequence)).startsWith(starts, (a, b) => a === b)).toBe(false);
  });
});
