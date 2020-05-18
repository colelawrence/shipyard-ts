export interface Storage<A> {
  [entityId: string]: A;
}

export type Component<T> = {
  name: string;
} & ({ check: (check: T) => T } | ((check: T) => T));
