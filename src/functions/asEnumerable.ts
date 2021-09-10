import { Enumerable } from '../Enumerable';
import { getIterableGenerator } from './shared/getIterableGenerator';

export function asEnumerable<TSource>(src: Iterable<TSource>): Enumerable<TSource> {
  return new Enumerable(getIterableGenerator(src));
}
