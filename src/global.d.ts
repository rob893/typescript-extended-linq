/* eslint-disable */
//@ts-nocheck
import { IEnumerable } from './types';

const iterator = Symbol(Symbol.iterator);

declare global {
  interface Array<T> extends Omit<IEnumerable<T>, 'forEach' | 'toString' | iterator> {}
  interface Map<K, V> extends Omit<IEnumerable<[K, V]>, 'forEach' | iterator> {}
  interface Set<T> extends Omit<IEnumerable<T>, 'forEach' | iterator> {}
  interface String extends Omit<IEnumerable<string>, 'endsWith' | 'startsWith' | 'split' | 'toString' | iterator> {}
}
