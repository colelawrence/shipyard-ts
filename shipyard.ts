import { Component, Storage } from "./types";
import { IWorld } from "./world";

const DEAD: "DEAD" = "DEAD";

export class EntityId {
  private static next = 0;
  constructor(private id: string = "E" + EntityId.next++) {
    if (id !== DEAD) {
      EntityStorage[id] = this;
    }
  }
  public static dead(): EntityId {
    return deadEntity;
  }
  public index(): string {
    return this.id;
  }
}

const EntityStorage: any = {};

const deadEntity = new EntityId(DEAD);

const PRIV_VIEW = Symbol();

export class View<T> {
  private constructor(private storage: Storage<T>) {}
  static [PRIV_VIEW] = <T>(storage: Storage<T>) => new View<T>(storage);

  /** Iterate over the values of a single view */
  iter(): Shiperator<[T, EntityId]> {
    return new Shiperator([this.storage, EntityStorage]);
  }
}

/** implementation of iter */
export function __iter(...views: View<any>[]): Shiperator<any[]> {
  return new Shiperator([...views.map((v) => v["storage"]), EntityStorage]);
}

/** implementation of get */
export function __get(
  entityId: EntityId,
  ...views: View<any>[]
): any[] | undefined {
  return __iter(...views).get(entityId);
}

class WorldC {
  private storages: any = {};
  private getStorage<T>(component: Component<T>): Storage<T> {
    invariant(
      component.name,
      "component must have name (e.g. class/named functions)"
    );
    let current = this.storages[component.name];
    if (!current) current = this.storages[component.name] = {};
    // set object to dictionary mode see https://v8.dev/blog/fast-properties
    delete this.storages[component.name][0];
    return current;
  }

  iter(...storages: Component<any>[]) {
    return new Shiperator([
      ...storages.map((storage) => this.getStorage(storage as any)),
      EntityStorage,
    ]);
  }

  view(...storages: Component<any>[]): View<any>[] {
    return storages
      .map((c) => this.getStorage(c))
      .map((s) => View[PRIV_VIEW](s));
  }

  add_entity(storages: Component<any>[], components: any[]) {
    assertAllFitIn(components, storages);
    const entity = new EntityId();
    storages
      .map((component) => this.getStorage(component as any))
      .forEach((storage, index) => {
        storage[entity.index()] = components[index];
      });
    return entity;
  }
  add_component(
    entity: EntityId,
    storages: Component<any>[],
    components: any[]
  ) {
    assertAllFitIn(components, storages);
    storages
      .map((component) => this.getStorage(component as any))
      .forEach((storage, index) => {
        storage[entity.index()] = components[index];
      });
  }
  run<R>(
    typeobj: { [name: string]: Component<any> },
    fn: (views: { [name: string]: View<any> }) => R
  ): any {
    return fn(
      Object.fromEntries(
        Object.entries(typeobj).map(([id, component]) => [
          id,
          View[PRIV_VIEW](this.getStorage(component)),
        ])
      )
    );
  }
}

function assertAllFitIn(values: any[], storages: Component<any>[]) {
  invariant(
    storages.length === values.length,
    "provide same length storages and components"
  );
  const unfit = zip(values, storages).filter(
    ([value, comp]) => !valueFitsIn(comp, value) // ensure all components are instanceofs their storage
  );
  invariant(
    unfit.length === 0,
    `all components are instances of storage failed on ${JSON.stringify(unfit)}`
  );
}

function valueFitsIn(value: any, storage: Component<any>): boolean {
  return (
    (typeof storage === "function" && value instanceof storage) ||
    value.__typename === storage.name
  );
}

export const World: { new (): IWorld } = WorldC as any;

function zip<A, B>(a: Iterable<A>, b: Iterable<B>): [A, B][] {
  let bIt = b[Symbol.iterator]();
  return Array.from(a).map((a) => [a, bIt.next().value]);
}

export class Shiperator<T extends any[]> {
  constructor(private componentStores: Storage<any>[]) {}
  [Symbol.iterator](): Iterator<T> {
    return this.iter()[Symbol.iterator]();
  }
  iter(): Iterable<T> {
    return this.componentStores
      .map((storeObj) => Object.keys(storeObj))
      .sort((left, right) => left.length - right.length)
      .map((list) => new Set(list))
      .reduce((inAll, entityIds) => {
        if (inAll == null) return Array.of(...entityIds); // init
        if (inAll.length === 0) return inAll; // nothing to do
        return inAll.filter((entityId) => entityIds.has(entityId));
      }, null as string[] | null)!
      .map((entityId) =>
        this.componentStores.map((store) => store[entityId])
      ) as any;
  }
  get(id: EntityId): T | undefined {
    const found = this.componentStores.map((store) => store[id.index()]);
    if (found.filter((a) => a != null).length < found.length) return undefined;
    return found as any;
  }
}

function invariant(test: any, message: string) {
  if (!test) {
    throw new Error(`Invariant error: ${message}`);
  }
}
