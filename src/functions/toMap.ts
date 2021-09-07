export function toMap<TSource, TKey>(src: Iterable<TSource>, keySelector: (item: TSource) => TKey): Map<TKey, TSource>;
export function toMap<TSource, TKey, TValue>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  valueSelector: (item: TSource) => TValue
): Map<TKey, TValue>;
export function toMap<TSource, TKey, TValue>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  valueSelector?: (item: TSource) => TValue
): Map<TKey, TSource | TValue>;
export function toMap<TSource, TKey, TValue>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  valueSelector?: (item: TSource) => TValue
): Map<TKey, TSource | TValue> {
  const map = new Map<TKey, TSource | TValue>();

  if (valueSelector) {
    for (const item of src) {
      const key = keySelector(item);
      map.set(key, valueSelector(item));
    }
  } else {
    for (const item of src) {
      const key = keySelector(item);
      map.set(key, item);
    }
  }

  return map;
}
