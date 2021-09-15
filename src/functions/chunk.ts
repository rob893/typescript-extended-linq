import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { applyChunk } from './applicators/applyChunk';

export function chunk<TSource>(src: Iterable<TSource>, chunkSize: number): IEnumerable<IEnumerable<TSource>> {
  return applyChunk(new EnumerableFactory(), src, chunkSize);
}
