export function atMost<TSource>(
  src: Iterable<TSource>,
  count: number,
  predicate?: (item: TSource, index: number) => boolean
): boolean {
  let matches = 0;

  if (predicate) {
    let i = 0;

    for (const item of src) {
      if (predicate(item, i)) {
        matches++;

        if (matches > count) {
          return false;
        }
      }

      i++;
    }
  } else {
    for (const _ of src) {
      matches++;

      if (matches > count) {
        return false;
      }
    }
  }

  return true;
}
