export function* whereGenerator<TSource>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => boolean
): Generator<TSource> {
  let i = 0;

  for (const item of src) {
    if (exp(item, i)) {
      yield item;
    }

    i++;
  }
}
