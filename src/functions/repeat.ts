import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { applyRepeat } from './applicators/applyRepeat';

export function repeat<TResult>(element: TResult, count: number): IEnumerable<TResult> {
  return applyRepeat(new EnumerableFactory(), element, count);
}
