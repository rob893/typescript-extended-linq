export function toSet<TSource>(src: Iterable<TSource>): Set<TSource> {
  return new Set(src);
}
