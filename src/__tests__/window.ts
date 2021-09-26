import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('window', (src, enumerable, addSrc) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).window(3);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return windows of size', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items)
      .window(3)
      .select(x => x.toArray())
      .toArray();

    expect(result).toEqual([
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]);
  });

  it('should return empty when size is greater than src length', () => {
    const items = src([1, 2, 3, 4, 5]);

    const result = enumerable(items).window(10).toArray();

    expect(result).toEqual([]);
  });

  it('should have deferred execution', () => {
    const items: Iterable<number> = src([]);

    const result = enumerable(items)
      .window(2)
      .select(x => x.toArray());

    expect(result.toArray()).toEqual([]);

    addSrc(items, 2, 3, 4);

    expect(result.toArray()).toEqual([
      [2, 3],
      [3, 4]
    ]);
  });

  it.each([-5, -1, 0])('should throw', size => {
    expect(() =>
      enumerable(src([1, 2, 3]))
        .window(size)
        .toArray()
    ).toThrow();
  });
});
