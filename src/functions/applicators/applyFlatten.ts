import { IEnumerable, IEnumerableFactory, FlatIterable } from '../../types';

function* internalFlatten<TSource, Depth extends number>(
  src: Iterable<TSource>,
  depth: Depth
): Generator<Iterable<TSource | Iterable<TSource>> | TSource> {
  if (depth < 0) {
    return yield src;
  }

  const isIterable = (item: Iterable<TSource | Iterable<TSource>> | TSource): item is Iterable<TSource> =>
    Symbol.iterator in Object(item);

  for (const currentItem of src) {
    if (isIterable(currentItem)) {
      yield* internalFlatten(currentItem, depth - 1);
    } else {
      yield currentItem;
    }
  }
}

export function applyFlatten<TSource, Depth extends number = 1>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  depth?: Depth
): IEnumerable<FlatIterable<Iterable<TSource>, Depth>> {
  if (Number.isNaN(depth) || (typeof depth === 'number' && depth < 0)) {
    throw new Error('Invalid depth.');
  }

  function* generator(): Generator<FlatIterable<Iterable<TSource>, Depth>> {
    yield* internalFlatten(src, depth ?? 1) as Generator<FlatIterable<Iterable<TSource>, Depth>>;
  }

  return factory.createBasicEnumerable(generator);
}
