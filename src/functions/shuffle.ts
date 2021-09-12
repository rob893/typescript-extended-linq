import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyShuffle } from './applicators/applyShuffle';

export function shuffle<TSource>(src: Iterable<TSource>): IEnumerable<TSource> {
  return applyShuffle(Enumerable, src);
}
