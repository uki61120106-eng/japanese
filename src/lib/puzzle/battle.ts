import { requireEnemySpec } from "@/lib/puzzle/dungeons"
import type { PartyMember } from "@/lib/puzzle/party"
import type {
  AttackElement,
  Dungeon,
  EnemySpec,
  Match,
} from "@/lib/puzzle/types"

export type EnemyInstance = {
  /** React の key と攻撃対象の指定に使う */
  key: string
  spec: EnemySpec
  hp: number
  maxHp: number
  /** 攻撃までの残りターン */
  turnsLeft: number
}

export function spawnFloor(dungeon: Dungeon, floorIndex: number): EnemyInstance[] {
  const floor = dungeon.floors[floorIndex]
  return floor.enemies.map((id, index) => {
    const spec = requireEnemySpec(id)
    return {
      key: `${dungeon.id}-${floorIndex}-${index}`,
      spec,
      hp: spec.hp,
      maxHp: spec.hp,
      turnsLeft: spec.firstTurn ?? spec.interval,
    }
  })
}

/** 火→木→水→火 が2倍、光と闇は相互に2倍。逆向きは0.5倍。 */
export function elementMultiplier(
  attacker: AttackElement,
  defender: AttackElement
): number {
  const strongAgainst: Record<AttackElement, AttackElement> = {
    fire: "wood",
    wood: "water",
    water: "fire",
    light: "dark",
    dark: "light",
  }
  if (strongAgainst[attacker] === defender) return 2
  if (strongAgainst[defender] === attacker) return 0.5
  return 1
}

export function comboMultiplier(combo: number): number {
  return 1 + 0.25 * Math.max(0, combo - 1)
}

export function sizeMultiplier(count: number): number {
  return 1 + 0.25 * (count - 3)
}

export type AttackBreakdown = {
  element: AttackElement
  damage: number
  /** 属性相性。1 以外のときだけ画面に出す */
  affinity: number
}

export type TurnOutcome = {
  combo: number
  /** 属性ごとの与ダメージ（演出と内訳表示に使う） */
  attacks: AttackBreakdown[]
  damage: number
  heal: number
}

/**
 * 消したドロップからこのターンの与ダメージと回復量を求める。
 * リーダースキルはパーティ先頭のものだけが効く。
 */
export function computeTurn(options: {
  members: PartyMember[]
  matches: Match[]
  combo: number
  /** 攻撃対象の敵。いなければダメージは 0 のまま内訳だけ返す */
  target?: EnemyInstance
}): TurnOutcome {
  const { members, matches, combo, target } = options
  const leaderSkill = members[0]?.spec.leaderSkill
  const comboMult = comboMultiplier(combo)
  const comboBonus =
    leaderSkill?.comboBonus && combo >= leaderSkill.comboBonus.combo
      ? leaderSkill.comboBonus.value
      : 1

  const byElement = new Map<AttackElement, AttackBreakdown>()
  let heal = 0

  for (const match of matches) {
    const sizeMult = sizeMultiplier(match.cells.length)

    if (match.element === "heart") {
      const rcv = members.reduce((sum, member) => sum + member.stats.rcv, 0)
      heal += rcv * sizeMult * comboMult * (leaderSkill?.rcv ?? 1)
      continue
    }

    const element = match.element
    for (const member of members) {
      if (member.spec.element !== element) continue

      let damage = member.stats.atk * sizeMult * comboMult * comboBonus
      const atkSkill = leaderSkill?.atk
      if (
        atkSkill &&
        (!atkSkill.element || atkSkill.element === member.spec.element)
      ) {
        damage *= atkSkill.value
      }

      const affinity = target
        ? elementMultiplier(element, target.spec.element)
        : 1
      damage = Math.round(damage * affinity)

      const current = byElement.get(element)
      if (current) {
        current.damage += damage
      } else {
        byElement.set(element, { element, damage, affinity })
      }
    }
  }

  const attacks = [...byElement.values()].filter((a) => a.damage > 0)
  return {
    combo,
    attacks,
    damage: attacks.reduce((sum, attack) => sum + attack.damage, 0),
    heal: Math.round(heal),
  }
}

/** 対象の敵にダメージを与えた後の敵の並びを返す。 */
export function damageEnemy(
  enemies: EnemyInstance[],
  targetKey: string,
  damage: number
): EnemyInstance[] {
  return enemies.map((enemy) =>
    enemy.key === targetKey
      ? { ...enemy, hp: Math.max(0, enemy.hp - damage) }
      : enemy
  )
}

export type EnemyAction = {
  enemyKey: string
  name: string
  damage: number
}

/** 敵の攻撃カウントを1つ進め、0になった敵の攻撃をまとめる。 */
export function advanceEnemies(enemies: EnemyInstance[]): {
  enemies: EnemyInstance[]
  actions: EnemyAction[]
} {
  const actions: EnemyAction[] = []
  const next = enemies.map((enemy) => {
    if (enemy.hp <= 0) return enemy
    const turnsLeft = enemy.turnsLeft - 1
    if (turnsLeft > 0) return { ...enemy, turnsLeft }
    actions.push({
      enemyKey: enemy.key,
      name: enemy.spec.name,
      damage: enemy.spec.atk,
    })
    return { ...enemy, turnsLeft: enemy.spec.interval }
  })
  return { enemies: next, actions }
}

export function isFloorCleared(enemies: EnemyInstance[]): boolean {
  return enemies.every((enemy) => enemy.hp <= 0)
}

/** 先頭の生存している敵。攻撃対象の既定値に使う。 */
export function firstAliveKey(enemies: EnemyInstance[]): string | null {
  return enemies.find((enemy) => enemy.hp > 0)?.key ?? null
}

/** クリア報酬のモンスター抽選。specId の配列を返す。 */
export function rollDrops(
  dungeon: Dungeon,
  rng: () => number = Math.random
): string[] {
  return dungeon.drops
    .filter((drop) => rng() < drop.rate)
    .map((drop) => drop.specId)
}
