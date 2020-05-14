import { EntityId, Shiperator } from "./shipyard";
import { Component } from "./types";

export interface IWorld {
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
  view<A>(a: Component<A>): Shiperator<[A]>;
  view<A, B>(a: Component<A>, b: Component<B>): Shiperator<[EntityId, A, B]>;
  view<A, B, C>(
    a: Component<A>,
    b: Component<B>,
    c: Component<C>
  ): Shiperator<[EntityId, A, B, C]>;
  view<A, B, C, D>(
    a: Component<A>,
    b: Component<B>,
    c: Component<C>,
    d: Component<D>
  ): Shiperator<[EntityId, A, B, C, D]>;
  view<A, B, C, D, E>(
    a: Component<A>,
    b: Component<B>,
    c: Component<C>,
    d: Component<D>,
    e: Component<E>
  ): Shiperator<[EntityId, A, B, C, D, E]>;
  view<A, B, C, D, E, F>(
    a: Component<A>,
    b: Component<B>,
    c: Component<C>,
    d: Component<D>,
    e: Component<E>,
    f: Component<F>
  ): Shiperator<[EntityId, A, B, C, D, E, F]>;
}
