import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('max', (src, enumerable) => {
  it.each([
    [[0, 1, 2], 2],
    [[-1, 0, 1], 1],
    [[3, 2, 1], 3]
  ])('should find the max number', (collection, expected) => {
    const result = enumerable(src(collection)).max();
    expect(result).toBe(expected);
  });

  it('should find the max using selector', () => {
    const people = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ]);

    const result = enumerable(people).max(p => p.age);

    expect(result).toBe(30);
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => enumerable(src(collection)).max()).toThrow();
  });
});

describe.each([...getEnumerables()])('maxBy', (src, enumerable) => {
  it('should find the max using selector and return object', () => {
    const people = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ]);

    const result = enumerable(people).maxBy(p => p.age);

    expect(result).toEqual({ name: 'bob', age: 30 });
  });

  it('should find the max using selector and return object first in sequence', () => {
    const people = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 50 },
      { name: 'sue', age: 20 },
      { name: 'jack', age: 50 }
    ]);

    const result = enumerable(people).maxBy(p => p.age);

    expect(result).toEqual({ name: 'joe', age: 50 });
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => enumerable(src<any>(collection)).maxBy(x => x.age)).toThrow();
  });
});
