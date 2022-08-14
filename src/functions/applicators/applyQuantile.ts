import { IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../../utilities/utilityFunctions';

export function applyQuantile<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  selectorOrQ: ((item: TSource) => number) | number,
  q?: number
): number {
  let quantile = 0;
  let selector: (item: TSource) => number = (x: any): number => x;

  if (typeof selectorOrQ === 'number') {
    quantile = selectorOrQ;
  } else {
    if (q === undefined) {
      throw new Error('Invalid use of quantile overloads.');
    }

    selector = selectorOrQ;
    quantile = q;
  }

  if (quantile > 100 || quantile < 0) {
    throw new Error('Quantile q must be between 0 and 100 inclusive.');
  }

  const sorted = factory
    .createBasicEnumerable(getIterableGenerator(src))
    .select(selector)
    .assert(x => typeof x === 'number')
    .orderBy(x => x)
    .toArray();
  const pos = (sorted.length - 1) * (quantile / 100);
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}
