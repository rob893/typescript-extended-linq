import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyWhere<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => boolean
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    let i = 0;

    for (const item of src) {
      if (exp(item, i)) {
        yield item;
      }

      i++;
    }
  }

  return factory.createEnumerable(generator);
}
