import { aggregate } from '../functions/aggregate';
import { all } from '../functions/all';
import { any } from '../functions/any';
import { applyAppend } from '../functions/applicators/applyAppend';
import { applyAsEnumerable } from '../functions/applicators/applyAsEnumerable';
import { applyChunk } from '../functions/applicators/applyChunk';
import { applyConcat } from '../functions/applicators/applyConcat';
import { applyDefaultIfEmpty } from '../functions/applicators/applyDefaultIfEmpty';
import { applyDistinct } from '../functions/applicators/applyDistinct';
import { applyExcept } from '../functions/applicators/applyExcept';
import { applyFullJoinHeterogeneous, applyFullJoinHomogeneous } from '../functions/applicators/applyFullJoin';
import { applyGroupBy } from '../functions/applicators/applyGroupBy';
import { applyGroupJoin } from '../functions/applicators/applyGroupJoin';
import { applyIntersect } from '../functions/applicators/applyIntersect';
import { applyJoin } from '../functions/applicators/applyJoin';
import { applyLeftJoinHeterogeneous, applyLeftJoinHomogeneous } from '../functions/applicators/applyLeftJoin';
import { applyMax } from '../functions/applicators/applyMax';
import { applyMin } from '../functions/applicators/applyMin';
import { applyOfType } from '../functions/applicators/applyOfType';
import { applyOrderBy } from '../functions/applicators/applyOrderBy';
import { applyPipe } from '../functions/applicators/applyPipe';
import { applyPrepend } from '../functions/applicators/applyPrepend';
import { applyQuantile } from '../functions/applicators/applyQuantile';
import { applyReverse } from '../functions/applicators/applyReverse';
import { applyRightJoinHeterogeneous, applyRightJoinHomogeneous } from '../functions/applicators/applyRightJoin';
import { applySelect, applySelectMany } from '../functions/applicators/applySelect';
import { applyShuffle } from '../functions/applicators/applyShuffle';
import { applySkip, applySkipLast, applySkipWhile } from '../functions/applicators/applySkip';
import { applyTake, applyTakeEvery, applyTakeLast, applyTakeWhile } from '../functions/applicators/applyTake';
import { applyUnion } from '../functions/applicators/applyUnion';
import { applyWhere } from '../functions/applicators/applyWhere';
import { applyZip } from '../functions/applicators/applyZip';
import { atLeast } from '../functions/atLeast';
import { atMost } from '../functions/atMost';
import { average } from '../functions/average';
import { contains } from '../functions/contains';
import { count } from '../functions/count';
import { elementAt, elementAtOrDefault } from '../functions/elementAt';
import { endsWith } from '../functions/endsWith';
import { first, firstOrDefault } from '../functions/first';
import { forEach } from '../functions/forEach';
import { last, lastOrDefault } from '../functions/last';
import { sequenceEqual } from '../functions/sequenceEqual';
import { single, singleOrDefault } from '../functions/single';
import { startsWith } from '../functions/startsWith';
import { sum } from '../functions/sum';
import { to } from '../functions/to';
import { toArray } from '../functions/toArray';
import { toMap } from '../functions/toMap';
import { toObject } from '../functions/toObject';
import { toSet } from '../functions/toSet';
import { Comparer, EqualityComparer, IEnumerable, IGrouping, IOrderedEnumerable, IEnumerableFactory } from '../types';

/**
 * Class that exposes an iterator, which supports a simple iteration and various methods.
 * This class will not include documentation or overloads (the interface has those).
 * @see {@link IEnumerable} For function documentation and overloads.
 * @typeparam TSource The type of elements in the Enumerable.
 */
export class BasicEnumerable<TSource> implements IEnumerable<TSource> {
  protected readonly factory: IEnumerableFactory;

  private readonly srcGenerator: () => Generator<TSource>;

  public constructor(factory: IEnumerableFactory, srcGenerator: () => Generator<TSource>) {
    this.factory = factory;
    this.srcGenerator = srcGenerator;
  }

  public [Symbol.iterator](): Generator<TSource> {
    return this.srcGenerator();
  }

  public aggregate<TAccumulate, TResult>(
    seedOrAggregator:
      | (TAccumulate | TSource)
      | ((prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource),
    aggregator?: (prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource,
    resultSelector?: (accumulated: TAccumulate) => TResult
  ): TAccumulate | TSource | TResult {
    return aggregate(this, seedOrAggregator, aggregator, resultSelector);
  }

  public all(condition: (item: TSource, index: number) => boolean): boolean {
    return all(this, condition);
  }

  public any(condition?: (item: TSource, index: number) => boolean): boolean {
    return any(this, condition);
  }

  public append(item: TSource): IEnumerable<TSource> {
    return applyAppend(this.factory, this, item);
  }

  public asEnumerable(): IEnumerable<TSource> {
    return applyAsEnumerable(this.factory, this);
  }

  public atLeast(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atLeast(this, count, predicate);
  }

  public atMost(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atMost(this, count, predicate);
  }

  public average(selector?: (item: TSource) => number): number {
    return average(this, selector);
  }

  public chunk(chunkSize: number): IEnumerable<IEnumerable<TSource>> {
    return applyChunk(this.factory, this, chunkSize);
  }

  public concat(second: Iterable<TSource>): IEnumerable<TSource> {
    return applyConcat(this.factory, this, second);
  }

  public contains(value: TSource, equalityComparer?: EqualityComparer<TSource>): boolean {
    return contains(this, value, equalityComparer);
  }

  public count(condition?: (item: TSource, index: number) => boolean): number {
    return count(this, condition);
  }

  public defaultIfEmpty(defaultItem: TSource): IEnumerable<TSource> {
    return applyDefaultIfEmpty(this.factory, this, defaultItem);
  }

  public distinct(equalityComparer?: EqualityComparer<TSource>): IEnumerable<TSource> {
    return applyDistinct(this.factory, this, x => x, equalityComparer);
  }

  public distinctBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return applyDistinct(this.factory, this, keySelector, equalityComparer);
  }

  public elementAt(index: number): TSource {
    return elementAt(this, index);
  }

  public elementAtOrDefault(index: number): TSource | null {
    return elementAtOrDefault(this, index);
  }

  public endsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return endsWith(this, second, equalityComparer);
  }

  public except(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): IEnumerable<TSource> {
    return applyExcept(this.factory, this, second, x => x, equalityComparer);
  }

  public exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return applyExcept(this.factory, this, second, keySelector, equalityComparer);
  }

  public first(condition?: (item: TSource, index: number) => boolean): TSource {
    return first(this, condition);
  }

  public firstOrDefault(condition?: (item: TSource, index: number) => boolean): TSource | null {
    return firstOrDefault(this, condition);
  }

  public forEach(callback: (item: TSource, index: number) => void): void {
    forEach(this, callback);
  }

  public fullJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyFullJoinHeterogeneous(
      this.factory,
      this,
      second,
      firstKeySelector,
      secondKeySelector,
      firstSelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  public fullJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyFullJoinHomogeneous(
      this.factory,
      this,
      second,
      keySelector,
      firstSelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  public groupBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<IGrouping<TKey, TSource>> {
    return applyGroupBy(this.factory, this, keySelector, equalityComparer);
  }

  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: IEnumerable<TInner>) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyGroupJoin(
      this.factory,
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      equalityComparer
    );
  }

  public intersect(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): IEnumerable<TSource> {
    return applyIntersect(this.factory, this, second, x => x, equalityComparer);
  }

  public intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return applyIntersect(this.factory, this, second, keySelector, equalityComparer);
  }

  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyJoin(this.factory, this, inner, outerKeySelector, innerKeySelector, resultSelector, equalityComparer);
  }

  public last(predicate?: (item: TSource, index: number) => boolean): TSource {
    return last(this, predicate);
  }

  public lastOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    return lastOrDefault(this, predicate);
  }

  public leftJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyLeftJoinHeterogeneous(
      this.factory,
      this,
      second,
      firstKeySelector,
      secondKeySelector,
      firstSelector,
      bothSelector,
      equalityComparer
    );
  }

  public leftJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyLeftJoinHomogeneous(
      this.factory,
      this,
      second,
      keySelector,
      firstSelector,
      bothSelector,
      equalityComparer
    );
  }

  public max<TResult>(selector?: (item: TSource) => TResult): TSource | TResult {
    return applyMax(this.factory, this, x => x, selector);
  }

  public maxBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return applyMax(this.factory, this, keySelector);
  }

  public min<TResult>(selector?: (item: TSource) => TResult): TSource | TResult {
    return applyMin(this.factory, this, x => x, selector);
  }

  public minBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return applyMin(this.factory, this, keySelector);
  }

  public ofType<TResult>(type: new (...params: unknown[]) => TResult): IEnumerable<TResult> {
    return applyOfType(this.factory, this, type) as IEnumerable<TResult>;
  }

  public orderBy<TKey>(selector: (item: TSource) => TKey, comparer?: Comparer<TKey>): IOrderedEnumerable<TSource> {
    return applyOrderBy(this.factory, this, true, selector, comparer);
  }

  public orderByDescending<TKey>(
    selector: (item: TSource) => TKey,
    comparer?: Comparer<TKey>
  ): IOrderedEnumerable<TSource> {
    return applyOrderBy(this.factory, this, false, selector, comparer);
  }

  public pipe(action: (item: TSource, index: number) => void): IEnumerable<TSource> {
    return applyPipe(this.factory, this, action);
  }

  public prepend(item: TSource): IEnumerable<TSource> {
    return applyPrepend(this.factory, this, item);
  }

  public quantile(selector: (item: TSource) => number, q: number): number {
    return applyQuantile(this.factory, this, selector, q);
  }

  public reverse(): IEnumerable<TSource> {
    return applyReverse(this.factory, this);
  }

  public rightJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyRightJoinHeterogeneous(
      this.factory,
      this,
      second,
      firstKeySelector,
      secondKeySelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  public rightJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyRightJoinHomogeneous(
      this.factory,
      this,
      second,
      keySelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  public select<TResult>(exp: (item: TSource, index: number) => TResult): IEnumerable<TResult> {
    return applySelect(this.factory, this, exp);
  }

  public selectMany<TResult>(exp: (item: TSource, index: number) => Iterable<TResult>): IEnumerable<TResult> {
    return applySelectMany(this.factory, this, exp);
  }

  public sequenceEqual(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return sequenceEqual(this, second, equalityComparer);
  }

  public shuffle(): IEnumerable<TSource> {
    return applyShuffle(this.factory, this);
  }

  public single(predicate?: (item: TSource, index: number) => boolean): TSource {
    return single(this, predicate);
  }

  public singleOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    return singleOrDefault(this, predicate);
  }

  public skip(count: number): IEnumerable<TSource> {
    return applySkip(this.factory, this, count);
  }

  public skipLast(count: number): IEnumerable<TSource> {
    return applySkipLast(this.factory, this, count);
  }

  public skipWhile(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource> {
    return applySkipWhile(this.factory, this, predicate);
  }

  public startsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return startsWith(this, second, equalityComparer);
  }

  public sum(selector?: (item: TSource) => number): number {
    return sum(this, selector);
  }

  public take(count: number): IEnumerable<TSource> {
    return applyTake(this.factory, this, count);
  }

  public takeEvery(step: number): IEnumerable<TSource> {
    return applyTakeEvery(this.factory, this, step);
  }

  public takeLast(count: number): IEnumerable<TSource> {
    return applyTakeLast(this.factory, this, count);
  }

  public takeWhile(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource> {
    return applyTakeWhile(this.factory, this, predicate);
  }

  public to<TResult>(ctor: new (src: Iterable<TSource>) => TResult): TResult {
    return to(this, ctor);
  }

  public toArray(): TSource[] {
    return toArray(this);
  }

  /**
   * @deprecated Not yet implemented. Do not use.
   */
  public toLookup(): unknown {
    throw new Error('Not yet implemented');
  }

  public toMap<TKey, TValue>(
    keySelector: (item: TSource) => TKey,
    valueSelector?: (item: TSource) => TValue
  ): Map<TKey, TSource | TValue> {
    return toMap(this, keySelector, valueSelector);
  }

  public toObject<TValue>(
    keySelector: (item: TSource) => string,
    valueSelector?: (item: TSource) => TValue
  ): Record<string, TSource | TValue> {
    return toObject(this, keySelector, valueSelector);
  }

  public toSet(): Set<TSource> {
    return toSet(this);
  }

  public union(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): IEnumerable<TSource> {
    return applyUnion(this.factory, this, second, x => x, equalityComparer);
  }

  public unionBy<TKey>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return applyUnion(this.factory, this, second, keySelector, equalityComparer);
  }

  public where(exp: (item: TSource, index: number) => boolean): IEnumerable<TSource> {
    return applyWhere(this.factory, this, exp);
  }

  public zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector?: (first: TSource, second: TSecond) => TResult
  ): IEnumerable<[TSource, TSecond] | TResult> {
    return applyZip(this.factory, this, second, resultSelector);
  }
}
