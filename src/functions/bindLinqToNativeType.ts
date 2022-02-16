import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { from } from './from';

export function bindLinqToNativeTypes(): void {
  const enumProps = BasicEnumerable.prototype;
  const protos = [Array.prototype, Set.prototype, Map.prototype, String.prototype];

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
