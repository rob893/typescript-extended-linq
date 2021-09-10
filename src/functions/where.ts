import { Enumerable } from '../Enumerable';
import { whereGenerator } from './generators/whereGenetator';

export function where<TSource>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => boolean
): Enumerable<TSource> {
  return new Enumerable(() => whereGenerator(src, exp));
}
