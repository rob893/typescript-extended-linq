/**
 * Returns the element at a specified index in a sequence or throws if the index is out of range.
 * A negative index can be used to get element starting from the end.
 * @example
 * ```typescript
 * const indexZero = elementAt([1, 2, 3], 0); // Will be 1
 * const willBeNull = elementAt([1, 2, 3], 10); // Will throw.
 * const last = elementAt([1, 2, 3], -1); // 3
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param index The zero-based index of the element to retrieve.
 * @returns The element at the specified position in the source sequence.
 */
export function elementAt<TSource>(src: Iterable<TSource>, index: number): TSource {
  const element = elementAtOrDefault(src, index);

  if (element === null) {
    throw new Error('Index out of bounds');
  }

  return element;
}

/**
 * Returns the element at a specified index in a sequence or null if the index is out of range.
 * A negative index can be used to get element starting from the end.
 * @example
 * ```typescript
 * const indexZero = elementAtOrDefault([1, 2, 3], 0); // Will be 1
 * const willBeNull = elementAtOrDefault([1, 2, 3], 10); // Will be null.
 * const last = elementAtOrDefault([1, 2, 3], -1); // 3
 * ```
 * @typeparam TSource The type of the source iterable.
 * @param src The source iterable.
 * @param index The zero-based index of the element to retrieve.
 * @returns The element at the specified position in the source sequence.
 */
export function elementAtOrDefault<TSource>(src: Iterable<TSource>, index: number): TSource | null {
  if (index < 0) {
    const asArr = Array.isArray(src) ? (src as TSource[]) : [...src];
    const target = asArr.length + index;

    if (target < 0) {
      return null;
    }

    return asArr[target];
  }

  if (Array.isArray(src)) {
    return index < src.length ? (src[index] as TSource) : null;
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
