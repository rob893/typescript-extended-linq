import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyInterweave<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  collections: Iterable<TSource>[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const srcAsArr = Array.isArray(src) || typeof src === 'string' ? src : [...src];
    const collectionsAsArrs: TSource[][] = [srcAsArr];

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];
      collectionsAsArrs.push(
        Array.isArray(collection) || typeof collection === 'string' ? collection : [...collection]
      );
    }

    const maxSize = Math.max(...collectionsAsArrs.map(c => c.length));

    for (let i = 0; i < maxSize; i++) {
      for (let j = 0; j < collectionsAsArrs.length; j++) {
        const collection = collectionsAsArrs[j];

        if (collection.length > i) {
          yield collection[i];
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
