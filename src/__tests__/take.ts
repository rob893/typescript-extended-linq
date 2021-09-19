import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('take', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).take(2);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the first 2', () => {
    const result = enumerable(src([1, 2, 3]))
      .take(2)
      .toArray();

    expect(result).toEqual([1, 2]);
  });

  it('should return the first 1', () => {
    const result = enumerable(src([1, 2, 3]))
      .take(1)
      .toArray();

    expect(result).toEqual([1]);
  });

  it('should return all', () => {
    const result = enumerable(src([1, 2, 3]))
      .take(100)
      .toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => enumerable(src([1, 2, 3])).take(count)).toThrow();
  });
});

describe.each([...getEnumerables()])('takeLast', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).takeLast(2);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the last 2', () => {
    const result = enumerable(src([1, 2, 3]))
      .takeLast(2)
      .toArray();

    expect(result).toEqual([2, 3]);
  });

  it('should return the last 1', () => {
    const result = enumerable(src([1, 2, 3]))
      .takeLast(1)
      .toArray();

    expect(result).toEqual([3]);
  });

  it('should return all', () => {
    const result = enumerable(src([1, 2, 3]))
      .takeLast(100)
      .toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => enumerable(src([1, 2, 3])).takeLast(count)).toThrow();
  });
});

describe.each([...getEnumerables()])('takeEvery', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).takeEvery(2);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return the every second', () => {
    const result = enumerable(src([1, 2, 3, 4, 5]))
      .takeEvery(2)
      .toArray();

    expect(result).toEqual([1, 3, 5]);
  });

  it('should return the first', () => {
    const result = enumerable(src([1, 2, 3]))
      .takeEvery(100)
      .toArray();

    expect(result).toEqual([1]);
  });

  it('should return all', () => {
    const result = enumerable(src([1, 2, 3]))
      .takeEvery(1)
      .toArray();

    expect(result).toEqual([1, 2, 3]);
  });

  it.each([-1, 0])('should throw', count => {
    expect(() => enumerable(src([1, 2, 3])).takeEvery(count)).toThrow();
  });
});

describe.each([...getEnumerables()])('takeWhile', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const result = enumerable(src([1, 2, 3])).takeWhile(x => true);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should return elements until condition is false', () => {
    const result = enumerable(src([1, 2, 3]))
      .takeWhile(x => x % 2 === 1)
      .toArray();

    expect(result).toEqual([1]);
  });

  it('should return all', () => {
    const result = enumerable(src([1, 2, 3]))
      .takeWhile(_ => true)
      .toArray();

    expect(result).toEqual([1, 2, 3]);
  });
});
