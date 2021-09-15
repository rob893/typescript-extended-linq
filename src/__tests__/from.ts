import { from, Enumerable, fromObject } from '../index';

describe('from', () => {
  it.each([
    [
      [1, 2, 3],
      [1, 2, 3]
    ],
    ['123', ['1', '2', '3']],
    [new Set([1, 2, 3]), [1, 2, 3]],
    [new Map(), []]
  ])('should return an Enumerable from the passed in iterable', (collection, expected) => {
    const result = from<unknown>(collection);

    expect(result).toBeInstanceOf(Enumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([null, undefined, false, 123, NaN])('should throw', src => {
    expect(() => from(src as any)).toThrow();
  });
});

describe('fromObject', () => {
  it.each([
    [{}, []],
    [
      { foo: 'bar', bar: 1 },
      [
        ['foo', 'bar'],
        ['bar', 1]
      ]
    ]
  ])('should return an Enumerable from the passed in object', (collection, expected) => {
    const result = fromObject(collection);

    expect(result).toBeInstanceOf(Enumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([null, undefined, false, 123, NaN])('should throw', src => {
    expect(() => fromObject(src)).toThrow();
  });
});
