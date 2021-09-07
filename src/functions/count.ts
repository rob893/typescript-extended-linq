export function count<TSource>(src: Iterable<TSource>, condition?: (item: TSource, index: number) => boolean): number {
  let count = 0;

  if (condition) {
    let i = 0;

    for (const item of src) {
      if (condition(item, i)) {
        count++;
      }

      i++;
    }
  } else {
    for (const _ of src) {
      count++;
    }
  }

  return count;
}
