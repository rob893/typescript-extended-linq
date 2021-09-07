import { Enumerable } from '../Enumerable';

export function skip<TSource>(src: Iterable<TSource>, count: number): Enumerable<TSource> {
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

  return new Enumerable(generator);
}

export function skipLast<TSource>(src: Iterable<TSource>, count: number): Enumerable<TSource> {
  if (count <= 0) {
    throw new Error('Count must be greater than 0');
  }

  function* generator(): Generator<TSource> {
    const arr = [...src];

    for (let i = 0; i < arr.length - count; i++) {
      yield arr[i];
    }
  }

  return new Enumerable(generator);
}

export function skipWhile<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): Enumerable<TSource> {
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

  return new Enumerable(generator);
}
