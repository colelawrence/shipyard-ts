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
  view(...storages: Component<any>[]) {
    return new Shiperator([
      EntityStorage,
      ...storages.map(storage => this.getStorage(storage as any))
    ]);
  }
  add_entity(storages: Component<any>[], components: any[]) {
    invariant(
      storages.length === components.length,
      "provide same length storages and components"
    );
    invariant(
      zip(storages, components).filter(
        ([storage, comp]) => !(comp instanceof storage) // ensure all components are instanceofs their storage
      ).length === 0,
      "all components are instances of storage"
    );
    const entity = new EntityId();
    storages
      .map(component => this.getStorage(component as any))
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
    invariant(
      storages.length === components.length,
      "provide same length storages and components"
    );
    invariant(
      zip(storages, components).filter(
        ([storage, comp]) => !(comp instanceof storage) // ensure all components are instanceofs their storage
      ).length === 0,
      "all components are instances of storage"
    );
    storages
      .map(component => this.getStorage(component as any))
      .forEach((storage, index) => {
        storage[entity.index()] = components[index];
      });
  }
}

export const World: { new (): IWorld } = WorldC as any;

function zip<A, B>(a: Iterable<A>, b: Iterable<B>): [A, B][] {
  let bIt = b[Symbol.iterator]();
  return Array.from(a).map(a => [a, bIt.next().value]);
}

export class Shiperator<T extends any[]> {
  constructor(private componentStores: Storage<any>[]) {}
  [Symbol.iterator](): Iterator<T> {
    return this.iter()[Symbol.iterator]();
  }
  iter(): Iterable<T> {
    return this.componentStores
      .map(storeObj => Object.keys(storeObj))
      .sort((left, right) => left.length - right.length)
      .map(list => new Set(list))
      .reduce((inAll, entityIds) => {
        if (inAll == null) return Array.of(...entityIds); // init
        if (inAll.length === 0) return inAll; // nothing to do
        return inAll.filter(entityId => entityIds.has(entityId));
      }, null as string[] | null)!
      .map(entityId =>
        this.componentStores.map(store => store[entityId])
      ) as any;
  }
  get(id: EntityId): T | undefined {
    const found = this.componentStores.map(store => store[id.index()]);
    if (found.filter(a => a != null).length < found.length) return undefined;
    return found as any;
  }
}

function invariant(test: any, message: string) {
  if (!test) {
    throw new Error(`Invariant error: ${message}`);
  }
}
