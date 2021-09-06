import { Enumerable, from } from '..';

describe('skip', () => {
  it('should return an Enumerable', () => {
    const result = from([1, 2, 3]).skip(2);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the last 1', () => {
    const result = from([1, 2, 3]).skip(2).toArray();

    expect(result).toEqual([3]);
  });

  it('should return the first 1', () => {
    const result = from([1, 2, 3]).skip(1).toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return none', () => {
    const result = from([1, 2, 3]).skip(100).toArray();

    expect(result).toEqual([]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => from([1, 2, 3]).skip(count)).toThrow();
  });
});

describe('skipLast', () => {
  it('should return an Enumerable', () => {
    const result = from([1, 2, 3]).skipLast(2);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the first one', () => {
    const result = from([1, 2, 3]).skipLast(2).toArray();

    expect(result).toEqual([1]);
  });

  it('should return the first 2', () => {
    const result = from([1, 2, 3]).skipLast(1).toArray();

    expect(result).toEqual([1, 2]);
  });

  it('should return none', () => {
    const result = from([1, 2, 3]).skipLast(100).toArray();

    expect(result).toEqual([]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => from([1, 2, 3]).skipLast(count)).toThrow();
  });
});

describe('skipWhile', () => {
  it('should return an Enumerable', () => {
    const result = from([1, 2, 3]).skipWhile(x => true);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return elements after condition is false', () => {
    const result = from([1, 2, 3])
      .skipWhile(x => x % 2 === 1)
      .toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return all', () => {
    const result = from([1, 2, 3])
      .skipWhile(_ => false)
      .toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return none', () => {
    const result = from([1, 2, 3])
      .skipWhile(_ => true)
      .toArray();

    expect(result).toEqual([]);
  });
});
