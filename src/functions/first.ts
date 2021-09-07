export function first<TSource>(src: Iterable<TSource>, condition?: (item: TSource, index: number) => boolean): TSource {
  const first = firstOrDefault(src, condition);

  if (first === null) {
    throw new Error('Sequence contains no elements.');
  }

  return first;
}

export function firstOrDefault<TSource>(
  src: Iterable<TSource>,
  condition?: (item: TSource, index: number) => boolean
): TSource | null {
  if (!condition) {
    for (const item of src) {
      return item;
    }
  } else {
    let i = 0;

    for (const item of src) {
      if (condition(item, i)) {
        return item;
      }

      i++;
    }
  }

  return null;
}
