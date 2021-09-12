import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyChunk } from './applicators/applyChunk';

export function chunk<TSource>(src: Iterable<TSource>, chunkSize: number): IEnumerable<IEnumerable<TSource>> {
  return applyChunk(Enumerable, src, chunkSize);
}
