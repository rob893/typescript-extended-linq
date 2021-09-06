import { from, OrderedEnumerable } from '..';

describe('orderBy', () => {
  it('should return an Enumerable', () => {
    const objects = [
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ];

    const result = from(objects).orderBy(x => x.id);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id', () => {
    const objects = [
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ];

    const result = from(objects).orderBy(x => x.id);

    expect(result.toArray()).toEqual([
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);
  });

  it('should return an Enumerable ordered by date', () => {
    const objects = [
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ];

    const result = from(objects).orderBy(x => x.bar);

    expect(result.toArray()).toEqual([
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') }
    ]);
  });
});

describe('orderByDescending', () => {
  it('should return an OrderedEnumerable', () => {
    const objects = [
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ];

    const result = from(objects).orderByDescending(x => x.id);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id', () => {
    const objects = [
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ];

    const result = from(objects).orderByDescending(x => x.id);

    expect(result.toArray()).toEqual([
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') }
    ]);
  });

  it('should return an Enumerable ordered by date', () => {
    const objects = [
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ];

    const result = from(objects).orderByDescending(x => x.bar);

    expect(result.toArray()).toEqual([
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') }
    ]);
  });
});

describe('thenBy', () => {
  it('should return an OrderedEnumerable', () => {
    const objects = [
      { id: 1, foo: 'sfoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'foo' }
    ];

    const result = from(objects)
      .orderBy(x => x.id)
      .thenBy(x => x.foo);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id then by foo', () => {
    const objects = [
      { id: 1, foo: 'zfoo' },
      { id: 1, foo: 'sfoo' },
      { id: 1, foo: 'afoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'fooz' },
      { id: 4, foo: 'foo' }
    ];

    const result = from(objects)
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
    const objects = [
      { id: 1, foo: 'zfoo', bar: new Date('8/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('9/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 4, foo: 'foo', bar: new Date('1/1/2000') }
    ];

    const result = from(objects)
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

describe('thenByDescending', () => {
  it('should return an OrderedEnumerable', () => {
    const objects = [
      { id: 1, foo: 'sfoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'foo' }
    ];

    const result = from(objects)
      .orderBy(x => x.id)
      .thenByDescending(x => x.foo);

    expect(result).toBeInstanceOf(OrderedEnumerable);
  });

  it('should return an Enumerable ordered by id then by foo', () => {
    const objects = [
      { id: 1, foo: 'zfoo' },
      { id: 1, foo: 'sfoo' },
      { id: 1, foo: 'afoo' },
      { id: 3, foo: 'ffoo' },
      { id: 2, foo: 'afoo' },
      { id: 4, foo: 'fooz' },
      { id: 4, foo: 'foo' }
    ];

    const result = from(objects)
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
    const objects = [
      { id: 1, foo: 'zfoo', bar: new Date('8/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('9/1/2021') },
      { id: 1, foo: 'sfoo', bar: new Date('8/1/2021') },
      { id: 3, foo: 'ffoo', bar: new Date('6/1/2021') },
      { id: 2, foo: 'afoo', bar: new Date('8/1/2051') },
      { id: 4, foo: 'foo', bar: new Date('8/1/2000') },
      { id: 4, foo: 'foo', bar: new Date('1/1/2000') }
    ];

    const result = from(objects)
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
