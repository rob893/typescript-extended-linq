import { Enumerable, empty } from '..';

describe('empty', () => {
  it('should return an empty Enumerable', () => {
    const result = empty();

    let count = 0;

    for (const _ of result) {
      count++;
    }

    expect(result).toBeInstanceOf(Enumerable);
    expect(count).toBe(0);
  });
});
