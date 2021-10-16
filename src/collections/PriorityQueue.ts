import { ArrayEnumerable } from '../enumerables/ArrayEnumerable';
import { Comparer, ICollection, IEnumerable } from '../types';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { getIterableGenerator } from '../utilities/utilityFunctions';
import { List } from './List';

/**
 * Implements an array-backed min-heap.
 * Each element is enqueued with an associated priority that determines the dequeue order: elements with the lowest priority get dequeued first.
 */
export class PriorityQueue<TSource, TPriority = number>
  extends ArrayEnumerable<[TSource, TPriority]>
  implements ICollection<[TSource, TPriority]>
{
  private readonly srcComparer: Comparer<TPriority>;

  public constructor();

  public constructor(collection: Iterable<[TSource, TPriority]>);

  public constructor(comparer: Comparer<TPriority>);

  public constructor(collection: Iterable<[TSource, TPriority]>, comparer: Comparer<TPriority>);

  public constructor(
    collectionOrComparer?: Iterable<[TSource, TPriority]> | Comparer<TPriority>,
    comparer?: Comparer<TPriority>
  ) {
    const src: [TSource, TPriority][] = [];
    super(new EnumerableFactory(), getIterableGenerator(src), src);

    this.srcComparer =
      typeof collectionOrComparer === 'function'
        ? collectionOrComparer
        : comparer ??
          ((a, b) => {
            if (a > b) {
              return 1;
            } else if (a < b) {
              return -1;
            } else {
              return 0;
            }
          });

    if (typeof collectionOrComparer !== 'function' && collectionOrComparer) {
      for (const [item, priority] of collectionOrComparer) {
        this.enqueue(item, priority);
      }
    }
  }

  public get comparer(): Comparer<TPriority> {
    return this.srcComparer;
  }

  public get length(): number {
    return this.srcArr.length;
  }

  public get unorderedItems(): IEnumerable<[TSource, TPriority]> {
    return new List(this);
  }

  public clear(): void {
    this.srcArr.length = 0;
  }

  public copyTo(array: [TSource, TPriority][], arrayIndex: number): void {
    let i = arrayIndex;

    for (const item of this) {
      array[i] = item;
      i++;
    }
  }

  public dequeue(): TSource {
    const item = this.tryDequeue();

    if (item === null) {
      throw new Error('Queue has no items.');
    }

    return item;
  }

  public enqueue(item: TSource, priority: TPriority): void {
    this.srcArr.push([item, priority]);
    this.heapifyUp();
  }

  public enqueueRange(items: [TSource, TPriority][]): void;

  public enqueueRange(items: TSource[], priority: TPriority): void;

  public enqueueRange(items: [TSource, TPriority][] | TSource[], priority?: TPriority): void {
    if (priority !== undefined) {
      for (const item of items) {
        this.enqueue(item as TSource, priority);
      }
    } else {
      for (const [item, itemPriority] of items as [TSource, TPriority][]) {
        this.enqueue(item, itemPriority);
      }
    }
  }

  public peek(): TSource {
    const item = this.tryPeek();

    if (item === null) {
      throw new Error('Queue has no items.');
    }

    return item;
  }

  public tryDequeue(): TSource | null {
    if (this.srcArr.length === 0) {
      return null;
    }

    const result = this.peek();
    const tail = this.srcArr.pop();

    if (tail === undefined) {
      throw new Error('Internal heap error.');
    }

    if (this.srcArr.length > 0) {
      this.srcArr[0] = tail;
      this.heapifyDown();
    }

    return result;
  }

  public tryPeek(): TSource | null {
    if (this.srcArr.length === 0) {
      return null;
    }

    return this.srcArr[0][0];
  }

  private heapifyUp(): void {
    let index = this.length - 1;

    while (
      this.hasParent(index) &&
      this.srcComparer(this.srcArr[index][1], this.srcArr[this.getParentIndex(index)][1]) < 0
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown(): void {
    let index = 0;

    // Because a heap is a complete tree, if a node has a child, it will always have at least a left child.
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);

      // Check if the right child is smaller than left.
      if (
        this.hasRightChild(index) &&
        this.srcComparer(this.srcArr[this.getRightChildIndex(index)][1], this.srcArr[smallerChildIndex][1]) < 0
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }

      if (this.srcComparer(this.srcArr[index][1], this.srcArr[smallerChildIndex][1]) < 0) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  private hasParent(index: number): boolean {
    return index > 0;
  }

  private hasLeftChild(index: number): boolean {
    return this.getLeftChildIndex(index) < this.length;
  }

  private hasRightChild(index: number): boolean {
    return this.getRightChildIndex(index) < this.length;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return Math.floor(2 * index + 1);
  }

  private getRightChildIndex(index: number): number {
    return Math.floor(2 * index + 2);
  }

  private swap(index1: number, index2: number): void {
    const temp = this.srcArr[index1];
    this.srcArr[index1] = this.srcArr[index2];
    this.srcArr[index2] = temp;
  }
}
