import assert from "node:assert/strict"
import { test } from "node:test"

import { getDungeon } from "@/lib/puzzle/dungeons"
import { expToNextLevel } from "@/lib/puzzle/party"
import {
  addToParty,
  applyClearRewards,
  createOwned,
  fuseMonsters,
  initialSave,
  normalizeSave,
  removeFromParty,
  setLeader,
} from "@/lib/puzzle/save"
import type { Dungeon } from "@/lib/puzzle/types"

const testDungeon: Dungeon = {
  id: "test-dungeon",
  name: "テスト",
  description: "",
  floors: [{ enemies: ["caterpillar"] }],
  exp: 1000,
  drops: [{ specId: "hinoko", rate: 1 }],
}

test("初期データは4体編成で始まる", () => {
  const save = initialSave()
  assert.equal(save.monsters.length, 4)
  assert.equal(save.party.length, 4)
  assert.equal(save.clearedDungeons.length, 0)
  assert.equal(save.settings.timeLimitSec, 8)
})

test("クリア報酬は編成中のモンスターにだけ経験値が入る", () => {
  const save = initialSave()
  const benched = createOwned("yorune")
  const withBench = { ...save, monsters: [...save.monsters, benched] }

  const result = applyClearRewards(withBench, testDungeon, () => 0)
  const grownLeader = result.save.monsters.find(
    (monster) => monster.uid === save.party[0]
  )
  const grownBench = result.save.monsters.find(
    (monster) => monster.uid === benched.uid
  )

  assert.equal(result.exp, 1000)
  assert.equal((grownLeader?.level ?? 1) > 1, true)
  assert.equal(grownBench?.level, 1)
  assert.equal(grownBench?.exp, 0)
  assert.equal(result.levelUps.length, 4)
  assert.deepEqual(result.save.clearedDungeons, ["test-dungeon"])
})

test("クリア報酬のモンスターが手持ちに加わる", () => {
  const save = initialSave()
  const result = applyClearRewards(save, testDungeon, () => 0)
  assert.equal(result.obtained.length, 1)
  assert.equal(result.obtained[0].specId, "hinoko")
  assert.equal(result.save.monsters.length, save.monsters.length + 1)
})

test("同じダンジョンを2回クリアしてもクリア済みは重複しない", () => {
  const first = applyClearRewards(initialSave(), testDungeon, () => 1)
  const second = applyClearRewards(first.save, testDungeon, () => 1)
  assert.deepEqual(second.save.clearedDungeons, ["test-dungeon"])
  assert.equal(second.obtained.length, 0)
})

test("合成は素材を消して経験値に変える", () => {
  const base = initialSave()
  const material = createOwned("yorune")
  const save = { ...base, monsters: [...base.monsters, material] }
  const targetUid = base.party[0]

  const result = fuseMonsters(save, targetUid, [material.uid])
  const target = result.save.monsters.find(
    (monster) => monster.uid === targetUid
  )

  assert.equal(result.gainedExp > 0, true)
  assert.equal(
    result.save.monsters.some((monster) => monster.uid === material.uid),
    false
  )
  assert.equal(
    (target?.level ?? 1) > 1 || (target?.exp ?? 0) > 0,
    true,
    "対象に経験値が入っていない"
  )
})

test("編成中のモンスターは素材にできない", () => {
  const save = initialSave()
  const result = fuseMonsters(save, save.party[0], [save.party[1]])
  assert.equal(result.gainedExp, 0)
  assert.equal(result.save.monsters.length, save.monsters.length)
})

test("パーティは4体まで、最後の1体は外せない", () => {
  const base = initialSave()
  const extra = createOwned("nox")
  const save = { ...base, monsters: [...base.monsters, extra] }

  assert.equal(addToParty(save, extra.uid).party.length, 4)

  let trimmed = save
  for (const uid of base.party) {
    trimmed = removeFromParty(trimmed, uid)
  }
  assert.equal(trimmed.party.length, 1)
  assert.equal(addToParty(trimmed, extra.uid).party.length, 2)
})

test("リーダーを入れ替えると先頭に来る", () => {
  const save = initialSave()
  const next = setLeader(save, save.party[2])
  assert.equal(next.party[0], save.party[2])
  assert.equal(next.party.length, 4)
  assert.deepEqual([...next.party].sort(), [...save.party].sort())
})

test("壊れた保存データは初期データに戻す", () => {
  assert.equal(normalizeSave(null).monsters.length, 4)
  assert.equal(normalizeSave({ monsters: "こわれている" }).monsters.length, 4)

  const unknown = normalizeSave({
    version: 1,
    monsters: [{ uid: "a", specId: "存在しないid", level: 1, exp: 0 }],
    party: ["a"],
    clearedDungeons: [],
    settings: { timeLimitSec: 8 },
  })
  assert.equal(
    unknown.monsters.every((monster) => monster.specId !== "存在しないid"),
    true
  )
})

test("保存データの編成に手持ちにない uid が混ざっていても復元できる", () => {
  const save = initialSave()
  const restored = normalizeSave({
    ...save,
    party: [...save.party, "存在しないuid"],
  })
  assert.equal(restored.party.length, 4)
  assert.equal(restored.party.includes("存在しないuid"), false)
})

test("同梱のダンジョンはすべて経験値と敵を持っている", () => {
  for (const id of ["grassland", "volcano", "temple", "tower", "peak"]) {
    const dungeon = getDungeon(id)
    assert.ok(dungeon, `${id} が見つからない`)
    assert.equal(dungeon.floors.length > 0, true)
    assert.equal(dungeon.exp > 0, true)
    assert.equal(expToNextLevel(1) < dungeon.exp, true)
  }
})
