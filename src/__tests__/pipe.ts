import { BasicEnumerable, pipe } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('pipe', (src, enumerable, addSrc) => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', collection => {
    const result = pipe(enumerable(src<unknown>(collection)), () => {});

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should call action for each item', () => {
    const action = jest.fn();

    const items = src([1, 2, 3]);

    const _ = pipe(enumerable(items), action).toArray();

    expect(action).toHaveBeenCalledTimes(3);
  });

  it('should have deferred execution', () => {
    const action = jest.fn();

    const items = src([1, 2, 3]);

    const result = pipe(items, action);

    expect(action).toHaveBeenCalledTimes(0);

    addSrc(items, 4);

    const _ = result.toArray();

    expect(action).toHaveBeenCalledTimes(4);
  });
});
