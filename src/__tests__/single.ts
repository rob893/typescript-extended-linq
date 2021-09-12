import { from } from '..';

describe('single', () => {
  it('should return the first element and ensure that exactly one exists', () => {
    const items = [1];

    const first = from(items).single();

    expect(first).toEqual(1);
  });

  it('should return the first element that matches the condition and ensure that exactly one exists', () => {
    const items = [1, 2, 3];

    const first = from(items).single(x => x === 2);

    expect(first).toEqual(2);
  });

  it('should should throw when empty', () => {
    expect(() => from([]).single()).toThrow();
  });

  it('should should throw when more than one element in sequence', () => {
    const items = [1, 2];

    expect(() => from(items).single()).toThrow();
  });

  it('should should throw when more than one element matches sequence in sequence', () => {
    const items = [1, 2, 3, 2];

    expect(() => from(items).single(x => x === 2)).toThrow();
  });
});

describe('singleOrDefault', () => {
  it('should return the first element and ensure that exactly one exists', () => {
    const items = [1];

    const first = from(items).singleOrDefault();

    expect(first).toEqual(1);
  });

  it('should return the first element that matches the condition and ensure that exactly one exists', () => {
    const items = [1, 2, 3];

    const first = from(items).singleOrDefault(x => x === 2);

    expect(first).toEqual(2);
  });

  it('should return null when empty', () => {
    expect(from([]).singleOrDefault()).toBeNull();
  });

  it('should should throw when more than one element in sequence', () => {
    const items = [1, 2];

    expect(() => from(items).singleOrDefault()).toThrow();
  });

  it('should should throw when more than one element matches sequence in sequence', () => {
    const items = [1, 2, 3, 2];

    expect(() => from(items).singleOrDefault(x => x === 2)).toThrow();
  });
});
