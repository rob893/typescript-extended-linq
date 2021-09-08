/**
 * Determines whether all elements of a sequence satisfy a condition.
 *
 * ```typescript
 * const numbers = [1, 2, 3, 4];
 * const areAllNumbersEven = all(numbers, x => x % 2 === 0);
 * ```
 *
 * @param src An Enumerable<TSource> that contains the elements to apply the predicate to.
 * @param condition A function to test each element for a condition.
 * @returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
 */
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
