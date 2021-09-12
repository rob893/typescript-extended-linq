import { Enumerable } from '../enumerables';
import { from } from '../functions/from';

describe('fullJoinHeterogeneous', () => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', src => {
    const result = from<unknown>(src).fullJoinHeterogeneous<unknown, unknown, unknown>(
      [],
      x => x,
      x => x,
      x => x,
      x => x,
      (x, y) => null
    );

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should join the two sequences on the selected key', () => {
    const right = 'right';
    const left = 'left';
    const both = 'both';
    const missing = null;

    type Side = typeof right | typeof both | typeof left;
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
      .fullJoinHeterogeneous<Pet, Person, { side: Side; left: Person | null; right: Pet | null }>(
        pets,
        person => person,
        pet => pet.owner,
        person => ({ side: left, left: person, right: missing }),
        pet => ({ side: right, left: missing, right: pet }),
        (person, pet) => ({ side: both, left: person, right: pet })
      )
      .toArray();

    expect(result).toEqual([
      { side: both, left: magnus, right: daisy },
      { side: both, left: terry, right: barley },
      { side: both, left: terry, right: boots },
      { side: both, left: adam, right: whiskers },
      { side: left, left: john, right: missing },
      { side: right, left: missing, right: scratchy }
    ]);
  });

  it('should join the two sequences on the selected key using equality comparer', () => {
    const right = 'right';
    const left = 'left';
    const both = 'both';
    const missing = null;

    type Side = typeof right | typeof both | typeof left;
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
      .fullJoinHeterogeneous<Pet, Person, { side: Side; left: Person | null; right: Pet | null }>(
        pets,
        person => person,
        pet => pet.owner,
        person => ({ side: left, left: person, right: missing }),
        pet => ({ side: right, left: missing, right: pet }),
        (person, pet) => ({ side: both, left: person, right: pet }),
        (personKey, petKey) => personKey.name === petKey.name
      )
      .toArray();

    expect(result).toEqual([
      { side: both, left: magnus, right: daisy },
      { side: both, left: terry, right: barley },
      { side: both, left: terry, right: boots },
      { side: both, left: adam, right: whiskers },
      { side: left, left: john, right: missing },
      { side: right, left: missing, right: scratchy }
    ]);
  });
});

describe('fullJoinHomogeneous', () => {
  it.each([[1, 2, 3], new Set([1, 2, 3]), '123', new Map()])('should return an Enumerable', src => {
    const result = from<unknown>(src).fullJoinHomogeneous<unknown, unknown>(
      [],
      x => x,
      x => x,
      x => x,
      (x, y) => null
    );

    expect(result).toBeInstanceOf(Enumerable);
  });

  it('should join the two sequences on the selected key', () => {
    const right = 'right';
    const left = 'left';
    const both = 'both';
    const missing = null;

    type Side = typeof right | typeof both | typeof left;
    type Person = { id: number; name: string };

    const magnus: Person = { id: 1, name: 'Magnus' };
    const terry1: Person = { id: 2, name: 'Terry' };
    const adam: Person = { id: 3, name: 'Adam' };
    const john1: Person = { id: 4, name: 'John' };
    const john4: Person = { id: 9, name: 'John' };

    const john2: Person = { id: 5, name: 'John' };
    const jane: Person = { id: 6, name: 'Jane' };
    const terry2: Person = { id: 7, name: 'Terry' };
    const john3: Person = { id: 8, name: 'John' };

    const people1 = from([magnus, terry1, adam, john1, john4]);
    const people2 = from([john2, jane, terry2, john3]);

    const result = people1
      .fullJoinHomogeneous<string, { side: Side; left: Person | null; right: Person | null }>(
        people2,
        person => person.name,
        personLeft => ({ side: left, left: personLeft, right: missing }),
        personRight => ({ side: right, left: missing, right: personRight }),
        (personLeft, personRight) => ({ side: both, left: personLeft, right: personRight })
      )
      .toArray();

    expect(result).toEqual([
      { side: left, left: magnus, right: missing },
      { side: both, left: terry1, right: terry2 },
      { side: left, left: adam, right: missing },
      { side: both, left: john1, right: john2 },
      { side: both, left: john1, right: john3 },
      { side: both, left: john4, right: john2 },
      { side: both, left: john4, right: john3 },
      { side: right, left: missing, right: jane }
    ]);
  });

  it('should join the two sequences on the selected key using equality comparer', () => {
    const right = 'right';
    const left = 'left';
    const both = 'both';
    const missing = null;

    type Side = typeof right | typeof both | typeof left;
    type Person = { id: number; name: string };

    const magnus: Person = { id: 1, name: 'Magnus' };
    const terry1: Person = { id: 2, name: 'Terry' };
    const adam: Person = { id: 3, name: 'Adam' };
    const john1: Person = { id: 4, name: 'John' };
    const john4: Person = { id: 9, name: 'John' };

    const john2: Person = { id: 5, name: 'John' };
    const jane: Person = { id: 6, name: 'Jane' };
    const terry2: Person = { id: 7, name: 'Terry' };
    const john3: Person = { id: 8, name: 'John' };

    const people1 = from([magnus, terry1, adam, john1, john4]);
    const people2 = from([john2, jane, terry2, john3]);

    const result = people1
      .fullJoinHomogeneous<string, { side: Side; left: Person | null; right: Person | null }>(
        people2,
        person => person.name,
        personLeft => ({ side: left, left: personLeft, right: missing }),
        personRight => ({ side: right, left: missing, right: personRight }),
        (personLeft, personRight) => ({ side: both, left: personLeft, right: personRight }),
        (leftKey, rightKey) => leftKey === rightKey
      )
      .toArray();

    expect(result).toEqual([
      { side: left, left: magnus, right: missing },
      { side: both, left: terry1, right: terry2 },
      { side: left, left: adam, right: missing },
      { side: both, left: john1, right: john2 },
      { side: both, left: john1, right: john3 },
      { side: both, left: john4, right: john2 },
      { side: both, left: john4, right: john3 },
      { side: right, left: missing, right: jane }
    ]);
  });
});
