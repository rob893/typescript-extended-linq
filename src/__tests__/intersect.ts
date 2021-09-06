import { Enumerable, from } from '..';

describe('intersect', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).intersect([1, 2, 3]);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the intersection of two collections', () => {
    const items = [1, 2, 3];

    const otherItems = [2, 3, 4, 5];

    const result = from(items).intersect(otherItems).toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return the intersection of two collections when one is empty', () => {
    const items = [1, 2, 3];

    const result = from(items).intersect([]).toArray();

    expect(result).toEqual([]);
  });

  it('should not have duplicates', () => {
    const items = [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3];

    const otherItems = [2, 2, 3, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5];

    const result = from(items).intersect(otherItems).toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should have deferred execution', () => {
    const items = [1, 2, 3];

    const otherItems = [2, 3, 4, 5];

    const result = from(items).intersect(otherItems);

    items.push(5);

    expect(result.toArray()).toEqual([2, 3, 5]);
  });

  it('should return the union of two collections using passed comparer', () => {
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
      .intersect(otherItems, (a, b) => a.id === b.id)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);
  });
});

describe('intersectBy', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).intersectBy([1, 2, 3], x => x);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the intersection of two collections by id', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];

    const result = from(items)
      .intersectBy([2, 3, 4], x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
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
      .intersectBy([2, 3, 3, 4, 4], x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ]);
  });

  it('should deferred execution', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];

    const result = from(items).intersectBy([3, 4, 5], x => x.id);

    items.push({ id: 4, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});
