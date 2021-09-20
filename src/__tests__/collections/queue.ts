import { Queue } from '../../collections/Queue';

describe('Queue', () => {
  describe('enqueue', () => {
    it('should add an item to the queue', () => {
      const q = new Queue<number>();

      q.enqueue(5);

      expect(q.length).toBe(1);
    });
  });

  describe('dequeue', () => {
    it('should remove the first item from the queue.', () => {
      const q = new Queue<number>();

      q.enqueue(5);
      q.enqueue(4);
      q.enqueue(3);
      q.enqueue(0);

      expect(q.length).toBe(4);

      let result = q.dequeue();

      expect(result).toBe(5);
      expect(q.length).toBe(3);

      result = q.dequeue();

      expect(result).toBe(4);
      expect(q.length).toBe(2);

      result = q.dequeue();

      expect(result).toBe(3);
      expect(q.length).toBe(1);

      result = q.dequeue();

      expect(result).toBe(0);
      expect(q.length).toBe(0);
    });

    it('should throw if queue is empty', () => {
      const q = new Queue<number>();
      expect(() => q.dequeue()).toThrow();
    });
  });

  describe('tryDequeue', () => {
    it('should remove an item from the queue.', () => {
      const q = new Queue<number>();

      q.enqueue(5);
      q.enqueue(4);
      q.enqueue(3);
      q.enqueue(0);

      expect(q.length).toBe(4);

      let result = q.tryDequeue();

      expect(result).toBe(5);
      expect(q.length).toBe(3);

      result = q.tryDequeue();

      expect(result).toBe(4);
      expect(q.length).toBe(2);

      result = q.tryDequeue();

      expect(result).toBe(3);
      expect(q.length).toBe(1);

      result = q.tryDequeue();

      expect(result).toBe(0);
      expect(q.length).toBe(0);
    });

    it('should return null if queue is empty', () => {
      const q = new Queue<number>();
      expect(q.tryDequeue()).toBeNull();
    });
  });

  describe('peek', () => {
    it('should return an item from the queue without removing it.', () => {
      const q = new Queue<number>();

      q.enqueue(5);
      q.enqueue(4);
      q.enqueue(3);
      q.enqueue(0);

      expect(q.length).toBe(4);

      const result = q.peek();

      expect(result).toBe(5);
      expect(q.length).toBe(4);
    });

    it('should throw if queue is empty', () => {
      const q = new Queue<number>();
      expect(() => q.peek()).toThrow();
    });
  });

  describe('tryPeek', () => {
    it('should return an item from the queue without removing it.', () => {
      const q = new Queue<number>();

      q.enqueue(5);
      q.enqueue(4);
      q.enqueue(3);
      q.enqueue(0);

      expect(q.length).toBe(4);

      const result = q.tryPeek();

      expect(result).toBe(5);
      expect(q.length).toBe(4);
    });

    it('should return null if queue is empty', () => {
      const q = new Queue<number>();
      expect(q.tryPeek()).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear the queue', () => {
      const q = new Queue<number>();

      q.enqueue(5);
      q.enqueue(4);
      q.enqueue(3);
      q.enqueue(0);

      expect(q.length).toBe(4);

      q.clear();
      expect(q.length).toBe(0);
    });
  });

  describe('copyTo', () => {
    it('should copy elements to passed in array', () => {
      const q = new Queue<number>();

      q.enqueue(5);
      q.enqueue(4);
      q.enqueue(3);
      q.enqueue(0);

      const result: number[] = [];

      q.copyTo(result, 0);

      expect(result).toEqual([5, 4, 3, 0]);
    });

    it('should copy elements to passed in array starting at passed in index', () => {
      const q = new Queue<number>();

      q.enqueue(5);
      q.enqueue(4);
      q.enqueue(3);
      q.enqueue(0);

      const result: number[] = [];

      q.copyTo(result, 2);

      expect(result).toEqual([undefined, undefined, 5, 4, 3, 0]);
    });
  });
});
