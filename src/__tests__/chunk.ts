import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('chunk', (src, enumerable, srcAdd) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).chunk(5);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should chunk the collection into collections of chunk size', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items)
      .chunk(2)
      .select(x => x.toArray())
      .toArray();

    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should be deferred execution', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items)
      .chunk(2)
      .select(x => x.toArray());

    srcAdd(items, 6, 7);

    expect(result.toArray()).toEqual([[1, 2], [3, 4], [5, 6], [7]]);
  });
});
