import { Enumerable } from '..';
import { from } from '../functions/from';

describe('except', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).except([1, 2, 3]);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the exception of two collections', () => {
    const items = [0, 1, 2, 3, 6];

    const otherItems = [2, 3, 4, 5];

    const result = from(items).except(otherItems).toArray();

    expect(result).toEqual([0, 1, 6]);
  });

  it('should return the exception of two collections when one is empty', () => {
    const items = [1, 2, 3];

    const result = from(items).except([]).toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should not have duplicates', () => {
    const items = [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3];

    const otherItems = [2, 2, 3, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5];

    const result = from(items).except(otherItems).toArray();

    expect(result).toEqual([1]);
  });

  it('should have deferred execution', () => {
    const items = [1, 2, 3];

    const otherItems = [2, 3, 4, 5];

    const result = from(items).except(otherItems);

    items.push(5, 6);

    expect(result.toArray()).toEqual([1, 6]);
  });

  it('should return the exception of two collections using passed comparer', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];

    const otherItems = [
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items)
      .except(otherItems, (a, b) => a.id === b.id)
      .toArray();

    expect(result).toEqual([{ id: 1, foo: 'asdf' }]);
  });
});

describe('exceptBy', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).exceptBy([1, 2, 3], x => x);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the exception of two collections by id', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 5, foo: 'asdf' }
    ];

    const result = from(items)
      .exceptBy([2, 3, 4], x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 5, foo: 'asdf' }
    ]);
  });

  it('should not have duplicates by key', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 1, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];

    const result = from(items)
      .exceptBy([2, 3, 3, 4, 4], x => x.id)
      .toArray();

    expect(result).toEqual([{ id: 1, foo: 'asdf' }]);
  });

  it('should deferred execution', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];

    const result = from(items).exceptBy([2, 3, 4, 5], x => x.id);

    items.push({ id: 6, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 6, foo: 'asdf' }
    ]);
  });
});
