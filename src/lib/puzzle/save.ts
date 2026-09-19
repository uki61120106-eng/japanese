import { rollDrops } from "@/lib/puzzle/battle"
import { getMonsterSpec, STARTER_MONSTER_IDS } from "@/lib/puzzle/monsters"
import { addExp, fusionExp, PARTY_SIZE } from "@/lib/puzzle/party"
import type { Dungeon, OwnedMonster, SaveData } from "@/lib/puzzle/types"

export const SAVE_KEY = "dropquest.save.v1"

export const TIME_LIMIT_CHOICES: (number | null)[] = [5, 8, 12, null]

let uidSeq = 0

export function createOwned(specId: string, level = 1): OwnedMonster {
  uidSeq += 1
  const random = Math.random().toString(36).slice(2, 8)
  return {
    uid: `mon-${Date.now().toString(36)}-${uidSeq}-${random}`,
    specId,
    level,
    exp: 0,
  }
}

export function initialSave(): SaveData {
  const monsters = STARTER_MONSTER_IDS.map((id) => createOwned(id))
  return {
    version: 1,
    monsters,
    party: monsters.map((monster) => monster.uid),
    clearedDungeons: [],
    settings: { timeLimitSec: 8 },
  }
}

/** 壊れた保存データでも落ちないように、読めるところだけ拾って整える。 */
export function normalizeSave(input: unknown): SaveData {
  const fallback = initialSave()
  if (!input || typeof input !== "object") return fallback

  const raw = input as Partial<SaveData>
  const monsters = Array.isArray(raw.monsters)
    ? raw.monsters.filter(
        (monster): monster is OwnedMonster =>
          Boolean(monster) &&
          typeof monster.uid === "string" &&
          typeof monster.specId === "string" &&
          Boolean(getMonsterSpec(monster.specId)) &&
          Number.isFinite(monster.level)
      )
    : []

  if (monsters.length === 0) return fallback

  const owned = new Set(monsters.map((monster) => monster.uid))
  const party = (Array.isArray(raw.party) ? raw.party : [])
    .filter((uid): uid is string => typeof uid === "string" && owned.has(uid))
    .slice(0, PARTY_SIZE)

  const timeLimit = raw.settings?.timeLimitSec
  return {
    version: 1,
    monsters,
    party: party.length > 0 ? party : monsters.slice(0, PARTY_SIZE).map((m) => m.uid),
    clearedDungeons: Array.isArray(raw.clearedDungeons)
      ? raw.clearedDungeons.filter((id): id is string => typeof id === "string")
      : [],
    settings: {
      timeLimitSec:
        timeLimit === null || (typeof timeLimit === "number" && timeLimit > 0)
          ? timeLimit
          : 8,
    },
  }
}

/** ブラウザ以外（サーバー描画時）では初期データを返す。 */
export function loadSave(): SaveData {
  if (typeof window === "undefined") return initialSave()
  try {
    const stored = window.localStorage.getItem(SAVE_KEY)
    if (!stored) return initialSave()
    return normalizeSave(JSON.parse(stored))
  } catch {
    return initialSave()
  }
}

export function writeSave(save: SaveData): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  } catch {
    // 容量超過やプライベートモードでは保存をあきらめる（遊びは続行できる）
  }
}

export type LevelUp = {
  uid: string
  specId: string
  before: number
  after: number
}

export type ClearRewards = {
  save: SaveData
  exp: number
  levelUps: LevelUp[]
  obtained: OwnedMonster[]
}

/** ダンジョンクリア時の経験値配分とモンスター抽選をまとめて適用する。 */
export function applyClearRewards(
  save: SaveData,
  dungeon: Dungeon,
  rng: () => number = Math.random
): ClearRewards {
  const inParty = new Set(save.party)
  const levelUps: LevelUp[] = []

  const grown = save.monsters.map((monster) => {
    if (!inParty.has(monster.uid)) return monster
    const result = addExp(monster, dungeon.exp)
    if (result.gainedLevels > 0) {
      levelUps.push({
        uid: monster.uid,
        specId: monster.specId,
        before: monster.level,
        after: result.monster.level,
      })
    }
    return result.monster
  })

  const obtained = rollDrops(dungeon, rng).map((specId) => createOwned(specId))

  return {
    save: {
      ...save,
      monsters: [...grown, ...obtained],
      clearedDungeons: save.clearedDungeons.includes(dungeon.id)
        ? save.clearedDungeons
        : [...save.clearedDungeons, dungeon.id],
    },
    exp: dungeon.exp,
    levelUps,
    obtained,
  }
}

export type FusionResult = {
  save: SaveData
  gainedExp: number
  gainedLevels: number
}

/** 素材を消費して対象に経験値を与える。編成中のモンスターは素材にできない。 */
export function fuseMonsters(
  save: SaveData,
  targetUid: string,
  materialUids: string[]
): FusionResult {
  const target = save.monsters.find((monster) => monster.uid === targetUid)
  if (!target) return { save, gainedExp: 0, gainedLevels: 0 }

  const inParty = new Set(save.party)
  const materials = save.monsters.filter(
    (monster) =>
      materialUids.includes(monster.uid) &&
      monster.uid !== targetUid &&
      !inParty.has(monster.uid)
  )
  if (materials.length === 0) return { save, gainedExp: 0, gainedLevels: 0 }

  const gainedExp = materials.reduce(
    (sum, material) => sum + fusionExp(material, target),
    0
  )
  const result = addExp(target, gainedExp)
  const consumed = new Set(materials.map((material) => material.uid))

  return {
    save: {
      ...save,
      monsters: save.monsters
        .filter((monster) => !consumed.has(monster.uid))
        .map((monster) =>
          monster.uid === targetUid ? result.monster : monster
        ),
    },
    gainedExp,
    gainedLevels: result.gainedLevels,
  }
}

/** パーティに加える。すでに満員か編成済みなら何もしない。 */
export function addToParty(save: SaveData, uid: string): SaveData {
  if (save.party.includes(uid)) return save
  if (save.party.length >= PARTY_SIZE) return save
  if (!save.monsters.some((monster) => monster.uid === uid)) return save
  return { ...save, party: [...save.party, uid] }
}

/** パーティから外す。最後の1体は外せない（編成が空になるのを防ぐ）。 */
export function removeFromParty(save: SaveData, uid: string): SaveData {
  if (save.party.length <= 1) return save
  return { ...save, party: save.party.filter((member) => member !== uid) }
}

/** 指定したモンスターをリーダー（先頭）にする。 */
export function setLeader(save: SaveData, uid: string): SaveData {
  const index = save.party.indexOf(uid)
  if (index <= 0) return save
  const party = [...save.party]
  const [picked] = party.splice(index, 1)
  return { ...save, party: [picked, ...party] }
}
