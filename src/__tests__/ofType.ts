import { BasicEnumerable, ofType, TypeOfMember } from '..';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('ofType', (src, enumerable) => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', collection => {
    const result = ofType(enumerable(src<unknown>(collection)), 'string');

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it.each([
    [[1, 'b', 'c', false], 'string', ['b', 'c']],
    [[1, 'b', 'c', false, 2, true], 'number', [1, 2]],
    [[1, 'b', 'c', false, 2, true], 'boolean', [false, true]]
  ])('should only return the specified type', (collection, type, expected) => {
    const result = ofType(enumerable(src(collection)), type as TypeOfMember).toArray();

    expect(result).toEqual(expected);
  });

  it('should only return instances of passed class', () => {
    class Test {}

    const a = new Test();
    const b = new Test();

    const items = [1, 3, 'sadf', a, false, null, undefined, b, NaN];

    const result = ofType(enumerable(src(items)), Test).toArray();

    expect(result).toEqual([a, b]);
  });
});
