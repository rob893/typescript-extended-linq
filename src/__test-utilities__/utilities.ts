import { LinkedList } from '../collections/LinkedList';
import { List } from '../collections/List';
import { Stack } from '../collections/Stack';
import { Queue } from '../collections/Queue';
import { PriorityQueue } from '../collections/PriorityQueue';
import { from } from '../functions/from';
import { IEnumerable } from '../types';

export function getEnumerables(): [
  getSource: <T>(src: Iterable<T>) => Iterable<T>,
  getEnumerable: <T>(src: Iterable<T>) => IEnumerable<T>,
  sourceAdd: <T>(src: Iterable<T>, ...items: T[]) => void
][] {
  return [
    [
      <T>(src: Iterable<T>) => src,
      <T>(src: Iterable<T>) => from(src),
      (src, ...items) => {
        if (!Array.isArray(src)) {
          throw new Error();
        }

        src.push(...items);
      }
    ],
    [
      <T>(src: Iterable<T>) => new List(src),
      <T>(src: Iterable<T>) => {
        if (!(src instanceof List)) {
          throw new Error();
        }

        return src;
      },
      (src, ...items) => {
        if (!(src instanceof List)) {
          throw new Error();
        }

        src.addRange(items);
      }
    ],
    [
      <T>(src: Iterable<T>) => new Stack(src),
      <T>(src: Iterable<T>) => {
        if (!(src instanceof Stack)) {
          throw new Error();
        }

        return src;
      },
      (src, ...items) => {
        if (!(src instanceof Stack)) {
          throw new Error();
        }

        for (const item of items) {
          src.push(item);
        }
      }
    ],
    [
      <T>(src: Iterable<T>) => new LinkedList(src),
      <T>(src: Iterable<T>) => {
        if (!(src instanceof LinkedList)) {
          throw new Error();
        }

        return src;
      },
      (src, ...items) => {
        if (!(src instanceof LinkedList)) {
          throw new Error();
        }

        for (const item of items) {
          src.addLast(item);
        }
      }
    ],
    [
      <T>(src: Iterable<T>) => new Queue(src),
      <T>(src: Iterable<T>) => {
        if (!(src instanceof Queue)) {
          throw new Error();
        }

        return src;
      },
      (src, ...items) => {
        if (!(src instanceof Queue)) {
          throw new Error();
        }

        for (const item of items) {
          src.enqueue(item);
        }
      }
    ]
  ];
}
