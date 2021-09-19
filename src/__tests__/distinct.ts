import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('distinct', (src, enumerable, srcAdd) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).distinct();

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should not have duplicates', () => {
    const items = src([1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3]);

    const result = enumerable(items).distinct().toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should have deferred execution', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).distinct();

    srcAdd(items, 4, 4);

    expect(result.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('should return the union of two collections using passed comparer', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .distinct((a, b) => a.id === b.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});

describe.each([...getEnumerables()])('distinctBy', (src, enumerable, srcAdd) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).distinctBy(x => x);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return distinct items by key', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .distinctBy(x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });

  it('should deferred execution', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);

    const result = enumerable(items).distinctBy(x => x.id);

    srcAdd(items, { id: 4, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});
