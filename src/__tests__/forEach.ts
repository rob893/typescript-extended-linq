import { from } from '..';

describe('forEach', () => {
  it.each([[[]], [[1, 2, 3]], [[1, 2, 3, 4, 5]]])('should iterate the sequence in order', src => {
    let i = 0;

    from(src).forEach((item, index) => {
      expect(index).toBe(i);
      expect(item).toEqual(src[i]);
      i++;
    });

    expect(src.length).toBe(i);
  });
});
