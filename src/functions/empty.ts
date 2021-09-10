import { Enumerable } from '../Enumerable';
import { getIterableGenerator } from './shared/getIterableGenerator';

export function empty<TSource>(): Enumerable<TSource> {
  return new Enumerable(getIterableGenerator([]));
}
