import { from } from '..';

describe('any', () => {
  it('should return true when any elements match predicate', () => {
    const items = [1, 2, 3];

    const result = from(items).any(x => x % 2 === 0);

    expect(result).toBe(true);
  });

  it('should return true when any elements are in the collection', () => {
    const items = [1];

    const result = from(items).any();

    expect(result).toBe(true);
  });

  it('should return false for empty collection', () => {
    const items: number[] = [];

    const result = from(items).any();

    expect(result).toBe(false);
  });

  it('should return false when all elements does not match', () => {
    const items = [2, 4, 6, 8, 10];

    const result = from(items).any(x => x > 20);

    expect(result).toBe(false);
  });
});
