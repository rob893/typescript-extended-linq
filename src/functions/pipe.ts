import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyPipe } from './applicators/applyPipe';

export function pipe<TSource>(
  src: Iterable<TSource>,
  action: (item: TSource, index: number) => void
): IEnumerable<TSource> {
  return applyPipe(Enumerable, src, action);
}
