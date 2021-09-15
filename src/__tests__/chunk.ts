import { from } from '../functions/from';
import { BasicEnumerable } from '..';

describe('chunk', () => {
  it('should return an Enumerable', () => {
    const items = [1, 2, 3];

    const result = from(items).chunk(5);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should chunk the collection into collections of chunk size', () => {
    const items = [1, 2, 3, 4, 5];

    const result = from(items)
      .chunk(2)
      .select(x => x.toArray())
      .toArray();

    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should be deferred execution', () => {
    const items = [1, 2, 3, 4, 5];

    const result = from(items)
      .chunk(2)
      .select(x => x.toArray());

    items.push(6, 7);

    expect(result.toArray()).toEqual([[1, 2], [3, 4], [5, 6], [7]]);
  });
});
