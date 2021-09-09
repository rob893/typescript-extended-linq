import { from, Enumerable } from '../index';

describe('from', () => {
  it.each([
    [
      [1, 2, 3],
      [1, 2, 3]
    ],
    ['123', ['1', '2', '3']],
    [new Set([1, 2, 3]), [1, 2, 3]],
    [new Map(), []],
    [{}, []],
    [
      { foo: 'bar', bar: 1 },
      [
        ['foo', 'bar'],
        ['bar', 1]
      ]
    ]
  ])('should return an Enumerable from the passed in iterable', (collection, expected) => {
    const result = from<unknown>(collection);

    expect(result).toBeInstanceOf(Enumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([null, undefined, false, 123, NaN])('should throw', src => {
    expect(() => from(src)).toThrow();
  });
});

describe('Enumerable.from', () => {
  it.each([
    [
      [1, 2, 3],
      [1, 2, 3]
    ],
    ['123', ['1', '2', '3']],
    [new Set([1, 2, 3]), [1, 2, 3]],
    [new Map(), []],
    [{}, []],
    [
      { foo: 'bar', bar: 1 },
      [
        ['foo', 'bar'],
        ['bar', 1]
      ]
    ]
  ])('should return an Enumerable from the passed in iterable', (collection, expected) => {
    const result = Enumerable.from<unknown>(collection);

    expect(result).toBeInstanceOf(Enumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([null, undefined, false, 123, NaN])('should throw', src => {
    expect(() => Enumerable.from(src)).toThrow();
  });
});
