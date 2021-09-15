import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyPipe<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  action: (item: TSource, index: number) => void
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    let i = 0;

    for (const item of src) {
      action(item, i);
      yield item;

      i++;
    }
  }

  return factory.createEnumerable(generator);
}
