import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applySelect<TSource, TResult>(
  enumerableType: IEnumerableConstructor<TResult>,
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => TResult
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    let i = 0;

    for (const item of src) {
      yield exp(item, i);
      i++;
    }
  }

  return new enumerableType(generator);
}

export function applySelectMany<TSource, TResult>(
  enumerableType: IEnumerableConstructor<TResult>,
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => Iterable<TResult>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    let i = 0;

    for (const item of src) {
      for (const subItem of exp(item, i)) {
        yield subItem;
      }

      i++;
    }
  }

  return new enumerableType(generator);
}
