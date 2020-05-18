export interface Storage<A> {
  [entityId: string]: A;
}

export type Component<T> = {
  name: string;
} & ({ check: (check: T) => T } | ((check: T) => T));

const uniqueSym = Symbol();

export type Unique<T> = {
  [uniqueSym]: {
    name: string;
  } & ({ check: (check: T) => T } | ((check: T) => T));
};

export function unique<T>(component: Component<T>): Unique<T> {
  return {
    [uniqueSym]: component,
  };
}

export function isUniqueOf<T>(obj: any): Component<T> | undefined {
  return obj[uniqueSym];
}
