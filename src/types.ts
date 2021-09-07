export type EqualityComparer<T> = (a: T, b: T) => boolean;

export type Comparer<T> = (a: T, b: T) => number;

export type TypeOfMember = 'string' | 'number' | 'boolean' | 'bigint' | 'function' | 'object' | 'symbol' | 'undefined';
