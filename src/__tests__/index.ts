import { from, Enumerable, OrderedEnumerable } from '../index';

const numbers = [5, 7, 2, 4, 1, -1, 0];
const objects = [
  { id: 1, foo: 'sfoo', bar: [5] },
  { id: 3, foo: 'ffoo', bar: [] },
  { id: 2, foo: 'afoo', bar: [5, 5, 2] },
  { id: 4, foo: 'foo', bar: [5, 4, 3, 2, 1] }
];

describe('from', () => {
  it.each([[1, 2, 3], '123', new Set([1, 2, 3]), new Map()])(
    'should return an Enumerable from the passed in iterable',
    collection => {
      const result = from<unknown>(collection);

      expect(result).toBeInstanceOf(Enumerable);
    }
  );
});

describe('groupBy', () => {
  it('should return an Enumerable', () => {
    const result = from(objects).groupBy(x => x.id);

    expect(result).toBeInstanceOf(Enumerable);
  });
});

describe('sum', () => {
  it('should sum the numbers', () => {
    const nums = [0, 1, 2, 3];
    const result = from(nums).sum();

    expect(result).toBe(6);
  });
});

describe('min', () => {
  it('should find the min number', () => {
    const nums = [0, 1, 2, 3];
    const result = from(nums).min();

    expect(result).toBe(0);
  });
});

describe('max', () => {
  it('should find the max number', () => {
    const nums = [0, 1, 2, 3];
    const result = from(nums).max();

    expect(result).toBe(3);
  });
});
