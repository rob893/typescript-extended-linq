import { Enumerable, from } from '..';

describe('where', () => {
  it('should return an Enumerable', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items).where(x => x.id > 1);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should filter out items that match the condition', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items)
      .where(x => x.id % 2 === 0)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });

  it('should filter no items from empty collection', () => {
    const items: { id: number }[] = [];

    const result = from(items)
      .where(x => x.id % 2 === 0)
      .toArray();

    expect(result).toEqual([]);
  });

  it('should have deferred execution', () => {
    const items: { id: number }[] = [];

    const result = from(items).where(x => x.id % 2 === 0);

    expect(result.toArray()).toEqual([]);

    items.push({ id: 2 });

    expect(result.toArray()).toEqual([{ id: 2 }]);
  });
});
