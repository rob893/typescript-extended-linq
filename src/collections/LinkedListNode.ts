export class LinkedListNode<TSource> {
  public readonly list: Iterable<TSource>;

  public readonly value: TSource;

  public next: LinkedListNode<TSource> | null = null;

  public previous: LinkedListNode<TSource> | null = null;

  public constructor(list: Iterable<TSource>, value: TSource) {
    this.list = list;
    this.value = value;
  }
}
