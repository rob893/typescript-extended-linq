import { aggregate } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('aggregate', (src, enumerable) => {
  it('should aggregate the numbers', () => {
    const nums = src([1, 2, 3]);

    const aggregate = enumerable(nums).aggregate(0, (prev, curr) => prev + curr);

    expect(aggregate).toEqual(6);
  });

  it('should throw when using static function wrong', () => {
    expect(() => aggregate([1, 2, 3], 0)).toThrow();
  });
});
