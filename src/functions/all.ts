export function all<TSource>(src: Iterable<TSource>, condition: (item: TSource, index: number) => boolean): boolean {
  let i = 0;

  for (const item of src) {
    if (!condition(item, i)) {
      return false;
    }

    i++;
  }

  return true;
}
