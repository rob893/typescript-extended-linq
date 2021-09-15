import { Enumerable, BasicEnumerable, empty } from '..';

describe('empty', () => {
  it('should return an empty Enumerable', () => {
    const result = empty();

    let count = 0;

    for (const _ of result) {
      count++;
    }

    expect(result).toBeInstanceOf(BasicEnumerable);
    expect(count).toBe(0);
  });
});

describe('Enumerable.empty', () => {
  it('should return an empty Enumerable', () => {
    const result = Enumerable.empty();

    let count = 0;

    for (const _ of result) {
      count++;
    }

    expect(result).toBeInstanceOf(BasicEnumerable);
    expect(count).toBe(0);
  });
});
