import assert from "node:assert/strict"
import { test } from "node:test"

import {
  addExp,
  expToNextLevel,
  fusionExp,
  partyTotals,
  statsAt,
  toMember,
} from "@/lib/puzzle/party"
import type { MonsterSpec, OwnedMonster } from "@/lib/puzzle/types"

const spec: MonsterSpec = {
  id: "test",
  name: "テスト",
  element: "fire",
  rarity: 2,
  maxLevel: 11,
  base: { hp: 100, atk: 50, rcv: 10 },
  max: { hp: 1100, atk: 550, rcv: 110 },
  emoji: "*",
  flavor: "",
}

function owned(level: number, exp = 0): OwnedMonster {
  return { uid: "uid", specId: "test", level, exp }
}

test("ステータスは Lv1 から最大Lv まで線形に伸びる", () => {
  assert.deepEqual(statsAt(spec, 1), { hp: 100, atk: 50, rcv: 10 })
  assert.deepEqual(statsAt(spec, 11), { hp: 1100, atk: 550, rcv: 110 })
  assert.deepEqual(statsAt(spec, 6), { hp: 600, atk: 300, rcv: 60 })
})

test("最大Lv を超えるレベルを渡しても最大値で止まる", () => {
  assert.deepEqual(statsAt(spec, 99), statsAt(spec, 11))
  assert.deepEqual(statsAt(spec, 0), statsAt(spec, 1))
})

test("必要経験値はレベルとともに増える", () => {
  assert.equal(expToNextLevel(1), 25)
  assert.equal(expToNextLevel(2) > expToNextLevel(1), true)
  assert.equal(expToNextLevel(30) > expToNextLevel(10), true)
})

test("経験値を足すとレベルが上がり、余りは持ち越される", () => {
  const result = addExp(owned(1), expToNextLevel(1) + 10, spec)
  assert.equal(result.monster.level, 2)
  assert.equal(result.monster.exp, 10)
  assert.equal(result.gainedLevels, 1)
})

test("一度に複数レベル上がる", () => {
  const need = expToNextLevel(1) + expToNextLevel(2) + expToNextLevel(3)
  const result = addExp(owned(1), need, spec)
  assert.equal(result.monster.level, 4)
  assert.equal(result.monster.exp, 0)
  assert.equal(result.gainedLevels, 3)
})

test("最大Lv では経験値を持たない", () => {
  const result = addExp(owned(10), 10_000_000, spec)
  assert.equal(result.monster.level, spec.maxLevel)
  assert.equal(result.monster.exp, 0)

  const capped = addExp(owned(spec.maxLevel), 999, spec)
  assert.equal(capped.monster.level, spec.maxLevel)
  assert.equal(capped.gainedLevels, 0)
})

test("合成の経験値はレア度とレベルで決まり、同属性は1.5倍", () => {
  const material = { uid: "m", specId: "test", level: 10, exp: 0 }
  const sameElement = fusionExp(material, owned(1), spec, spec)
  assert.equal(sameElement, Math.floor((2 * 300 + 10 * 100) * 1.5))

  const waterSpec: MonsterSpec = { ...spec, id: "water", element: "water" }
  const other = fusionExp(material, owned(1), spec, waterSpec)
  assert.equal(other, 2 * 300 + 10 * 100)
})

test("パーティ合計はリーダースキルの HP 倍率を反映する", () => {
  const leaderSpec: MonsterSpec = {
    ...spec,
    id: "leader",
    leaderSkill: { name: "守り", description: "", hp: 1.5 },
  }
  const members = [
    { owned: owned(1), spec: leaderSpec, stats: statsAt(leaderSpec, 1) },
    { owned: owned(1), spec, stats: statsAt(spec, 1) },
  ]
  const totals = partyTotals(members)
  assert.equal(totals.rawHp, 200)
  assert.equal(totals.maxHp, 300)
  assert.equal(totals.atk, 100)
  assert.equal(totals.rcv, 20)
})

test("図鑑にある id なら実体に変換できる", () => {
  const member = toMember({ uid: "u", specId: "hinoko", level: 1, exp: 0 })
  assert.equal(member.spec.name, "ヒノコ")
  assert.equal(member.stats.atk > 0, true)
})
