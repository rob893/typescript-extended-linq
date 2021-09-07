import { Enumerable, pipe } from '..';

describe('pipe', () => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', src => {
    const result = pipe<unknown>(src, () => {});

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should call action for each item', () => {
    const action = jest.fn();

    const items = [1, 2, 3];

    const _ = pipe(items, action).toArray();

    expect(action).toHaveBeenCalledTimes(items.length);
  });

  it('should have deferred execution', () => {
    const action = jest.fn();

    const items = [1, 2, 3];

    const result = pipe(items, action);

    expect(action).toHaveBeenCalledTimes(0);

    items.push(4);

    const _ = result.toArray();

    expect(action).toHaveBeenCalledTimes(items.length);
  });
});
