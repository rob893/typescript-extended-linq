import { IEnumerable, IEnumerableFactory } from '../../types';

export function applyRange(factory: IEnumerableFactory, start: number, count: number): IEnumerable<number> {
  if (count < 0) {
    throw new Error('Count must be greater than or equal to 0');
  }

  if (start + count >= Number.MAX_SAFE_INTEGER) {
    throw new Error('start + count must be less than Number.MAX_SAFE_INTEGER');
  }

  function* generator(): Generator<number> {
    for (let i = start; i < start + count; i++) {
      yield i;
    }
  }

  return factory.createBasicEnumerable(generator);
}
