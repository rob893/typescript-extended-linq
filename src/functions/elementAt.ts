export function elementAt<TSource>(src: Iterable<TSource>, index: number): TSource {
  const element = elementAtOrDefault(src, index);

  if (element === null) {
    throw new Error('Index out of bounds');
  }

  return element;
}

export function elementAtOrDefault<TSource>(src: Iterable<TSource>, index: number): TSource | null {
  if (index < 0) {
    throw new Error('Index must be greater than or equal to 0');
  }

  let i = 0;

  for (const item of src) {
    if (i === index) {
      return item;
    }

    i++;
  }

  return null;
}
