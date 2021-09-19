import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('reverse', (src, enumerable, addSrc) => {
  it('should return an Enumberable', () => {
    const result = enumerable(src([1, 2, 3])).reverse();

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should reverse the elements', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).reverse().toArray();

    expect(result).toEqual([3, 2, 1]);
  });

  it('should not mutate src', () => {
    const items = src([1, 2, 3]);

    const _ = enumerable(items).reverse().toArray();

    expect([...items]).toEqual([1, 2, 3]);
  });

  it('should have deferred execution', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).reverse();

    addSrc(items, 4, 5);

    expect(result.toArray()).toEqual([5, 4, 3, 2, 1]);
  });
});
