export function forEach<TSource>(src: Iterable<TSource>, callback: (item: TSource, index: number) => void): void {
  let i = 0;

  for (const item of src) {
    callback(item, i);
    i++;
  }
}
