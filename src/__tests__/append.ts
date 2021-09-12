import { from } from '../functions/from';

describe('append', () => {
  it.each([[], new Set([1, 2]), [1, 2]])('should append a new element', src => {
    const last = 3;

    const res = from(src).append(last).toArray();

    expect(res[res.length - 1]).toBe(last);
  });
});
