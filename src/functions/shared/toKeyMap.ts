export function toKeyMap<TKey, T>(src: Iterable<T>, keySelector: (item: T) => TKey): Map<TKey, T[]> {
  const map = new Map<TKey, T[]>();

  for (const item of src) {
    const key = keySelector(item);
    const curr = map.get(key);

    if (curr !== undefined) {
      curr.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return map;
}
