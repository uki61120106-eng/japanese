/**
 * インドネシア語の場面別会話データ。
 *
 * - `id`   : インドネシア語の文
 * - `kana` : 日本語話者向けのカタカナ読み（目安。あいまい母音 e は「ゥ」系で表す）
 * - `ja`   : 日本語訳
 *
 * 会話は A と B が交互に話す前提で並べる（ロールプレイで自分の番を判定するため）。
 */

export type Speaker = "A" | "B"

export type Line = {
  speaker: Speaker
  id: string
  kana: string
  ja: string
}

export type Word = {
  id: string
  ja: string
}

export type SceneTheme =
  | "rose"
  | "amber"
  | "emerald"
  | "sky"
  | "violet"
  | "teal"

export type Scene = {
  slug: string
  title: string
  /** インドネシア語での場面名 */
  titleId: string
  description: string
  emoji: string
  theme: SceneTheme
  /** 話し手の役名（ロールプレイの役選びに使う） */
  roles: Record<Speaker, string>
  lines: Line[]
  words: Word[]
}

export const SCENES: Scene[] = [
  {
    slug: "greeting",
    title: "あいさつ",
    titleId: "Salam",
    description: "朝のあいさつと「元気？」のやりとり",
    emoji: "👋",
    theme: "rose",
    roles: { A: "あなた", B: "友だち" },
    lines: [
      {
        speaker: "A",
        id: "Selamat pagi!",
        kana: "スラマッ パギ！",
        ja: "おはようございます！",
      },
      {
        speaker: "B",
        id: "Selamat pagi! Apa kabar?",
        kana: "スラマッ パギ！ アパ カバール？",
        ja: "おはようございます！ お元気ですか？",
      },
      {
        speaker: "A",
        id: "Kabar baik, terima kasih. Bagaimana dengan Anda?",
        kana: "カバール バイッ、トゥリマ カシ。バガイマナ ドゥンガン アンダ？",
        ja: "元気です、ありがとう。あなたは？",
      },
      {
        speaker: "B",
        id: "Saya juga baik.",
        kana: "サヤ ジュガ バイッ。",
        ja: "わたしも元気です。",
      },
      {
        speaker: "A",
        id: "Sampai jumpa lagi!",
        kana: "サンパイ ジュンパ ラギ！",
        ja: "また会いましょう！",
      },
      {
        speaker: "B",
        id: "Sampai jumpa!",
        kana: "サンパイ ジュンパ！",
        ja: "またね！",
      },
    ],
    words: [
      { id: "selamat pagi", ja: "おはよう（朝のあいさつ）" },
      { id: "apa kabar?", ja: "元気？" },
      { id: "baik", ja: "よい・元気な" },
      { id: "terima kasih", ja: "ありがとう" },
      { id: "juga", ja: "〜も" },
      { id: "sampai jumpa", ja: "またね" },
    ],
  },
  {
    slug: "introduction",
    title: "じこしょうかい",
    titleId: "Perkenalan",
    description: "名前と出身を伝える",
    emoji: "🤝",
    theme: "amber",
    roles: { A: "あなた", B: "デウィさん" },
    lines: [
      {
        speaker: "A",
        id: "Halo, nama saya Kenji.",
        kana: "ハロ、ナマ サヤ ケンジ。",
        ja: "こんにちは、わたしの名前はケンジです。",
      },
      {
        speaker: "B",
        id: "Halo, Kenji. Saya Dewi. Senang berkenalan dengan Anda.",
        kana: "ハロ、ケンジ。サヤ デウィ。スナン ブルクナラン ドゥンガン アンダ。",
        ja: "こんにちは、ケンジさん。わたしはデウィです。はじめまして。",
      },
      {
        speaker: "A",
        id: "Saya juga senang.",
        kana: "サヤ ジュガ スナン。",
        ja: "わたしもうれしいです。",
      },
      {
        speaker: "B",
        id: "Anda berasal dari mana?",
        kana: "アンダ ブルアサル ダリ マナ？",
        ja: "どちらのご出身ですか？",
      },
      {
        speaker: "A",
        id: "Saya dari Jepang.",
        kana: "サヤ ダリ ジュパン。",
        ja: "日本から来ました。",
      },
      {
        speaker: "B",
        id: "Wah, bagus sekali!",
        kana: "ワー、バグス スカリ！",
        ja: "わあ、すてきですね！",
      },
    ],
    words: [
      { id: "nama", ja: "名前" },
      { id: "saya", ja: "わたし" },
      { id: "Anda", ja: "あなた（ていねい）" },
      { id: "senang", ja: "うれしい" },
      { id: "dari", ja: "〜から" },
      { id: "mana", ja: "どこ" },
      { id: "Jepang", ja: "日本" },
    ],
  },
  {
    slug: "shopping",
    title: "かいもの",
    titleId: "Belanja",
    description: "市場で値段を聞いて、値引きをお願いする",
    emoji: "🛍️",
    theme: "emerald",
    roles: { A: "お客さん", B: "お店の人" },
    lines: [
      {
        speaker: "A",
        id: "Permisi, ini berapa?",
        kana: "プルミシ、イニ ブラパ？",
        ja: "すみません、これはいくらですか？",
      },
      {
        speaker: "B",
        id: "Lima puluh ribu rupiah.",
        kana: "リマ プル リブ ルピア。",
        ja: "5万ルピアです。",
      },
      {
        speaker: "A",
        id: "Wah, mahal. Bisa kurang?",
        kana: "ワー、マハル。ビサ クラン？",
        ja: "わあ、高い。まけてもらえますか？",
      },
      {
        speaker: "B",
        id: "Boleh, empat puluh ribu saja.",
        kana: "ボレ、ウンパッ プル リブ サジャ。",
        ja: "いいですよ、4万でいいです。",
      },
      {
        speaker: "A",
        id: "Oke, saya beli.",
        kana: "オケ、サヤ ブリ。",
        ja: "じゃあ、買います。",
      },
      {
        speaker: "B",
        id: "Terima kasih banyak!",
        kana: "トゥリマ カシ バニャッ！",
        ja: "どうもありがとうございます！",
      },
    ],
    words: [
      { id: "permisi", ja: "すみません（呼びかけ）" },
      { id: "ini", ja: "これ" },
      { id: "berapa", ja: "いくら・いくつ" },
      { id: "ribu", ja: "千" },
      { id: "mahal", ja: "（値段が）高い" },
      { id: "bisa kurang?", ja: "まけてもらえる？" },
      { id: "beli", ja: "買う" },
    ],
  },
  {
    slug: "restaurant",
    title: "レストラン",
    titleId: "Di Restoran",
    description: "食べ物と飲み物を注文する",
    emoji: "🍛",
    theme: "sky",
    roles: { A: "お客さん", B: "店員さん" },
    lines: [
      {
        speaker: "B",
        id: "Selamat malam. Mau pesan apa?",
        kana: "スラマッ マラム。マウ プサン アパ？",
        ja: "こんばんは。ご注文は何にしますか？",
      },
      {
        speaker: "A",
        id: "Saya mau nasi goreng satu.",
        kana: "サヤ マウ ナシ ゴレン サトゥ。",
        ja: "ナシゴレンを1つください。",
      },
      {
        speaker: "B",
        id: "Minumnya apa?",
        kana: "ミヌムニャ アパ？",
        ja: "お飲み物は何にしますか？",
      },
      {
        speaker: "A",
        id: "Es teh manis, ya.",
        kana: "エス テー マニス、ヤ。",
        ja: "甘いアイスティーをお願いします。",
      },
      {
        speaker: "B",
        id: "Baik, mohon ditunggu.",
        kana: "バイッ、モホン ディトゥング。",
        ja: "かしこまりました、少々お待ちください。",
      },
      {
        speaker: "A",
        id: "Terima kasih.",
        kana: "トゥリマ カシ。",
        ja: "ありがとうございます。",
      },
    ],
    words: [
      { id: "selamat malam", ja: "こんばんは" },
      { id: "mau", ja: "〜したい・ほしい" },
      { id: "pesan", ja: "注文する" },
      { id: "satu", ja: "1つ" },
      { id: "minum", ja: "飲む" },
      { id: "manis", ja: "甘い" },
    ],
  },
  {
    slug: "directions",
    title: "みちをたずねる",
    titleId: "Bertanya Jalan",
    description: "駅への行き方と距離を聞く",
    emoji: "🧭",
    theme: "violet",
    roles: { A: "あなた", B: "通りがかりの人" },
    lines: [
      {
        speaker: "A",
        id: "Permisi, stasiun di mana?",
        kana: "プルミシ、スタシウン ディ マナ？",
        ja: "すみません、駅はどこですか？",
      },
      {
        speaker: "B",
        id: "Jalan lurus, lalu belok kiri.",
        kana: "ジャラン ルルス、ラル ベロッ キリ。",
        ja: "まっすぐ行って、それから左に曲がってください。",
      },
      {
        speaker: "A",
        id: "Jauh tidak?",
        kana: "ジャウ ティダッ？",
        ja: "遠いですか？",
      },
      {
        speaker: "B",
        id: "Tidak, kira-kira lima menit jalan kaki.",
        kana: "ティダッ、キラキラ リマ ムニッ ジャラン カキ。",
        ja: "いいえ、歩いて5分くらいです。",
      },
      {
        speaker: "A",
        id: "Terima kasih banyak.",
        kana: "トゥリマ カシ バニャッ。",
        ja: "どうもありがとうございます。",
      },
      {
        speaker: "B",
        id: "Sama-sama.",
        kana: "サマサマ。",
        ja: "どういたしまして。",
      },
    ],
    words: [
      { id: "di mana", ja: "どこに" },
      { id: "stasiun", ja: "駅" },
      { id: "lurus", ja: "まっすぐ" },
      { id: "belok kiri / kanan", ja: "左へ / 右へ曲がる" },
      { id: "jauh", ja: "遠い" },
      { id: "tidak", ja: "〜ない・いいえ" },
      { id: "sama-sama", ja: "どういたしまして" },
    ],
  },
  {
    slug: "hotel",
    title: "ホテル",
    titleId: "Di Hotel",
    description: "チェックインと朝食の時間",
    emoji: "🏨",
    theme: "teal",
    roles: { A: "あなた", B: "フロント係" },
    lines: [
      {
        speaker: "B",
        id: "Selamat siang. Ada yang bisa saya bantu?",
        kana: "スラマッ シアン。アダ ヤン ビサ サヤ バントゥ？",
        ja: "こんにちは。ご用件をうかがいます。",
      },
      {
        speaker: "A",
        id: "Saya sudah pesan kamar atas nama Tanaka.",
        kana: "サヤ スダ プサン カマール アタス ナマ タナカ。",
        ja: "田中の名前で部屋を予約しています。",
      },
      {
        speaker: "B",
        id: "Baik. Boleh saya lihat paspor Anda?",
        kana: "バイッ。ボレ サヤ リハッ パスポール アンダ？",
        ja: "かしこまりました。パスポートを拝見できますか？",
      },
      {
        speaker: "A",
        id: "Ini paspor saya.",
        kana: "イニ パスポール サヤ。",
        ja: "これがわたしのパスポートです。",
      },
      {
        speaker: "B",
        id: "Terima kasih. Kamar Anda nomor tiga ratus dua.",
        kana: "トゥリマ カシ。カマール アンダ ノモール ティガ ラトゥス ドゥア。",
        ja: "ありがとうございます。お部屋は302号室です。",
      },
      {
        speaker: "A",
        id: "Sarapan jam berapa?",
        kana: "サラパン ジャム ブラパ？",
        ja: "朝食は何時ですか？",
      },
      {
        speaker: "B",
        id: "Dari jam enam sampai jam sepuluh.",
        kana: "ダリ ジャム ウナム サンパイ ジャム スプル。",
        ja: "6時から10時までです。",
      },
    ],
    words: [
      { id: "selamat siang", ja: "こんにちは（昼）" },
      { id: "sudah", ja: "もう〜した" },
      { id: "kamar", ja: "部屋" },
      { id: "boleh", ja: "〜してもよい" },
      { id: "sarapan", ja: "朝食" },
      { id: "jam berapa?", ja: "何時？" },
      { id: "dari 〜 sampai 〜", ja: "〜から〜まで" },
    ],
  },
]

export function getScene(slug: string): Scene | undefined {
  return SCENES.find((scene) => scene.slug === slug)
}
