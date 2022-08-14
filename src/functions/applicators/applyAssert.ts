import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyAssert<TSource, TError extends Error>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  predicate: (item: TSource, index: number) => boolean,
  messageOrErrorType?: string | (new (message?: string) => TError),
  errorType?: new (message?: string) => TError
): IEnumerable<TSource> {
  let errorToUse: (new (message?: string) => TError) | (new (message: string) => Error) = Error;
  let errorMessage = 'Assert failed.';

  if (typeof messageOrErrorType === 'string') {
    errorMessage = messageOrErrorType;
  } else if (messageOrErrorType) {
    errorToUse = messageOrErrorType;
  }

  if (errorType) {
    errorToUse = errorType;
  }

  function* generator(): Generator<TSource> {
    let i = 0;

    for (const item of src) {
      if (!predicate(item, i)) {
        throw new errorToUse(errorMessage);
      }

      yield item;

      i++;
    }
  }

  return factory.createBasicEnumerable(generator);
}
