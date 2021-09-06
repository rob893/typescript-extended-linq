import { from } from '..';

describe('prepend', () => {
  it.each([[], new Set([1, 2]), [1, 2]])('should prepend a new element', src => {
    const first = 3;

    const res = from(src).prepend(first).toArray();

    expect(res[0]).toBe(first);
  });
});
