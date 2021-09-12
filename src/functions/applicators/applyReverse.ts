import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyReverse<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
  src: Iterable<TSource>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const items = [...src];

    for (let i = items.length - 1; i >= 0; i--) {
      yield items[i];
    }
  }

  return new enumerableType(generator);
}
