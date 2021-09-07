export function toObject<TSource>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => string
): Record<string, TSource>;
export function toObject<TSource, TValue>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => string,
  valueSelector: (item: TSource) => TValue
): Record<string, TValue>;
export function toObject<TSource, TValue>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => string,
  valueSelector?: (item: TSource) => TValue
): Record<string, TSource | TValue>;
export function toObject<TSource, TValue>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => string,
  valueSelector?: (item: TSource) => TValue
): Record<string, TSource | TValue> {
  const obj: Record<string, TSource | TValue> = {};

  if (valueSelector) {
    for (const item of src) {
      const key = keySelector(item);
      obj[key] = valueSelector(item);
    }
  } else {
    for (const item of src) {
      const key = keySelector(item);
      obj[key] = item;
    }
  }

  return obj;
}
