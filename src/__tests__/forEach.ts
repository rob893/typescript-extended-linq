import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('forEach', (src, enumerable) => {
  it.each([[[]], [[1, 2, 3]], [[1, 2, 3, 4, 5]]])('should iterate the sequence in order', collection => {
    let i = 0;

    enumerable(src(collection)).forEach((item, index) => {
      expect(index).toBe(i);
      expect(item).toEqual(collection[i]);
      i++;
    });

    expect(collection.length).toBe(i);
  });
});
