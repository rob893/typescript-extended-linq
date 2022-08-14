import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('quantile', (src, enumerable) => {
  it('should quantile 50 the numbers', () => {
    const nums = src([1, 2, 2, 3, 4]);
    const result = enumerable(nums).quantile(50);

    expect(result).toBe(2);
  });

  it.each([[[false, true, false]], [[{}, {}, {}]], [[[], [], []]], [['asdf', 's']]])(
    'should throw if no selected passed for non-number collections',
    collection => {
      expect(() => enumerable(src(collection)).quantile(50)).toThrow();
    }
  );

  it('should sum the selected numbers', () => {
    const nums = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'joe', age: 40 },
      { name: 'sue', age: 20 },
      { name: 'jack', age: 50 }
    ]);
    const result = enumerable(nums).quantile(x => x.age, 50);

    expect(result).toBe(30);
  });
});
