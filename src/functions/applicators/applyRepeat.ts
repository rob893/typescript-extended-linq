import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyRepeat<TResult>(
  enumerableType: IEnumerableConstructor<TResult>,
  element: TResult,
  count: number
): IEnumerable<TResult> {
  if (count < 0) {
    throw new Error('Count must be greater than or equal to 0');
  }

  function* generator(): Generator<TResult> {
    for (let i = 0; i < count; i++) {
      yield element;
    }
  }

  return new enumerableType(generator);
}
