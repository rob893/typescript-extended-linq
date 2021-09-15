import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyRange } from './applicators/applyRange';

export function range(start: number, count: number): IEnumerable<number> {
  return applyRange(new EnumerableFactory(), start, count);
}
