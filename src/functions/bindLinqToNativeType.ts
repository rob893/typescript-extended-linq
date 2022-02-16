import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { from } from './from';

export function bindLinqToNativeTypes(
  types: (new () => Iterable<unknown>)[] = [
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
  ]
): void {
  const enumProps = BasicEnumerable.prototype;
  const protos = types.map(t => t.prototype);

  const enumPropNames = Object.getOwnPropertyNames(enumProps);

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
