import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('select', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const items = src([{ foo: 'foo1' }, { foo: 'foo2' }]);
    const result = enumerable(items).select(x => x.foo);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the mapped collection', () => {
    const items = src([{ foo: 'foo1' }, { foo: 'foo2' }]);
    const result = enumerable(items)
      .select(x => x.foo)
      .toArray();

    expect(result).toEqual(['foo1', 'foo2']);
  });

  it('should return empty for empty collection', () => {
    const items: Iterable<{ foo: string }> = src([]);
    const result = enumerable(items)
      .select(x => x.foo)
      .toArray();

    expect(result).toEqual([]);
  });
});

describe.each([...getEnumerables()])('selectMany', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const items = src([
      { foo: 'foo1', bar: [1, 2] },
      { foo: 'foo2', bar: [3, 4] }
    ]);
    const result = enumerable(items).selectMany(x => x.bar);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the mapped collection', () => {
    const items = src([
      { foo: 'foo1', bar: [1, 2] },
      { foo: 'foo2', bar: [3, 4] }
    ]);
    const result = enumerable(items)
      .selectMany(x => x.bar)
      .toArray();

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should return empty for empty collection', () => {
    const items: Iterable<{ foo: string; bar: number[] }> = src([]);
    const result = enumerable(items)
      .selectMany(x => x.bar)
      .toArray();

    expect(result).toEqual([]);
  });
});
