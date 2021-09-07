import { EqualityComparer } from '../types';

export function contains<TSource>(
  src: Iterable<TSource>,
  value: TSource,
  equalityComparer?: EqualityComparer<TSource>
): boolean {
  if (equalityComparer) {
    for (const item of src) {
      if (equalityComparer(item, value)) {
        return true;
      }
    }
  } else {
    for (const item of src) {
      if (item === value) {
        return true;
      }
    }
  }

  return false;
}
