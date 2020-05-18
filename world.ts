import { EntityId, Shiperator, View } from "./shipyard";
import { Component, Unique } from "./types";

export declare function iter<A>(viewA: View<A>): Shiperator<[A, EntityId]>;
export declare function iter<A, B>(
  viewA: View<A>,
  viewB: View<B>
): Shiperator<[A, B, EntityId]>;
export declare function iter<A, B, C>(
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>
): Shiperator<[A, B, C, EntityId]>;
export declare function iter<A, B, C, D>(
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>,
  viewD: View<D>
): Shiperator<[A, B, C, D, EntityId]>;
export declare function iter<A, B, C, D, E>(
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>,
  viewD: View<D>,
  viewE: View<E>
): Shiperator<[A, B, C, D, E, EntityId]>;
export declare function iter<A, B, C, D, E, F>(
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>,
  viewD: View<D>,
  viewE: View<E>,
  viewF: View<F>
): Shiperator<[A, B, C, D, E, F, EntityId]>;

// @ts-ignore
export { __iter as iter } from "./shipyard";

export declare function get<A>(
  entityId: EntityId,
  viewA: View<A>
): [A, EntityId] | undefined;
export declare function get<A, B>(
  entityId: EntityId,
  viewA: View<A>,
  viewB: View<B>
): [A, B, EntityId] | undefined;
export declare function get<A, B, C>(
  entityId: EntityId,
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>
): [A, B, C, EntityId] | undefined;
export declare function get<A, B, C, D>(
  entityId: EntityId,
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>,
  viewD: View<D>
): [A, B, C, D, EntityId] | undefined;
export declare function get<A, B, C, D, E>(
  entityId: EntityId,
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>,
  viewD: View<D>,
  viewE: View<E>
): [A, B, C, D, E, EntityId] | undefined;
export declare function get<A, B, C, D, E, F>(
  entityId: EntityId,
  viewA: View<A>,
  viewB: View<B>,
  viewC: View<C>,
  viewD: View<D>,
  viewE: View<E>,
  viewF: View<F>
): [A, B, C, D, E, F, EntityId] | undefined;

// @ts-ignore
export { __get as get } from "./shipyard";

export interface IWorld {
  add_unique<A>(component: Component<A>, value: A): void;

  add_component<A>(
    entity: EntityId,
    storages: [Component<A>],
    values: [A]
  ): void;
  add_component<A, B>(
    entity: EntityId,
    storages: [Component<A>, Component<B>],
    values: [A, B]
  ): void;
  add_component<A, B, C>(
    entity: EntityId,
    storages: [Component<A>, Component<B>, Component<C>],
    values: [A, B, C]
  ): void;
  add_component<A, B, C, D>(
    entity: EntityId,
    storages: [Component<A>, Component<B>, Component<C>, Component<D>],
    values: [A, B, C, D]
  ): void;
  add_component<A, B, C, D, E>(
    entity: EntityId,
    storages: [
      Component<A>,
      Component<B>,
      Component<C>,
      Component<D>,
      Component<E>
    ],
    values: [A, B, C, D, E]
  ): void;
  add_component<A, B, C, D, E, F>(
    entity: EntityId,
    storages: [
      Component<A>,
      Component<B>,
      Component<C>,
      Component<D>,
      Component<E>,
      Component<F>
    ],
    values: [A, B, C, D, E, F]
  ): void;
  add_entity<A>(storages: [Component<A>], values: [A]): EntityId;
  add_entity<A, B>(
    storages: [Component<A>, Component<B>],
    values: [A, B]
  ): EntityId;
  add_entity<A, B, C>(
    storages: [Component<A>, Component<B>, Component<C>],
    values: [A, B, C]
  ): EntityId;
  add_entity<A, B, C, D>(
    storages: [Component<A>, Component<B>, Component<C>, Component<D>],
    values: [A, B, C, D]
  ): EntityId;
  add_entity<A, B, C, D, E>(
    storages: [
      Component<A>,
      Component<B>,
      Component<C>,
      Component<D>,
      Component<E>
    ],
    values: [A, B, C, D, E]
  ): EntityId;
  add_entity<A, B, C, D, E, F>(
    storages: [
      Component<A>,
      Component<B>,
      Component<C>,
      Component<D>,
      Component<E>,
      Component<F>
    ],
    values: [A, B, C, D, E, F]
  ): EntityId;

  /** The first workload built becomes the default workload */
  add_workload(name: string): WorkloadBuilder;

  /** Run the first workload built */
  run_default(): void;

  run_workload(name: string): void;

  run<T extends SystemDeps, R>(
    /** type signature */
    views: T,
    fn: (views: SystemFnViews<T>) => R
  ): R;

  iter(...args: View<any>[]): Shiperator<any[]>;
}

interface WorkloadBuilder {
  with_system<T extends SystemDeps>(
    deps: T,
    systemFn: (views: SystemFnViews<T>) => any
  ): WorkloadBuilder;
  build: () => void;
}

type SystemDeps = { [id: string]: Component<any> | Unique<any> };

type SystemFnViews<T extends SystemDeps> = {
  [P in keyof T]: T[P] extends Unique<infer S>
    ? S
    : T[P] extends Component<infer S>
    ? View<S>
    : never;
};
