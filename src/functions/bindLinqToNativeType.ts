import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { ArrayExtensions } from '../extensions/ArrayExtensions';
import { from } from './from';

export function bindLinqToNativeTypes(options?: {
  types?: (new () => Iterable<unknown>)[];
  functionsToIgnore?: (keyof BasicEnumerable<unknown>)[];
  bindingOptions?: { writable?: boolean; configurable?: boolean; enumerable?: boolean };
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
    functionsToIgnore = [],
    bindingOptions: { writable = false, configurable = false, enumerable = false } = {
      writable: false,
      configurable: false,
      enumerable: false
    }
  } = options ?? {};

  const descriptor = {
    writable,
    configurable,
    enumerable
  };

  for (const type of types) {
    let test: Iterable<unknown>;

    try {
      test = new type();
    } catch {
      throw new TypeError(`Unsupported type: ${type.name}. All types must support the 'new' keyword.`);
    }

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
      if (!Object.prototype.hasOwnProperty.call(proto, prop)) {
        Object.defineProperty(proto, prop, {
          value: function (...params: unknown[]) {
            return (from(this) as any)[prop](...params);
          },
          ...descriptor
        });
      }
    }
  }

  const arrayExtensionPropNames = Object.getOwnPropertyNames(ArrayExtensions);

  for (const prop of arrayExtensionPropNames) {
    if (
      !Object.hasOwnProperty.call(Array.prototype, prop) &&
      !Object.prototype.hasOwnProperty.call(Array.prototype, prop)
    ) {
      Object.defineProperty(Array.prototype, prop, {
        value: function (...params: unknown[]) {
          return (ArrayExtensions as any)[prop](this, ...params);
        },
        ...descriptor
      });
    }
  }
}
