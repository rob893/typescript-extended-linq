import { from, Enumerable } from '../index';

describe('from', () => {
  it.each([[1, 2, 3], '123', new Set([1, 2, 3]), new Map()])(
    'should return an Enumerable from the passed in iterable',
    collection => {
      const result = from<unknown>(collection);

      expect(result).toBeInstanceOf(Enumerable);
    }
  );
});

describe('Enumerable.from', () => {
  it.each([[1, 2, 3], '123', new Set([1, 2, 3]), new Map()])(
    'should return an Enumerable from the passed in iterable',
    collection => {
      const result = Enumerable.from<unknown>(collection);

      expect(result).toBeInstanceOf(Enumerable);
    }
  );
});
