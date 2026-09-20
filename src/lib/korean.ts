export type CategoryId =
  | "greeting"
  | "thanks"
  | "intro"
  | "number"
  | "food"
  | "shop"
  | "travel"
  | "daily"
  | "trouble"

export type Word = {
  /** 一覧やカードの key に使う一意な ID（例: "greeting-1"） */
  id: string
  category: CategoryId
  /** ハングル表記（例: "안녕하세요"） */
  hangul: string
  /** カタカナでの読み（例: "アンニョンハセヨ"） */
  kana: string
  /** ローマ字表記（文化観光部2000年式）（例: "annyeonghaseyo"） */
  romaji: string
  /** 日本語の意味 */
  meaning: string
  /** 使う場面のメモ。無いことばもある */
  note?: string
}

export type Category = {
  id: CategoryId
  /** ホームのチップに出す短い名前（例: "あいさつ"） */
  label: string
}

export const CATEGORIES: Category[] = [
  { id: "greeting", label: "あいさつ" },
  { id: "thanks", label: "お礼と返事" },
  { id: "intro", label: "自己紹介" },
  { id: "number", label: "数字" },
  { id: "food", label: "食べもの" },
  { id: "shop", label: "買いもの" },
  { id: "travel", label: "移動・場所" },
  { id: "daily", label: "毎日のことば" },
  { id: "trouble", label: "困ったとき" },
]

/** [ハングル, カタカナ読み, ローマ字, 意味, 使う場面のメモ] */
type Entry = [string, string, string, string, string?]

const ENTRIES: Record<CategoryId, Entry[]> = {
  greeting: [
    [
      "안녕하세요",
      "アンニョンハセヨ",
      "annyeonghaseyo",
      "こんにちは",
      "朝・昼・夜のどの時間でも使える基本のあいさつ",
    ],
    [
      "안녕",
      "アンニョン",
      "annyeong",
      "やあ / じゃあね",
      "親しい友だちや年下に使うくだけた形",
    ],
    [
      "안녕히 계세요",
      "アンニョンヒ ケセヨ",
      "annyeonghi gyeseyo",
      "さようなら（残る人へ）",
      "自分が先に帰るとき、その場に残る相手に言う",
    ],
    [
      "안녕히 가세요",
      "アンニョンヒ カセヨ",
      "annyeonghi gaseyo",
      "さようなら（帰る人へ）",
      "自分が残り、相手が帰っていくときに言う",
    ],
    [
      "안녕히 주무세요",
      "アンニョンヒ チュムセヨ",
      "annyeonghi jumuseyo",
      "おやすみなさい",
      "年上の人へ。友だちには 잘 자（チャル ジャ）",
    ],
    [
      "처음 뵙겠습니다",
      "チョウム ペプケッスムニダ",
      "cheoeum boepgetseumnida",
      "はじめてお目にかかります",
      "初対面のあらたまった場面で",
    ],
    [
      "반갑습니다",
      "パンガプスムニダ",
      "bangapseumnida",
      "お会いできてうれしいです",
      "名前を伝えたあとに続けると自然",
    ],
    [
      "오랜만이에요",
      "オレンマニエヨ",
      "oraenmanieyo",
      "お久しぶりです",
      "오래간만이에요（オレガンマニエヨ）の縮まった形",
    ],
    [
      "잘 지냈어요?",
      "チャル チネッソヨ",
      "jal jinaesseoyo",
      "お元気でしたか",
      "久しぶりに会った相手に",
    ],
    [
      "어서 오세요",
      "オソ オセヨ",
      "eoseo oseyo",
      "いらっしゃいませ",
      "お店や家に相手を迎えるときのことば",
    ],
    [
      "수고하셨습니다",
      "スゴハショッスムニダ",
      "sugohasyeotseumnida",
      "お疲れさまでした",
      "仕事や作業を終えた相手へ",
    ],
    [
      "잘 부탁합니다",
      "チャル プタッカムニダ",
      "jal butakamnida",
      "よろしくお願いします",
    ],
  ],
  thanks: [
    [
      "감사합니다",
      "カムサハムニダ",
      "gamsahamnida",
      "ありがとうございます",
      "いちばん広く使える丁寧なお礼",
    ],
    [
      "고맙습니다",
      "コマプスムニダ",
      "gomapseumnida",
      "ありがとうございます",
      "감사합니다 と同じ意味の固有語。やわらかい響き",
    ],
    ["천만에요", "チョンマネヨ", "cheonmaneyo", "どういたしまして"],
    [
      "죄송합니다",
      "チェソンハムニダ",
      "joesonghamnida",
      "申し訳ありません",
      "あらたまった謝罪",
    ],
    [
      "미안해요",
      "ミアネヨ",
      "mianhaeyo",
      "ごめんなさい",
      "親しい相手へのやわらかい謝罪",
    ],
    [
      "괜찮아요",
      "クェンチャナヨ",
      "gwaenchanayo",
      "大丈夫です",
      "「けっこうです」と断るときにも使う",
    ],
    ["네", "ネ", "ne", "はい"],
    ["아니요", "アニヨ", "aniyo", "いいえ"],
    [
      "실례합니다",
      "シルレハムニダ",
      "sillyehamnida",
      "失礼します",
      "声をかけるとき・席を立つときに",
    ],
    ["잘 먹겠습니다", "チャル モッケッスムニダ", "jal meokgetseumnida", "いただきます"],
    [
      "잘 먹었습니다",
      "チャル モゴッスムニダ",
      "jal meogeotseumnida",
      "ごちそうさまでした",
    ],
  ],
  intro: [
    ["저", "チョ", "jeo", "わたし", "丁寧な「わたし」。친구 には 나（ナ）"],
    ["이름", "イルム", "ireum", "名前"],
    ["이름이 뭐예요?", "イルミ ムォエヨ", "ireumi mwoyeyo", "お名前は何ですか"],
    [
      "일본 사람",
      "イルボン サラム",
      "ilbon saram",
      "日本人",
      "사람 は「人」。国名＋사람 で「〜人」",
    ],
    ["한국 사람", "ハングク サラム", "hanguk saram", "韓国人"],
    [
      "한국어",
      "ハングゴ",
      "hangugeo",
      "韓国語",
      "話しことばでは 한국말（ハングンマル）も使う",
    ],
    ["학생", "ハクセン", "haksaeng", "学生"],
    ["회사원", "フェサウォン", "hoesawon", "会社員"],
    ["만나서 반가워요", "マンナソ パンガウォヨ", "mannaseo bangawoyo", "会えてうれしいです"],
    [
      "저는 일본에서 왔어요",
      "チョヌン イルボネソ ワッソヨ",
      "jeoneun ilboneseo wasseoyo",
      "わたしは日本から来ました",
    ],
  ],
  number: [
    ["일", "イル", "il", "1（いち）", "漢数詞。日付・電話番号・値段に使う"],
    ["이", "イ", "i", "2（に）"],
    ["삼", "サム", "sam", "3（さん）"],
    ["사", "サ", "sa", "4（よん）"],
    ["오", "オ", "o", "5（ご）"],
    ["육", "ユク", "yuk", "6（ろく）"],
    ["칠", "チル", "chil", "7（なな）"],
    ["팔", "パル", "pal", "8（はち）"],
    ["구", "ク", "gu", "9（きゅう）"],
    ["십", "シプ", "sip", "10（じゅう）"],
    ["하나", "ハナ", "hana", "ひとつ", "固有数詞。個数や年齢を数えるときに使う"],
    ["둘", "トゥル", "dul", "ふたつ"],
    ["셋", "セッ", "set", "みっつ"],
    ["넷", "ネッ", "net", "よっつ"],
    ["다섯", "タソッ", "daseot", "いつつ"],
  ],
  food: [
    ["물", "ムル", "mul", "水"],
    ["밥", "パプ", "bap", "ごはん", "「食事」の意味でも使う"],
    ["김치", "キムチ", "gimchi", "キムチ"],
    ["불고기", "プルゴギ", "bulgogi", "プルコギ（甘辛い焼き肉）"],
    ["비빔밥", "ピビムパプ", "bibimbap", "ビビンバ"],
    ["라면", "ラミョン", "ramyeon", "ラーメン", "インスタント麺を指すことが多い"],
    ["커피", "コピ", "keopi", "コーヒー"],
    ["맥주", "メクチュ", "maekju", "ビール"],
    ["맛있어요", "マシッソヨ", "masisseoyo", "おいしいです"],
    ["매워요", "メウォヨ", "maewoyo", "辛いです"],
  ],
  shop: [
    ["얼마예요?", "オルマエヨ", "eolmayeyo", "いくらですか"],
    ["이거 주세요", "イゴ チュセヨ", "igeo juseyo", "これください", "주세요 で「〜ください」"],
    ["계산해 주세요", "ケサネ ジュセヨ", "gyesanhae juseyo", "お会計をお願いします"],
    ["돈", "トン", "don", "お金"],
    ["가게", "カゲ", "gage", "店"],
    ["카드", "カドゥ", "kadeu", "カード", "クレジットカードのこと"],
    ["봉투", "ポントゥ", "bongtu", "袋"],
    ["있어요?", "イッソヨ", "isseoyo", "ありますか"],
    ["싸요", "サヨ", "ssayo", "安いです"],
    ["비싸요", "ピッサヨ", "bissayo", "高いです"],
  ],
  travel: [
    ["어디예요?", "オディエヨ", "eodiyeyo", "どこですか"],
    ["역", "ヨク", "yeok", "駅"],
    ["화장실", "ファジャンシル", "hwajangsil", "トイレ"],
    ["지하철", "チハチョル", "jihacheol", "地下鉄"],
    ["버스", "ポス", "beoseu", "バス"],
    ["택시", "テクシ", "taeksi", "タクシー"],
    ["공항", "コンハン", "gonghang", "空港"],
    ["호텔", "ホテル", "hotel", "ホテル"],
    ["오른쪽", "オルンチョク", "oreunjjok", "右"],
    ["왼쪽", "ウェンチョク", "oenjjok", "左"],
    ["여기", "ヨギ", "yeogi", "ここ"],
  ],
  daily: [
    ["집", "チプ", "jip", "家"],
    ["학교", "ハッキョ", "hakgyo", "学校"],
    ["회사", "フェサ", "hoesa", "会社"],
    ["친구", "チング", "chingu", "友だち"],
    ["가족", "カジョク", "gajok", "家族"],
    ["오늘", "オヌル", "oneul", "今日"],
    ["내일", "ネイル", "naeil", "明日"],
    ["시간", "シガン", "sigan", "時間"],
    ["책", "チェク", "chaek", "本"],
    ["사랑", "サラン", "sarang", "愛"],
  ],
  trouble: [
    ["도와주세요", "トワジュセヨ", "dowajuseyo", "助けてください"],
    ["모르겠어요", "モルゲッソヨ", "moreugesseoyo", "わかりません"],
    ["다시 말해 주세요", "タシ マレ ジュセヨ", "dasi malhae juseyo", "もう一度言ってください"],
    [
      "천천히 말해 주세요",
      "チョンチョニ マレ ジュセヨ",
      "cheoncheonhi malhae juseyo",
      "ゆっくり話してください",
    ],
    [
      "일본어 할 수 있어요?",
      "イルボノ ハル ス イッソヨ",
      "ilboneo hal su isseoyo",
      "日本語ができますか",
    ],
    ["병원", "ピョンウォン", "byeongwon", "病院"],
    ["경찰", "キョンチャル", "gyeongchal", "警察"],
  ],
}

function build(): Word[] {
  return CATEGORIES.flatMap((category) =>
    ENTRIES[category.id].map(([hangul, kana, romaji, meaning, note], index) => ({
      id: `${category.id}-${index + 1}`,
      category: category.id,
      hangul,
      kana,
      romaji,
      meaning,
      note,
    }))
  )
}

export const WORDS: Word[] = build()

/** カテゴリごとの語数（ホーム画面の「◯語」表示用） */
export function categoryCount(categoryId: CategoryId): number {
  return ENTRIES[categoryId].length
}

export function categoryLabel(categoryId: CategoryId): string {
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? ""
}
