import { EqualityComparer } from '../types';

export function endsWith<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): boolean {
  const srcArr = [...src];
  const secondArr = Array.isArray(second) ? second : [...second];

  if (secondArr.length > srcArr.length) {
    return false;
  }

  for (let i = srcArr.length - secondArr.length, j = 0; i < srcArr.length; i++, j++) {
    const srcItem = srcArr[i];
    const secondItem = secondArr[j];

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
