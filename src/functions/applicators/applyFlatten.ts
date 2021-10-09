import { IEnumerable, IEnumerableFactory } from '../../types';

function* internalFlatten<TSource>(
  src: Iterable<TSource | Iterable<TSource>>,
  depth?: number
): Generator<TSource | Iterable<TSource | Iterable<TSource>>> {
  if (typeof depth === 'number' && depth < 0) {
    return yield src;
  }

  const isIterable = <T>(item: unknown): item is Iterable<T> => Symbol.iterator in Object(item);

  for (const currentItem of src) {
    if (isIterable(currentItem)) {
      return yield* internalFlatten(currentItem, typeof depth === 'number' ? depth - 1 : undefined);
    }

    yield currentItem;
  }
}

export function applyFlatten<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource | Iterable<TSource>>,
  depth?: number
): IEnumerable<TSource | Iterable<TSource | Iterable<TSource>>> {
  function* generator(): Generator<TSource | Iterable<TSource | Iterable<TSource>>> {
    yield* internalFlatten(src, depth);
  }

  return factory.createBasicEnumerable(generator);
}
