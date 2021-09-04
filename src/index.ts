import { linq } from './linq';

const stuff = [1, 2, 3, 4, 5];

console.log(
  linq(stuff)
    .where(i => i % 2 === 1)
    .aggregate(0, (prev, curr) => prev + curr)
);
