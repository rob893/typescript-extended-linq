import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { from } from './from';

export function bindLinqToNativeTypes(options?: {
  types?: (new () => Iterable<unknown>)[];
  functionsToIgnore?: (keyof BasicEnumerable<unknown>)[];
}): void {
  const {
    types = [
      Array,
      Int8Array,
      Int16Array,
      Int32Array,
      Uint8ClampedArray,
      Uint16Array,
      Uint32Array,
      Float32Array,
      Float64Array,
      Set,
      Map,
      String
    ] as (new () => Iterable<unknown>)[],
    functionsToIgnore = []
  } = options ?? {};
  for (const type of types) {
    const test = new type();

    if (!(Symbol.iterator in test)) {
      throw new TypeError(`Unsuppoted type: ${type.name}. Types must have Symbol.iterator.`);
    }
  }

  const alwaysIgnore: (keyof BasicEnumerable<unknown>)[] = ['toJSON', 'toString'];
  const ignore = new Set<keyof BasicEnumerable<unknown>>([...alwaysIgnore, ...functionsToIgnore]);
  const enumProps = BasicEnumerable.prototype;
  const protos = types.map(t => t.prototype);

  const enumPropNames = Object.getOwnPropertyNames(enumProps).filter(
    name => !ignore.has(name as keyof BasicEnumerable<unknown>)
  );

  for (const proto of protos) {
    for (const prop of enumPropNames) {
      if (proto[prop] === undefined) {
        proto[prop] = function (...params: any[]) {
          return (from(this) as any)[prop](...params);
        };
      }
    }
  }
}
