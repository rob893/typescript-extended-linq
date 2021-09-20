import { LinkedList } from './LinkedList';
import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { ICollection } from '../types';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { getIterableGenerator } from '../functions/shared/getIterableGenerator';

export class Queue<TSource> extends BasicEnumerable<TSource> implements ICollection<TSource> {
  private readonly list: LinkedList<TSource>;

  public constructor();

  public constructor(collection: Iterable<TSource>);

  public constructor(collection?: Iterable<TSource>) {
    const list = new LinkedList<TSource>();
    super(new EnumerableFactory(), getIterableGenerator(list));

    this.list = list;

    for (const item of collection ?? []) {
      this.enqueue(item);
    }
  }

  public get length(): number {
    return this.list.length;
  }

  public clear(): void {
    this.list.clear();
  }

  public copyTo(array: TSource[], arrayIndex: number): void {
    let i = arrayIndex;

    for (const item of this) {
      array[i] = item;
      i++;
    }
  }

  public dequeue(): TSource {
    const first = this.tryDequeue();

    if (first === null) {
      throw new Error('Queue contains no elements');
    }

    return first;
  }

  public enqueue(item: TSource): void {
    this.list.addLast(item);
  }

  public peek(): TSource {
    const first = this.tryPeek();

    if (first === null) {
      throw new Error('Queue contains no elements');
    }

    return first;
  }

  public tryDequeue(): TSource | null {
    const first = this.list.firstListNode;
    this.list.removeFirst();

    return first?.value ?? null;
  }

  public tryPeek(): TSource | null {
    const first = this.list.firstListNode;

    return first?.value ?? null;
  }
}
