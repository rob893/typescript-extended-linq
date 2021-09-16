import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { IEnumerable } from '../types';

export function isEnumerable(obj: unknown): obj is IEnumerable<unknown> {
  return obj instanceof BasicEnumerable;
}
