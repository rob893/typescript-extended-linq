import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { Enumerable } from '../enumerables/Enumerable';
import { EnumerableFactory } from '../utilities/EnumerableFactory';

describe('complex', () => {
  it('should allow for multiple statements', () => {
    const items = [
      { id: 1, foo: 'a', bar: new Date('2021-08-01T00:00:00.000Z') },
      { id: 2, foo: 'a', bar: new Date('2021-08-01T00:00:00.000Z') },
      { id: 2, foo: 'b', bar: new Date('2021-08-01T00:00:00.000Z') },
      { id: 2, foo: 'a', bar: new Date('2021-09-01T00:00:00.000Z') },
      { id: 3, foo: 'a', bar: new Date('2021-08-01T00:00:00.000Z') },
      { id: 3, foo: 'b', bar: new Date('2021-08-01T00:00:00.000Z') }
    ];

    let iterationCounter = 0;
    const mock = jest.fn(function* (): Generator<{ id: number; foo: string; bar: Date }> {
      for (let i = 0; i < items.length; i++) {
        iterationCounter++;
        yield items[i];
      }
    });

    const query = new BasicEnumerable(new EnumerableFactory(), mock)
      .where(item => item.id % 2 === 0)
      .orderBy(item => item.id)
      .thenBy(item => item.foo)
      .thenBy(item => item.bar);

    expect(mock).toHaveBeenCalledTimes(0);
    expect(iterationCounter).toBe(0);

    const asArray = query.toArray();

    expect(mock).toHaveBeenCalledTimes(1);
    expect(iterationCounter).toBe(6);
    expect(asArray).toEqual([
      { id: 2, foo: 'a', bar: new Date('2021-08-01T00:00:00.000Z') },
      { id: 2, foo: 'a', bar: new Date('2021-09-01T00:00:00.000Z') },
      { id: 2, foo: 'b', bar: new Date('2021-08-01T00:00:00.000Z') }
    ]);
  });
});

describe('StaticEnumerable.from', () => {
  it.each([
    [
      [1, 2, 3],
      [1, 2, 3]
    ],
    ['123', ['1', '2', '3']],
    [new Set([1, 2, 3]), [1, 2, 3]],
    [new Map(), []]
  ])('should return an Enumerable from the passed in iterable', (collection, expected) => {
    const result = Enumerable.from<unknown>(collection);

    expect(result).toBeInstanceOf(BasicEnumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([null, undefined, false, 123, NaN])('should throw', src => {
    expect(() => Enumerable.from(src as any)).toThrow();
  });
});

describe('StaticEnumerable.fromObject', () => {
  it.each([
    [{}, []],
    [
      { foo: 'bar', bar: 1 },
      [
        ['foo', 'bar'],
        ['bar', 1]
      ]
    ]
  ])('should return an Enumerable from the passed in iterable', (collection, expected) => {
    const result = Enumerable.fromObject<unknown>(collection);

    expect(result).toBeInstanceOf(BasicEnumerable);
    expect(result.toArray()).toEqual(expected);
  });

  it.each([null, undefined, false, 123, NaN])('should throw', src => {
    expect(() => Enumerable.fromObject(src)).toThrow();
  });
});
