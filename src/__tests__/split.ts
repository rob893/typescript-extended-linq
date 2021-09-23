import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('split', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).split(2);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should split at 2', () => {
    const result = enumerable(src([1, 2, 3]))
      .split(2)
      .select(x => x.toArray())
      .toArray();

    expect(result).toEqual([[1], [3]]);
  });

  it('should split nothing and return full sequence', () => {
    const result = enumerable(src([1, 2, 3]))
      .split(5)
      .select(x => x.toArray())
      .toArray();

    expect(result).toEqual([[1, 2, 3]]);
  });

  it('should split nothing and return empty', () => {
    const result = enumerable(src<number>([]))
      .split(5)
      .select(x => x.toArray())
      .toArray();

    expect(result).toEqual([]);
  });
});
