import assert from "node:assert/strict"
import { test } from "node:test"

import {
  advanceEnemies,
  comboMultiplier,
  computeTurn,
  damageEnemy,
  elementMultiplier,
  firstAliveKey,
  isFloorCleared,
  rollDrops,
  sizeMultiplier,
  type EnemyInstance,
} from "@/lib/puzzle/battle"
import type { PartyMember } from "@/lib/puzzle/party"
import type {
  AttackElement,
  Cell,
  Dungeon,
  Element,
  LeaderSkill,
  Match,
} from "@/lib/puzzle/types"

function member(
  element: AttackElement,
  atk: number,
  rcv = 50,
  leaderSkill?: LeaderSkill
): PartyMember {
  return {
    owned: { uid: `uid-${element}`, specId: `spec-${element}`, level: 1, exp: 0 },
    spec: {
      id: `spec-${element}`,
      name: element,
      element,
      rarity: 1,
      maxLevel: 10,
      base: { hp: 100, atk, rcv },
      max: { hp: 100, atk, rcv },
      leaderSkill,
      emoji: "*",
      flavor: "",
    },
    stats: { hp: 100, atk, rcv },
  }
}

function match(element: Element, count: number): Match {
  const cells: Cell[] = Array.from({ length: count }, (_, index) => ({
    row: 0,
    col: index,
  }))
  return { element, cells }
}

function enemy(element: AttackElement, hp = 1000, interval = 3): EnemyInstance {
  return {
    key: `enemy-${element}`,
    spec: {
      id: `enemy-${element}`,
      name: element,
      element,
      hp,
      atk: 300,
      interval,
      emoji: "*",
    },
    hp,
    maxHp: hp,
    turnsLeft: interval,
  }
}

test("属性相性は有利2倍・不利0.5倍・それ以外は等倍", () => {
  assert.equal(elementMultiplier("fire", "wood"), 2)
  assert.equal(elementMultiplier("wood", "water"), 2)
  assert.equal(elementMultiplier("water", "fire"), 2)
  assert.equal(elementMultiplier("wood", "fire"), 0.5)
  assert.equal(elementMultiplier("light", "dark"), 2)
  assert.equal(elementMultiplier("dark", "light"), 2)
  assert.equal(elementMultiplier("fire", "light"), 1)
})

test("倍率の式", () => {
  assert.equal(sizeMultiplier(3), 1)
  assert.equal(sizeMultiplier(5), 1.5)
  assert.equal(comboMultiplier(1), 1)
  assert.equal(comboMultiplier(5), 2)
})

test("消した属性と同じモンスターだけが攻撃する", () => {
  const outcome = computeTurn({
    members: [member("fire", 100), member("water", 100)],
    matches: [match("fire", 3)],
    combo: 1,
    target: enemy("wood"),
  })
  assert.equal(outcome.attacks.length, 1)
  assert.equal(outcome.attacks[0].element, "fire")
  assert.equal(outcome.damage, 200) // 100 × 相性2倍
})

test("個数とコンボで倍率がかかる", () => {
  const outcome = computeTurn({
    members: [member("fire", 100), member("water", 100)],
    matches: [match("fire", 4), match("water", 3)],
    combo: 2,
    target: enemy("fire"),
  })
  // 火: 100 × 1.25(4個) × 1.25(2コンボ) × 1.0(等倍) = 156
  // 水: 100 × 1.0 × 1.25 × 2.0(有利) = 250
  assert.equal(outcome.damage, 156 + 250)
})

test("回復ドロップはパーティ全員の回復力で回復する", () => {
  const outcome = computeTurn({
    members: [member("fire", 100, 60), member("water", 100, 40)],
    matches: [match("heart", 4)],
    combo: 1,
    target: enemy("fire"),
  })
  assert.equal(outcome.damage, 0)
  assert.equal(outcome.heal, 125) // (60+40) × 1.25
})

test("リーダースキルは該当属性の攻撃力だけを上げる", () => {
  const leader = member("fire", 100, 50, {
    name: "test",
    description: "",
    atk: { element: "fire", value: 2 },
  })
  const outcome = computeTurn({
    members: [leader, member("water", 100)],
    matches: [match("fire", 3), match("water", 3)],
    combo: 2,
    target: enemy("light"),
  })
  // 火: 100 × 1.25 × 2 = 250、水: 100 × 1.25 = 125
  assert.equal(outcome.damage, 375)
})

test("コンボボーナスは条件を満たしたときだけ乗る", () => {
  const leader = member("fire", 100, 50, {
    name: "test",
    description: "",
    comboBonus: { combo: 4, value: 1.5 },
  })
  const under = computeTurn({
    members: [leader],
    matches: [match("fire", 3)],
    combo: 3,
    target: enemy("light"),
  })
  const over = computeTurn({
    members: [leader],
    matches: [match("fire", 3)],
    combo: 4,
    target: enemy("light"),
  })
  assert.equal(under.damage, 150) // 100 × 1.5(3コンボ)
  assert.equal(over.damage, 263) // 100 × 1.75(4コンボ) × 1.5
})

test("リーダー以外のリーダースキルは効かない", () => {
  const sub = member("fire", 100, 50, {
    name: "test",
    description: "",
    atk: { value: 10 },
  })
  const outcome = computeTurn({
    members: [member("water", 100), sub],
    matches: [match("fire", 3)],
    combo: 1,
    target: enemy("light"),
  })
  assert.equal(outcome.damage, 100)
})

test("敵はカウントが0になったターンに攻撃し、間隔ぶん戻る", () => {
  let enemies = [enemy("fire", 1000, 2)]
  let step = advanceEnemies(enemies)
  assert.equal(step.actions.length, 0)
  assert.equal(step.enemies[0].turnsLeft, 1)

  step = advanceEnemies(step.enemies)
  assert.equal(step.actions.length, 1)
  assert.equal(step.actions[0].damage, 300)
  assert.equal(step.enemies[0].turnsLeft, 2)

  // 倒した敵は行動しない
  enemies = damageEnemy(step.enemies, step.enemies[0].key, 1000)
  const dead = advanceEnemies(enemies)
  assert.equal(dead.actions.length, 0)
  assert.equal(isFloorCleared(dead.enemies), true)
})

test("ダメージは対象の敵にだけ入り、HP は0未満にならない", () => {
  const enemies = [enemy("fire", 500), enemy("water", 500)]
  const next = damageEnemy(enemies, enemies[1].key, 800)
  assert.equal(next[0].hp, 500)
  assert.equal(next[1].hp, 0)
  assert.equal(firstAliveKey(next), enemies[0].key)
})

test("ドロップ抽選は確率どおりに判定する", () => {
  const dungeon = {
    id: "test",
    name: "test",
    description: "",
    floors: [],
    exp: 0,
    drops: [
      { specId: "always", rate: 1 },
      { specId: "never", rate: 0 },
      { specId: "half", rate: 0.5 },
    ],
  } satisfies Dungeon

  assert.deepEqual(rollDrops(dungeon, () => 0.4), ["always", "half"])
  assert.deepEqual(rollDrops(dungeon, () => 0.9), ["always"])
})
