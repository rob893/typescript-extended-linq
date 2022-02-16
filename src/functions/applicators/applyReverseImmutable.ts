import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyReverseImmutable<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const items = [...src];

    for (let i = items.length - 1; i >= 0; i--) {
      yield items[i];
    }
  }

  return factory.createBasicEnumerable(generator);
}
