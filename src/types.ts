export type EqualityComparer<T> = (a: T, b: T) => boolean;

export type Comparer<T> = (a: T, b: T) => number;

export type TypeOfMember = 'string' | 'number' | 'boolean' | 'bigint' | 'function' | 'object' | 'symbol' | 'undefined';

export type IEnumerableConstructor<
  TGeneratorOutput,
  TEnumerable = TGeneratorOutput,
  TEnumerableType extends IEnumerable<TEnumerable> = IEnumerable<TEnumerable>
> = new (generator: () => Generator<TGeneratorOutput>) => TEnumerableType;

/**
 * Interface that exposes an iterator, which supports a simple iteration and various methods.
 * @typeparam TSource The type of elements in the IEnumerable.
 */
export interface IEnumerable<TSource> extends Iterable<TSource> {
  /**
   * Exposes an iterator that can be used for iteration.
   * @example
   * ```typescript
   * const numbers = from([1, 2, 3]);
   * for (const number of numbers) {
   *   // Iteration is allowed because of the iterator.
   * }
   * ```
   * @returns The iterator for the IEnumerable.
   */
  [Symbol.iterator](): Generator<TSource>;

  /**
   * Applies an accumulator function over a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const sum = from(items)
   *   .aggregate((prev, curr) => prev + curr); // sum will be 6
   * ```
   * @param aggregator An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  aggregate(aggregator: (prev: TSource, curr: TSource, index: number) => TSource): TSource;

  /**
   * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const sum = from(items)
   *   .aggregate((prev, curr) => prev + curr, 10); // sum will be 16
   * ```
   * @typeparam TAccumulate The type of the accumulator value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @param seed The initial accumulator value.
   * @returns The final accumulator value.
   */
  aggregate<TAccumulate>(
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
    seed: TAccumulate
  ): TAccumulate;

  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const sum = from(items)
   *   .aggregate((prev, curr) => prev + curr, 10, result => ({ result })); // sum will be { result: 16 }
   * ```
   * @typeparam TAccumulate The type of the accumulator value.
   * @typeparam TResult The type of the resulting value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @param seed The initial accumulator value.
   * @param resultSelector An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  aggregate<TAccumulate, TResult>(
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
    seed: TAccumulate,
    resultSelector: (accumulated: TAccumulate) => TResult
  ): TResult;

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAllNumbersEven = from(numbers).all(x => x % 2 === 0); // false
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
   */
  all(predicate: (item: TSource, index: number) => boolean): boolean;

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAnyNumbersEven = from(numbers).any(); // true
   * ```
   * @returns true if the source sequence contains any elements (or if at least one matches condition if condition is passed); otherwise, false.
   */
  any(): boolean;

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAnyNumbersEven = from(numbers).any(x => x % 2 === 0); // true
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns true if the source sequence contains any elements (or if at least one matches condition if condition is passed); otherwise, false.
   */
  any(predicate: (item: TSource, index: number) => boolean): boolean;

  /**
   * Appends a value to the end of the sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const withFive = from(numbers).append(5); // [1, 2, 3, 4, 5]
   * ```
   * @param item The value to append.
   * @returns A new sequence that ends with element.
   */
  append(item: TSource): IEnumerable<TSource>;

  /**
   * Returns the input as an IEnumerable.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const asEnumerable = from(items).asEnumerable();
   * ```
   * @returns The input sequence as IEnumerable.
   */
  asEnumerable(): IEnumerable<TSource>;

  /**
   * Determines whether or not the number of elements in the sequence is greater than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atLeastThree = from(items).atLeast(3); // true
   * const atLeastFour = from(items).atLeast(4); // false
   * ```
   * @param count The minimum number of items a sequence must have for this function to return true
   * @returns true if the number of elements in the sequence is greater than or equal to the given integer or false otherwise.
   */
  atLeast(count: number): boolean;

  /**
   * Determines whether or not the number of elements in the sequence is greater than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atLeastOneEven = from(items).atLeast(1, x => x % 2 === 0); // true
   * const atLeastTwoEven = from(items).atLeast(2, x => x % 2 === 0); // false
   * ```
   * @param count The minimum number of items a sequence must have for this function to return true
   * @param predicate A function to test each element for a condition.
   * @returns true if the number of elements in the sequence is greater than or equal to the given integer or false otherwise.
   */
  atLeast(count: number, predicate: (item: TSource, index: number) => boolean): boolean;

  atMost(count: number): boolean;

  atMost(count: number, predicate: (item: TSource, index: number) => boolean): boolean;

  /**
   * Computes the average of a sequence of numeric values.
   * @example
   * ```typescript
   * const numbers = [2, 2, 1, 3];
   * const average = from(numbers).average(); // 2
   * ```
   * @returns The average of the sequence of values.
   */
  average(): number;

  /**
   * Computes the average of a sequence of numeric values.
   * @example
   * ```typescript
   * const numbers = [{ age: 20 }, { age: 10 }, { age: 30 }];
   * const average = from(numbers).average(x => x.age); // 20
   * ```
   * @param selector A transform function to apply to each element.
   * @returns The average of the sequence of values.
   */
  average(selector: (item: TSource) => number): number;

  /**
   * Split the elements of a sequence into chunks of size at most chunkSize.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4, 5];
   * const chunks = from(numbers).chunk(2); // [[1, 2], [3, 4], [5]]
   * ```
   * @param chunkSize The maximum size of each chunk.
   * @returns An IEnumerable<TSource> that contains the elements the input sequence split into chunks of size chunkSize.
   */
  chunk(chunkSize: number): IEnumerable<IEnumerable<TSource>>;

  /**
   * Concatenates two sequences.
   * @example
   * ```typescript
   * const numbers = [1, 2];
   * const moreNumbers = from(numbers).concat([3, 4, 5]); // [1, 2, 3, 4, 5]
   * ```
   * @param second The sequence to concatenate to the first sequence.
   * @returns An IEnumerable<TSource> that contains the concatenated elements of the two input sequences.
   */
  concat(second: Iterable<TSource>): IEnumerable<TSource>;

  /**
   * Determines whether a sequence contains a specified element.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const hasThree = from(numbers).contains(3); // true
   * ```
   * @param value The value to locate in the sequence.
   * @returns true if the source sequence contains an element that has the specified value; otherwise, false.
   */
  contains(value: TSource): boolean;

  /**
   * Determines whether a sequence contains a specified element.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const hasThree = from(numbers).contains(3, (a, b) => a === b); // true
   * ```
   * @param value The value to locate in the sequence.
   * @param equalityComparer An equality comparer to compare values.
   * @returns true if the source sequence contains an element that has the specified value; otherwise, false.
   */
  contains(value: TSource, equalityComparer: EqualityComparer<TSource>): boolean;

  /**
   * Returns the number of elements in a sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const numCount = from(numbers).count(); // 3
   * ```
   * @returns The number of elements in the input sequence.
   */
  count(): number;

  /**
   * Returns the number of elements in a sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const evenNumCount = from(numbers).count(x => x % 2 === 0); // 1
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns The number of elements in the input sequence.
   */
  count(predicate: (item: TSource, index: number) => boolean): number;

  /**
   * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
   * @example
   * ```typescript
   * const defaultNum = 0;
   * const items = [];
   * const itemsWithDefault = from(items).defaultIfEmpty(defaultNum); // [0];
   * const
   * ```
   * @param defaultItem The value to return if the sequence is empty.
   * @returns An IEnumerable<TSource> that contains defaultValue if source is empty; otherwise, source.
   */
  defaultIfEmpty(defaultItem: TSource): IEnumerable<TSource>;

  /**
   * Returns distinct elements from a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 1, 2];
   * const distinct = from(items).distinct(); // Will be [1, 2, 3]
   * ```
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  distinct(): IEnumerable<TSource>;

  /**
   * Returns distinct elements from a sequence.
   * @example
   * ```typescript
   * const items = [{ name: 'bob' }, { name: 'Joe' }, { name: 'Bob' }];
   * const distinct = from(items).distinct((a, b) => a.name.toUpperCase() === b.name.toUpperCase()); // Will be [{ name: 'bob' }, { name: 'Joe' }]
   * ```
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  distinct(equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  /**
   * Returns distinct elements from a sequence according to a specified key selector function.
   * @example
   * ```typescript
   * const items = [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }, { name: 'John', id: 2 }];
   * const distinct = from(items).distinctBy(x => x.id); // Will be [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }]
   * ```
   * @typeparam TKey The type of key to distinguish elements by.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  distinctBy<TKey>(keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Returns distinct elements from a sequence according to a specified key selector function.
   * @example
   * ```typescript
   * const items = [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }, { name: 'John', id: 2 }];
   * const distinct = from(items).distinctBy(x => x.id, (a, b) => a === b); // Will be [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }]
   * ```
   * @typeparam TKey The type of key to distinguish elements by.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  distinctBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Returns the element at a specified index in a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAt(0); // Will be 1
   * const willThrow = from(items).elementAt(10); // This will throw.
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
  elementAt(index: number): TSource;

  /**
   * Returns the element at a specified index in a sequence or null if the index is out of range.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAt(0); // Will be 1
   * const willBeNull = from(items).elementAt(10); // Will be null.
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
  elementAtOrDefault(index: number): TSource | null;

  endsWith(second: Iterable<TSource>): boolean;

  endsWith(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  except(second: Iterable<TSource>): IEnumerable<TSource>;

  except(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  exceptBy<TKey>(second: Iterable<TKey>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  first(): TSource;

  first(predicate: (item: TSource, index: number) => boolean): TSource;

  firstOrDefault(): TSource | null;

  firstOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  forEach(action: (item: TSource, index: number) => void): void;

  /**
   * Performs a full outer join on two heterogeneous sequences.
   * Additional arguments specify key selection functions, result projection functions and a key comparer.
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector: Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  fullJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a full outer join on two heterogeneous sequences.
   * Additional arguments specify key selection functions, result projection functions and a key comparer.
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector: Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  fullJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  /**
   * Performs a full outer join on two homogeneous sequences.
   * Additional arguments specify key selection functions and result projection functions.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a full outer join of the two input sequences.
   */
  fullJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a full outer join on two homogeneous sequences.
   * Additional arguments specify key selection functions and result projection functions.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a full outer join of the two input sequences.
   */
  fullJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  groupBy<TKey>(keySelector: (item: TSource) => TKey): IEnumerable<IGrouping<TKey, TSource>>;

  groupBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<IGrouping<TKey, TSource>>;

  /**
   * Correlates the elements of two sequences based on key equality, and groups the results.
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
   * const result = people
   *   .groupJoin(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     (person, petCollection) => ({ ownerName: person.name, pets: petCollection.select(p => p.name).toArray() })
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { ownerName: 'Magnus', pets: ['Daisy'] },
   *   { ownerName: 'Terry', pets: ['Barley', 'Boots'] },
   *   { ownerName: 'Adam', pets: ['Whiskers'] },
   *   { ownerName: 'John', pets: [] }
   * ]);
   * ```
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The sequence to join to the first sequence.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
   */
  groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: IEnumerable<TInner>) => TResult
  ): IEnumerable<TResult>;

  /**
   * Correlates the elements of two sequences based on key equality, and groups the results.
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
   * const result = people
   *   .groupJoin(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     (person, petCollection) => ({ ownerName: person.name, pets: petCollection.select(p => p.name).toArray() }),
   *     (person, pet) => person.name === pet.owner.name
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { ownerName: 'Magnus', pets: ['Daisy'] },
   *   { ownerName: 'Terry', pets: ['Barley', 'Boots'] },
   *   { ownerName: 'Adam', pets: ['Whiskers'] },
   *   { ownerName: 'John', pets: [] }
   * ]);
   * ```
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The sequence to join to the first sequence.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
   * @param equalityComparer An IEnumerable<TResult> that contains elements of type TResult that are obtained by performing a grouped join on two sequences.
   */
  groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: IEnumerable<TInner>) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  intersect(second: Iterable<TSource>): IEnumerable<TSource>;

  intersect(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  intersectBy<TKey>(second: Iterable<TKey>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

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
   * const result = people.join(
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
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The second sequence to join to the first.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from two matching elements.
   * @returns An IEnumerable<TResult> that has elements of type TResult that are obtained by performing an inner join on two sequences.
   */
  join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult
  ): IEnumerable<TResult>;

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
   * const result = people.join(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     (person, pet) => ({ ownerName: person.name, pet: pet.name }),
   *     (person, pet) => person.name === pet.owner.name
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
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The second sequence to join to the first.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from two matching elements.
   * @param equalityComparer A function to compare keys.
   * @returns An IEnumerable<TResult> that has elements of type TResult that are obtained by performing an inner join on two sequences.
   */
  join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  last(): TSource;

  last(predicate: (item: TSource, index: number) => boolean): TSource;

  lastOrDefault(): TSource | null;

  lastOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  /**
   * Performs a left outer join on two heterogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  leftJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a left outer join on two heterogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  leftJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  /**
   * Performs a left outer join on two homogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  leftJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a left outer join on two homogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  leftJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  max(): TSource;

  max<TResult>(selector: (item: TSource) => TResult): TResult;

  maxBy<TKey>(keySelector: (item: TSource) => TKey): TSource;

  min(): TSource;

  min<TResult>(selector: (item: TSource) => TResult): TResult;

  minBy<TKey>(keySelector: (item: TSource) => TKey): TSource;

  ofType<TResult>(type: new (...params: unknown[]) => TResult): IEnumerable<TResult>;

  orderBy<TKey>(selector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  orderBy<TKey>(selector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  orderByDescending<TKey>(selector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  orderByDescending<TKey>(selector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  pipe(action: (item: TSource, index: number) => void): IEnumerable<TSource>;

  prepend(item: TSource): IEnumerable<TSource>;

  quantile(selector: (item: TSource) => number, q: number): number;

  reverse(): IEnumerable<TSource>;

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
   * const result = people.rightJoinHeterogeneous<Pet, Person, { side: Side; left: Person | null; right: Pet }>(
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
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  rightJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult
  ): IEnumerable<TResult>;

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
   * const result = people.rightJoinHeterogeneous<Pet, Person, { side: Side; left: Person | null; right: Pet }>(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     pet => ({ side: right, left: missing, right: pet }),
   *     (person, pet) => ({ side: both, left: person, right: pet }),
   *     (person, pet) => person.name === pet.owner.name
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
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  rightJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

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
   * const result = people1.rightJoinHomogeneous<string, { side: Side; left: Person | null; right: Person }>(
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
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  rightJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult
  ): IEnumerable<TResult>;

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
   * const result = people1.rightJoinHomogeneous<string, { side: Side; left: Person | null; right: Person }>(
   *     people2,
   *     person => person.name,
   *     person => ({ side: right, left: missing, right: person }),
   *     (personLeft, personRight) => ({ side: both, left: personLeft, right: personRight }),
   *     (keyLeft, keyRight) => keyLeft.toUpperCase() === keyRight.toUpperCase()
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
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  rightJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  select<TResult>(selector: (item: TSource, index: number) => TResult): IEnumerable<TResult>;

  selectMany<TResult>(selector: (item: TSource, index: number) => TResult[]): IEnumerable<TResult>;

  sequenceEqual(second: Iterable<TSource>): boolean;

  sequenceEqual(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  shuffle(): IEnumerable<TSource>;

  /**
   * Returns the first element of a sequence, and throws an exception if more than one element exists.
   * @returns The single element of the input sequence that satisfies a condition.
   */
  single(): TSource;

  /**
   * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
   * @param predicate A function to test an element for a condition.
   * @returns The single element of the input sequence that satisfies a condition.
   */
  single(predicate: (item: TSource, index: number) => boolean): TSource;

  singleOrDefault(): TSource | null;

  singleOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  skip(count: number): IEnumerable<TSource>;

  skipLast(count: number): IEnumerable<TSource>;

  skipWhile(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource>;

  startsWith(second: Iterable<TSource>): boolean;

  startsWith(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  sum(): number;

  sum(selector: (item: TSource) => number): number;

  take(count: number): IEnumerable<TSource>;

  takeEvery(step: number): IEnumerable<TSource>;

  takeLast(count: number): IEnumerable<TSource>;

  takeWhile(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource>;

  /**
   * Creates a new instance of the passed in ctor with the Enumerable as input.
   * Useful for custom iterables.
   * @example
   * ```typescript
   * class MyCustomEnumerable<T> extends Enumerable<T> {
   *   public foo(): void {
   *     console.log('hello');
   *   }
   * }
   *
   * const items = [1, 2, 3];
   *
   * const asCustom = from(items).to(MyCustomEnumerable); // asCustom is now a MyCustomEnumerable instance.
   * ```
   * @typeparam TResult The type of the returned object.
   * @param ctor The constructor function to create the result.
   * @returns A new instance of the passed in ctor with the enumerable passed as input.
   */
  to<TResult>(ctor: new (src: Iterable<TSource>) => TResult): TResult;

  toArray(): TSource[];

  /**
   * @deprecated Not yet implemented. Do not use.
   */
  toLookup(): unknown;

  toMap<TKey>(keySelector: (item: TSource) => TKey): Map<TKey, TSource>;

  toMap<TKey, TValue>(
    keySelector: (item: TSource) => TKey,
    valueSelector: (item: TSource) => TValue
  ): Map<TKey, TValue>;

  toObject(keySelector: (item: TSource) => string): Record<string, TSource>;

  toObject<TValue>(
    keySelector: (item: TSource) => string,
    valueSelector: (item: TSource) => TValue
  ): Record<string, TValue>;

  toSet(): Set<TSource>;

  union(second: Iterable<TSource>): IEnumerable<TSource>;

  union(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  unionBy<TKey>(second: Iterable<TSource>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  unionBy<TKey>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Filters a sequence of values based on a predicate.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5];
   * const greaterThanTwo = from(items).where(x => x > 2); // Will be [3, 4, 5]
   * ```
   * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<TSource> that contains elements from the input sequence that satisfy the condition.
   */
  where(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource>;

  zip<TSecond>(second: Iterable<TSecond>): IEnumerable<[TSource, TSecond]>;

  zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (first: TSource, second: TSecond) => TResult
  ): IEnumerable<TResult>;
}

export interface IOrderedEnumerable<TSource> extends IEnumerable<TSource> {
  thenBy<TKey>(selector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  thenBy<TKey>(selector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  thenByDescending<TKey>(selector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  thenByDescending<TKey>(selector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;
}

export interface IGrouping<TKey, TSource> extends IEnumerable<TSource> {
  readonly key: TKey;
}
