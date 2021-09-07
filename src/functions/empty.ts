import { Enumerable } from '../Enumerable';

export function empty<TSource>(): Enumerable<TSource> {
  return new Enumerable([]);
}
