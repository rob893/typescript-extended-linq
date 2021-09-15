import { IEnumerable, IEnumerableFactory } from '../../types';

export function applySkip<TSource>(
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
      i++;

      if (i > count) {
        yield item;
      }
    }
  }

  return factory.createEnumerable(generator);
}

export function applySkipLast<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  count: number
): IEnumerable<TSource> {
  if (count <= 0) {
    throw new Error('Count must be greater than 0');
  }

  function* generator(): Generator<TSource> {
    const arr = [...src];

    for (let i = 0; i < arr.length - count; i++) {
      yield arr[i];
    }
  }

  return factory.createEnumerable(generator);
}

export function applySkipWhile<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    let i = 0;
    let keepSkipping = true;

    for (const item of src) {
      if (keepSkipping) {
        if (!predicate(item, i)) {
          keepSkipping = false;
        }
      }

      if (!keepSkipping) {
        yield item;
      }

      i++;
    }
  }

  return factory.createEnumerable(generator);
}
