import { Stack } from '../../collections/Stack';

describe('Stack', () => {
  describe('push', () => {
    it('should add an item to the stack', () => {
      const stack = new Stack<number>();

      stack.push(5);

      expect(stack.length).toBe(1);
    });
  });

  describe('pop', () => {
    it('should remove the first item from the stack.', () => {
      const stack = new Stack<number>();

      stack.push(5);
      stack.push(4);
      stack.push(3);
      stack.push(0);

      expect(stack.length).toBe(4);

      const result = stack.pop();

      expect(result).toBe(0);
      expect(stack.length).toBe(3);
    });

    it('should throw if stack is empty', () => {
      const stack = new Stack<number>();
      expect(() => stack.pop()).toThrow();
    });
  });

  describe('tryPop', () => {
    it('should remove an item from the stack', () => {
      const stack = new Stack<number>();

      stack.push(5);
      stack.push(4);
      stack.push(3);
      stack.push(0);

      expect(stack.length).toBe(4);

      const result = stack.tryPop();

      expect(result).toBe(0);
      expect(stack.length).toBe(3);
    });

    it('should return null if stack is empty', () => {
      const q = new Stack<number>();
      expect(q.tryPop()).toBeNull();
    });
  });

  describe('peek', () => {
    it('should return an item from the stack without removing it.', () => {
      const stack = new Stack<number>();

      stack.push(5);
      stack.push(4);
      stack.push(3);
      stack.push(0);

      expect(stack.length).toBe(4);

      const result = stack.peek();

      expect(result).toBe(0);
      expect(stack.length).toBe(4);
    });

    it('should throw if stack is empty', () => {
      const stack = new Stack<number>();
      expect(() => stack.peek()).toThrow();
    });
  });

  describe('tryPeek', () => {
    it('should return an item from the stack without removing it.', () => {
      const stack = new Stack<number>();

      stack.push(5);
      stack.push(4);
      stack.push(3);
      stack.push(0);

      expect(stack.length).toBe(4);

      const result = stack.tryPeek();

      expect(result).toBe(0);
      expect(stack.length).toBe(4);
    });

    it('should return null if stack is empty', () => {
      const stack = new Stack<number>();
      expect(stack.tryPeek()).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear the stack', () => {
      const stack = new Stack<number>();

      stack.push(5);
      stack.push(4);
      stack.push(3);
      stack.push(0);

      expect(stack.length).toBe(4);

      stack.clear();
      expect(stack.length).toBe(0);
    });
  });

  describe('copyTo', () => {
    it('should copy elements to passed in array', () => {
      const stack = new Stack<number>();

      stack.push(5);
      stack.push(4);
      stack.push(3);
      stack.push(0);

      const result: number[] = [];

      stack.copyTo(result);

      expect(result).toEqual([5, 4, 3, 0]);
    });

    it('should copy elements to passed in array starting at passed in index', () => {
      const stack = new Stack<number>();

      stack.push(5);
      stack.push(4);
      stack.push(3);
      stack.push(0);

      const result: number[] = [];

      stack.copyTo(result, 2);

      expect(result).toEqual([undefined, undefined, 5, 4, 3, 0]);
    });
  });
});
