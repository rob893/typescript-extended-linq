import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('sum', (src, enumerable) => {
  it('should sum the numbers', () => {
    const nums = src([0, 1, 2, 3]);
    const result = enumerable(nums).sum();

    expect(result).toBe(6);
  });

  it.each([[[false, true, false]], [[{}, {}, {}]], [[[], [], []]], [['asdf', 's']]])(
    'should throw if no selected passed for non-number collections',
    collection => {
      expect(() => enumerable(src(collection)).sum()).toThrow();
    }
  );

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => enumerable(src(collection)).sum()).toThrow();
  });

  it('should sum the selected numbers', () => {
    const nums = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ]);
    const result = enumerable(nums).sum(x => x.age);

    expect(result).toBe(60);
  });
});
