import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../../utilities/utilityFunctions';

export function applyWindow<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  size: number
): IEnumerable<IEnumerable<TSource>> {
  if (size <= 0) {
    throw new Error('size must be greater than 0.');
  }

  function* generator(): Generator<IEnumerable<TSource>> {
    const arr = Array.isArray(src) ? src : [...src];

    for (let i = 0; i <= arr.length - size; i++) {
      const window: TSource[] = [];

      for (let j = i; j < i + size; j++) {
        window.push(arr[j]);
      }

      if (window.length === size) {
        yield factory.createArrayEnumerable(getIterableGenerator(window), window);
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
