import { from } from '..';

describe('sum', () => {
  it('should sum the numbers', () => {
    const nums = [0, 1, 2, 3];
    const result = from(nums).sum();

    expect(result).toBe(6);
  });

  it.each([[[false, true, false]], [[{}, {}, {}]], [[[], [], []]], [['asdf', 's']]])(
    'should throw if no selected passed for non-number collections',
    collection => {
      expect(() => from(collection).sum()).toThrow();
    }
  );

  it.each([[], new Set(), '', new Map()])('should throw if no elements in sequence', collection => {
    expect(() => from(collection).sum()).toThrow();
  });

  it('should sum the selected numbers', () => {
    const nums = [
      { name: 'bob', age: 30 },
      { name: 'joe', age: 10 },
      { name: 'sue', age: 20 }
    ];
    const result = from(nums).sum(x => x.age);

    expect(result).toBe(60);
  });
});
