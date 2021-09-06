import { Enumerable, from } from '..';

describe('take', () => {
  it('should return an Enumerable', () => {
    const result = from([1, 2, 3]).take(2);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the first 2', () => {
    const result = from([1, 2, 3]).take(2).toArray();

    expect(result).toEqual([1, 2]);
  });

  it('should return the first 1', () => {
    const result = from([1, 2, 3]).take(1).toArray();

    expect(result).toEqual([1]);
  });

  it('should return all', () => {
    const result = from([1, 2, 3]).take(100).toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => from([1, 2, 3]).take(count)).toThrow();
  });
});

describe('takeLast', () => {
  it('should return an Enumerable', () => {
    const result = from([1, 2, 3]).takeLast(2);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return the last 2', () => {
    const result = from([1, 2, 3]).takeLast(2).toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return the last 1', () => {
    const result = from([1, 2, 3]).takeLast(1).toArray();

    expect(result).toEqual([3]);
  });

  it('should return all', () => {
    const result = from([1, 2, 3]).takeLast(100).toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => from([1, 2, 3]).takeLast(count)).toThrow();
  });
});

describe('takeWhile', () => {
  it('should return an Enumerable', () => {
    const result = from([1, 2, 3]).takeWhile(x => true);

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should return elements until condition is false', () => {
    const result = from([1, 2, 3])
      .takeWhile(x => x % 2 === 1)
      .toArray();

    expect(result).toEqual([1]);
  });

  it('should return all', () => {
    const result = from([1, 2, 3])
      .takeWhile(_ => true)
      .toArray();

    expect(result).toEqual([1, 2, 3]);
  });
});
