export function getIterableGenerator<TSource>(src: Iterable<TSource>): () => Generator<TSource> {
  return Array.isArray(src) || typeof src === 'string'
    ? function* (): Generator<TSource> {
        for (let i = 0; i < src.length; i++) {
          yield src[i];
        }
      }
    : function* (): Generator<TSource> {
        for (const item of src) {
          yield item;
        }
      };
}
