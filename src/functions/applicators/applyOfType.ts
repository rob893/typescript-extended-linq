import { IEnumerable, IEnumerableConstructor, TypeOfMember } from '../../types';

export function applyOfType<TSource, TResult>(
  enumerableType: IEnumerableConstructor<TResult | TSource>,
  src: Iterable<TSource>,
  type: (new (...params: unknown[]) => TResult) | TypeOfMember
): IEnumerable<TResult | TSource> {
  function* generator(): Generator<TResult | TSource> {
    for (const item of src) {
      if (typeof type === 'string') {
        if (typeof item === type) {
          yield item;
        }
      } else {
        if (item instanceof type) {
          yield item;
        }
      }
    }
  }

  return new enumerableType(generator);
}
