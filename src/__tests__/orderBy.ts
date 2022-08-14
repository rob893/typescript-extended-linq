import { OrderedEnumerable } from '../enumerables/OrderedEnumerable';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('order', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const objects = src([1, 3, 2, 4]);

    const result = enumerable(objects).order();

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id', () => {
    const objects = src([1, 3, 2, 4]);

    const result = enumerable(objects).order();

    expect(result.toArray()).toEqual([1, 2, 3, 4]);
  });
});

describe.each([...getEnumerables()])('order', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const objects = src([1, 3, 2, 4]);

    const result = enumerable(objects).orderDescending();

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id', () => {
    const objects = src([1, 3, 2, 4]);

    const result = enumerable(objects).orderDescending();

    expect(result.toArray()).toEqual([4, 3, 2, 1]);
  });
});

describe.each([...getEnumerables()])('orderBy', (src, enumerable) => {
  it('should return an Enumerable', () => {
    const objects = src([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);

    const result = enumerable(objects).orderBy(x => x.id);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id', () => {
    const objects = src([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);

    const result = enumerable(objects).orderBy(x => x.id);

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);
  });

  it('should return an Enumerable ordered by date', () => {
    const objects = src([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);

    const result = enumerable(objects).orderBy(x => x.bar);

    expect(result.toArray()).toEqual([
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') }
    ]);
  });
});

describe.each([...getEnumerables()])('orderByDescending', (src, enumerable) => {
  it('should return an OrderedEnumerable', () => {
    const objects = src([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);

    const result = enumerable(objects).orderByDescending(x => x.id);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id', () => {
    const objects = src([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);

    const result = enumerable(objects).orderByDescending(x => x.id);

    expect(result.toArray()).toEqual([
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') }
    ]);
  });

  it('should return an Enumerable ordered by date', () => {
    const objects = src([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);

    const result = enumerable(objects).orderByDescending(x => x.bar);

    expect(result.toArray()).toEqual([
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);
  });
});

describe.each([...getEnumerables()])('thenBy', (src, enumerable) => {
  it('should return an OrderedEnumerable', () => {
    const objects = src([
      { id: 1, foo: 'sfoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'foo' }
    ]);

    const result = enumerable(objects)
      .orderBy(x => x.id)
      .thenBy(x => x.foo);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id then by foo', () => {
    const objects = src([
      { id: 1, foo: 'zfoo' },
      { id: 1, foo: 'sfoo' },
      { id: 1, foo: 'afoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'fooz' },
      { id: 4, foo: 'foo' }
    ]);

    const result = enumerable(objects)
      .orderBy(x => x.id)
      .thenBy(x => x.foo)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'afoo' },
      { id: 1, foo: 'sfoo' },
      { id: 1, foo: 'zfoo' },
      { id: 2, foo: 'afoo' },
      { id: 3, foo: 'ffoo' },
      { id: 4, foo: 'foo' },
      { id: 4, foo: 'fooz' }
    ]);
  });

  it('should return an Enumerable ordered by id then by foo then by bar', () => {
    const objects = src([
      { id: 1, foo: 'zfoo', bar: new Date('8/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('9/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 4, foo: 'foo', bar: new Date('1/1/2000') }
    ]);

    const result = enumerable(objects)
      .orderBy(x => x.id)
      .thenBy(x => x.foo)
      .thenBy(x => x.bar)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('9/1/2021') },
      { id: 1, foo: 'zfoo', bar: new Date('8/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 4, foo: 'foo', bar: new Date('1/1/2000') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);
  });
});

describe.each([...getEnumerables()])('thenByDescending', (src, enumerable) => {
  it('should return an OrderedEnumerable', () => {
    const objects = src([
      { id: 1, foo: 'sfoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'foo' }
    ]);

    const result = enumerable(objects)
      .orderBy(x => x.id)
      .thenByDescending(x => x.foo);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id then by foo', () => {
    const objects = src([
      { id: 1, foo: 'zfoo' },
      { id: 1, foo: 'sfoo' },
      { id: 1, foo: 'afoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'fooz' },
      { id: 4, foo: 'foo' }
    ]);

    const result = enumerable(objects)
      .orderBy(x => x.id)
      .thenByDescending(x => x.foo)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'zfoo' },
      { id: 1, foo: 'sfoo' },
      { id: 1, foo: 'afoo' },
      { id: 2, foo: 'afoo' },
      { id: 3, foo: 'ffoo' },
      { id: 4, foo: 'fooz' },
      { id: 4, foo: 'foo' }
    ]);
  });

  it('should return an Enumerable ordered by id then by foo then by bar', () => {
    const objects = src([
      { id: 1, foo: 'zfoo', bar: new Date('8/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('9/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 4, foo: 'foo', bar: new Date('1/1/2000') }
    ]);

    const result = enumerable(objects)
      .orderBy(x => x.id)
      .thenByDescending(x => x.foo)
      .thenByDescending(x => x.bar)
      .toArray();

    expect(result).toEqual([
      { id: 1, foo: 'zfoo', bar: new Date('8/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('9/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 4, foo: 'foo', bar: new Date('1/1/2000') }
    ]);
  });
});
