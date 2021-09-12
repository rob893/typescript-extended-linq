import { IEnumerable, IEnumerableConstructor } from '../../types';

export function applyShuffle<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
  src: Iterable<TSource>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const array = [...src];
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;

      yield array[currentIndex];
    }
  }

  return new enumerableType(generator);
}
