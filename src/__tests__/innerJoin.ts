import { innerJoin } from '../functions/innerJoin';
import { BasicEnumerable } from '../enumerables/BasicEnumerable';
import { getEnumerables } from '../__test-utilities__/utilities';

describe.each([...getEnumerables()])('join', (src, enumerable) => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', collection => {
    const result = innerJoin<unknown, unknown, unknown, unknown>(
      collection,
      [],
      x => x,
      x => x,
      (x, y) => null
    );

    expect(result).toBeInstanceOf(BasicEnumerable);
  });

  it('should join the two sequences on the selected key', () => {
    type Person = { name: string };
    type Pet = { name: string; owner: Person };

    const magnus: Person = { name: 'Magnus' };
    const terry: Person = { name: 'Terry' };
    const adam: Person = { name: 'Adam' };
    const john: Person = { name: 'John' };

    const barley: Pet = { name: 'Barley', owner: terry };
    const boots: Pet = { name: 'Boots', owner: terry };
    const whiskers: Pet = { name: 'Whiskers', owner: adam };
    const daisy: Pet = { name: 'Daisy', owner: magnus };
    const scratchy: Pet = { name: 'Scratchy', owner: { name: 'Bob' } };

    const people = enumerable(src([magnus, terry, adam, john]));
    const pets = enumerable(src([barley, boots, whiskers, daisy, scratchy]));

    const result = people
      .innerJoin(
        pets,
        person => person,
        pet => pet.owner,
        (person, pet) => ({ ownerName: person.name, pet: pet.name })
      )
      .toArray();

    expect(result).toEqual([
      { ownerName: 'Magnus', pet: 'Daisy' },
      { ownerName: 'Terry', pet: 'Barley' },
      { ownerName: 'Terry', pet: 'Boots' },
      { ownerName: 'Adam', pet: 'Whiskers' }
    ]);
  });

  it('should join the two sequences on the selected key using equality comparer', () => {
    type Person = { name: string };
    type Pet = { name: string; owner: Person };

    const magnus: Person = { name: 'Magnus' };
    const terry: Person = { name: 'Terry' };
    const adam: Person = { name: 'Adam' };
    const john: Person = { name: 'John' };

    const barley: Pet = { name: 'Barley', owner: terry };
    const boots: Pet = { name: 'Boots', owner: terry };
    const whiskers: Pet = { name: 'Whiskers', owner: adam };
    const daisy: Pet = { name: 'Daisy', owner: magnus };
    const scratchy: Pet = { name: 'Scratchy', owner: { name: 'Bob' } };

    const people = enumerable(src([magnus, terry, adam, john]));
    const pets = enumerable(src([barley, boots, whiskers, daisy, scratchy]));

    const result = people
      .innerJoin(
        pets,
        person => person,
        pet => pet.owner,
        (person, pet) => ({ ownerName: person.name, pet: pet.name }),
        (personA, personB) => personA.name === personB.name
      )
      .toArray();

    expect(result).toEqual([
      { ownerName: 'Magnus', pet: 'Daisy' },
      { ownerName: 'Terry', pet: 'Barley' },
      { ownerName: 'Terry', pet: 'Boots' },
      { ownerName: 'Adam', pet: 'Whiskers' }
    ]);
  });
});
