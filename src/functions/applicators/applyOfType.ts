import { IEnumerable, IEnumerableFactory, TypeOfMember } from '../../types';

export function applyOfType<TSource, TResult>(
  factory: IEnumerableFactory,
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

  return factory.createBasicEnumerable(generator);
}
