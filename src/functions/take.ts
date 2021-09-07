import { Enumerable } from '../Enumerable';

export function take<TSource>(src: Iterable<TSource>, count: number): Enumerable<TSource> {
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

  return new Enumerable(generator);
}

export function takeEvery<TSource>(src: Iterable<TSource>, step: number): Enumerable<TSource> {
  if (step <= 0) {
    throw new Error('Count must be greater than 0');
  }

  return Enumerable.from(src).where((_, i) => i % step === 0);
}

export function takeLast<TSource>(src: Iterable<TSource>, count: number): Enumerable<TSource> {
  if (count <= 0) {
    throw new Error('Count must be greater than 0');
  }

  function* generator(): Generator<TSource> {
    const arr = [...src];

    for (let i = Math.max(arr.length - count, 0); i < arr.length; i++) {
      yield arr[i];
    }
  }

  return new Enumerable(generator);
}

export function takeWhile<TSource>(
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean
): Enumerable<TSource> {
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

  return new Enumerable(generator);
}
