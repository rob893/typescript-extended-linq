import { Enumerable } from '../Enumerable';

describe('complex', () => {
  it('should allow for multiple statements', () => {
    const items = [
      { id: 1, foo: 'a', bar: new Date('8/1/2021') },
      { id: 2, foo: 'a', bar: new Date('8/1/2021') },
      { id: 2, foo: 'b', bar: new Date('8/1/2021') },
      { id: 2, foo: 'a', bar: new Date('9/1/2021') },
      { id: 3, foo: 'a', bar: new Date('8/1/2021') },
      { id: 3, foo: 'b', bar: new Date('8/1/2021') }
    ];

    let iterationCounter = 0;
    const mock = jest.fn(function* (): Generator<{ id: number; foo: string; bar: Date }> {
      for (let i = 0; i < items.length; i++) {
        iterationCounter++;
        yield items[i];
      }
    });

    const query = new Enumerable(mock)
      .where(item => item.id % 2 === 0)
      .orderBy(item => item.id)
      .thenBy(item => item.foo)
      .thenBy(item => item.bar);

    expect(mock).toBeCalledTimes(0);
    expect(iterationCounter).toBe(0);

    const asArray = query.toArray();

    expect(mock).toBeCalledTimes(1);
    expect(iterationCounter).toBe(6);
    expect(asArray).toEqual([
      { id: 2, foo: 'a', bar: new Date('2021-08-01T07:00:00.000Z') },
      { id: 2, foo: 'a', bar: new Date('2021-09-01T07:00:00.000Z') },
      { id: 2, foo: 'b', bar: new Date('2021-08-01T07:00:00.000Z') }
    ]);
  });
});
