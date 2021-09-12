import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyPipe<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
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

  return new enumerableType(generator);
}
