import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyConcat<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
  src: Iterable<TSource>,
  second: Iterable<TSource>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    for (const item of src) {
      yield item;
    }

    if (Array.isArray(second) || typeof second === 'string') {
      for (let i = 0; i < second.length; i++) {
        yield second[i];
      }
    } else {
      for (const secondItem of second) {
        yield secondItem;
      }
    }
  }

  return new enumerableType(generator);
}
