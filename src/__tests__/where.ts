import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('where', (src, enumerable, addSrc) => {
  it('should return an Enumerable', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items).where(x => x.id > 1);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should filter out items that match the condition', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .where(x => x.id % 2 === 0)
      .toArray();

    expect(result).toEqual([
      { id: 2, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);
  });

  it('should filter no items from empty collection', () => {
    const items: Iterable<{ id: number }> = src([]);

    const result = enumerable(items)
      .where(x => x.id % 2 === 0)
      .toArray();

    expect(result).toEqual([]);
  });

  it('should have deferred execution', () => {
    const items: Iterable<{ id: number }> = src([]);

    const result = enumerable(items).where(x => x.id % 2 === 0);

    expect(result.toArray()).toEqual([]);

    addSrc(items, { id: 2 });

    expect(result.toArray()).toEqual([{ id: 2 }]);
  });
});
