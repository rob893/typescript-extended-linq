import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('zip', (src, enumerable, addSrc) => {
  it('should return an Enumerable', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items).zip([1, 2, 3]);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return zipped collection', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items).zip([1, 2, 3]).toArray();

    expect(result).toEqual([
      [{ id: 1, foo: 'asdf' }, 1],
      [{ id: 2, foo: 'asdf' }, 2],
      [{ id: 3, foo: 'asdf' }, 3]
    ]);
  });

  it('should return zipped collection using transformer', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items)
      .zip([1, 2, 3], ({ id, foo }, second) => ({
        id,
        foo,
        other: second
      }))
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'asdf', other: 1 },
      { id: 2, foo: 'asdf', other: 2 },
      { id: 3, foo: 'asdf', other: 3 }
    ]);
  });

  it('should return empty collection when source is empty', () => {
    const result = enumerable(src([])).zip([1, 2, 3]).toArray();

    expect(result).toEqual([]);
  });

  it('should return empty collection when second is empty', () => {
    const result = enumerable(src([1, 2, 3]))
      .zip([])
      .toArray();

    expect(result).toEqual([]);
  });
});
