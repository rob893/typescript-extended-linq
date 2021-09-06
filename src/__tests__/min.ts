import { from } from '..';

describe('min', () => {
  it.each([
    [[0, 1, 2], 0],
    [[-1, 0, 1], -1],
    [[3, 2, 1], 1]
  ])('should find the min number', (collection, expected) => {
    const result = from(collection).min();
    expect(result).toBe(expected);
  });

  it('should find the min using selector', () => {
    const people = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ];

    const result = from(people).min(p => p.age);

    expect(result).toBe(10);
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => from(collection).min()).toThrow();
  });
});

describe('minBy', () => {
  it('should find the min using selector and return object', () => {
    const people = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ];

    const result = from(people).minBy(p => p.age);

    expect(result).toEqual({ name: 'joe', age: 10 });
  });

  it('should find the min using selector and return object first in sequence', () => {
    const people = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 },
      { name: 'jack', age: 10 }
    ];

    const result = from(people).minBy(p => p.age);

    expect(result).toEqual({ name: 'joe', age: 10 });
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => from<any>(collection).minBy(x => x.age)).toThrow();
  });
});
