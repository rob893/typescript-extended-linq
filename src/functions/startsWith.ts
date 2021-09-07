import { EqualityComparer } from '../types';

export function startsWith<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): boolean {
  const srcArr = [...src];
  const secondArr = Array.isArray(second) ? second : [...second];

  if (secondArr.length > srcArr.length) {
    return false;
  }

  for (let i = 0; i < secondArr.length; i++) {
    const srcItem = srcArr[i];
    const secondItem = secondArr[i];

    if (equalityComparer) {
      if (!equalityComparer(srcItem, secondItem)) {
        return false;
      }
    } else {
      if (srcItem !== secondItem) {
        return false;
      }
    }
  }

  return true;
}
