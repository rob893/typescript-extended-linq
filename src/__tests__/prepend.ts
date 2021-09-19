import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('prepend', (src, enumerable) => {
  it.each([[], new Set([1, 2]), [1, 2]])('should prepend a new element', collection => {
    const first = 3;

    const res = enumerable(src(collection)).prepend(first).toArray();

    expect(res[0]).toBe(first);
  });
});
