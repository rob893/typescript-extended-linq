import { allBenchmark } from './all';
import { anyBenchmark } from './any';
import { whereBenchmark } from './where';
import { complexBenchmark } from './complex';
import { countBenchmark } from './count';
import { selectBenchmark } from './select';
import { sumBenchmark } from './sum';
import { listBenchmark } from './list';
import { queueBenchmark } from './queue';
import { xorBenchmark } from './xor';
import { IEnumerable } from '../types';
import { ArrayEnumerable } from '../enumerables/ArrayEnumerable';
import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { from } from '../functions/from';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Array<T> extends Omit<IEnumerable<T>, 'forEach' | 'toString' | 'any'> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Map<K, V> extends Omit<IEnumerable<[K, V]>, 'forEach' | 'toString' | 'any'> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Set<T> extends Omit<IEnumerable<T>, 'forEach' | 'toString' | 'any'> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface String extends Omit<IEnumerable<string>, 'forEach' | 'toString' | 'any'> {}
}

const arrEnumProps = ArrayEnumerable.prototype;
const enumProps = BasicEnumerable.prototype;
const arrProps = Array.prototype;
const nativeProps = new Set(Object.getOwnPropertyNames(arrProps));
const protos = [
  [Array.prototype, Array.name],
  [Map.prototype, Map.name],
  [Set.prototype, Set.name],
  [String.prototype, String.name]
];
const nativeProtos = new Set(protos.map(([p]) => Object.getOwnPropertyNames(p)).flat());

const enumPropNames = Object.getOwnPropertyNames(enumProps);
const arrEnumPropNames = Object.getOwnPropertyNames(arrEnumProps);

for (const [proto, protoName] of protos) {
  for (const prop of enumPropNames) {
    if (!nativeProtos.has(prop)) {
      (proto as any)[prop as any] = function (...params: any[]) {
        return (from(this) as any)[prop as any](...params);
      };
    } else {
      console.log(`${prop} is a collision on ${protoName}!!!`);
    }
  }
}

// declare global {
//   interface Array<T> {
//     where(predicate: (item: T) => boolean): IEnumerable<T>;
//     // take(amount: number): Array<T>;
//   }
// }

// const arrProto = Array.prototype;

// arrProto.where = function <T>(predicate: (item: T) => boolean): IEnumerable<T> {
//   return from(this as unknown as T[]).where(predicate);
// };

//arrProto.slice;

console.log(
  [1, 2, 3]
    .pipe(x => console.log(x))
    .where(e => e % 2 === 1)
    .take(1)
    .toArray()
);

console.log(
  new Map([
    [1, 'a'],
    [2, 'b']
  ])
    .where(([k, v]) => k === 2)
    .select(([_, v]) => v)
    .toArray()
);
// const args = process.argv.slice(2);

// if (args.length === 0) {
//   throw new Error('Benchmark name must be passed.');
// }

// const benchmark = args[0];

// switch (benchmark.toLowerCase()) {
//   case 'any':
//     anyBenchmark();
//     break;
//   case 'all':
//     allBenchmark();
//     break;
//   case 'where':
//     whereBenchmark();
//     break;
//   case 'complex':
//     complexBenchmark();
//     break;
//   case 'count':
//     countBenchmark();
//     break;
//   case 'select':
//     selectBenchmark();
//     break;
//   case 'sum':
//     sumBenchmark();
//     break;
//   case 'list':
//     listBenchmark();
//     break;
//   case 'queue':
//     queueBenchmark();
//     break;
//   case 'xor':
//     xorBenchmark();
//     break;
//   default:
//     throw new Error(`${benchmark} is not a valid benchmark name.`);
// }
