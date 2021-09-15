import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyJoin } from './applicators/applyJoin';

/**
 * Performs an inner join by correlating the elements of two sequences based on matching keys.
 * @example
 * ```typescript
 * const magnus = { name: 'Magnus' };
 * const terry = { name: 'Terry' };
 * const adam = { name: 'Adam' };
 * const john = { name: 'John' };
 *
 * const barley = { name: 'Barley', owner: terry };
 * const boots = { name: 'Boots', owner: terry };
 * const whiskers = { name: 'Whiskers', owner: adam };
 * const daisy = { name: 'Daisy', owner: magnus };
 * const scratchy = { name: 'Scratchy', owner: { name: 'Bob' } };
 *
 * const people = from([magnus, terry, adam, john]);
 * const pets = from([barley, boots, whiskers, daisy, scratchy]);
 *
 * const result = join(
 *     people,
 *     pets,
 *     person => person,
 *     pet => pet.owner,
 *     (person, pet) => ({ ownerName: person.name, pet: pet.name })
 *   )
 *   .toArray();
 *
 * expect(result).toEqual([
 *   { ownerName: 'Magnus', pet: 'Daisy' },
 *   { ownerName: 'Terry', pet: 'Barley' },
 *   { ownerName: 'Terry', pet: 'Boots' },
 *   { ownerName: 'Adam', pet: 'Whiskers' }
 * ]);
 * ```
 * @typeparam TOuter The type of the elements of the first sequence.
 * @typeparam TInner The type of the elements of the second sequence.
 * @typeparam TKey The type of the keys returned by the key selector functions.
 * @typeparam TResult The type of the result elements.
 * @param outer The first sequence to join.
 * @param inner The second sequence to join to the first.
 * @param outerKeySelector A function to extract the join key from each element of the first sequence.
 * @param innerKeySelector A function to extract the join key from each element of the second sequence.
 * @param resultSelector A function to create a result element from two matching elements.
 * @param equalityComparer A function to compare keys.
 * @returns An Enumerable<TResult> that has elements of type TResult that are obtained by performing an inner join on two sequences.
 */
export function join<TOuter, TInner, TKey, TResult>(
  outer: Iterable<TOuter>,
  inner: Iterable<TInner>,
  outerKeySelector: (item: TOuter) => TKey,
  innerKeySelector: (item: TInner) => TKey,
  resultSelector: (item: TOuter, inner: TInner) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  return applyJoin(
    new EnumerableFactory(),
    outer,
    inner,
    outerKeySelector,
    innerKeySelector,
    resultSelector,
    equalityComparer
  );
}
