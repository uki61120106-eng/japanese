import { requireMonsterSpec } from "@/lib/puzzle/monsters"
import type {
  MonsterSpec,
  OwnedMonster,
  SaveData,
  Stats,
} from "@/lib/puzzle/types"

export const PARTY_SIZE = 4

export type PartyMember = {
  owned: OwnedMonster
  spec: MonsterSpec
  stats: Stats
}

/** Lv1 の base から最大Lv の max まで線形に伸ばす。 */
export function statsAt(spec: MonsterSpec, level: number): Stats {
  const clamped = Math.min(Math.max(level, 1), spec.maxLevel)
  const ratio = spec.maxLevel <= 1 ? 1 : (clamped - 1) / (spec.maxLevel - 1)
  return {
    hp: Math.round(spec.base.hp + (spec.max.hp - spec.base.hp) * ratio),
    atk: Math.round(spec.base.atk + (spec.max.atk - spec.base.atk) * ratio),
    rcv: Math.round(spec.base.rcv + (spec.max.rcv - spec.base.rcv) * ratio),
  }
}

/** 次のレベルに上がるまでに必要な経験値。 */
export function expToNextLevel(level: number): number {
  return Math.ceil(25 * Math.pow(level, 1.7))
}

export type ExpResult = {
  monster: OwnedMonster
  /** 上がったレベル数（0 なら据え置き） */
  gainedLevels: number
}

/** 経験値を与えてレベルを上げる。最大Lv では経験値を持ち越さない。 */
export function addExp(
  monster: OwnedMonster,
  amount: number,
  spec: MonsterSpec = requireMonsterSpec(monster.specId)
): ExpResult {
  let level = monster.level
  let exp = monster.exp + Math.max(0, Math.floor(amount))
  let gainedLevels = 0

  while (level < spec.maxLevel) {
    const need = expToNextLevel(level)
    if (exp < need) break
    exp -= need
    level += 1
    gainedLevels += 1
  }

  if (level >= spec.maxLevel) {
    level = spec.maxLevel
    exp = 0
  }

  return { monster: { ...monster, level, exp }, gainedLevels }
}

/** 素材1体を合成したときに入る経験値。同属性なら1.5倍。 */
export function fusionExp(
  material: OwnedMonster,
  target: OwnedMonster,
  materialSpec: MonsterSpec = requireMonsterSpec(material.specId),
  targetSpec: MonsterSpec = requireMonsterSpec(target.specId)
): number {
  const base = materialSpec.rarity * 300 + material.level * 100
  const bonus = materialSpec.element === targetSpec.element ? 1.5 : 1
  return Math.floor(base * bonus)
}

export function toMember(monster: OwnedMonster): PartyMember {
  const spec = requireMonsterSpec(monster.specId)
  return { owned: monster, spec, stats: statsAt(spec, monster.level) }
}

/** 保存データの party（uid の配列）を、実体のある並びに変換する。 */
export function partyMembers(save: SaveData): PartyMember[] {
  return save.party
    .map((uid) => save.monsters.find((monster) => monster.uid === uid))
    .filter((monster): monster is OwnedMonster => Boolean(monster))
    .map(toMember)
}

export type PartyTotals = {
  /** リーダースキル適用後の最大HP */
  maxHp: number
  /** 補正のかからない素の合計値（一覧表示用） */
  rawHp: number
  atk: number
  rcv: number
}

export function partyTotals(members: PartyMember[]): PartyTotals {
  const leaderSkill = members[0]?.spec.leaderSkill
  const rawHp = members.reduce((sum, member) => sum + member.stats.hp, 0)
  return {
    rawHp,
    maxHp: Math.round(rawHp * (leaderSkill?.hp ?? 1)),
    atk: members.reduce((sum, member) => sum + member.stats.atk, 0),
    rcv: members.reduce((sum, member) => sum + member.stats.rcv, 0),
  }
}

/** 図鑑順で並べ替える（属性 → レア度 → Lv の降順）。 */
export function sortMonsters(monsters: OwnedMonster[]): OwnedMonster[] {
  return [...monsters].sort((a, b) => {
    const specA = requireMonsterSpec(a.specId)
    const specB = requireMonsterSpec(b.specId)
    if (specA.element !== specB.element) {
      return specA.element.localeCompare(specB.element)
    }
    if (specA.rarity !== specB.rarity) return specB.rarity - specA.rarity
    if (a.level !== b.level) return b.level - a.level
    return a.uid.localeCompare(b.uid)
  })
}
