/**
 * Creates a new instance of the passed in ctor with the Enumerable as input.
 * Useful for custom iterables.
 * @example
 * ```typescript
 * class MyCustomEnumerable<T> extends Enumerable<T> {
 *   public foo(): void {
 *     console.log('hello');
 *   }
 * }
 *
 * const items = [1, 2, 3];
 *
 * const asCustom = from(items).to(MyCustomEnumerable); // asCustom is now a MyCustomEnumerable instance.
 * ```
 * @typeparam TSource The type of the source iterable.
 * @typeparam TResult The type of the returned object.
 * @param src The source Iterable.
 * @param ctor The constructor function to create the result.
 * @returns A new instance of the passed in ctor with the enumerable passed as input.
 */
export function to<TSource, TResult>(src: Iterable<TSource>, ctor: new (src: Iterable<TSource>) => TResult): TResult {
  if ((ctor as unknown) === Array) {
    return [...src] as unknown as TResult;
  }

  return new ctor(src);
}
