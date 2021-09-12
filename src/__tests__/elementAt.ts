import { from } from '..';

describe('elementAt', () => {
  it.each([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5]
  ])('should return the element at the given index', (index, expected) => {
    const items = [1, 2, 3, 4, 5];

    expect(from(items).elementAt(index)).toBe(expected);
  });

  it.each([-1, 5, 6])('should throw', index => {
    const items = [1, 2, 3, 4, 5];

    expect(() => from(items).elementAt(index)).toThrow();
  });
});

describe('elementAtOrDefault', () => {
  it.each([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5]
  ])('should return the element at the given index', (index, expected) => {
    const items = [1, 2, 3, 4, 5];

    expect(from(items).elementAtOrDefault(index)).toBe(expected);
  });

  it('should return null of out of bounds', () => {
    const items = [1, 2, 3, 4, 5];

    expect(from(items).elementAtOrDefault(5)).toBeNull();
  });

  it.each([-1, -2])('should throw', index => {
    const items = [1, 2, 3, 4, 5];

    expect(() => from(items).elementAtOrDefault(index)).toThrow();
  });
});
