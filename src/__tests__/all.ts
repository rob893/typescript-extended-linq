import { from } from '../functions/from';

describe('all', () => {
  it('should return true when all elements match predicate', () => {
    const items = [2, 4, 6, 8, 10];

    const result = from(items).all(x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it('should return true for empty collection', () => {
    const items: number[] = [];

    const result = from(items).all(x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it('should return false when any element does not match', () => {
    const items = [2, 4, 6, 8, 10];

    const result = from(items).all(x => x % 2 === 1);

    expect(result).toBe(false);
  });
});
