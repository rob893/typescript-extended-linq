import { BasicEnumerable } from '..';
import { from } from '../functions/from';

describe('distinct', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).distinct();

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should not have duplicates', () => {
    const items = [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3];

    const result = from(items).distinct().toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should have deferred execution', () => {
    const items = [1, 2, 3];

    const result = from(items).distinct();

    items.push(4, 4);

    expect(result.toArray()).toEqual([1, 2, 3, 4]);
  });

  it('should return the union of two collections using passed comparer', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items)
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

describe('distinctBy', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).distinctBy(x => x);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return distinct items by key', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items)
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
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];

    const result = from(items).distinctBy(x => x.id);

    items.push({ id: 4, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});
