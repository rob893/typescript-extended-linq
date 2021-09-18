import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { getIterableGenerator } from '../functions/shared/getIterableGenerator';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { LinkedListNode } from './LinkedListNode';

export class LinkedList<TSource> extends BasicEnumerable<TSource> {
  private firstNode: LinkedListNode<TSource> | null = null;

  private lastNode: LinkedListNode<TSource> | null = null;

  private listLength: number = 0;

  public constructor();

  public constructor(collection: Iterable<TSource>);

  public constructor(collection?: Iterable<TSource>) {
    super(new EnumerableFactory(), getIterableGenerator([]));
    (this as unknown as { srcGenerator: () => Generator<TSource> }).srcGenerator = this.generator;

    for (const item of collection ?? []) {
      this.addFirst(item);
    }
  }

  public get firstListNode(): LinkedListNode<TSource> | null {
    return this.firstNode;
  }

  public get lastListNode(): LinkedListNode<TSource> | null {
    return this.lastNode;
  }

  public get length(): number {
    return this.listLength;
  }

  public addAfter(node: LinkedListNode<TSource>, item: TSource): LinkedListNode<TSource> {
    if (node.list !== this) {
      throw new Error('Node must belong to the list.');
    }

    const newNode = new LinkedListNode(this, item);

    newNode.previous = node;
    newNode.next = node.next;

    if (node.next) {
      node.next.previous = newNode;
    }

    node.next = newNode;

    this.listLength++;

    return newNode;
  }

  public addBefore(node: LinkedListNode<TSource>, item: TSource): LinkedListNode<TSource> {
    if (node.list !== this) {
      throw new Error('Node must belong to the list.');
    }

    const newNode = new LinkedListNode(this, item);

    newNode.previous = node.previous;
    newNode.next = node;

    if (node.previous) {
      node.previous.next = newNode;
    }

    node.previous = newNode;

    this.listLength++;

    return newNode;
  }

  public addFirst(item: TSource): LinkedListNode<TSource> {
    const node = new LinkedListNode(this, item);

    if (!this.firstNode) {
      this.firstNode = node;
    } else {
      node.next = this.firstNode;
      this.firstNode.previous = node;
      this.firstNode = node;
    }

    if (!this.lastNode) {
      this.lastNode = node;
    }

    this.listLength++;

    return node;
  }

  public addLast(item: TSource): LinkedListNode<TSource> {
    const node = new LinkedListNode(this, item);

    if (!this.firstNode) {
      this.firstNode = node;
    }

    if (!this.lastNode) {
      this.lastNode = node;
    } else {
      node.previous = this.lastNode;
      this.lastNode.next = node;
      this.lastNode = node;
    }

    this.listLength++;

    return node;
  }

  public clear(): void {
    let node = this.firstNode;

    while (node) {
      const next = node.next;
      node.previous = null;
      node.next = null;
      node = next;
    }

    this.firstNode = null;
    this.lastNode = null;
    this.listLength = 0;
  }

  public remove(item: TSource): boolean {
    let node = this.firstNode;

    while (node) {
      if (node.value === item) {
        if (node.previous) {
          node.previous.next = node.next;
        }

        if (node.next) {
          node.next.previous = node.previous;
        }

        node.next = null;
        node.previous = null;

        this.listLength--;

        return true;
      }

      node = node.next;
    }

    return false;
  }

  public removeFirst(): void {
    if (this.listLength === 1 || !this.firstNode) {
      this.clear();
      return;
    }

    const first = this.firstNode;
    this.firstNode = this.firstNode.next;

    if (this.firstNode) {
      this.firstNode.previous = null;
    }

    first.next = null;
    first.previous = null;

    this.listLength--;
  }

  public removeLast(): void {
    if (this.listLength === 1 || !this.lastNode) {
      this.clear();
      return;
    }

    const last = this.lastNode;
    this.lastNode = this.lastNode.previous;

    if (this.lastNode) {
      this.lastNode.next = null;
    }

    last.next = null;
    last.previous = null;

    this.listLength--;
  }

  private *generator(): Generator<TSource> {
    let node = this.firstNode;

    while (node) {
      yield node.value;
      node = node.next;
    }
  }
}
