import { Enumerable } from '../enumerables';
import { from } from '../functions/from';

describe('leftJoinHeterogeneous', () => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', src => {
    const result = from(src).leftJoinHeterogeneous<unknown, unknown, unknown>(
      [],
      x => x,
      x => x,
      x => x,
      (x, y) => null
    );

    expect(result).toBeInstanceOf(Enumerable);
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

    const people = from([magnus, terry, adam, john]);
    const pets = from([barley, boots, whiskers, daisy, scratchy]);

    const result = people
      .leftJoinHeterogeneous<Pet, Person, { ownerName: string; pet: string | null }>(
        pets,
        person => person,
        pet => pet.owner,
        person => ({ ownerName: person.name, pet: null }),
        (person, pet) => ({ ownerName: person.name, pet: pet.name })
      )
      .toArray();

    expect(result).toEqual([
      { ownerName: 'Magnus', pet: 'Daisy' },
      { ownerName: 'Terry', pet: 'Barley' },
      { ownerName: 'Terry', pet: 'Boots' },
      { ownerName: 'Adam', pet: 'Whiskers' },
      { ownerName: 'John', pet: null }
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

    const people = from([magnus, terry, adam, john]);
    const pets = from([barley, boots, whiskers, daisy, scratchy]);

    const result = people
      .leftJoinHeterogeneous<Pet, Person, { ownerName: string; pet: string | null }>(
        pets,
        person => person,
        pet => pet.owner,
        person => ({ ownerName: person.name, pet: null }),
        (person, pet) => ({ ownerName: person.name, pet: pet.name }),
        (personKey, petKey) => personKey.name === petKey.name
      )
      .toArray();

    expect(result).toEqual([
      { ownerName: 'Magnus', pet: 'Daisy' },
      { ownerName: 'Terry', pet: 'Barley' },
      { ownerName: 'Terry', pet: 'Boots' },
      { ownerName: 'Adam', pet: 'Whiskers' },
      { ownerName: 'John', pet: null }
    ]);
  });
});

describe('leftJoinHomogeneous', () => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', src => {
    const result = from(src).leftJoinHomogeneous<unknown, unknown>(
      [],
      x => x,
      x => x,
      (x, y) => null
    );

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should join the two sequences on the selected key', () => {
    type Person = { id: number; name: string };

    const magnus: Person = { id: 1, name: 'Magnus' };
    const terry1: Person = { id: 2, name: 'Terry' };
    const adam: Person = { id: 3, name: 'Adam' };
    const john1: Person = { id: 4, name: 'John' };

    const john2: Person = { id: 5, name: 'John' };
    const jane: Person = { id: 6, name: 'Jane' };
    const terry2: Person = { id: 7, name: 'Terry' };
    const john3: Person = { id: 8, name: 'John' };

    const people1 = from([magnus, terry1, adam, john1]);
    const people2 = from([john2, jane, terry2, john3]);

    const result = people1
      .leftJoinHomogeneous<string, { id1: number; id2: number | null; name: string }>(
        people2,
        person => person.name,
        person => ({ id1: person.id, id2: null, name: person.name }),
        (person1, person2) => ({ id1: person1.id, id2: person2.id, name: person1.name })
      )
      .toArray();

    expect(result).toEqual([
      { id1: 1, id2: null, name: 'Magnus' },
      { id1: 2, id2: 7, name: 'Terry' },
      { id1: 3, id2: null, name: 'Adam' },
      { id1: 4, id2: 5, name: 'John' },
      { id1: 4, id2: 8, name: 'John' }
    ]);
  });

  it('should join the two sequences on the selected key using equality comparer', () => {
    type Person = { id: number; name: string };

    const magnus: Person = { id: 1, name: 'Magnus' };
    const terry1: Person = { id: 2, name: 'Terry' };
    const adam: Person = { id: 3, name: 'Adam' };
    const john1: Person = { id: 4, name: 'John' };

    const john2: Person = { id: 5, name: 'John' };
    const jane: Person = { id: 6, name: 'Jane' };
    const terry2: Person = { id: 7, name: 'Terry' };
    const john3: Person = { id: 8, name: 'John' };

    const people1 = from([magnus, terry1, adam, john1]);
    const people2 = from([john2, jane, terry2, john3]);

    const result = people1
      .leftJoinHomogeneous<string, { id1: number; id2: number | null; name: string }>(
        people2,
        person => person.name,
        person => ({ id1: person.id, id2: null, name: person.name }),
        (person1, person2) => ({ id1: person1.id, id2: person2.id, name: person1.name }),
        (person1Key, person2Key) => person1Key === person2Key
      )
      .toArray();

    expect(result).toEqual([
      { id1: 1, id2: null, name: 'Magnus' },
      { id1: 2, id2: 7, name: 'Terry' },
      { id1: 3, id2: null, name: 'Adam' },
      { id1: 4, id2: 5, name: 'John' },
      { id1: 4, id2: 8, name: 'John' }
    ]);
  });
});
