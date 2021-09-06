import { Enumerable, from } from '..';

describe('select', () => {
  it('should return an Enumerable', () => {
    const items = [{ foo: 'foo1' }, { foo: 'foo2' }];
    const result = from(items).select(x => x.foo);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the mapped collection', () => {
    const items = [{ foo: 'foo1' }, { foo: 'foo2' }];
    const result = from(items)
      .select(x => x.foo)
      .toArray();

    expect(result).toEqual(['foo1', 'foo2']);
  });

  it('should return empty for empty collection', () => {
    const items: { foo: string }[] = [];
    const result = from(items)
      .select(x => x.foo)
      .toArray();

    expect(result).toEqual([]);
  });
});

describe('selectMany', () => {
  it('should return an Enumerable', () => {
    const items = [
      { foo: 'foo1', bar: [1, 2] },
      { foo: 'foo2', bar: [3, 4] }
    ];
    const result = from(items).selectMany(x => x.bar);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the mapped collection', () => {
    const items = [
      { foo: 'foo1', bar: [1, 2] },
      { foo: 'foo2', bar: [3, 4] }
    ];
    const result = from(items)
      .selectMany(x => x.bar)
      .toArray();

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('should return empty for empty collection', () => {
    const items: { foo: string; bar: number[] }[] = [];
    const result = from(items)
      .selectMany(x => x.bar)
      .toArray();

    expect(result).toEqual([]);
  });
});
