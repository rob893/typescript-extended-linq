import { aggregate } from './aggregate';

export function sum<TSource>(src: Iterable<TSource>, selector?: (item: TSource) => number): number {
  if (!selector) {
    return aggregate(src as number[], (prev, curr) => {
      if (typeof curr !== 'number') {
        throw new Error('sum can only be used with numbers');
      }

      return prev + curr;
    });
  }

  return aggregate(src, 0, (prev, curr) => prev + selector(curr));
}
