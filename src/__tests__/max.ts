import { from } from '..';

describe('max', () => {
  it.each([
    [[0, 1, 2], 2],
    [[-1, 0, 1], 1],
    [[3, 2, 1], 3]
  ])('should find the max number', (collection, expected) => {
    const result = from(collection).max();
    expect(result).toBe(expected);
  });

  it('should find the max using selector', () => {
    const people = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ];

    const result = from(people).max(p => p.age);

    expect(result).toBe(30);
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => from(collection).max()).toThrow();
  });
});

describe('maxBy', () => {
  it('should find the max using selector and return object', () => {
    const people = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ];

    const result = from(people).maxBy(p => p.age);

    expect(result).toEqual({ name: 'bob', age: 30 });
  });

  it('should find the max using selector and return object first in sequence', () => {
    const people = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 50 },
      { name: 'sue', age: 20 },
      { name: 'jack', age: 50 }
    ];

    const result = from(people).maxBy(p => p.age);

    expect(result).toEqual({ name: 'joe', age: 50 });
  });

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => from<any>(collection).maxBy(x => x.age)).toThrow();
  });
});
