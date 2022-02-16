import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { from } from './from';

export function bindLinqToNativeTypes(): void {
  const enumProps = BasicEnumerable.prototype;
  const protos = [
    Array.prototype,
    Int8Array.prototype,
    Int16Array.prototype,
    Int32Array.prototype,
    Uint8ClampedArray.prototype,
    Uint16Array.prototype,
    Uint32Array.prototype,
    Float32Array.prototype,
    Float64Array.prototype,
    Set.prototype,
    Map.prototype,
    String.prototype
  ];

  const enumPropNames = Object.getOwnPropertyNames(enumProps);

  for (const proto of protos) {
    for (const prop of enumPropNames) {
      if ((proto as any)[prop] === undefined) {
        (proto as any)[prop as any] = function (...params: any[]) {
          return (from(this) as any)[prop as any](...params);
        };
      }
    }
  }
}
