export function atLeast<TSource>(
  src: Iterable<TSource>,
  count: number,
  predicate?: (item: TSource, index: number) => boolean
): boolean {
  if (count < 1) {
    throw new Error('count must be greater than 0.');
  }

  let matches = 0;

  if (predicate) {
    let i = 0;

    for (const item of src) {
      if (predicate(item, i)) {
        matches++;

        if (matches >= count) {
          return true;
        }
      }

      i++;
    }
  } else {
    for (const _ of src) {
      matches++;

      if (matches >= count) {
        return true;
      }
    }
  }

  return false;
}
