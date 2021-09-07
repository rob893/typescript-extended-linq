export function any<TSource>(src: Iterable<TSource>, condition?: (item: TSource, index: number) => boolean): boolean {
  if (!condition) {
    for (const _ of src) {
      return true;
    }
  } else if (condition) {
    let i = 0;

    for (const item of src) {
      if (condition(item, i)) {
        return true;
      }

      i++;
    }
  }

  return false;
}
