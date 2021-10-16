import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('xor', (src, enumerable, addSrc) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).xor([1, 2, 3]);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the xor of two collections', () => {
    const items = src([1, 2, 3]);

    const otherItems = [2, 3, 4, 5];

    const result = enumerable(items).xor(otherItems).toArray();

    expect(result).toEqual([1, 4, 5]);
  });

  it('should return the xor of several collections', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).xor([2, 3, 4], [3, 4, 5], [], [6]).toArray();

    expect(result).toEqual([1, 5, 6]);
  });

  it('should not have duplicates', () => {
    const items = src([1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3]);

    const otherItems = [2, 2, 3, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5];

    const result = enumerable(items).xor(otherItems).toArray();

    expect(result).toEqual([1, 4, 5]);
  });

  it('should have deferred execution', () => {
    const items = src([1, 2, 3]);

    const otherItems = [2, 3, 4, 5];

    const result = enumerable(items).xor(otherItems);

    addSrc(items, 6);

    expect(result.toArray()).toEqual([1, 6, 4, 5]);
  });

  it('should return the xor of two collections using passed comparer', () => {
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
      .xor(otherItems, (a, b) => a.id === b.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});

describe.each([...getEnumerables()])('xorBy', (src, enumerable, addSrc) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).xorBy([1, 2, 3], x => x);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the xor of two collections by id', () => {
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
      .xorBy(otherItems, x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });

  it('should return the xor of multiple collections by id', () => {
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

    const evenMoreItems = [
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' },
      { id: 5, foo: 'asdf' }
    ];

    const result = enumerable(items)
      .xorBy(otherItems, evenMoreItems, x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 5, foo: 'asdf' }
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

    const otherItems = [
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = enumerable(items)
      .xorBy(otherItems, x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });

  it('should deferred execution', () => {
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

    const result = enumerable(items).xorBy(otherItems, x => x.id);

    addSrc(items, { id: 6, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 6, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});
