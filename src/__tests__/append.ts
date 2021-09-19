import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('append', (src, enumerable) => {
  it.each([[], new Set([1, 2]), [1, 2]])('should append a new element', collection => {
    const last = 3;

    const res = enumerable(src(collection)).append(last).toArray();

    expect(res[res.length - 1]).toBe(last);
  });
});
