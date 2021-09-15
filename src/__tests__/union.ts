import { BasicEnumerable, from } from '..';

describe('union', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).union([1, 2, 3]);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the union of two collections', () => {
    const items = [1, 2, 3];

    const otherItems = [2, 3, 4, 5];

    const result = from(items).union(otherItems).toArray();

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should not have duplicates', () => {
    const items = [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3];

    const otherItems = [2, 2, 3, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5];

    const result = from(items).union(otherItems).toArray();

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('should have deferred execution', () => {
    const items = [1, 2, 3];

    const otherItems = [2, 3, 4, 5];

    const result = from(items).union(otherItems);

    otherItems.push(6);

    expect(result.toArray()).toEqual([1, 2, 3, 4, 5, 6]);
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
      .union(otherItems, (a, b) => a.id === b.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });
});

describe('unionBy', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).unionBy([1, 2, 3], x => x);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the union of two collections by id', () => {
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
      .unionBy(otherItems, x => x.id)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
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

    const otherItems = [
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items)
      .unionBy(otherItems, x => x.id)
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

    const otherItems = [
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items).unionBy(otherItems, x => x.id);

    otherItems.push({ id: 6, foo: 'asdf' });

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' },
      { id: 6, foo: 'asdf' }
    ]);
  });
});
