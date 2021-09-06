import { from } from '..';

describe('count', () => {
  it('should return the count', () => {
    const items = [1, 2, 3];

    const result = from(items).count();

    expect(result).toBe(items.length);
  });

  it('should return 0 for empty', () => {
    const result = from([]).count();

    expect(result).toBe(0);
  });

  it('should return count that matches condition', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    const result = from(items).count(x => x.id % 2 === 0);

    expect(result).toBe(2);
  });
});
