import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('single', (src, enumerable) => {
  it('should return the first element and ensure that exactly one exists', () => {
    const items = src([1]);

    const first = enumerable(items).single();

    expect(first).toEqual(1);
  });

  it('should return the first element that matches the condition and ensure that exactly one exists', () => {
    const items = src([1, 2, 3]);

    const first = enumerable(items).single(x => x === 2);

    expect(first).toEqual(2);
  });

  it('should should throw when empty', () => {
    expect(() => enumerable(src([])).single()).toThrow();
  });

  it('should should throw when more than one element in sequence', () => {
    const items = src([1, 2]);

    expect(() => enumerable(items).single()).toThrow();
  });

  it('should should throw when more than one element matches sequence in sequence', () => {
    const items = src([1, 2, 3, 2]);

    expect(() => enumerable(items).single(x => x === 2)).toThrow();
  });
});

describe.each([...getEnumerables()])('singleOrDefault', (src, enumerable) => {
  it('should return the first element and ensure that exactly one exists', () => {
    const items = src([1]);

    const first = enumerable(items).singleOrDefault();

    expect(first).toEqual(1);
  });

  it('should return the first element that matches the condition and ensure that exactly one exists', () => {
    const items = src([1, 2, 3]);

    const first = enumerable(items).singleOrDefault(x => x === 2);

    expect(first).toEqual(2);
  });

  it('should return null when empty', () => {
    expect(enumerable(src([])).singleOrDefault()).toBeNull();
  });

  it('should should throw when more than one element in sequence', () => {
    const items = src([1, 2]);

    expect(() => enumerable(items).singleOrDefault()).toThrow();
  });

  it('should should throw when more than one element matches sequence in sequence', () => {
    const items = src([1, 2, 3, 2]);

    expect(() => enumerable(items).singleOrDefault(x => x === 2)).toThrow();
  });
});
