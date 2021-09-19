import { ICollection } from '../types';
import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { getIterableGenerator } from '../functions/shared/getIterableGenerator';
import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { LinkedListNode } from './LinkedListNode';

export class LinkedList<TSource> extends BasicEnumerable<TSource> implements ICollection<TSource> {
  private firstNode: LinkedListNode<TSource> | null = null;

  private lastNode: LinkedListNode<TSource> | null = null;

  private listLength: number = 0;

  public constructor();

  public constructor(collection: Iterable<TSource>);

  public constructor(collection?: Iterable<TSource>) {
    super(new EnumerableFactory(), getIterableGenerator([]));
    (this as unknown as { srcGenerator: () => Generator<TSource> }).srcGenerator = this.generator;

    for (const item of collection ?? []) {
      this.addLast(item);
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

  public addAfter(node: LinkedListNode<TSource>, newNode: LinkedListNode<TSource>): LinkedListNode<TSource>;

  public addAfter(node: LinkedListNode<TSource>, item: TSource): LinkedListNode<TSource>;

  public addAfter(
    node: LinkedListNode<TSource>,
    newNodeOrItem: LinkedListNode<TSource> | TSource
  ): LinkedListNode<TSource> {
    if (node.list !== this) {
      throw new Error('Node must belong to the list.');
    }

    let newNode;

    if (newNodeOrItem instanceof LinkedListNode) {
      if (newNodeOrItem.list !== null) {
        throw new Error('newNode cannot belong to a list.');
      }

      newNode = newNodeOrItem;
    } else {
      newNode = new LinkedListNode(newNodeOrItem);
    }

    newNode.list = this;
    newNode.previous = node;
    newNode.next = node.next;

    if (node.next) {
      node.next.previous = newNode;
    }

    node.next = newNode;

    this.listLength++;

    return newNode;
  }

  public addBefore(node: LinkedListNode<TSource>, newNode: LinkedListNode<TSource>): LinkedListNode<TSource>;

  public addBefore(node: LinkedListNode<TSource>, item: TSource): LinkedListNode<TSource>;

  public addBefore(
    node: LinkedListNode<TSource>,
    newNodeOrItem: LinkedListNode<TSource> | TSource
  ): LinkedListNode<TSource> {
    if (node.list !== this) {
      throw new Error('Node must belong to the list.');
    }

    let newNode;

    if (newNodeOrItem instanceof LinkedListNode) {
      if (newNodeOrItem.list !== null) {
        throw new Error('newNode cannot belong to a list.');
      }

      newNode = newNodeOrItem;
    } else {
      newNode = new LinkedListNode(newNodeOrItem);
    }

    newNode.list = this;
    newNode.previous = node.previous;
    newNode.next = node;

    if (node.previous) {
      node.previous.next = newNode;
    }

    node.previous = newNode;

    this.listLength++;

    return newNode;
  }

  public addFirst(newNode: LinkedListNode<TSource>): LinkedListNode<TSource>;

  public addFirst(item: TSource): LinkedListNode<TSource>;

  public addFirst(newNodeOrItem: LinkedListNode<TSource> | TSource): LinkedListNode<TSource> {
    let newNode;

    if (newNodeOrItem instanceof LinkedListNode) {
      if (newNodeOrItem.list !== null) {
        throw new Error('newNode cannot belong to a list.');
      }

      newNode = newNodeOrItem;
    } else {
      newNode = new LinkedListNode(newNodeOrItem);
    }

    newNode.list = this;

    if (!this.firstNode) {
      this.firstNode = newNode;
    } else {
      newNode.next = this.firstNode;
      this.firstNode.previous = newNode;
      this.firstNode = newNode;
    }

    if (!this.lastNode) {
      this.lastNode = newNode;
    }

    this.listLength++;

    return newNode;
  }

  public addLast(newNode: LinkedListNode<TSource>): LinkedListNode<TSource>;

  public addLast(item: TSource): LinkedListNode<TSource>;

  public addLast(newNodeOrItem: LinkedListNode<TSource> | TSource): LinkedListNode<TSource> {
    let newNode;

    if (newNodeOrItem instanceof LinkedListNode) {
      if (newNodeOrItem.list !== null) {
        throw new Error('newNode cannot belong to a list.');
      }

      newNode = newNodeOrItem;
    } else {
      newNode = new LinkedListNode(newNodeOrItem);
    }

    newNode.list = this;

    if (!this.firstNode) {
      this.firstNode = newNode;
    }

    if (!this.lastNode) {
      this.lastNode = newNode;
    } else {
      newNode.previous = this.lastNode;
      this.lastNode.next = newNode;
      this.lastNode = newNode;
    }

    this.listLength++;

    return newNode;
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

  public copyTo(array: TSource[], arrayIndex: number): void {
    throw new Error('Method not implemented.');
  }

  public remove(newNode: LinkedListNode<TSource>): boolean;

  public remove(item: TSource): boolean;

  public remove(newNodeOrItem: LinkedListNode<TSource> | TSource): boolean {
    if (newNodeOrItem instanceof LinkedListNode && newNodeOrItem.list !== this) {
      return false;
    }

    let node = this.firstNode;

    while (node) {
      if (node === newNodeOrItem || node.value === newNodeOrItem) {
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
