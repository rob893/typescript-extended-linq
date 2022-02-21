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
    bindLinqToNativeTypes();

    const test: any = new ctor();

    expect(typeof test['where']).toBe('function');
    expect(typeof test['select']).toBe('function');
  });

  it('should invoke where', () => {
    bindLinqToNativeTypes();

    const res = ([1, 2, 3, 4, 5] as unknown as IEnumerable<number>).where(x => x % 2 === 0).toArray();

    expect(res).toEqual([2, 4]);
  });

  it('should only bind to Array and Map', () => {
    bindLinqToNativeTypes({ types: [Array, Map] });

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
    bindLinqToNativeTypes({ functionsToIgnore: ['select'] });

    const test: any = new ctor();

    expect(typeof test['where']).toBe('function');
    expect(typeof test['select']).toBe('undefined');
  });

  it.each([[Array, Number, String, Set], [[], 'asdf', new Map()], [Array, 'asdf', Map], 70, 'asdf'])(
    'should throw due to invalid type arguments',
    (collection: any) => {
      expect(() => bindLinqToNativeTypes({ types: collection })).toThrow();
    }
  );
});
