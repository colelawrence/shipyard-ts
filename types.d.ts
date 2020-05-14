export interface Storage<A> {
  [entityId: string]: A;
}

export interface Component<T> {
  new (...args: any[]): T;
  name: string;
}
