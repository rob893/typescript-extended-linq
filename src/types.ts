export type EqualityComparer<T> = (a: T, b: T) => boolean;

export type Comparer<T> = (a: T, b: T) => number;

export type TypeOfMember = 'string' | 'number' | 'boolean' | 'bigint' | 'function' | 'object' | 'symbol' | 'undefined';

export type FlatIterable<Itr, Depth extends number> = {
  done: Itr;
  recur: Itr extends Iterable<infer InnerItr>
    ? FlatIterable<InnerItr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
    : Itr;
}[Depth extends -1 ? 'done' : 'recur'];

export interface IEnumerableFactory {
  createBasicEnumerable<TSource>(generator: () => Generator<TSource>): IEnumerable<TSource>;

  createOrderedEnumerable<TSource>(generator: () => Generator<TSource[]>): IOrderedEnumerable<TSource>;

  createGroupedEnumerable<TKey, TSource>(key: TKey, generator: () => Generator<TSource>): IGrouping<TKey, TSource>;

  createArrayEnumerable<TSource>(generator: () => Generator<TSource>, srcArr: TSource[]): IEnumerable<TSource>;

  createList<TSource>(generator: () => Generator<TSource>): IList<TSource>;
}

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
   *   .aggregate(10, (prev, curr) => prev + curr); // sum will be 16
   * ```
   * @typeparam TAccumulate The type of the accumulator value.
   * @param seed The initial accumulator value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  aggregate<TAccumulate>(
    seed: TAccumulate,
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate
  ): TAccumulate;

  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const sum = from(items)
   *   .aggregate(10, (prev, curr) => prev + curr, result => ({ result })); // sum will be { result: 16 }
   * ```
   * @typeparam TAccumulate The type of the accumulator value.
   * @typeparam TResult The type of the resulting value.
   * @param seed The initial accumulator value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @param resultSelector An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  aggregate<TAccumulate, TResult>(
    seed: TAccumulate,
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
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
   * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
   * @example
   * ```typescript
   * const items = [1, 2, '3'];
   * const sum = from(items).assert(x => typeof x === 'number').sum(); // throws due to '3'
   * ```
   * @param predicate A function to test each element for a condition. If false, an error will be thrown.
   * @returns A sequence with source elements in their original order.
   */
  assert(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource>;

  /**
   * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
   * @example
   * ```typescript
   * const items = [1, 2, '3'];
   * const sum = from(items).assert(x => typeof x === 'number', 'Should be number').sum(); // throws due to '3'
   * ```
   * @param predicate A function to test each element for a condition. If false, an error will be thrown.
   * @param message The message to use for thrown errors.
   * @returns A sequence with source elements in their original order.
   */
  assert(predicate: (item: TSource, index: number) => boolean, message: string): IEnumerable<TSource>;

  /**
   * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
   * @example
   * ```typescript
   * class MyError extends Error {}
   * const items = [1, 2, '3'];
   * const sum = from(items).assert(x => typeof x === 'number', MyError).sum(); // throws instance of MyError due to '3'
   * ```
   * @typeparam TError The type of error to be thrown.
   * @param predicate A function to test each element for a condition. If false, an error will be thrown.
   * @param errorType Type of error to throw.
   * @returns A sequence with source elements in their original order.
   */
  assert<TError extends Error>(
    predicate: (item: TSource, index: number) => boolean,
    errorType: new (message?: string) => TError
  ): IEnumerable<TSource>;

  /**
   * Tests a sequence with a given predicate. An error will be thrown if any element fails the sequence.
   * @example
   * ```typescript
   * class MyError extends Error {}
   * const items = [1, 2, '3'];
   * const sum = from(items).assert(x => typeof x === 'number', 'Must be number', MyError).sum(); // throws instance of MyError with message due to '3'
   * ```
   * @typeparam TError The type of error to be thrown.
   * @param predicate A function to test each element for a condition. If false, an error will be thrown.
   * @param message The message to use for thrown errors.
   * @param errorType Type of error to throw.
   * @returns A sequence with source elements in their original order.
   */
  assert<TError extends Error>(
    predicate: (item: TSource, index: number) => boolean,
    message: string,
    errorType: new (message?: string) => TError
  ): IEnumerable<TSource>;

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

  /**
   * Determines whether or not the number of elements in the sequence is lesser than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atMostTwo = from(items).atMost(2); // false
   * const atMostFour = from(items).atMost(4); // true
   * ```
   * @param count The maximun number of items a sequence must have for this function to return true.
   * @returns true if the number of elements in the sequence is lesser than or equal to the given integer or false otherwise.
   */
  atMost(count: number): boolean;

  /**
   * Determines whether or not the number of elements that match the predicate in the sequence is lesser than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atMostTwo = from(items).atMost(2, x => x > 0); // false
   * const atMostFour = from(items).atMost(4, x => x > 2); // true
   * ```
   * @param count The maximun number of items a sequence must have for this function to return true.
   * @param predicate The condition to match the elements by.
   * @returns true if the number of elements that match the predicate in the sequence is lesser than or equal to the given integer or false otherwise.
   */
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
   * const moreNumbers = from(numbers).concatenate([3, 4, 5]); // [1, 2, 3, 4, 5]
   * ```
   * @param collection The sequence to concatenate to the first sequence.
   * @returns An IEnumerable<TSource> that contains the concatenated elements of the two input sequences.
   */
  concatenate(collection: Iterable<TSource>): IEnumerable<TSource>;

  /**
   * Concatenates two sequences.
   * @example
   * ```typescript
   * const numbers = [1, 2];
   * const evenMoreNumbers = from(numbers).concatenate([3, 4], [5, 6]); // [1, 2, 3, 4, 5, 6]
   * ```
   * @param collections The sequences to concatenate to the first sequence.
   * @returns An IEnumerable<TSource> that contains the concatenated elements of the two or more input sequences.
   */
  concatenate(...collections: Iterable<TSource>[]): IEnumerable<TSource>;

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
   * Returns the element at a specified index in a sequence or throws if the index is out of range.
   * A negative index can be used to get element starting from the end.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAt(0); // Will be 1
   * const willBeNull = from(items).elementAt(10); // Will throw.
   * const last = from(items).elementAt(-1); // 3
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
  elementAt(index: number): TSource;

  /**
   * Returns the element at a specified index in a sequence or null if the index is out of range.
   * A negative index can be used to get element starting from the end.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAtOrDefault(0); // Will be 1
   * const willBeNull = from(items).elementAtOrDefault(10); // Will be null.
   * const last = from(items).elementAtOrDefault(-1); // 3
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
  elementAtOrDefault(index: number): TSource | null;

  /**
   * Determines whether the end of the first sequence is equivalent to the second sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const endsWith = from(items).endsWith([2, 3]); // true
   * const doesNotEndWith = from(items).endsWith([3, 2]); // false
   * ```
   * @param second The sequence to compare to.
   * @returns true if first ends with elements equivalent to second.
   */
  endsWith(second: Iterable<TSource>): boolean;

  /**
   * Determines whether the end of the first sequence is equivalent to the second sequence, using the specified element equality comparer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const endsWith = from(items).endsWith([2, 3], (a, b) => a === b); // true
   * const doesNotEndWith = from(items).endsWith([3, 2], (a, b) => a === b); // false
   * ```
   * @param second The sequence to compare to.
   * @param equalityComparer Equality comparer to use.
   * @returns true if first ends with elements equivalent to second.
   */
  endsWith(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4];
   * const exceptItems = from(items).except([2, 4]); // [1, 3]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  except(second: Iterable<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4];
   * const exceptItems = from(items).except([2, 4], [3, 4]); // [1]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  except(...second: Iterable<TSource>[]): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4];
   * const exceptItems = from(items).except([2, 4], (a, b) => a === b); // [1, 3]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  except(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4];
   * const exceptItems = from(items).except([2, 4], [3], (a, b) => a === b); // [1]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  except(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5, 6, 7];
   * const exceptItems = from(items).except([2, 4], [3, 5], [7], (a, b) => a === b); // [1, 6]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param fourth An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  except(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  exceptBy<TKey>(second: Iterable<TKey>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  exceptBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TKey>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param fourth An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  exceptBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TKey>,
    fourth: Iterable<TKey>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  exceptBy<TKey>(
    second: Iterable<TKey>,
    thrid: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param fourth An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  exceptBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TKey>,
    fourth: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Returns the first element in a sequence. Throws if sequence contains no elements.
   * @returns The first element in the sequence.
   */
  first(): TSource;

  /**
   * Returns the first element in a sequence that satisfies a specified condition. Throws if sequence contains no elements that matches condition.
   * @param predicate A function to test each element for a condition.
   * @returns The first element in the sequence that passes the test in the specified predicate function.
   */
  first(predicate: (item: TSource, index: number) => boolean): TSource;

  /**
   * Returns the first element in a sequence. Returns null if sequence contains no elements.
   * @returns The first element in the sequence or null.
   */
  firstOrDefault(): TSource | null;

  /**
   * Returns the first element in a sequence that satisfies a specified condition. Returns null if sequence contains no elements that matches condition.
   * @param predicate A function to test each element for a condition.
   * @returns The first element in the sequence that passes the test in the specified predicate function or null.
   */
  firstOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  /**
   * Returns a new IEnumerable with all sub-iterable elements concatenated into it one level deep.
   * @example
   * ```typescript
   * const items = [1, 2, [3, 4, [5, []]]];
   * const res = from(items).flatten(); // [1, 2, 3, 4, [5, []]]
   * ```
   * @returns A new IEnumerable with all sub-iterable elements concatenated into it recursively up.
   */
  flatten(): IEnumerable<FlatIterable<Iterable<TSource>, 1>>;

  /**
   * Returns a new IEnumerable with all sub-iterable elements concatenated into it recursively up to the specified depth.
   * @example
   * ```typescript
   * const items = [1, 2, [3, 4, [5, []]]];
   * const res = from(items).flatten(3); // [1, 2, 3, 4, 5]
   * ```
   * @param depth The depth to flatten to.
   * @returns A new IEnumerable with all sub-iterable elements concatenated into it recursively up.
   */
  flatten<Depth extends number>(depth: Depth): IEnumerable<FlatIterable<Iterable<TSource>, Depth>>;

  /**
   * Iterates the sequence and calls an action on each element.
   * @param action The action to perform on each item in the sequence.
   */
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

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<IGrouping<TKey, TSource>> where each IGrouping<TKey, TSource> object contains a sequence of objects and a key.
   */
  groupBy<TKey>(keySelector: (item: TSource) => TKey): IEnumerable<IGrouping<TKey, TSource>>;

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer A function to compare keys.
   * @returns An IEnumerable<IGrouping<TKey, TSource>> where each IGrouping<TKey, TSource> object contains a sequence of objects and a key.
   */
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
   * @param equalityComparer A function to compare keys.
   */
  groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: IEnumerable<TInner>) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  /**
   * Produces the set intersection of two sequences.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersect(second: Iterable<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersect(...second: Iterable<TSource>[]): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersect(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersect(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param fourth An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersect(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersectBy<TKey>(second: Iterable<TKey>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersectBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param fourth An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersectBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersectBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param third An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param fourth An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  intersectBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
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
   * const result = people.innerJoin(
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
  innerJoin<TInner, TKey, TResult>(
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
   * const result = people.innerJoin(
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
  innerJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  /**
   * Returns the last element of a sequence. Throws if sequence is empty.
   * @returns The value at the last position in the source sequence.
   */
  last(): TSource;

  /**
   * Returns the last element of a sequence that satisfies a specified condition.
   * @param predicate A function to test each element for a condition.
   * @returns The last element in the sequence that passes the test in the specified predicate function.
   */
  last(predicate: (item: TSource, index: number) => boolean): TSource;

  /**
   * Returns the last element of a sequence, or null if the sequence contains no elements.
   * @returns null if the source sequence is empty; otherwise, the last element in the IEnumerable<T>
   */
  lastOrDefault(): TSource | null;

  /**
   * Returns the last element of a sequence that satisfies a condition or null if no such element is found.
   * @param predicate A function to test each element for a condition.
   * @returns null if the sequence is empty or if no elements pass the test in the predicate function; otherwise, the last element that passes the test in the predicate function.
   */
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

  /**
   * Returns the maximum value in a sequence of values.
   * @returns The max value in the sequence.
   */
  max(): TSource;

  /**
   * Invokes a transform function on each element of a generic sequence and returns the maximum resulting value.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each element.
   * @returns The maximum value in the sequence.
   */
  max<TResult>(selector: (item: TSource) => TResult): TResult;

  /**
   * Returns the maximum value in a generic sequence according to a specified key selector function.
   * @typeparam TKey The type of key to compare elements by.
   * @param keySelector A function to extract the key for each element.
   * @returns The value with the maximum key in the sequence.
   */
  maxBy<TKey>(keySelector: (item: TSource) => TKey): TSource;

  /**
   * Returns the min value in a sequence of values.
   * @returns The min value in the sequence.
   */
  min(): TSource;

  /**
   * Invokes a transform function on each element of a generic sequence and returns the min resulting value.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each element.
   * @returns The min value in the sequence.
   */
  min<TResult>(selector: (item: TSource) => TResult): TResult;

  /**
   * Returns the min value in a generic sequence according to a specified key selector function.
   * @typeparam TKey The type of key to compare elements by.
   * @param keySelector A function to extract the key for each element.
   * @returns The value with the min key in the sequence.
   */
  minBy<TKey>(keySelector: (item: TSource) => TKey): TSource;

  /**
   * Filters the elements of an IEnumerable based on a specified type.
   * @typeparam TResult The type to filter the elements of the sequence on.
   * @param type The type to filter the elements of the sequence on.
   * @returns An IEnumerable<T> that contains elements from the input sequence of type TResult.
   */
  ofType<TResult>(type: new (...params: unknown[]) => TResult): IEnumerable<TResult>;

  /**
   * Sorts the elements of a sequence in ascending order.
   * @example
   * ```typescript
   * const items = [1, 3, 2];
   * const ordered = from(items).order().toArray(); // Will be [1, 2, 3]
   * ```
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
   */
  order(): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in ascending order.
   * @example
   * ```typescript
   * const items = [1, 3, 2];
   * const ordered = from(items).order().toArray(); // Will be [1, 2, 3]
   * ```
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
   */
  order(comparer: Comparer<TSource>): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in descending order.
   * @example
   * ```typescript
   * const items = [1, 3, 2];
   * const ordered = from(items).orderDescending().toArray(); // Will be [3, 2, 1]
   * ```
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
   */
  orderDescending(): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in descending order.
   * @example
   * ```typescript
   * const items = [1, 3, 2];
   * const ordered = from(items).orderDescending().toArray(); // Will be [3, 2, 1]
   * ```
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted.
   */
  orderDescending(comparer: Comparer<TSource>): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in ascending order.
   * @example
   * ```typescript
   * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
   * const ordered = from(items).orderBy(x => x.id).toArray(); // Will be [{ id: 1 }, { id: 2 }, { id: 3 }]
   * ```
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  orderBy<TKey>(keySelector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in ascending order.
   * @example
   * ```typescript
   * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
   * const ordered = from(items).orderBy(x => x.id).toArray(); // Will be [{ id: 1 }, { id: 2 }, { id: 3 }]
   * ```
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  orderBy<TKey>(keySelector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in descending order.
   * @example
   * ```typescript
   * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
   * const ordered = from(items).orderByDescending(x => x.id).toArray(); // Will be [{ id: 3 }, { id: 2 }, { id: 1 }]
   * ```
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  orderByDescending<TKey>(keySelector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in descending order.
   * @example
   * ```typescript
   * const items = [{ id: 1 }, { id: 3 }, { id: 2 }];
   * const ordered = from(items).orderByDescending(x => x.id).toArray(); // Will be [{ id: 3 }, { id: 2 }, { id: 1 }]
   * ```
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  orderByDescending<TKey>(keySelector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  /**
   * Executes the given action on each element in the source sequence and yields it.
   * @param action The action to execute on each element.
   * @returns A sequence with source elements in their original order.
   */
  pipe(action: (item: TSource, index: number) => void): IEnumerable<TSource>;

  /**
   * Adds a value to the beginning of the sequence.
   * @param item The value to prepend to source.
   * @returns A new sequence that begins with item.
   */
  prepend(item: TSource): IEnumerable<TSource>;

  /**
   * Computes the quantile of a sequence.
   * @param selector A function to extract a value from each element.
   * @param q The percentile to compute (25, 50, etc.)
   * @returns The percentile of the sequence.
   */
  quantile(selector: (item: TSource) => number, q: number): number;

  /**
   * Inverts the order of the elements in a sequence.
   * @returns A sequence whose elements correspond to those of the input sequence in reverse order.
   */
  reverseImmutable(): IEnumerable<TSource>;

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

  /**
   * Projects each element of a sequence into a new form.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each element.
   * @returns An IEnumerable<T> whose elements are the result of invoking the transform function on each element of source.
   */
  select<TResult>(selector: (item: TSource, index: number) => TResult): IEnumerable<TResult>;

  /**
   * Projects each element of a sequence to an IEnumerable<T> and flattens the resulting sequences into one sequence.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<T> whose elements are the result of invoking the one-to-many transform function on each element of an input sequence.
   */
  selectMany<TResult>(selector: (item: TSource, index: number) => TResult[]): IEnumerable<TResult>;

  /**
   * Determines whether two sequences are equal by comparing the elements.
   * @param second An IEnumerable<T> to compare to the first sequence.
   * @returns true if the two source sequences are of equal length and their corresponding elements are equal; otherwise, false.
   */
  sequenceEqual(second: Iterable<TSource>): boolean;

  /**
   * Determines whether two sequences are equal by comparing their elements by using a specified EqualityComparer<T>.
   * @param second An IEnumerable<T> to compare to the first sequence.
   * @param equalityComparer An EqualityComparer<T> to use to compare elements.
   * @returns true if the two source sequences are of equal length and their corresponding elements compare equal according to equalityComparer; otherwise, false.
   */
  sequenceEqual(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  /**
   * Returns a new IEnumerable<TSource> of the input sequence in random order.
   * @returns A new IEnumerable<TSource> of the input sequence in random order.
   */
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

  /**
   * Returns a single, specific element of a sequence, or null if that element is not found.
   * @returns The single element of the input sequence, or null if the sequence contains no elements.
   */
  singleOrDefault(): TSource | null;

  /**
   * Returns the only element of a sequence that satisfies a specified condition or null if no such element exists; this method throws an exception if more than one element satisfies the condition.
   * @param predicate A function to test an element for a condition.
   * @returns The single element of the input sequence that satisfies the condition, or null if no such element is found.
   */
  singleOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   * @param count The number of elements to skip before returning the remaining elements.
   * @returns An IEnumerable<T> that contains the elements that occur after the specified index in the input sequence.
   */
  skip(count: number): IEnumerable<TSource>;

  /**
   * Returns a new enumerable collection that contains the elements from source with the last count elements of the source collection omitted.
   * @param count The number of elements to omit from the end of the collection.
   * @returns A new enumerable collection that contains the elements from source minus count elements from the end of the collection.
   */
  skipLast(count: number): IEnumerable<TSource>;

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<T> that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
   */
  skipWhile(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource>;

  /**
   * Splits the source sequence by a separator.
   * @param separator Separator element.
   * @returns A sequence of splits of elements.
   */
  split(separator: TSource): IEnumerable<IEnumerable<TSource>>;

  /**
   * Splits the source sequence by a predicate.
   * @param predicate A function to test an element for a condition.
   * @returns A sequence of splits of elements.
   */
  split(predicate: (item: TSource, index: number) => boolean): IEnumerable<IEnumerable<TSource>>;

  /**
   * Determines whether the beginning of the first sequence is equivalent to the second sequence.
   * @param second The sequence to compare to.
   * @returns true if first begins with elements equivalent to second.
   */
  startsWith(second: Iterable<TSource>): boolean;

  /**
   * Determines whether the beginning of the first sequence is equivalent to the second sequence, using the specified element equality comparer.
   * @param second The sequence to compare to.
   * @param equalityComparer Equality comparer to use.
   * @returns true if first begins with elements equivalent to second.
   */
  startsWith(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  /**
   * Computes the sum of a sequence of numeric values.
   * @returns The sum of the values in the sequence.
   */
  sum(): number;

  /**
   * Computes the sum of the sequence of values that are obtained by invoking a transform function on each element of the input sequence.
   * @example
   * ```typescript
   * const items = [{ age: 15 }, { age: 25 }, { age: 20 }];
   * const result = from(items).sum(x => x.age); // 60
   * ```
   * @param selector A transform function to apply to each element.
   * @returns The sum of the projected values.
   */
  sum(selector: (item: TSource) => number): number;

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5];
   * const result = from(items).take(2); // [1, 2]
   * ```
   * @returns An IEnumerable<T> that contains the specified number of elements from the start of the input sequence.
   */
  take(count: number): IEnumerable<TSource>;

  /**
   * Returns every N-th element of a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5];
   * const result = from(items).takeEvery(3); // [1, 4]
   * ```
   * @param step Number of elements to bypass before returning the next element.
   * @returns A sequence with every N-th element of the input sequence.
   */
  takeEvery(step: number): IEnumerable<TSource>;

  /**
   * Returns a new enumerable collection that contains the last count elements from source.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5];
   * const lastTwo = from(items).takeLast(2); // [4, 5]
   * ```
   * @param count The number of elements to take from the end of the collection.
   * @returns A new enumerable collection that contains the last count elements from source.
   */
  takeLast(count: number): IEnumerable<TSource>;

  /**
   * Returns elements from a sequence as long as a specified condition is true, and then skips the remaining elements.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5];
   * const result = from(items).takeWhile(x => x < 3); // [1, 2]
   * ```
   * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<T> that contains elements from the input sequence that occur before the element at which the test no longer passes.
   */
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

  /**
   * Converts the source sequence into an array.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const arr = from(items).toArray(); // [1, 2, 3]
   * ```
   * @returns A new array containing the elements of the source sequence.
   */
  toArray(): TSource[];

  /**
   * Returns a JSON string representation of the enumerable.
   * @returns A JSON string representation of the enumerable.
   */
  toJSON(): string;

  /**
   * Converts the source sequence into list.
   * @returns A new list containing the elements of the source sequence.
   */
  toList(): IList<TSource>;

  /**
   * @deprecated Not yet implemented. Do not use.
   */
  toLookup(): unknown;

  /**
   * Creates a Map<TKey, TValue> from an IEnumerable<T> according to specified key selector.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @returns A Map<TKey, TSource> that contains keys and values.
   */
  toMap<TKey>(keySelector: (item: TSource) => TKey): Map<TKey, TSource>;

  /**
   * Creates a Map<TKey, TValue> from an IEnumerable<T> according to specified key selector and element selector functions.
   * @typeparam TKey The type of the key returned by keySelector.
   * @typeparam TValue The type of the value returned by valueSelector.
   * @param keySelector A function to extract a key from each element.
   * @param valueSelector A transform function to produce a result element value from each element.
   * @returns A Map<TKey, TValue> that contains keys and values.
   */
  toMap<TKey, TValue>(
    keySelector: (item: TSource) => TKey,
    valueSelector: (item: TSource) => TValue
  ): Map<TKey, TValue>;

  /**
   * Returns an object with keys selected by keySelector and values of TSource.
   * @param keySelector A function to extract a key from each element.
   * @returns An object with keys selected by keySelector and values of TSource
   */
  toObject(keySelector: (item: TSource) => string): Record<string, TSource>;

  /**
   * Returns an object with keys selected by keySelector and values of TSource.
   * @typeparam TValue The type of the value returned by valueSelector.
   * @param keySelector A function to extract a key from each element.
   * @param valueSelector A transform function to produce a result element value from each element.
   * @returns An object with keys selected by keySelector and values of TSource
   */
  toObject<TValue>(
    keySelector: (item: TSource) => string,
    valueSelector: (item: TSource) => TValue
  ): Record<string, TValue>;

  /**
   * Creates a Set<T> from an IEnumerable<T>.
   * @example
   * ```typescript
   * const items = [1, 1, 2, 3, 3];
   *
   * const asSet = from(items).asSet(); // Set([1, 2, 3])
   * ```
   * @returns A Set<T> that contains values of type TSource selected from the input sequence.
   */
  toSet(): Set<TSource>;

  /**
   * Returns a string representation of the enumerable.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const asStr = from(items).toString(); // '1,2,3'
   * ```
   * @returns A string representation of the enumerable.
   */
  toString(): string;

  /**
   * Produces the set union of two sequences.
   * @param second One or more Iterable<T> whose distinct elements form the second set for the union.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  union(second: Iterable<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set union of two or more sequences.
   * @param second One or more Iterable<T> whose distinct elements form the second set for the union.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  union(...second: Iterable<TSource>[]): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  union(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  union(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  union(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  unionBy<TKey>(second: Iterable<TSource>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  unionBy<TKey>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
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

  /**
   * Processes a sequence into a series of subsequences representing a windowed subset of the original.
   * If size is greater than source.length, no subsequences will be returned.
   * @param size The size (number of elements) in each window.
   * @returns A series of sequences representing each sliding window subsequence.
   */
  window(size: number): IEnumerable<IEnumerable<TSource>>;

  /**
   * Produces the set union of two sequences.
   * @param second One or more Iterable<T> whose distinct elements form the second set for the union.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xor(second: Iterable<TSource>): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of two or more sequences.
   * @param second One or more Iterable<T> whose distinct elements form the second or more set for the symmetric difference.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xor(...second: Iterable<TSource>[]): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of two sequences using a provided equality comparer.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xor(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of three sequences using a provided equality comparer.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xor(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of four sequences using a provided equality comparer.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
   * @param fourth An Iterable<T> whose distinct elements form the fourth set for the symmetric difference.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xor(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xorBy<TKey>(second: Iterable<TSource>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of three sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xorBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of four sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
   * @param fourth An Iterable<T> whose distinct elements form the fourth set for the symmetric difference.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xorBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of two sequences according to a specified key selector function using a provided equality comparer.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xorBy<TKey>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of three sequences according to a specified key selector function using a provided equality comparer.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xorBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the symmetric difference of four sequences according to a specified key selector function using a provided equality comparer.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose distinct elements form the second set for the symmetric difference.
   * @param third An Iterable<T> whose distinct elements form the third set for the symmetric difference.
   * @param fourth An Iterable<T> whose distinct elements form the fourth set for the symmetric difference.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the symmetric difference from all input sequences, excluding duplicates.
   */
  xorBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces a sequence of tuples with elements from the two specified sequences.
   * @typeparam TSecond The type of the elements of the second input sequence.
   * @param second The second sequence to merge.
   * @returns An IEnumerable<[TSource, TSecond]> that contains merged elements of two input sequences.
   */
  zip<TSecond>(second: Iterable<TSecond>): IEnumerable<[TSource, TSecond]>;

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   * @typeparam TSecond The type of the elements of the second input sequence.
   * @typeparam TResult The type of the elements of the result sequence.
   * @param second The second sequence to merge.
   * @param resultSelector A function that specifies how to merge the elements from the two sequences.
   * @returns An IEnumerable<TResult> that contains merged elements of two input sequences.
   */
  zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (first: TSource, second: TSecond) => TResult
  ): IEnumerable<TResult>;
}

/**
 * Represents a sorted sequence.
 * @typeparam TSource The type of the elements of the sequence.
 */
export interface IOrderedEnumerable<TSource> extends IEnumerable<TSource> {
  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  thenBy<TKey>(keySelector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  thenBy<TKey>(keySelector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  thenByDescending<TKey>(keySelector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  thenByDescending<TKey>(keySelector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;
}

/**
 * Represents a collection of objects that have a common key.
 * @typeparam TKey The type of the key.
 * @typeparam TSource The type of the values.
 */
export interface IGrouping<TKey, TSource> extends IEnumerable<TSource> {
  /**
   * Gets the key of the IGrouping<TKey, TSource>.
   */
  readonly key: TKey;
}

export interface IList<TSource> extends ICollection<TSource> {
  get length(): number;

  add(item: TSource): void;

  addRange(collection: Iterable<TSource>): void;

  clear(): void;

  copyTo(array: TSource[]): void;

  copyTo(array: TSource[], arrayIndex: number): void;

  copyTo(index: number, array: TSource[], arrayIndex: number, count: number): void;

  findIndex(predicate: (item: TSource, index: number) => boolean): number;

  findIndex(startIndex: number, predicate: (item: TSource, index: number) => boolean): number;

  findIndex(startIndex: number, count: number, predicate: (item: TSource, index: number) => boolean): number;

  indexOf(item: TSource): number;

  indexOf(item: TSource, index: number): number;

  indexOf(item: TSource, index: number, count: number): number;

  insert(index: number, item: TSource): void;

  insertRange(index: number, collection: Iterable<TSource>): void;

  remove(item: TSource): boolean;

  removeAll(predicate: (item: TSource, index: number) => boolean): number;

  removeAt(index: number): void;

  removeRange(index: number, count: number): void;

  reverseInPlace(): void;

  reverseInPlace(index: number, count: number): void;

  sort(): void;
}

export interface ICollection<TSource> extends IEnumerable<TSource> {
  get length(): number;

  copyTo(array: TSource[], arrayIndex: number): void;
}
