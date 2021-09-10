import { Enumerable } from '../Enumerable';
import { EqualityComparer } from '../types';
import { leftJoinHeterogeneousGenerator, leftJoinHomogeneousGenerator } from './generators/leftJoinGenerator';

/**
 * Performs a left outer join on two heterogeneous sequences.
 * @example
 * ```typescript
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
 * const result = leftJoinHeterogeneous<Pet, Person, { ownerName: string; pet: string | null }>(
 *     people,
 *     pets,
 *     person => person,
 *     pet => pet.owner,
 *     person => ({ ownerName: person.name, pet: null }),
 *     (person, pet) => ({ ownerName: person.name, pet: pet.name })
 *   )
 *   .toArray();
 *
 * expect(result).toEqual([
 *   { ownerName: 'Magnus', pet: 'Daisy' },
 *   { ownerName: 'Terry', pet: 'Barley' },
 *   { ownerName: 'Terry', pet: 'Boots' },
 *   { ownerName: 'Adam', pet: 'Whiskers' },
 *   { ownerName: 'John', pet: null }
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
 * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a left outer join of the two input sequences.
 */
export function leftJoinHeterogeneous<TFirst, TSecond, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TSecond>,
  firstKeySelector: (item: TFirst) => TKey,
  secondKeySelector: (item: TSecond) => TKey,
  firstSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TSecond) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
  return new Enumerable(() =>
    leftJoinHeterogeneousGenerator(
      first,
      second,
      firstKeySelector,
      secondKeySelector,
      firstSelector,
      bothSelector,
      equalityComparer
    )
  );
}

/**
 * Performs a left outer join on two homogeneous sequences.
 * @example
 * ```typescript
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
 * const result = leftJoinHomogeneous<Pet, Person, { ownerName: string; pet: string | null }>(
 *     people,
 *     pets,
 *     person => person,
 *     pet => pet.owner,
 *     person => ({ ownerName: person.name, pet: null }),
 *     (person, pet) => ({ ownerName: person.name, pet: pet.name })
 *   )
 *   .toArray();
 *
 * expect(result).toEqual([
 *   { ownerName: 'Magnus', pet: 'Daisy' },
 *   { ownerName: 'Terry', pet: 'Barley' },
 *   { ownerName: 'Terry', pet: 'Boots' },
 *   { ownerName: 'Adam', pet: 'Whiskers' },
 *   { ownerName: 'John', pet: null }
 * ]);
 * ```
 * @typeparam TFirst The type of elements in the first sequence.
 * @typeparam TKey The type of the key returned by the key selector functions.
 * @typeparam TResult The type of the result elements.
 * @param first The first sequence of the join operation.
 * @param second The second sequence of the join operation.
 * @param keySelector Function that projects the key given an element of one of the sequences to join.
 * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
 * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
 * @param equalityComparer A function to compare keys.
 * @returns A sequence containing results projected from a left outer join of the two input sequences.
 */
export function leftJoinHomogeneous<TFirst, TKey, TResult>(
  first: Iterable<TFirst>,
  second: Iterable<TFirst>,
  keySelector: (item: TFirst) => TKey,
  firstSelector: (item: TFirst) => TResult,
  bothSelector: (a: TFirst, b: TFirst) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<TResult> {
  return new Enumerable(() =>
    leftJoinHomogeneousGenerator(first, second, keySelector, firstSelector, bothSelector, equalityComparer)
  );
}
