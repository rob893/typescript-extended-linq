import { Enumerable } from '../enumerables';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyRightJoinHeterogeneous, applyRightJoinHomogeneous } from './applicators/applyRightJoin';

/**
 * Performs a right outer join on two heterogeneous sequences.
 * @example
 * ```typescript
 * const right = 'right';
 * const both = 'both';
 * const missing = null;
 *
 * type Side = typeof right | typeof both;
 * type Person = { name: string };
 * type Pet = { name: string; owner: Person };
 *
 * const magnus: Person = { name: 'Magnus' };
 * const terry: Person = { name: 'Terry' };
 * const adam: Person = { name: 'Adam' };
 * const john: Person = { name: 'John' };
 *
 * const barley: Pet = { name: 'Barley', owner: terry };
 * const boots: Pet = { name: 'Boots', owner: terry };
 * const whiskers: Pet = { name: 'Whiskers', owner: adam };
 * const daisy: Pet = { name: 'Daisy', owner: magnus };
 * const scratchy: Pet = { name: 'Scratchy', owner: { name: 'Bob' } };
 *
 * const people = from([magnus, terry, adam, john]);
 * const pets = from([barley, boots, whiskers, daisy, scratchy]);
 *
 * const result = rightJoinHeterogeneous<Pet, Person, { side: Side; left: Person | null; right: Pet }>(
 *     people,
 *     pets,
 *     person => person,
 *     pet => pet.owner,
 *     pet => ({ side: right, left: missing, right: pet }),
 *     (person, pet) => ({ side: both, left: person, right: pet })
 *   )
 *   .toArray();
 *
 * expect(result).toEqual([
 *   { side: both, left: terry, right: barley },
 *   { side: both, left: terry, right: boots },
 *   { side: both, left: adam, right: whiskers },
 *   { side: both, left: magnus, right: daisy },
 *   { side: right, left: missing, right: scratchy } // Scratchy has an owner, Bob, but Bob is not in the calling collection, hence the 'missing'.
 * ]);
 * ```
 * @typeparam TFirst The type of elements in the first sequence.
 * @typeparam TSecond The type of elements in the second sequence.
 * @typeparam TKey The type of the key returned by the key selector functions.
 * @typeparam TResult The type of the result elements.
 * @param first The first sequence of the join operation.
 * @param second The second sequence of the join operation.
 * @param firstKeySelector Function that projects the key given an element from first.
 * @param secondKeySelector Function that projects the key given an element from second.
 * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a right outer join of the two input sequences.
 */
export function rightJoinHeterogeneous<TFirst, TSecond, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TSecond>,
  firstKeySelector: (item: TFirst) => TKey,
  secondKeySelector: (item: TSecond) => TKey,
  secondSelector: (item: TSecond) => TResult,
  bothSelector: (a: TFirst, b: TSecond) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  return applyRightJoinHeterogeneous(
    Enumerable,
    first,
    second,
    firstKeySelector,
    secondKeySelector,
    secondSelector,
    bothSelector,
    equalityComparer
  );
}

/**
 * Performs a right outer join on two homogeneous sequences.
 * @example
 * ```typescript
 * const right = 'right';
 * const both = 'both';
 * const missing = null;
 *
 * type Side = typeof right | typeof both;
 * type Person = { id: number; name: string };
 *
 * const magnus: Person = { id: 1, name: 'Magnus' };
 * const terry1: Person = { id: 2, name: 'Terry' };
 * const adam: Person = { id: 3, name: 'Adam' };
 * const john1: Person = { id: 4, name: 'John' };
 * const john4: Person = { id: 9, name: 'John' };
 *
 * const john2: Person = { id: 5, name: 'John' };
 * const jane: Person = { id: 6, name: 'Jane' };
 * const terry2: Person = { id: 7, name: 'Terry' };
 * const john3: Person = { id: 8, name: 'John' };
 *
 * const people1 = from([magnus, terry1, adam, john1, john4]);
 * const people2 = from([john2, jane, terry2, john3]);
 *
 * const result = rightJoinHomogeneous<string, { side: Side; left: Person | null; right: Person }>(
 *     people1,
 *     people2,
 *     person => person.name,
 *     person => ({ side: right, left: missing, right: person }),
 *     (personLeft, personRight) => ({ side: both, left: personLeft, right: personRight })
 *   )
 *   .toArray();
 *
 * expect(result).toEqual([
 *   { side: both, left: john1, right: john2 },
 *   { side: both, left: john4, right: john2 },
 *   { side: right, left: missing, right: jane },
 *   { side: both, left: terry1, right: terry2 },
 *   { side: both, left: john1, right: john3 },
 *   { side: both, left: john4, right: john3 }
 * ]);
 * ```
 * @typeparam TFirst The type of elements in the first sequence.
 * @typeparam TSecond The type of elements in the second sequence.
 * @typeparam TKey The type of the key returned by the key selector functions.
 * @typeparam TResult The type of the result elements.
 * @param first The first sequence of the join operation.
 * @param second The second sequence of the join operation.
 * @param keySelector Function that projects the key given an element of one of the sequences to join.
 * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a right outer join of the two input sequences.
 */
export function rightJoinHomogeneous<TFirst, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TFirst>,
  keySelector: (item: TFirst) => TKey,
  secondSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TFirst) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  return applyRightJoinHomogeneous(
    Enumerable,
    first,
    second,
    keySelector,
    secondSelector,
    bothSelector,
    equalityComparer
  );
}
