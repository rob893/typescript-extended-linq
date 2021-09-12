import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { applyRepeat } from './applicators/applyRepeat';

export function repeat<TResult>(element: TResult, count: number): IEnumerable<TResult> {
  return applyRepeat(Enumerable, element, count);
}
