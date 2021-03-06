/**
 * Applies an accumulator function over a sequence.
 * @typeparam TSource The type of the elements of source.
 * @param src An Enumerable<TSource> to aggregate over.
 * @param aggregator An accumulator function to be invoked on each element.
 * @returns The final accumulator value.
 */
export function aggregate<TSource>(
  src: Iterable<TSource>,
  aggregator: (prev: TSource, curr: TSource, index: number) => TSource
): TSource;

/**
 * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
 * @typeparam TSource The type of the elements of source.
 * @typeparam TAccumulate The type of the accumulator value.
 * @param src An Enumerable<TSource> to aggregate over.
 * @param aggregator An accumulator function to be invoked on each element.
 * @param seed The initial accumulator value.
 * @returns The final accumulator value.
 */
export function aggregate<TSource, TAccumulate>(
  src: Iterable<TSource>,
  seed: TAccumulate,
  aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate
): TAccumulate;

/**
 * Applies an accumulator function over a sequence.
 * The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
 * @typeparam TSource The type of the elements of source.
 * @typeparam TAccumulate The type of the accumulator value.
 * @typeparam TResult The type of the resulting value.
 * @param src An Enumerable<TSource> to aggregate over.
 * @param aggregator An accumulator function to be invoked on each element.
 * @param seed The initial accumulator value.
 * @param resultSelector An accumulator function to be invoked on each element.
 * @returns The final accumulator value.
 */
export function aggregate<TSource, TAccumulate, TResult>(
  src: Iterable<TSource>,
  seed: TAccumulate,
  aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
  resultSelector: (accumulated: TAccumulate) => TResult
): TResult;

/**
 * Applies an accumulator function over a sequence.
 * The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
 * @typeparam TSource The type of the elements of source.
 * @typeparam TAccumulate The type of the accumulator value.
 * @typeparam TResult The type of the resulting value.
 * @param src An Enumerable<TSource> to aggregate over.
 * @param aggregator An accumulator function to be invoked on each element.
 * @param seed The initial accumulator value.
 * @param resultSelector An accumulator function to be invoked on each element.
 * @returns The final accumulator value.
 */
export function aggregate<TSource, TAccumulate, TResult>(
  src: Iterable<TSource>,
  seedOrAggregator:
    | (TAccumulate | TSource)
    | ((prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource),
  aggregator?: (prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource,
  resultSelector?: (accumulated: TAccumulate) => TResult
): TAccumulate | TSource | TResult;

export function aggregate<TSource, TAccumulate, TResult>(
  src: Iterable<TSource>,
  seedOrAggregator:
    | (TAccumulate | TSource)
    | ((prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource),
  aggregator?: (prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource,
  resultSelector?: (accumulated: TAccumulate | TSource) => TResult
): TAccumulate | TSource | TResult {
  let aggregate: TAccumulate | TSource | undefined;
  let aggregatorFn: (prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource;

  if (typeof seedOrAggregator === 'function') {
    aggregatorFn = seedOrAggregator as (
      prev: TAccumulate | TSource,
      curr: TSource,
      index: number
    ) => TAccumulate | TSource;
  } else {
    if (!aggregator) {
      throw new Error('Invalid use of aggregate overloads.');
    }

    aggregatorFn = aggregator;
    aggregate = seedOrAggregator;
  }

  let i = 0;

  for (const item of src) {
    if (aggregate === undefined) {
      aggregate = item;
    } else {
      aggregate = aggregatorFn(aggregate, item, i);
    }

    i++;
  }

  if (aggregate === undefined) {
    throw new Error('Sequence contains no elements');
  }

  return resultSelector ? resultSelector(aggregate) : aggregate;
}
