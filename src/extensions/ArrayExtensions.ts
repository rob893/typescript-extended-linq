// Important for first argument to be the array and for all functions to be static.
export class ArrayExtensions {
  public static clear<TSource>(arr: TSource[]): void {
    arr.length = 0;
  }

  public static insert<TSource>(arr: TSource[], index: number, item: TSource): void {
    if (index < 0 || index >= arr.length) {
      throw new Error('Index out of bounds.');
    }

    arr.splice(index, 0, item);
  }

  public static insertRange<TSource>(arr: TSource[], index: number, collection: Iterable<TSource>): void {
    if (index < 0 || index >= arr.length) {
      throw new Error('Index out of bounds.');
    }

    let i = index;

    for (const item of collection) {
      ArrayExtensions.insert(arr, i, item);
      i++;
    }
  }

  public static remove<TSource>(arr: TSource[], item: TSource): boolean {
    const indexOfItem = arr.indexOf(item);

    if (indexOfItem >= 0) {
      arr.splice(indexOfItem, 1);
      return true;
    }

    return false;
  }

  public static removeAll<TSource>(arr: TSource[], predicate: (item: TSource, index: number) => boolean): number {
    let removed = 0;
    const itemIndexesToRemove = [];

    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i], i)) {
        itemIndexesToRemove.push(i);
      }
    }

    for (let i = itemIndexesToRemove.length - 1; i >= 0; i--) {
      arr.splice(itemIndexesToRemove[i], 1);
      removed++;
    }

    return removed;
  }
}
