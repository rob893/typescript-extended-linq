import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyInterweave<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  collections: Iterable<TSource>[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const collectionGenerators = [src, ...collections].map(arr => arr[Symbol.iterator]());

    let hasMore = true;

    while (hasMore) {
      hasMore = false;

      for (const collection of collectionGenerators) {
        const { value, done } = collection.next();

        if (!done) {
          hasMore = true;
          yield value;
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
