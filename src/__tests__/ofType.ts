import { Enumerable, ofType, TypeOfMember } from '..';

describe('ofType', () => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', src => {
    const result = ofType<unknown, string>(src, 'string');

    expect(result).toBeInstanceOf(Enumerable);
  });

  it.each([
    [[1, 'b', 'c', false], 'string', ['b', 'c']],
    [[1, 'b', 'c', false, 2, true], 'number', [1, 2]],
    [[1, 'b', 'c', false, 2, true], 'boolean', [false, true]]
  ])('should only return the specified type', (src, type, expected) => {
    const result = ofType(src, type as TypeOfMember).toArray();

    expect(result).toEqual(expected);
  });

  it('should only return instances of passed class', () => {
    class Test {}

    const a = new Test();
    const b = new Test();

    const items = [1, 3, 'sadf', a, false, null, undefined, b, NaN];

    const result = ofType(items, Test).toArray();

    expect(result).toEqual([a, b]);
  });
});
