import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('count', (src, enumerable) => {
  it('should return the count', () => {
    const items = src([1, 2, 3]);
    let itemsLength = 0;

    for (const _ of items) {
      itemsLength++;
    }

    const result = enumerable(items).count();

    expect(result).toBe(itemsLength);
  });

  it('should return 0 for empty', () => {
    const result = enumerable(src([])).count();

    expect(result).toBe(0);
  });

  it('should return count that matches condition', () => {
    const items = src([
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ]);

    const result = enumerable(items).count(x => x.id % 2 === 0);

    expect(result).toBe(2);
  });
});
