/** ゲーム全体で使う型。数値データは monsters.ts / dungeons.ts 側に置く。 */

/** ドロップの色。heart（回復）だけは攻撃に使われない。 */
export type Element = "fire" | "water" | "wood" | "light" | "dark" | "heart"

/** モンスターと敵が持つ属性（回復属性のモンスターは作らない） */
export type AttackElement = Exclude<Element, "heart">

export const ELEMENTS: Element[] = [
  "fire",
  "water",
  "wood",
  "light",
  "dark",
  "heart",
]

export const ATTACK_ELEMENTS: AttackElement[] = [
  "fire",
  "water",
  "wood",
  "light",
  "dark",
]

/** 盤面のマス。id は React の key と移動アニメーションの同一性判定に使う。 */
export type Orb = {
  id: string
  element: Element
}

/** 盤面。board[row][col] で、row 0 が一番上。 */
export type Board = Orb[][]

export type Cell = {
  row: number
  col: number
}

/** 消える1かたまり。cells は同色で隣接しているマス。 */
export type Match = {
  element: Element
  cells: Cell[]
}

export type Stats = {
  hp: number
  atk: number
  rcv: number
}

/** リーダースキル。該当する倍率だけを持たせる。 */
export type LeaderSkill = {
  name: string
  description: string
  /** 攻撃力倍率。element を指定するとその属性だけに効く */
  atk?: { element?: AttackElement; value: number }
  hp?: number
  rcv?: number
  /** combo コンボ以上で攻撃力を value 倍（上の atk とは掛け算で重なる） */
  comboBonus?: { combo: number; value: number }
}

/** 図鑑に載っているモンスターの定義（不変） */
export type MonsterSpec = {
  id: string
  name: string
  element: AttackElement
  /** 1〜3。合成の素材経験値と入手しやすさの目安 */
  rarity: number
  maxLevel: number
  /** Lv1 のステータス */
  base: Stats
  /** 最大Lv のステータス */
  max: Stats
  leaderSkill?: LeaderSkill
  /** 一覧やバトルで表示する絵文字 */
  emoji: string
  flavor: string
}

/** 手持ちの1体（可変）。specId で図鑑を引く。 */
export type OwnedMonster = {
  uid: string
  specId: string
  level: number
  /** 現在レベルの中での累積経験値 */
  exp: number
}

export type EnemySpec = {
  id: string
  name: string
  element: AttackElement
  hp: number
  atk: number
  /** 攻撃間隔（ターン） */
  interval: number
  /** 初回攻撃までのターン。省略時は interval と同じ */
  firstTurn?: number
  emoji: string
}

export type DungeonFloor = {
  /** EnemySpec の id。左から並ぶ */
  enemies: string[]
}

export type Dungeon = {
  id: string
  name: string
  description: string
  /** このダンジョンを解放するために必要なクリア済みダンジョン */
  requires?: string
  floors: DungeonFloor[]
  /** クリア時にパーティへ配る経験値の合計 */
  exp: number
  /** クリア時の入手抽選。rate は 0〜1 */
  drops: { specId: string; rate: number }[]
}

export type Settings = {
  /** 操作の制限時間（秒）。null は無制限 */
  timeLimitSec: number | null
}

export type SaveData = {
  version: 1
  monsters: OwnedMonster[]
  /** パーティのモンスター uid。先頭がリーダー。最大4体 */
  party: string[]
  clearedDungeons: string[]
  settings: Settings
}
