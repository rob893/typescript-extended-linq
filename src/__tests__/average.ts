import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('average', (src, enumerable) => {
  it('should average the numbers', () => {
    const nums = src([2, 3, 1]);
    const result = enumerable(nums).average();

    expect(result).toBe(2);
  });

  it.each([[[false, true, false]], [[{}, {}, {}]], [[[], [], []]], [['asdf', 's']]])(
    'should throw if no selected passed for non-number collections',
    collection => {
      expect(() => enumerable(src(collection)).average()).toThrow();
    }
  );

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => enumerable(src(collection)).average()).toThrow();
  });

  it('should sum the selected numbers', () => {
    const nums = src([
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ]);
    const result = enumerable(nums).average(x => x.age);

    expect(result).toBe(20);
  });
});
