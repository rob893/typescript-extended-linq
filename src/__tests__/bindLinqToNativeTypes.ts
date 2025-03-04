import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { bindLinqToNativeTypes } from '../functions/bindLinqToNativeType';
import { IEnumerable } from '../types';

const defaultNativeTypes: (new () => Iterable<unknown>)[] = [
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
];

const originals = new Map(defaultNativeTypes.map(ctor => [ctor, { ...ctor.prototype }]));

function resetPrototypesToOriginal(): void {
  for (const ctor of defaultNativeTypes) {
    const originalProto = originals.get(ctor);

    if (!originalProto) {
      throw new Error('Something went wrong and stuff.');
    }

    for (const prop in ctor.prototype) {
      delete ctor.prototype[prop];
    }

    for (const prop in originalProto) {
      ctor.prototype[prop] = originalProto[prop];
    }
  }
}

beforeEach(() => resetPrototypesToOriginal());

describe('bindLinqToNativeTypes', () => {
  it.each([...defaultNativeTypes])('should bind linq functions to type', ctor => {
    bindLinqToNativeTypes({ bindingOptions: { writable: true, configurable: true, enumerable: true } });

    const test: any = new ctor();

    expect(typeof test['where']).toBe('function');
    expect(typeof test['select']).toBe('function');
  });

  it('should invoke where', () => {
    bindLinqToNativeTypes({ bindingOptions: { writable: true, configurable: true, enumerable: true } });

    const res = ([1, 2, 3, 4, 5] as unknown as IEnumerable<number>).where(x => x % 2 === 0).toArray();

    expect(res).toEqual([2, 4]);
  });

  it.each([...defaultNativeTypes])('should not bind non-functions', ctor => {
    (BasicEnumerable.prototype as any)['x'] = 'foo';
    bindLinqToNativeTypes({ bindingOptions: { writable: true, configurable: true, enumerable: true } });

    const hasX = Object.prototype.hasOwnProperty.call(ctor.prototype, 'x');
    delete (BasicEnumerable.prototype as any)['x'];

    expect(hasX).toBeFalsy();
  });

  it.each([...defaultNativeTypes])('should not bind static functions', ctor => {
    (BasicEnumerable as any)['x'] = () => {
      return false;
    };
    bindLinqToNativeTypes({ bindingOptions: { writable: true, configurable: true, enumerable: true } });

    const hasXInstance = Object.prototype.hasOwnProperty.call(ctor.prototype, 'x');
    const hasXStatic = Object.prototype.hasOwnProperty.call(ctor, 'x');
    delete (BasicEnumerable as any)['x'];

    expect(hasXInstance).toBeFalsy();
    expect(hasXStatic).toBeFalsy();
  });

  it('should only bind to Array and Map', () => {
    bindLinqToNativeTypes({
      types: [Array, Map],
      bindingOptions: { writable: true, configurable: true, enumerable: true }
    });

    const arr: any = [];
    const map: any = new Map();
    const set: any = new Set();
    const str: any = '';

    expect(typeof arr['where']).toBe('function');
    expect(typeof map['where']).toBe('function');
    expect(typeof set['where']).toBe('undefined');
    expect(typeof str['where']).toBe('undefined');
  });

  it.each([...defaultNativeTypes])('should not bind select', ctor => {
    bindLinqToNativeTypes({
      functionsToIgnore: ['select'],
      bindingOptions: { writable: true, configurable: true, enumerable: true }
    });

    const test: any = new ctor();

    expect(typeof test['where']).toBe('function');
    expect(typeof test['select']).toBe('undefined');
  });

  it.each([[Array, Number, String, Set], [[], 'asdf', new Map()], [Array, 'asdf', Map], 70, 'asdf'])(
    'should throw due to invalid type arguments',
    (collection: any) => {
      expect(() =>
        bindLinqToNativeTypes({
          types: collection,
          bindingOptions: { writable: true, configurable: true, enumerable: true }
        })
      ).toThrow();
    }
  );

  it.each(['remove', 'clear', 'removeAll', 'insert', 'insertRange'])(
    'should bind all array extensions to array prototype',
    name => {
      bindLinqToNativeTypes({ bindingOptions: { writable: true, configurable: true, enumerable: true } });

      const arr: any = [1, 2, 3];

      expect(typeof arr[name]).toBe('function');
    }
  );

  it('should bind remove array extension to array prototype', () => {
    bindLinqToNativeTypes({ bindingOptions: { writable: true, configurable: true, enumerable: true } });

    const arr: any = [1, 2, 3];

    const res = arr.remove(2);

    expect(typeof arr['remove']).toBe('function');
    expect(res).toBe(true);
    expect(arr).toEqual([1, 3]);
  });
});
