import { Enumerable } from '../Enumerable';
import { from, groupJoin } from '..';

describe('groupJoin', () => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', src => {
    const result = groupJoin<unknown, unknown, unknown, unknown>(
      src,
      [],
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

    const barley: Pet = { name: 'Barley', owner: terry };
    const boots: Pet = { name: 'Boots', owner: terry };
    const whiskers: Pet = { name: 'Whiskers', owner: adam };
    const daisy: Pet = { name: 'Daisy', owner: magnus };

    const people = from([magnus, terry, adam]);
    const pets = from([barley, boots, whiskers, daisy]);

    const result = people
      .groupJoin(
        pets,
        person => person,
        pet => pet.owner,
        (person, petCollection) => ({ ownerName: person.name, pets: petCollection.select(p => p.name).toArray() })
      )
      .toArray();

    expect(result).toEqual([
      { ownerName: 'Magnus', pets: ['Daisy'] },
      { ownerName: 'Terry', pets: ['Barley', 'Boots'] },
      { ownerName: 'Adam', pets: ['Whiskers'] }
    ]);
  });

  it('should join the two sequences on the selected key using equality comparer', () => {
    type Person = { name: string };
    type Pet = { name: string; owner: Person };

    const magnus: Person = { name: 'Magnus' };
    const terry: Person = { name: 'Terry' };
    const adam: Person = { name: 'Adam' };

    const barley: Pet = { name: 'Barley', owner: terry };
    const boots: Pet = { name: 'Boots', owner: terry };
    const whiskers: Pet = { name: 'Whiskers', owner: adam };
    const daisy: Pet = { name: 'Daisy', owner: magnus };

    const people = from([magnus, terry, adam]);
    const pets = from([barley, boots, whiskers, daisy]);

    const result = people
      .groupJoin(
        pets,
        person => person,
        pet => pet.owner,
        (person, petCollection) => ({ ownerName: person.name, pets: petCollection.select(p => p.name).toArray() }),
        (personA, personB) => personA.name === personB.name
      )
      .toArray();

    expect(result).toEqual([
      { ownerName: 'Magnus', pets: ['Daisy'] },
      { ownerName: 'Terry', pets: ['Barley', 'Boots'] },
      { ownerName: 'Adam', pets: ['Whiskers'] }
    ]);
  });
});