import { Enumerable, from } from '..';

describe('reverse', () => {
  it('should return an Enumberable', () => {
    const result = from([1, 2, 3]).reverse();

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should reverse the elements', () => {
    const items = [1, 2, 3];

    const result = from(items).reverse().toArray();

    expect(result).toEqual([3, 2, 1]);
  });

  it('should not mutate src', () => {
    const items = [1, 2, 3];

    const _ = from(items).reverse().toArray();

    expect(items).toEqual([1, 2, 3]);
  });

  it('should have deferred execution', () => {
    const items = [1, 2, 3];

    const result = from(items).reverse();

    items.push(4, 5);

    expect(result.toArray()).toEqual([5, 4, 3, 2, 1]);
  });
});
