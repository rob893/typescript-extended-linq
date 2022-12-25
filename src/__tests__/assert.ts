import { BasicEnumerable, assert, from } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('assert', (src, enumerable, addSrc) => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', collection => {
    const result = assert(enumerable(src<unknown>(collection)), () => true);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should throw error if predicate fails', () => {
    const items = from(src([1, 2, 3]));

    const query = items.assert(x => x <= 2);

    expect(() => query.toArray()).toThrow(Error);
  });

  it('should throw error with custom error message if predicate fails', () => {
    const items = from(src([1, 2, 3]));
    const customMessage = 'my custom message';

    const query = items.assert(x => x <= 2, customMessage);

    expect(() => query.toArray()).toThrow(Error);
    expect(() => query.toArray()).toThrow(customMessage);
  });

  it('should throw error with custom error type if predicate fails', () => {
    class CustomError extends Error {}
    const items = from(src([1, 2, 3]));

    const query = items.assert(x => x <= 2, CustomError);

    expect(() => query.toArray()).toThrow(CustomError);
  });

  it('should throw error with custom error message and custom type if predicate fails', () => {
    class CustomError extends Error {}
    const items = from(src([1, 2, 3]));
    const customMessage = 'my custom message';

    const query = items.assert(x => x <= 2, customMessage, CustomError);

    expect(() => query.toArray()).toThrow(CustomError);
    expect(() => query.toArray()).toThrow(customMessage);
  });

  it('should call predicate for each item', () => {
    const predicate = jest.fn(() => true);

    const items = src([1, 2, 3]);

    const _ = assert(enumerable(items), predicate).toArray();

    expect(predicate).toHaveBeenCalledTimes(3);
  });

  it('should have deferred execution', () => {
    const predicate = jest.fn(() => true);

    const items = src([1, 2, 3]);

    const result = assert(items, predicate);

    expect(predicate).toHaveBeenCalledTimes(0);

    addSrc(items, 4);

    const _ = result.toArray();

    expect(predicate).toHaveBeenCalledTimes(4);
  });
});
