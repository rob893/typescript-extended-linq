import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('contains', (src, enumerable) => {
  it('should return true for containing the item', () => {
    const target = 3;

    const result = enumerable(src([1, 2, 3, 4])).contains(target);

    expect(result).toBe(true);
  });

  it('should return false for not containing the item', () => {
    const target = 6;

    const result = enumerable(src([1, 2, 3, 4])).contains(target);

    expect(result).toBe(false);
  });

  it('should return true for containing the item using equality comparer', () => {
    const target = { id: 2, foo: 'foo' };

    const result = enumerable(
      src([
        { id: 3, foo: 'foo' },
        { id: 2, foo: 'fooz' },
        { id: 1, foo: 'foo' }
      ])
    ).contains(target, (a, b) => a.id === b.id);

    expect(result).toBe(true);
  });

  it('should return false for not containing the item using equality comparer', () => {
    const target = { id: 5, foo: 'foo' };

    const result = enumerable(
      src([
        { id: 3, foo: 'foo' },
        { id: 2, foo: 'fooz' },
        { id: 1, foo: 'foo' }
      ])
    ).contains(target, (a, b) => a.id === b.id);

    expect(result).toBe(false);
  });
});
