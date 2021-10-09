import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('except', (src, enumerable, srcAdd) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).except([1, 2, 3]);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the exception of two collections', () => {
    const items = src([0, 1, 2, 3, 6]);

    const otherItems = [2, 3, 4, 5];

    const result = enumerable(items).except(otherItems).toArray();

    expect(result).toEqual([0, 1, 6]);
  });

  it('should return the exception of multiple collections', () => {
    const items = src([0, 1, 2, 3, 6, 7, 8, 9, 10]);

    const otherItems = [2, 3, 4, 5];

    const evenMoreItems = [7, 8, 9];

    const result = enumerable(items).except(otherItems, evenMoreItems).toArray();

    expect(result).toEqual([0, 1, 6, 10]);
  });

  it('should return the exception of two collections when one is empty', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).except([]).toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should not have duplicates', () => {
    const items = src([1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3]);

    const otherItems = [2, 2, 3, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5];

    const result = enumerable(items).except(otherItems).toArray();

    expect(result).toEqual([1]);
  });

  it('should have deferred execution', () => {
    const items = src([1, 2, 3]);

    const otherItems = [2, 3, 4, 5];

    const result = enumerable(items).except(otherItems);

    srcAdd(items, 5, 6);

    expect(result.toArray()).toEqual([1, 6]);
  });

  it('should return the exception of two collections using passed comparer', () => {
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
      .except(otherItems, (a, b) => a.id === b.id)
      .toArray();

    expect(result).toEqual([{ id: 1, foo: 'asdf' }]);
  });

  it('should return the exception of multiple collections using passed comparer', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .except(
        [
          { id: 3, foo: 'asdf' },
          { id: 4, foo: 'asdf' }
        ],
        [
          { id: 2, foo: 'asdf' },
          { id: 5, foo: 'asdf' }
        ],
        (a, b) => a.id === b.id
      )
      .toArray();

    expect(result).toEqual([{ id: 1, foo: 'asdf' }]);
  });
});

describe.each([...getEnumerables()])('exceptBy', (src, enumerable, srcAdd) => {
  it('should return an Enumerable', () => {
    const items = src([1, 2, 3]);

    const result = enumerable(items).exceptBy([1, 2, 3], x => x);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the exception of two collections by id', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 5, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .exceptBy([2, 3, 4], x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 5, foo: 'asdf' }
    ]);
  });

  it('should return the exception of multiple collections by id', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 5, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .exceptBy([2, 3], [4], x => x.id)
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

    const result = enumerable(items)
      .exceptBy([2, 3, 3, 4, 4], x => x.id)
      .toArray();

    expect(result).toEqual([{ id: 1, foo: 'asdf' }]);
  });

  it('should deferred execution', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);

    const result = enumerable(items).exceptBy([2, 3, 4, 5], x => x.id);

    srcAdd(items, { id: 6, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 6, foo: 'asdf' }
    ]);
  });
});
