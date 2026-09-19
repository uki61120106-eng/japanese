import type { MonsterSpec } from "@/lib/puzzle/types"

/**
 * モンスター図鑑。バランス調整はこのファイルの数値だけで完結させる。
 * ステータスは Lv1 の base から最大Lv の max まで線形に伸びる（party.ts）。
 */
export const MONSTERS: MonsterSpec[] = [
  // ── 火 ──────────────────────────────────────────────
  {
    id: "hinoko",
    name: "ヒノコ",
    element: "fire",
    rarity: 1,
    maxLevel: 30,
    base: { hp: 220, atk: 85, rcv: 22 },
    max: { hp: 760, atk: 275, rcv: 62 },
    leaderSkill: {
      name: "小さな火種",
      description: "火属性の攻撃力が1.2倍になる",
      atk: { element: "fire", value: 1.2 },
    },
    emoji: "🔥",
    flavor: "火種から生まれた小さな精霊。よく跳ねる。",
  },
  {
    id: "salamandre",
    name: "サラマンドル",
    element: "fire",
    rarity: 2,
    maxLevel: 50,
    base: { hp: 360, atk: 140, rcv: 30 },
    max: { hp: 1560, atk: 560, rcv: 110 },
    leaderSkill: {
      name: "紅蓮の鼓動",
      description: "火属性の攻撃力が1.5倍になる",
      atk: { element: "fire", value: 1.5 },
    },
    emoji: "🦎",
    flavor: "火山の地熱で育つ大トカゲ。尾の熱で岩を割る。",
  },
  {
    id: "ignis",
    name: "焔竜イグナ",
    element: "fire",
    rarity: 3,
    maxLevel: 70,
    base: { hp: 520, atk: 190, rcv: 38 },
    max: { hp: 2680, atk: 950, rcv: 170 },
    leaderSkill: {
      name: "業火の咆哮",
      description: "火属性の攻撃力が2倍になる",
      atk: { element: "fire", value: 2 },
    },
    emoji: "🐲",
    flavor: "火口の底で眠る古竜。目覚めると空が赤く焼ける。",
  },

  // ── 水 ──────────────────────────────────────────────
  {
    id: "mizutama",
    name: "ミズタマ",
    element: "water",
    rarity: 1,
    maxLevel: 30,
    base: { hp: 240, atk: 78, rcv: 28 },
    max: { hp: 820, atk: 250, rcv: 78 },
    leaderSkill: {
      name: "しずくの守り",
      description: "HP が1.2倍になる",
      hp: 1.2,
    },
    emoji: "💧",
    flavor: "湧き水にまぎれて暮らす水の精霊。",
  },
  {
    id: "seiren",
    name: "セイレーン",
    element: "water",
    rarity: 2,
    maxLevel: 50,
    base: { hp: 330, atk: 100, rcv: 70 },
    max: { hp: 1420, atk: 400, rcv: 300 },
    leaderSkill: {
      name: "癒やしの歌声",
      description: "回復力が2倍になる",
      rcv: 2,
    },
    emoji: "🧜",
    flavor: "航路の岩場で歌う海の住人。歌は傷をふさぐ。",
  },
  {
    id: "aquas",
    name: "蒼竜アクアス",
    element: "water",
    rarity: 3,
    maxLevel: 70,
    base: { hp: 560, atk: 180, rcv: 45 },
    max: { hp: 2820, atk: 920, rcv: 190 },
    leaderSkill: {
      name: "蒼海の威",
      description: "水属性の攻撃力が2倍になる",
      atk: { element: "water", value: 2 },
    },
    emoji: "🐋",
    flavor: "深海の海流そのものと呼ばれる巨竜。",
  },

  // ── 木 ──────────────────────────────────────────────
  {
    id: "wakaba",
    name: "ワカバ",
    element: "wood",
    rarity: 1,
    maxLevel: 30,
    base: { hp: 260, atk: 80, rcv: 24 },
    max: { hp: 880, atk: 258, rcv: 70 },
    leaderSkill: {
      name: "芽吹きの力",
      description: "木属性の攻撃力が1.2倍になる",
      atk: { element: "wood", value: 1.2 },
    },
    emoji: "🌱",
    flavor: "芽吹いたばかりの若木の精。日光が主食。",
  },
  {
    id: "trent",
    name: "トレント",
    element: "wood",
    rarity: 2,
    maxLevel: 50,
    base: { hp: 520, atk: 120, rcv: 32 },
    max: { hp: 2200, atk: 470, rcv: 120 },
    leaderSkill: {
      name: "大樹の護り",
      description: "HP が1.5倍になる",
      hp: 1.5,
    },
    emoji: "🌳",
    flavor: "森の見張りを務める古木。根が地脈まで届く。",
  },
  {
    id: "verde",
    name: "翠竜ヴェルデ",
    element: "wood",
    rarity: 3,
    maxLevel: 70,
    base: { hp: 580, atk: 175, rcv: 44 },
    max: { hp: 2900, atk: 900, rcv: 185 },
    leaderSkill: {
      name: "翠嵐の加護",
      description: "木属性の攻撃力が2倍になる",
      atk: { element: "wood", value: 2 },
    },
    emoji: "🐉",
    flavor: "翼をひろげると森ひとつ分の風が起きる。",
  },

  // ── 光 ──────────────────────────────────────────────
  {
    id: "hikarimushi",
    name: "ヒカリムシ",
    element: "light",
    rarity: 1,
    maxLevel: 30,
    base: { hp: 200, atk: 92, rcv: 20 },
    max: { hp: 700, atk: 300, rcv: 58 },
    leaderSkill: {
      name: "またたき",
      description: "3コンボ以上で攻撃力が1.2倍になる",
      comboBonus: { combo: 3, value: 1.2 },
    },
    emoji: "✨",
    flavor: "夜道を照らす小さな虫。群れると眩しい。",
  },
  {
    id: "pegasus",
    name: "ペガサス",
    element: "light",
    rarity: 2,
    maxLevel: 50,
    base: { hp: 380, atk: 135, rcv: 40 },
    max: { hp: 1620, atk: 540, rcv: 150 },
    leaderSkill: {
      name: "疾風の祝福",
      description: "4コンボ以上で攻撃力が1.5倍になる",
      comboBonus: { combo: 4, value: 1.5 },
    },
    emoji: "🦄",
    flavor: "雲の上を駆ける天馬。踏み跡に光が残る。",
  },
  {
    id: "lux",
    name: "聖竜ルクス",
    element: "light",
    rarity: 3,
    maxLevel: 70,
    base: { hp: 540, atk: 185, rcv: 42 },
    max: { hp: 2740, atk: 940, rcv: 178 },
    leaderSkill: {
      name: "聖光の理",
      description: "光属性の攻撃力が2倍、HP が1.25倍になる",
      atk: { element: "light", value: 2 },
      hp: 1.25,
    },
    emoji: "🕊",
    flavor: "祈りの声が集まる場所に現れるという竜。",
  },

  // ── 闇 ──────────────────────────────────────────────
  {
    id: "yorune",
    name: "ヨルネ",
    element: "dark",
    rarity: 1,
    maxLevel: 30,
    base: { hp: 210, atk: 95, rcv: 18 },
    max: { hp: 720, atk: 310, rcv: 52 },
    emoji: "🌑",
    flavor: "影から影へ渡り歩く夜の小鬼。",
  },
  {
    id: "gargoyle",
    name: "ガーゴイル",
    element: "dark",
    rarity: 2,
    maxLevel: 50,
    base: { hp: 400, atk: 145, rcv: 26 },
    max: { hp: 1700, atk: 580, rcv: 96 },
    leaderSkill: {
      name: "夜陰の牙",
      description: "闇属性の攻撃力が1.5倍になる",
      atk: { element: "dark", value: 1.5 },
    },
    emoji: "🦇",
    flavor: "塔の縁で雨ざらしのまま千年待っていた石像。",
  },
  {
    id: "nox",
    name: "冥竜ノクス",
    element: "dark",
    rarity: 3,
    maxLevel: 70,
    base: { hp: 500, atk: 200, rcv: 36 },
    max: { hp: 2600, atk: 1020, rcv: 156 },
    leaderSkill: {
      name: "終焉のカウント",
      description: "5コンボ以上で攻撃力が2.5倍になる",
      comboBonus: { combo: 5, value: 2.5 },
    },
    emoji: "💀",
    flavor: "光の届かない淵に棲み、数えた数だけ力を増す。",
  },
]

const BY_ID = new Map(MONSTERS.map((monster) => [monster.id, monster]))

export function getMonsterSpec(id: string): MonsterSpec | undefined {
  return BY_ID.get(id)
}

/** 図鑑にない id が保存データに残っていた場合に備えて、呼び出し側で落ちないようにする。 */
export function requireMonsterSpec(id: string): MonsterSpec {
  const spec = BY_ID.get(id)
  if (!spec) {
    throw new Error(`図鑑にないモンスター: ${id}`)
  }
  return spec
}

/** 最初に配る4体。属性がばらけるように選んでいる。 */
export const STARTER_MONSTER_IDS = [
  "hinoko",
  "mizutama",
  "wakaba",
  "hikarimushi",
]
