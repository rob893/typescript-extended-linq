import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { applyShuffle } from './applicators/applyShuffle';

export function shuffle<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyShuffle(new EnumerableFactory(), src);
}
