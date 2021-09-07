import { EqualityComparer } from '../types';

export function sequenceEqual<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): boolean {
  const firstArr = [...src];
  const secondArr = Array.isArray(second) || typeof second === 'string' ? second : [...second];

  if (firstArr.length !== secondArr.length) {
    return false;
  }

  for (let i = 0; i < firstArr.length; i++) {
    if (equalityComparer) {
      if (!equalityComparer(firstArr[i], secondArr[i])) {
        return false;
      }
    } else {
      if (firstArr[i] !== secondArr[i]) {
        return false;
      }
    }
  }

  return true;
}
