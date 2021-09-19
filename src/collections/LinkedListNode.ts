export class LinkedListNode<TSource> {
  public readonly value: TSource;

  public list: Iterable<TSource> | null = null;

  public next: LinkedListNode<TSource> | null = null;

  public previous: LinkedListNode<TSource> | null = null;

  public constructor(value: TSource) {
    this.value = value;
  }
}
