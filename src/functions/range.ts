import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyRange } from './applicators/applyRange';

export function range(start: number, count: number): IEnumerable<number> {
  return applyRange(Enumerable, start, count);
}
