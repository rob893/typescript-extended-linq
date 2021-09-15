import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyZip<TSource, TSecond, TResult>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  second: Iterable<TSecond>,
  resultSelector?: (first: TSource, second: TSecond) => TResult
): IEnumerable<[TSource, TSecond] | TResult> {
  function* generator(): Generator<[TSource, TSecond] | TResult> {
    const firstArr = [...src];
    const secondArr = Array.isArray(second) || typeof second === 'string' ? second : [...second];

    const limit = Math.min(firstArr.length, secondArr.length);

    for (let i = 0; i < limit; i++) {
      if (resultSelector) {
        yield resultSelector(firstArr[i], secondArr[i]);
      } else {
        yield [firstArr[i], secondArr[i]];
      }
    }
  }

  return factory.createEnumerable(generator);
}
