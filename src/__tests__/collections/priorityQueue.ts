import { PriorityQueue } from '../../collections/PriorityQueue';

describe('PriorityQueue', () => {
  describe('enqueue', () => {
    it('should add an item to the queue', () => {
      const q = new PriorityQueue<number, number>();

      q.enqueue(5, 1);

      expect(q.length).toBe(1);
    });
  });

  describe('dequeue', () => {
    it('should remove an item from the queue. Lower priorites should be dequeued first', () => {
      const q = new PriorityQueue<number, number>();

      q.enqueue(5, 5);
      q.enqueue(4, 1);
      q.enqueue(3, 3);
      q.enqueue(0, 2);

      expect(q.length).toBe(4);

      let result = q.dequeue();

      expect(result).toBe(4);
      expect(q.length).toBe(3);

      result = q.dequeue();

      expect(result).toBe(0);
      expect(q.length).toBe(2);

      result = q.dequeue();

      expect(result).toBe(3);
      expect(q.length).toBe(1);

      result = q.dequeue();

      expect(result).toBe(5);
      expect(q.length).toBe(0);
    });

    it('should throw if queue is empty', () => {
      const q = new PriorityQueue<number, number>();
      expect(() => q.dequeue()).toThrow();
    });
  });

  describe('tryDequeue', () => {
    it('should remove an item from the queue. Lower priorites should be dequeued first', () => {
      const q = new PriorityQueue<number, number>();

      q.enqueue(5, 5);
      q.enqueue(4, 1);
      q.enqueue(3, 3);
      q.enqueue(0, 2);

      expect(q.length).toBe(4);

      let result = q.tryDequeue();

      expect(result).toBe(4);
      expect(q.length).toBe(3);

      result = q.tryDequeue();

      expect(result).toBe(0);
      expect(q.length).toBe(2);

      result = q.tryDequeue();

      expect(result).toBe(3);
      expect(q.length).toBe(1);

      result = q.tryDequeue();

      expect(result).toBe(5);
      expect(q.length).toBe(0);
    });

    it('should return null if queue is empty', () => {
      const q = new PriorityQueue<number, number>();
      expect(q.tryDequeue()).toBeNull();
    });
  });

  describe('peek', () => {
    it('should return an item from the queue without removing it. Lower priorites should be dequeued first', () => {
      const q = new PriorityQueue<number, number>();

      q.enqueue(5, 5);
      q.enqueue(4, 1);
      q.enqueue(3, 3);
      q.enqueue(0, 2);

      expect(q.length).toBe(4);

      const result = q.peek();

      expect(result).toBe(4);
      expect(q.length).toBe(4);
    });

    it('should throw if queue is empty', () => {
      const q = new PriorityQueue<number, number>();
      expect(() => q.peek()).toThrow();
    });
  });

  describe('tryPeek', () => {
    it('should return an item from the queue without removing it. Lower priorites should be dequeued first', () => {
      const q = new PriorityQueue<number, number>();

      q.enqueue(5, 5);
      q.enqueue(4, 1);
      q.enqueue(3, 3);
      q.enqueue(0, 2);

      expect(q.length).toBe(4);

      const result = q.tryPeek();

      expect(result).toBe(4);
      expect(q.length).toBe(4);
    });

    it('should return null if queue is empty', () => {
      const q = new PriorityQueue<number, number>();
      expect(q.tryPeek()).toBeNull();
    });
  });
});
