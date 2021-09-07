export function last<TSource>(src: Iterable<TSource>, predicate?: (item: TSource, index: number) => boolean): TSource {
  const last = lastOrDefault(src, predicate);

  if (last === null) {
    throw new Error('Sequence contains no elements');
  }

  return last;
}

export function lastOrDefault<TSource>(
  src: Iterable<TSource>,
  predicate?: (item: TSource, index: number) => boolean
): TSource | null {
  const arr = [...src];

  if (predicate) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i], i)) {
        return arr[i];
      }
    }
  } else {
    if (arr.length > 0) {
      return arr[arr.length - 1];
    }
  }

  return null;
}
