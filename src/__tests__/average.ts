import { from } from '..';

describe('average', () => {
  it('should average the numbers', () => {
    const nums = [2, 3, 1];
    const result = from(nums).average();

    expect(result).toBe(2);
  });

  it.each([[[false, true, false]], [[{}, {}, {}]], [[[], [], []]], [['asdf', 's']]])(
    'should throw if no selected passed for non-number collections',
    collection => {
      expect(() => from(collection).average()).toThrow();
    }
  );

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => from(collection).average()).toThrow();
  });

  it('should sum the selected numbers', () => {
    const nums = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ];
    const result = from(nums).average(x => x.age);

    expect(result).toBe(20);
  });
});
