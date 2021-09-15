import { BasicEnumerable, from } from '..';

describe('groupBy', () => {
  it('should return an Enumerable', () => {
    const items = [{ id: 1, foo: 'asdf' }];
    const result = from(items).groupBy(x => x.id);

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should group items based on selected key', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];
    const result = from(items)
      .groupBy(x => x.id)
      .select(group => ({ key: group.key, group: group.toArray() }))
      .toArray();

    expect(result).toEqual([
      {
        key: 1,
        group: [
          { id: 1, foo: 'asdf' },
          { id: 1, foo: 'asdf' }
        ]
      },
      {
        key: 2,
        group: [
          { id: 2, foo: 'asdf' },
          { id: 2, foo: 'asdf' }
        ]
      },
      {
        key: 3,
        group: [{ id: 3, foo: 'asdf' }]
      }
    ]);
  });

  it('should group items based on selected key and passed comparer', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 1, foo: 'asdfz' },
      { id: 2, foo: 'asqf' },
      { id: 2, foo: 'asdfv' },
      { id: 3, foo: 'asd' }
    ];
    const result = from(items)
      .groupBy(
        x => x.foo,
        (a, b) => a.length === b.length
      )
      .select(group => ({ key: group.key, group: group.toArray() }))
      .toArray();

    expect(result).toEqual([
      {
        key: 'asdf',
        group: [
          { id: 1, foo: 'asdf' },
          { id: 2, foo: 'asqf' }
        ]
      },
      {
        key: 'asdfz',
        group: [
          { id: 1, foo: 'asdfz' },
          { id: 2, foo: 'asdfv' }
        ]
      },
      {
        key: 'asd',
        group: [{ id: 3, foo: 'asd' }]
      }
    ]);
  });
});
