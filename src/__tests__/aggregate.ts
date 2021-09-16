import { from, aggregate } from '../..';

describe('aggregate', () => {
  it('should aggregate the numbers', () => {
    const nums = [1, 2, 3];

    const aggregate = from(nums).aggregate(0, (prev, curr) => prev + curr);

    expect(aggregate).toEqual(6);
  });

  it('should throw when using static function wrong', () => {
    expect(() => aggregate([1, 2, 3], 0)).toThrow();
  });
});
