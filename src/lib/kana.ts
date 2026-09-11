export type Script = "hiragana" | "katakana"

export type RowId =
  | "a"
  | "ka"
  | "sa"
  | "ta"
  | "na"
  | "ha"
  | "ma"
  | "ya"
  | "ra"
  | "wa"
  | "n"

export type Kana = {
  /** 一覧やカードの key に使う一意な ID（例: "hiragana-a"） */
  id: string
  script: Script
  /** 表に出す文字（例: "あ"） */
  char: string
  /** 読み方のローマ字（例: "a"） */
  romaji: string
  row: RowId
  /** 裏に出す例単語 */
  word: string
  wordRomaji: string
  /** 例単語の意味（日本語） */
  wordMeaning: string
}

export type Row = {
  id: RowId
  /** ひらがな表記の行名（例: "あ行"） */
  label: string
  /** カタカナ表記の行名（例: "ア行"） */
  katakanaLabel: string
}

export const ROWS: Row[] = [
  { id: "a", label: "あ行", katakanaLabel: "ア行" },
  { id: "ka", label: "か行", katakanaLabel: "カ行" },
  { id: "sa", label: "さ行", katakanaLabel: "サ行" },
  { id: "ta", label: "た行", katakanaLabel: "タ行" },
  { id: "na", label: "な行", katakanaLabel: "ナ行" },
  { id: "ha", label: "は行", katakanaLabel: "ハ行" },
  { id: "ma", label: "ま行", katakanaLabel: "マ行" },
  { id: "ya", label: "や行", katakanaLabel: "ヤ行" },
  { id: "ra", label: "ら行", katakanaLabel: "ラ行" },
  { id: "wa", label: "わ行", katakanaLabel: "ワ行" },
  { id: "n", label: "ん", katakanaLabel: "ン" },
]

/** [文字, ローマ字, 例単語, 例単語のローマ字, 意味] */
type Entry = [string, string, string, string, string]

const HIRAGANA_ROWS: Record<RowId, Entry[]> = {
  a: [
    ["あ", "a", "あめ", "ame", "雨"],
    ["い", "i", "いぬ", "inu", "犬"],
    ["う", "u", "うみ", "umi", "海"],
    ["え", "e", "えき", "eki", "駅"],
    ["お", "o", "おに", "oni", "鬼"],
  ],
  ka: [
    ["か", "ka", "かさ", "kasa", "傘"],
    ["き", "ki", "きつね", "kitsune", "狐"],
    ["く", "ku", "くま", "kuma", "熊"],
    ["け", "ke", "けむり", "kemuri", "煙"],
    ["こ", "ko", "こえ", "koe", "声"],
  ],
  sa: [
    ["さ", "sa", "さかな", "sakana", "魚"],
    ["し", "shi", "しま", "shima", "島"],
    ["す", "su", "すいか", "suika", "西瓜"],
    ["せ", "se", "せかい", "sekai", "世界"],
    ["そ", "so", "そら", "sora", "空"],
  ],
  ta: [
    ["た", "ta", "たけ", "take", "竹"],
    ["ち", "chi", "ちず", "chizu", "地図"],
    ["つ", "tsu", "つき", "tsuki", "月"],
    ["て", "te", "てがみ", "tegami", "手紙"],
    ["と", "to", "とり", "tori", "鳥"],
  ],
  na: [
    ["な", "na", "なつ", "natsu", "夏"],
    ["に", "ni", "にわ", "niwa", "庭"],
    ["ぬ", "nu", "ぬの", "nuno", "布"],
    ["ね", "ne", "ねこ", "neko", "猫"],
    ["の", "no", "のはら", "nohara", "野原"],
  ],
  ha: [
    ["は", "ha", "はな", "hana", "花"],
    ["ひ", "hi", "ひかり", "hikari", "光"],
    ["ふ", "fu", "ふね", "fune", "船"],
    ["へ", "he", "へや", "heya", "部屋"],
    ["ほ", "ho", "ほし", "hoshi", "星"],
  ],
  ma: [
    ["ま", "ma", "まど", "mado", "窓"],
    ["み", "mi", "みず", "mizu", "水"],
    ["む", "mu", "むし", "mushi", "虫"],
    ["め", "me", "めがね", "megane", "眼鏡"],
    ["も", "mo", "もり", "mori", "森"],
  ],
  ya: [
    ["や", "ya", "やま", "yama", "山"],
    ["ゆ", "yu", "ゆき", "yuki", "雪"],
    ["よ", "yo", "よる", "yoru", "夜"],
  ],
  ra: [
    ["ら", "ra", "らくだ", "rakuda", "駱駝"],
    ["り", "ri", "りんご", "ringo", "林檎"],
    ["る", "ru", "るす", "rusu", "留守"],
    ["れ", "re", "れきし", "rekishi", "歴史"],
    ["ろ", "ro", "ろうそく", "rousoku", "蝋燭"],
  ],
  wa: [
    ["わ", "wa", "わたし", "watashi", "私"],
    ["を", "wo", "ほんをよむ", "hon o yomu", "本を読む（助詞）"],
  ],
  n: [["ん", "n", "みかん", "mikan", "蜜柑"]],
}

const KATAKANA_ROWS: Record<RowId, Entry[]> = {
  a: [
    ["ア", "a", "アイス", "aisu", "氷菓子"],
    ["イ", "i", "イベント", "ibento", "催し"],
    ["ウ", "u", "ウール", "uuru", "羊毛"],
    ["エ", "e", "エアコン", "eakon", "冷暖房機"],
    ["オ", "o", "オレンジ", "orenji", "だいだい色の果物"],
  ],
  ka: [
    ["カ", "ka", "カメラ", "kamera", "写真機"],
    ["キ", "ki", "キッチン", "kicchin", "台所"],
    ["ク", "ku", "クラス", "kurasu", "学級"],
    ["ケ", "ke", "ケーキ", "keeki", "洋菓子"],
    ["コ", "ko", "コーヒー", "koohii", "珈琲"],
  ],
  sa: [
    ["サ", "sa", "サラダ", "sarada", "生野菜の料理"],
    ["シ", "shi", "シャツ", "shatsu", "上半身の衣類"],
    ["ス", "su", "スープ", "suupu", "汁物"],
    ["セ", "se", "セーター", "seetaa", "毛糸の上着"],
    ["ソ", "so", "ソファ", "sofa", "長椅子"],
  ],
  ta: [
    ["タ", "ta", "タオル", "taoru", "手ぬぐい"],
    ["チ", "chi", "チーズ", "chiizu", "乳製品"],
    ["ツ", "tsu", "ツアー", "tsuaa", "団体旅行"],
    ["テ", "te", "テレビ", "terebi", "受像機"],
    ["ト", "to", "トマト", "tomato", "赤い野菜"],
  ],
  na: [
    ["ナ", "na", "ナイフ", "naifu", "小刀"],
    ["ニ", "ni", "ニュース", "nyuusu", "報道"],
    ["ヌ", "nu", "ヌードル", "nuudoru", "麺"],
    ["ネ", "ne", "ネクタイ", "nekutai", "襟飾り"],
    ["ノ", "no", "ノート", "nooto", "帳面"],
  ],
  ha: [
    ["ハ", "ha", "ハンカチ", "hankachi", "手ふき布"],
    ["ヒ", "hi", "ヒーター", "hiitaa", "暖房器具"],
    ["フ", "fu", "フォーク", "fooku", "洋食の食具"],
    ["ヘ", "he", "ヘリコプター", "herikoputaa", "回転翼機"],
    ["ホ", "ho", "ホテル", "hoteru", "宿泊施設"],
  ],
  ma: [
    ["マ", "ma", "マスク", "masuku", "口おおい"],
    ["ミ", "mi", "ミルク", "miruku", "牛乳"],
    ["ム", "mu", "ムード", "muudo", "雰囲気"],
    ["メ", "me", "メニュー", "menyuu", "品書き"],
    ["モ", "mo", "モデル", "moderu", "模型・模範"],
  ],
  ya: [
    ["ヤ", "ya", "ヤシ", "yashi", "南国の木"],
    ["ユ", "yu", "ユニフォーム", "yunifoomu", "制服"],
    ["ヨ", "yo", "ヨガ", "yoga", "健康体操"],
  ],
  ra: [
    ["ラ", "ra", "ラジオ", "rajio", "放送受信機"],
    ["リ", "ri", "リボン", "ribon", "飾りひも"],
    ["ル", "ru", "ルール", "ruuru", "規則"],
    ["レ", "re", "レモン", "remon", "黄色い果物"],
    ["ロ", "ro", "ロボット", "robotto", "人造の機械"],
  ],
  wa: [
    ["ワ", "wa", "ワイン", "wain", "ぶどう酒"],
    ["ヲ", "wo", "ヲ", "wo", "今はほとんど使わない文字"],
  ],
  n: [["ン", "n", "パン", "pan", "焼いた食べ物"]],
}

function build(script: Script, rows: Record<RowId, Entry[]>): Kana[] {
  return ROWS.flatMap((row) =>
    rows[row.id].map(([char, romaji, word, wordRomaji, wordMeaning]) => ({
      id: `${script}-${char}`,
      script,
      char,
      romaji,
      row: row.id,
      word,
      wordRomaji,
      wordMeaning,
    }))
  )
}

export const HIRAGANA: Kana[] = build("hiragana", HIRAGANA_ROWS)
export const KATAKANA: Kana[] = build("katakana", KATAKANA_ROWS)

export function getKana(script: Script): Kana[] {
  return script === "hiragana" ? HIRAGANA : KATAKANA
}

export function rowLabel(row: Row, script: Script): string {
  return script === "hiragana" ? row.label : row.katakanaLabel
}

/** 行ごとの枚数（ホーム画面の「◯枚」表示用） */
export function rowCount(rowId: RowId): number {
  return HIRAGANA_ROWS[rowId].length
}
