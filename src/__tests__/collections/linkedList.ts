import { BasicEnumerable, LinkedList } from '../..';

describe('LinkedList', () => {
  describe('constructor', () => {
    it('should be an BasicEnuerable', () => {
      const list = new LinkedList();

      expect(list).toBeInstanceOf(BasicEnumerable);
    });

    it('should allow an iterable to be passed into constructor', () => {
      const arr = [1, 2, 3];
      const list = new LinkedList(arr);

      expect(list.length).toBe(arr.length);
    });
  });

  describe('addLast', () => {
    it('should add an item to the list', () => {
      const list = new LinkedList<number>();

      expect(list.length).toBe(0);

      list.addLast(1);
      list.addLast(2);

      expect(list.length).toBe(2);
      expect(list).toEqual(new LinkedList([1, 2]));
    });
  });

  describe('addFirst', () => {
    it('should add an item to the list', () => {
      const list = new LinkedList<number>();

      expect(list.length).toBe(0);

      list.addFirst(1);
      list.addFirst(2);

      expect(list.length).toBe(2);
      expect(list).toEqual(new LinkedList([2, 1]));
    });
  });

  describe('addAfter', () => {
    it('should add an item to the list', () => {
      const list = new LinkedList<number>();

      expect(list.length).toBe(0);

      const first = list.addLast(1);
      list.addLast(2);

      list.addAfter(first, 3);

      expect(list.length).toBe(3);
      expect(list).toEqual(new LinkedList([1, 3, 2]));
    });
  });

  describe('addBefore', () => {
    it('should add an item to the list', () => {
      const list = new LinkedList<number>();

      expect(list.length).toBe(0);

      list.addLast(1);
      const second = list.addLast(2);

      list.addBefore(second, 3);

      expect(list.length).toBe(3);
      expect(list).toEqual(new LinkedList([1, 3, 2]));
    });
  });

  describe('clear', () => {
    it('should clear the list', () => {
      const list = new LinkedList([1, 2, 3, 4, 5]);

      expect(list.length).toBe(5);

      list.clear();

      expect(list.length).toBe(0);
    });
  });

  describe('copyTo', () => {
    it('should copy the list to the destination array at array index', () => {
      const list = new LinkedList([1, 2, 3]);
      const arrToCopyTo: number[] = [];

      list.copyTo(arrToCopyTo, 2);

      expect(arrToCopyTo).toEqual([undefined, undefined, 1, 2, 3]);
    });
  });

  describe('length', () => {
    it.each([
      [new LinkedList([]), 0],
      [new LinkedList(), 0],
      [new LinkedList([1]), 1],
      [new LinkedList([1, 2, 3]), 3]
    ])('should return the length of the list', (list, expected) => {
      expect(list.length).toBe(expected);
    });
  });

  describe('remove', () => {
    it('should remove the item and return true', () => {
      const list = new LinkedList([1, 2, 3, 4, 5]);

      const result = list.remove(3);

      expect(result).toBe(true);
      expect(list).toEqual(new LinkedList([1, 2, 4, 5]));
    });

    it('should return false if no item found', () => {
      const list = new LinkedList([1, 2, 3, 4, 5]);

      const result = list.remove(8);

      expect(result).toBe(false);
      expect(list).toEqual(new LinkedList([1, 2, 3, 4, 5]));
    });
  });

  describe('removeFirst', () => {
    it('should remove the item and return true', () => {
      const list = new LinkedList([1, 2, 3, 4, 5]);

      list.removeFirst();

      expect(list).toEqual(new LinkedList([2, 3, 4, 5]));
    });
  });

  describe('removeLast', () => {
    it('should remove the item and return true', () => {
      const list = new LinkedList([1, 2, 3, 4, 5]);

      list.removeLast();

      expect(list).toEqual(new LinkedList([1, 2, 3, 4]));
    });
  });
});
