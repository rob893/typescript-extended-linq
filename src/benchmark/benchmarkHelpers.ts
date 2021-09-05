export interface TestType {
  id: number;
  foo: string;
  bar: number[];
}

export function getTestObjects(num: number = 250000): TestType[] {
  const objects: TestType[] = [];

  for (let i = 0; i < num; i++) {
    objects.push({ id: i, foo: `${i}foo`, bar: [1, 2, 3] });
  }

  return objects;
}

export class EagerLoad<T> implements Iterable<T> {
  private readonly src: Iterable<T>;

  public constructor(src: Iterable<T>) {
    this.src = src;
  }

  public *[Symbol.iterator](): Generator<T> {
    for (const item of this.src) {
      yield item;
    }
  }

  public where(exp: (item: T, index: number) => boolean): EagerLoad<T> {
    const filtered = [];

    let i = 0;
    for (const item of this.src) {
      if (exp(item, i)) {
        filtered.push(item);
      }
      i++;
    }

    return new EagerLoad(filtered);
  }

  public select<TDestination>(exp: (item: T, index: number) => TDestination): EagerLoad<TDestination> {
    const mapped = [];

    let i = 0;
    for (const item of this.src) {
      mapped.push(exp(item, i));
      i++;
    }

    return new EagerLoad(mapped);
  }

  public selectMany<TDestination>(exp: (item: T, index: number) => TDestination[]): EagerLoad<TDestination> {
    const mapped = [];

    let i = 0;
    for (const item of this.src) {
      for (const subItem of exp(item, i)) {
        mapped.push(subItem);
      }
      i++;
    }

    return new EagerLoad(mapped);
  }

  public toArray(): T[] {
    return [...this.src];
  }
}
