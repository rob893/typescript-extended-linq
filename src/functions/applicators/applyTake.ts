import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyTake<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  count: number
): IEnumerable<TSource> {
  if (count <= 0) {
    throw new Error('Count must be greater than 0');
  }

  function* generator(): Generator<TSource> {
    let i = 0;

    for (const item of src) {
      if (i >= count) {
        return;
      }

      i++;
      yield item;
    }
  }

  return factory.createEnumerable(generator);
}

export function applyTakeEvery<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  step: number
): IEnumerable<TSource> {
  if (step <= 0) {
    throw new Error('Count must be greater than 0');
  }

  return factory.createEnumerable(getIterableGenerator(src)).where((_, i) => i % step === 0);
}

export function applyTakeLast<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  count: number
): IEnumerable<TSource> {
  if (count <= 0) {
    throw new Error('Count must be greater than 0');
  }

  function* generator(): Generator<TSource> {
    const arr = [...src];

    for (let i = Math.max(arr.length - count, 0); i < arr.length; i++) {
      yield arr[i];
    }
  }

  return factory.createEnumerable(generator);
}

export function applyTakeWhile<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    let i = 0;

    for (const item of src) {
      if (!predicate(item, i)) {
        return;
      }

      i++;
      yield item;
    }
  }

  return factory.createEnumerable(generator);
}
