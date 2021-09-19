import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('min', (src, enumerable) => {
  it.each([
    [[0, 1, 2], 0],
    [[-1, 0, 1], -1],
    [[3, 2, 1], 1]
  ])('should find the min number', (collection, expected) => {
    const result = enumerable(src(collection)).min();
    expect(result).toBe(expected);
  });

  it('should find the min using selector', () => {
    const people = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ]);

    const result = enumerable(people).min(p => p.age);

    expect(result).toBe(10);
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => enumerable(src(collection)).min()).toThrow();
  });
});

describe.each([...getEnumerables()])('minBy', (src, enumerable) => {
  it('should find the min using selector and return object', () => {
    const people = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ]);

    const result = enumerable(people).minBy(p => p.age);

    expect(result).toEqual({ name: 'joe', age: 10 });
  });

  it('should find the min using selector and return object first in sequence', () => {
    const people = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 },
      { name: 'jack', age: 10 }
    ]);

    const result = enumerable(people).minBy(p => p.age);

    expect(result).toEqual({ name: 'joe', age: 10 });
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => enumerable(src<any>(collection)).minBy(x => x.age)).toThrow();
  });
});
