import { World } from "./shipyard";

class Health {
  constructor(public value: number) {}
}

class Stamina {
  constructor(public value: number) {}
}

const world = new World();

const e0 = world.add_entity([Health], [new Health(21)]);
const e1 = world.add_entity([Stamina], [new Stamina(18)]);
const e2 = world.add_entity([Stamina], [new Stamina(16)]);
world.add_component(e2, [Health], [new Health(8)]);

const [health] = world.view(Health).get(e0)!;
console.log(health);

console.group("both health and fat:");
for (const [health, stamina] of world.view(Health, Stamina)) {
  console.log(health, stamina);
}
console.groupEnd();
