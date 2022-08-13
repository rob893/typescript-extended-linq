import { ArrayEnumerable, List } from '../..';

describe('List', () => {
  describe('constructor', () => {
    it('should be an ArrayEnumerable', () => {
      const list = new List();

      expect(list).toBeInstanceOf(ArrayEnumerable);
    });

    it('should allow an iterable to be passed into constructor', () => {
      const arr = [1, 2, 3];
      const list = new List(arr);

      expect(list.length).toBe(arr.length);
    });
  });

  describe('add', () => {
    it('should add an item to the list', () => {
      const list = new List<number>();
      const toAdd = 5;

      expect(list.length).toBe(0);

      list.add(toAdd);

      expect(list.length).toBe(1);
      expect(list.elementAt(0)).toBe(toAdd);
    });
  });

  describe('addRange', () => {
    it('should add a range of items to the list', () => {
      const list = new List<number>();
      const toAdd = [1, 2, 3];

      expect(list.length).toBe(0);

      list.addRange(toAdd);

      expect(list.length).toBe(toAdd.length);

      for (let i = 0; i < toAdd.length; i++) {
        expect(list.elementAt(i)).toBe(toAdd[i]);
      }
    });
  });

  describe('clear', () => {
    it('should clear the list', () => {
      const list = new List([1, 2, 3, 4, 5]);

      expect(list.length).toBe(5);

      list.clear();

      expect(list.length).toBe(0);
    });
  });

  describe('copyTo', () => {
    it('should copy the entire list to the destination array', () => {
      const list = new List([1, 2, 3]);
      const arrToCopyTo: number[] = [];

      list.copyTo(arrToCopyTo);

      expect(arrToCopyTo.length).toBe(list.length);

      for (let i = 0; i < list.length; i++) {
        expect(arrToCopyTo[i]).toBe(list.elementAt(i));
      }
    });

    it('should copy the list to the destination array at array index', () => {
      const list = new List([1, 2, 3]);
      const arrToCopyTo: number[] = [];

      list.copyTo(arrToCopyTo, 2);

      expect(arrToCopyTo).toEqual([undefined, undefined, 1, 2, 3]);
    });

    it('should copy the list to the destination array at array index starting at index', () => {
      const list = new List([1, 2, 3, 4]);
      const arrToCopyTo: number[] = [];

      list.copyTo(1, arrToCopyTo, 2, 2);

      expect(arrToCopyTo).toEqual([undefined, undefined, 2, 3]);
    });
  });

  describe('findIndex', () => {
    it('should return the index of the item in the list', () => {
      const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);

      const index = list.findIndex(x => x.id === 2);

      expect(index).toBe(1);
    });

    it('should return -1 if not found', () => {
      const list = new List([{ id: 1 }, { id: 2 }, { id: 3 }]);

      const index = list.findIndex(x => x.id === 5);

      expect(index).toBe(-1);
    });
  });

  describe('indexOf', () => {
    it('should return the index of the item in the list', () => {
      const toFind = { id: 2 };
      const list = new List([{ id: 1 }, toFind, { id: 3 }]);

      const index = list.indexOf(toFind);

      expect(index).toBe(1);
    });

    it('should return -1 if item not found', () => {
      const toFind = { id: 2 };
      const list = new List([{ id: 1 }, { id: 4 }, { id: 3 }]);

      const index = list.indexOf(toFind);

      expect(index).toBe(-1);
    });
  });

  describe('insert', () => {
    it('should insert the item at the given index', () => {
      const list = new List([1, 2, 3, 4]);

      list.insert(2, 5);

      expect(list.length).toBe(5);
      expect(list.toArray()).toEqual([1, 2, 5, 3, 4]);
    });
  });

  describe('insertRange', () => {
    it('should insert the item at the given index', () => {
      const list = new List([1, 2, 3, 4]);

      list.insertRange(2, [5, 6, 7]);

      expect(list.length).toBe(7);
      expect(list.toArray()).toEqual([1, 2, 5, 6, 7, 3, 4]);
    });
  });

  describe('length', () => {
    it.each([
      [new List([]), 0],
      [new List(), 0],
      [new List([1]), 1],
      [new List([1, 2, 3]), 3]
    ])('should return the length of the list', (list, expected) => {
      expect(list.length).toBe(expected);
    });
  });

  describe('remove', () => {
    it('should remove the item and return true', () => {
      const list = new List([1, 2, 3, 4, 5]);

      const result = list.remove(3);

      expect(result).toBe(true);
      expect(list.toArray()).toEqual([1, 2, 4, 5]);
    });

    it('should return false if no item found', () => {
      const list = new List([1, 2, 3, 4, 5]);

      const result = list.remove(8);

      expect(result).toBe(false);
      expect(list.toArray()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('removeAll', () => {
    it('should remove the item and return true', () => {
      const list = new List([1, 2, 3, 4, 5]);

      const result = list.removeAll(x => x > 3);

      expect(result).toBe(2);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('removeAt', () => {
    it('should remove the item at index', () => {
      const list = new List([1, 2, 3, 4, 5]);

      list.removeAt(1);

      expect(list.toArray()).toEqual([1, 3, 4, 5]);
    });

    it.each([-1, 5, 6])('should throw for index out of bounds', index => {
      const list = new List([1, 2, 3, 4, 5]);

      expect(() => list.removeAt(index)).toThrow();
    });
  });

  describe('removeRange', () => {
    it('should remove the range at index', () => {
      const list = new List([1, 2, 3, 4, 5]);

      list.removeRange(1, 2);

      expect(list.toArray()).toEqual([1, 4, 5]);
    });

    it.each([-1, 5, 6])('should throw for index out of bounds', index => {
      const list = new List([1, 2, 3, 4, 5]);

      expect(() => list.removeRange(index, 1)).toThrow();
    });
  });

  describe('reverseInPlace', () => {
    it.each([
      [new List(), new List()],
      [new List([1]), new List([1])],
      [new List([1, 2, 3]), new List([3, 2, 1])]
    ])('should reverse the list in place', (list, expected) => {
      list.reverseInPlace();

      expect(list.toArray()).toEqual(expected.toArray());
    });
  });
});
