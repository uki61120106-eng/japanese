import type { Dungeon, EnemySpec } from "@/lib/puzzle/types"

/**
 * 敵とダンジョンの数値。難易度の調整はこのファイルだけを触れば済むようにしている。
 * interval は攻撃間隔（ターン）、firstTurn は初回攻撃までのターン。
 */
export const ENEMIES: EnemySpec[] = [
  // ── はじまりの草原 ──
  { id: "caterpillar", name: "はらぺこイモムシ", element: "wood", hp: 280, atk: 100, interval: 3, emoji: "🐛" },
  { id: "aramusi", name: "あらくれウサギ", element: "wood", hp: 420, atk: 130, interval: 3, emoji: "🐇" },
  { id: "puddle", name: "みずたまり", element: "water", hp: 360, atk: 120, interval: 4, emoji: "🫧" },
  { id: "sunflower", name: "草原の主 ヒマワリオウ", element: "wood", hp: 1400, atk: 300, interval: 3, firstTurn: 4, emoji: "🌻" },

  // ── 灼熱の洞窟 ──
  { id: "scorpion", name: "ひあぶりサソリ", element: "fire", hp: 1200, atk: 340, interval: 3, emoji: "🦂" },
  { id: "firefly", name: "ひのたま", element: "fire", hp: 900, atk: 260, interval: 2, emoji: "🔥" },
  { id: "bat", name: "ほらあなコウモリ", element: "dark", hp: 1400, atk: 380, interval: 3, emoji: "🦇" },
  { id: "golem", name: "溶岩ゴーレム", element: "fire", hp: 6000, atk: 1000, interval: 3, firstTurn: 4, emoji: "🗿" },

  // ── 水底の神殿 ──
  { id: "piranha", name: "かみつきウオ", element: "water", hp: 4200, atk: 800, interval: 2, emoji: "🐟" },
  { id: "squid", name: "ふかみのイカ", element: "water", hp: 5600, atk: 1000, interval: 3, emoji: "🦑" },
  { id: "statue", name: "みはりの石像", element: "light", hp: 7200, atk: 1200, interval: 4, emoji: "🗽" },
  { id: "kraken", name: "神殿の番人 クラーケン", element: "water", hp: 20000, atk: 2200, interval: 3, firstTurn: 4, emoji: "🐙" },

  // ── 星影の塔 ──
  { id: "ghost", name: "さまようともしび", element: "dark", hp: 13000, atk: 1800, interval: 2, emoji: "👻" },
  { id: "candle", name: "ふうじのロウソク", element: "light", hp: 15000, atk: 2000, interval: 3, emoji: "🕯" },
  { id: "knight", name: "星影の騎士", element: "dark", hp: 20000, atk: 2600, interval: 3, emoji: "🛡" },
  { id: "archon", name: "塔の主 アルコーン", element: "light", hp: 58000, atk: 4200, interval: 3, firstTurn: 4, emoji: "👼" },

  // ── 竜の頂 ──
  { id: "dragon-fire", name: "炎鱗のドラゴン", element: "fire", hp: 45000, atk: 3800, interval: 3, emoji: "🐲" },
  { id: "dragon-water", name: "氷鱗のドラゴン", element: "water", hp: 46000, atk: 3900, interval: 3, emoji: "🐋" },
  { id: "dragon-wood", name: "翠鱗のドラゴン", element: "wood", hp: 48000, atk: 3700, interval: 3, emoji: "🐉" },
  { id: "dragon-dark", name: "闇鱗のドラゴン", element: "dark", hp: 50000, atk: 4300, interval: 2, emoji: "🦕" },
  { id: "sovereign", name: "頂の竜王 バハムス", element: "light", hp: 130000, atk: 8000, interval: 3, firstTurn: 5, emoji: "👑" },
]

const ENEMY_BY_ID = new Map(ENEMIES.map((enemy) => [enemy.id, enemy]))

export function requireEnemySpec(id: string): EnemySpec {
  const spec = ENEMY_BY_ID.get(id)
  if (!spec) {
    throw new Error(`定義のない敵: ${id}`)
  }
  return spec
}

export const DUNGEONS: Dungeon[] = [
  {
    id: "grassland",
    name: "はじまりの草原",
    description: "まずはここから。ドロップの動かし方を覚えよう。",
    floors: [
      { enemies: ["caterpillar"] },
      { enemies: ["caterpillar", "puddle"] },
      { enemies: ["aramusi", "aramusi"] },
      { enemies: ["sunflower"] },
    ],
    exp: 600,
    drops: [
      { specId: "wakaba", rate: 0.45 },
      { specId: "mizutama", rate: 0.35 },
      { specId: "hinoko", rate: 0.35 },
      { specId: "trent", rate: 0.08 },
    ],
  },
  {
    id: "volcano",
    name: "灼熱の洞窟",
    description: "火属性ばかり。水のモンスターを連れていくと楽になる。",
    requires: "grassland",
    floors: [
      { enemies: ["firefly", "firefly"] },
      { enemies: ["scorpion", "bat"] },
      { enemies: ["scorpion", "firefly", "scorpion"] },
      { enemies: ["bat", "bat"] },
      { enemies: ["golem"] },
    ],
    exp: 2200,
    drops: [
      { specId: "hinoko", rate: 0.4 },
      { specId: "yorune", rate: 0.3 },
      { specId: "salamandre", rate: 0.14 },
      { specId: "gargoyle", rate: 0.1 },
      { specId: "ignis", rate: 0.03 },
    ],
  },
  {
    id: "temple",
    name: "水底の神殿",
    description: "打たれ強い水の敵が続く。木属性で攻めたい。",
    requires: "volcano",
    floors: [
      { enemies: ["piranha", "piranha"] },
      { enemies: ["squid", "statue"] },
      { enemies: ["piranha", "squid", "piranha"] },
      { enemies: ["statue", "squid"] },
      { enemies: ["kraken"] },
    ],
    exp: 6500,
    drops: [
      { specId: "mizutama", rate: 0.4 },
      { specId: "hikarimushi", rate: 0.3 },
      { specId: "seiren", rate: 0.14 },
      { specId: "pegasus", rate: 0.1 },
      { specId: "aquas", rate: 0.03 },
      { specId: "verde", rate: 0.03 },
    ],
  },
  {
    id: "tower",
    name: "星影の塔",
    description: "光と闇が入り混じる。相性を読み違えると一撃が重い。",
    requires: "temple",
    floors: [
      { enemies: ["ghost", "candle"] },
      { enemies: ["knight"] },
      { enemies: ["ghost", "ghost", "candle"] },
      { enemies: ["knight", "candle"] },
      { enemies: ["knight", "knight"] },
      { enemies: ["archon"] },
    ],
    exp: 18000,
    drops: [
      { specId: "pegasus", rate: 0.2 },
      { specId: "gargoyle", rate: 0.2 },
      { specId: "salamandre", rate: 0.15 },
      { specId: "seiren", rate: 0.15 },
      { specId: "lux", rate: 0.05 },
      { specId: "nox", rate: 0.05 },
    ],
  },
  {
    id: "peak",
    name: "竜の頂",
    description: "最後の試練。育てきったパーティで挑むこと。",
    requires: "tower",
    floors: [
      { enemies: ["dragon-fire", "dragon-water"] },
      { enemies: ["dragon-wood", "dragon-dark"] },
      { enemies: ["dragon-water", "dragon-fire", "dragon-wood"] },
      { enemies: ["dragon-dark", "dragon-dark"] },
      { enemies: ["sovereign"] },
    ],
    exp: 55000,
    drops: [
      { specId: "ignis", rate: 0.18 },
      { specId: "aquas", rate: 0.18 },
      { specId: "verde", rate: 0.18 },
      { specId: "lux", rate: 0.12 },
      { specId: "nox", rate: 0.12 },
    ],
  },
]

export function getDungeon(id: string): Dungeon | undefined {
  return DUNGEONS.find((dungeon) => dungeon.id === id)
}

export function isUnlocked(dungeon: Dungeon, cleared: string[]): boolean {
  return !dungeon.requires || cleared.includes(dungeon.requires)
}
