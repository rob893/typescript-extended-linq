/**
 * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
 * @typeparam TSource The type of the elements of source.
 * @param src An Iterable to return a single element from.
 * @param predicate A function to test an element for a condition.
 * @returns The single element of the input sequence that satisfies a condition.
 */
export function single<TSource>(
  src: Iterable<TSource>,
  predicate?: (item: TSource, index: number) => boolean
): TSource {
  const returnValue = singleOrDefault(src, predicate);

  if (returnValue === null) {
    throw new Error('Sequence contains no elements.');
  }

  return returnValue;
}

/**
 * Returns the only element of a sequence, or a default value if the sequence is empty; this method throws an exception if there is more than one element in the sequence.
 * @typeparam TSource The type of the elements of source.
 * @param src An Iterable to return a single element from.
 * @param predicate A function to test an element for a condition.
 * @returns The single element of the input sequence that satisfies a condition.
 */
export function singleOrDefault<TSource>(
  src: Iterable<TSource>,
  predicate?: (item: TSource, index: number) => boolean
): TSource | null {
  let returnValue: TSource | null = null;
  let i = 0;

  for (const item of src) {
    if (predicate) {
      if (predicate(item, i)) {
        if (returnValue !== null) {
          throw new Error('Squence contains more than one element.');
        } else {
          returnValue = item;
        }
      }
    } else {
      if (returnValue !== null) {
        throw new Error('Squence contains more than one element.');
      } else {
        returnValue = item;
      }
    }

    i++;
  }

  return returnValue;
}
