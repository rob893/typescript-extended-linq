import { Enumerable } from '../Enumerable';

export function select<TSource, TDestination>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => TDestination
): Enumerable<TDestination> {
  function* generator(): Generator<TDestination> {
    let i = 0;

    for (const item of src) {
      yield exp(item, i);
      i++;
    }
  }

  return new Enumerable(generator);
}

export function selectMany<TSource, TDestination>(
  src: Iterable<TSource>,
  exp: (item: TSource, index: number) => TDestination[]
): Enumerable<TDestination> {
  function* generator(): Generator<TDestination> {
    let i = 0;

    for (const item of src) {
      for (const subItem of exp(item, i)) {
        yield subItem;
      }

      i++;
    }
  }

  return new Enumerable(generator);
}
