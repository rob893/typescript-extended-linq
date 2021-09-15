import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyEmpty } from './applicators/applyEmpty';

export function empty<TSource>(): IEnumerable<TSource> {
  return applyEmpty(new EnumerableFactory());
}
