import { BasicEnumerable } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('skip', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).skip(2);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the last 1', () => {
    const result = enumerable(src([1, 2, 3]))
      .skip(2)
      .toArray();

    expect(result).toEqual([3]);
  });

  it('should return the first 1', () => {
    const result = enumerable(src([1, 2, 3]))
      .skip(1)
      .toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return none', () => {
    const result = enumerable(src([1, 2, 3]))
      .skip(100)
      .toArray();

    expect(result).toEqual([]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => enumerable(src([1, 2, 3])).skip(count)).toThrow();
  });
});

describe.each([...getEnumerables()])('skipLast', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).skipLast(2);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the first one', () => {
    const result = enumerable(src([1, 2, 3]))
      .skipLast(2)
      .toArray();

    expect(result).toEqual([1]);
  });

  it('should return the first 2', () => {
    const result = enumerable(src([1, 2, 3]))
      .skipLast(1)
      .toArray();

    expect(result).toEqual([1, 2]);
  });

  it('should return none', () => {
    const result = enumerable(src([1, 2, 3]))
      .skipLast(100)
      .toArray();

    expect(result).toEqual([]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => enumerable(src([1, 2, 3])).skipLast(count)).toThrow();
  });
});

describe.each([...getEnumerables()])('skipWhile', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).skipWhile(x => true);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return elements after condition is false', () => {
    const result = enumerable(src([1, 2, 3]))
      .skipWhile(x => x % 2 === 1)
      .toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return all', () => {
    const result = enumerable(src([1, 2, 3]))
      .skipWhile(_ => false)
      .toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should return none', () => {
    const result = enumerable(src([1, 2, 3]))
      .skipWhile(_ => true)
      .toArray();

    expect(result).toEqual([]);
  });
});
