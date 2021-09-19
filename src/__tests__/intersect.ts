import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('intersect', (src, enumerable, srcAdd) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).intersect([1, 2, 3]);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the intersection of two collections', () => {
    const items = src([1, 2, 3]);

    const otherItems = [2, 3, 4, 5];

    const result = enumerable(items).intersect(otherItems).toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return the intersection of two collections when one is empty', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).intersect([]).toArray();

    expect(result).toEqual([]);
  });

  it('should not have duplicates', () => {
    const items = src([1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3]);

    const otherItems = [2, 2, 3, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5];

    const result = enumerable(items).intersect(otherItems).toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should have deferred execution', () => {
    const items = src([1, 2, 3]);

    const otherItems = [2, 3, 4, 5];

    const result = enumerable(items).intersect(otherItems);

    srcAdd(items, 5);

    expect(result.toArray()).toEqual([2, 3, 5]);
  });

  it('should return the union of two collections using passed comparer', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);

    const otherItems = [
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = enumerable(items)
      .intersect(otherItems, (a, b) => a.id === b.id)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);
  });
});

describe.each([...getEnumerables()])('intersectBy', (src, enumerable, srcAdd) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).intersectBy([1, 2, 3], x => x);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the intersection of two collections by id', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .intersectBy([2, 3, 4], x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);
  });

  it('should not have duplicates by key', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 1, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .intersectBy([2, 3, 3, 4, 4], x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);
  });

  it('should deferred execution', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);

    const result = enumerable(items).intersectBy([3, 4, 5], x => x.id);

    srcAdd(items, { id: 4, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});
