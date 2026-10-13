/**
 * 英会話デモで出題するフレーズ。通信せずに済むよう、データはここに同梱する。
 * 収録範囲は初心者レベル（中学1〜2年程度の語彙・文型）に限定している。
 */

export type GroupId = "daily" | "travel"

export type SceneId =
  | "greeting"
  | "self"
  | "thanks"
  | "airport"
  | "shopping"
  | "restaurant"
  | "direction"

export type Phrase = {
  /** 一覧やカードの key に使う一意な ID（例: "greeting-1"） */
  id: string
  scene: SceneId
  /** 覚える英語のフレーズ */
  en: string
  /** 日本語の意味。出題時はこちらを先に見せる */
  ja: string
  /** 読み方のカタカナ。音声が使えない環境でも発音の見当がつくように */
  kana: string
  /** 使い方のひとこと */
  note: string
  /** 相手から返ってくる典型的な一言（会話の形で覚えるため） */
  reply?: { en: string; ja: string }
}

export type Scene = {
  id: SceneId
  group: GroupId
  /** 画面に出す場面名（例: "あいさつ"） */
  label: string
  /** 場面の補足（例: "朝・昼・夜のあいさつ"） */
  description: string
}

export type Group = {
  id: GroupId
  label: string
}

export const GROUPS: Group[] = [
  { id: "daily", label: "あいさつ・自己紹介" },
  { id: "travel", label: "旅行・買い物・レストラン" },
]

export const SCENES: Scene[] = [
  {
    id: "greeting",
    group: "daily",
    label: "あいさつ",
    description: "朝・昼・夜のあいさつ",
  },
  {
    id: "self",
    group: "daily",
    label: "自己紹介",
    description: "名前・出身・仕事",
  },
  {
    id: "thanks",
    group: "daily",
    label: "お礼とおわび",
    description: "感謝とおわび",
  },
  {
    id: "airport",
    group: "travel",
    label: "空港と移動",
    description: "チケットと乗り物",
  },
  {
    id: "shopping",
    group: "travel",
    label: "買い物",
    description: "値段をきいて買う",
  },
  {
    id: "restaurant",
    group: "travel",
    label: "レストラン",
    description: "注文からお会計まで",
  },
  {
    id: "direction",
    group: "travel",
    label: "道をたずねる",
    description: "場所と行き方をきく",
  },
]

/** [英語, 日本語, カタカナ, ひとこと, 返事の英語?, 返事の日本語?] */
type Entry = [string, string, string, string, string?, string?]

const SCENE_PHRASES: Record<SceneId, Entry[]> = {
  greeting: [
    [
      "Hello.",
      "こんにちは。",
      "ハロー",
      "時間帯を選ばず使える、いちばん安全なあいさつ。",
      "Hi. How are you?",
      "やあ。元気ですか？",
    ],
    [
      "Good morning.",
      "おはようございます。",
      "グッド モーニング",
      "昼までは morning、昼すぎは afternoon、夕方からは evening。",
      "Good morning.",
      "おはようございます。",
    ],
    [
      "How are you?",
      "元気ですか？",
      "ハウ アー ユー",
      "あいさつの続きに置く一言。深い意味はない。",
      "I'm good, thanks. And you?",
      "元気です、ありがとう。あなたは？",
    ],
    [
      "I'm fine, thank you.",
      "元気です、ありがとう。",
      "アイム ファイン、サンキュー",
      "How are you? への返し。And you? を足すと会話が続く。",
    ],
    [
      "Nice to meet you.",
      "はじめまして。",
      "ナイス トゥ ミート ユー",
      "初対面のときだけ。2回目以降は Nice to see you.",
      "Nice to meet you, too.",
      "こちらこそ、はじめまして。",
    ],
    [
      "See you later.",
      "またね。",
      "シー ユー レイター",
      "別れぎわの定番。later を tomorrow に変えてもよい。",
      "See you.",
      "またね。",
    ],
    [
      "Have a good day.",
      "よい一日を。",
      "ハヴ ア グッド デイ",
      "店や窓口で別れるときによく使う。",
      "You too.",
      "あなたも。",
    ],
    [
      "Good night.",
      "おやすみなさい。",
      "グッド ナイト",
      "夜の別れぎわと、寝る前のあいさつ。",
    ],
  ],

  self: [
    [
      "My name is Ken.",
      "私の名前はケンです。",
      "マイ ネイム イズ ケン",
      "くだけた場では I'm Ken. で十分。",
      "Nice to meet you, Ken.",
      "はじめまして、ケンさん。",
    ],
    [
      "I'm from Japan.",
      "日本から来ました。",
      "アイム フロム ジャパン",
      "出身地にも「今どこから来たか」にも使える。",
    ],
    [
      "I live in Tokyo.",
      "東京に住んでいます。",
      "アイ リヴ イン トーキョー",
      "都市名の前は in。番地まで言うときは at。",
    ],
    [
      "I work at a city office.",
      "市役所で働いています。",
      "アイ ワーク アット ア シティ オフィス",
      "勤め先は at、職種を言うときは I'm a teacher. の形。",
    ],
    [
      "What do you do?",
      "お仕事は何ですか？",
      "ワット ドゥ ユー ドゥー",
      "直訳は「何をしていますか」だが、仕事をきく決まり文句。",
      "I'm a teacher.",
      "教師です。",
    ],
    [
      "Where are you from?",
      "どちらのご出身ですか？",
      "ウェア アー ユー フロム",
      "自己紹介のあとに続けると会話が広がる。",
      "I'm from Canada.",
      "カナダから来ました。",
    ],
    [
      "I like music.",
      "音楽が好きです。",
      "アイ ライク ミュージック",
      "like のあとは名詞か -ing（I like cooking.）。",
    ],
    [
      "I don't speak English very well.",
      "英語はあまり得意ではありません。",
      "アイ ドント スピーク イングリッシュ ヴェリー ウェル",
      "先に伝えておくと、相手がゆっくり話してくれる。",
    ],
  ],

  thanks: [
    [
      "Thank you very much.",
      "ありがとうございます。",
      "サンキュー ヴェリー マッチ",
      "短く言うなら Thanks. だけでもよい。",
      "You're welcome.",
      "どういたしまして。",
    ],
    [
      "You're welcome.",
      "どういたしまして。",
      "ユア ウェルカム",
      "No problem. も同じ場面で使える。",
    ],
    [
      "I'm sorry.",
      "ごめんなさい。",
      "アイム ソーリー",
      "おわびの言葉。人を呼び止めるときは Excuse me.",
      "That's OK.",
      "大丈夫ですよ。",
    ],
    [
      "Excuse me.",
      "すみません。",
      "エクスキューズ ミー",
      "呼びかけ・前を通る・聞き返すときに使う。",
    ],
    [
      "Could you help me?",
      "手伝ってもらえますか？",
      "クッジュー ヘルプ ミー",
      "Could you 〜? は Can you 〜? よりていねい。",
      "Sure.",
      "もちろんです。",
    ],
    [
      "Thanks for your help.",
      "手伝ってくれてありがとう。",
      "サンクス フォー ユア ヘルプ",
      "for のあとに感謝の中身を置く。",
    ],
    [
      "I'm sorry I'm late.",
      "遅れてすみません。",
      "アイム ソーリー アイム レイト",
      "理由を足すなら The train was late. など。",
    ],
    [
      "No problem.",
      "問題ありません。",
      "ノー プロブレム",
      "お礼にも、おわびにも返せる便利な一言。",
    ],
  ],

  airport: [
    [
      "Where is the check-in counter?",
      "チェックインカウンターはどこですか？",
      "ウェア イズ ザ チェックイン カウンター",
      "Where is 〜? は場所をきく基本形。",
      "It's over there.",
      "あちらです。",
    ],
    [
      "I have one bag.",
      "荷物は1つです。",
      "アイ ハヴ ワン バッグ",
      "預ける荷物の数をきかれたときの答え。",
    ],
    [
      "I'm here for sightseeing.",
      "観光で来ました。",
      "アイム ヒア フォー サイトシーイング",
      "入国審査の定番。仕事なら for business。",
    ],
    [
      "One ticket to Osaka, please.",
      "大阪まで1枚ください。",
      "ワン チケット トゥ オオサカ、プリーズ",
      "〜, please. をつけるだけでていねいになる。",
    ],
    [
      "What time does the train leave?",
      "電車は何時に出ますか？",
      "ワット タイム ダズ ザ トレイン リーヴ",
      "train を bus や flight に置き換えて使える。",
      "At three thirty.",
      "3時30分です。",
    ],
    [
      "Is this seat taken?",
      "この席は空いていますか？",
      "イズ ジス シート テイクン",
      "直訳は「取られていますか」。空席の確認に使う。",
      "No, go ahead.",
      "いいえ、どうぞ。",
    ],
    [
      "Could you say that again?",
      "もう一度言ってもらえますか？",
      "クッジュー セイ ザット アゲン",
      "聞き取れないときの命綱。遠慮せず使う。",
    ],
    [
      "I missed my train.",
      "電車に乗り遅れました。",
      "アイ ミスト マイ トレイン",
      "miss は「乗りそこなう」。過去形は missed。",
    ],
  ],

  shopping: [
    [
      "How much is this?",
      "これはいくらですか？",
      "ハウ マッチ イズ ジス",
      "値段をきく基本形。複数なら How much are these?",
      "It's ten dollars.",
      "10ドルです。",
    ],
    [
      "I'm just looking.",
      "見ているだけです。",
      "アイム ジャスト ルッキング",
      "声をかけられたときの断り方。角が立たない。",
    ],
    [
      "Do you have this in blue?",
      "これの青はありますか？",
      "ドゥ ユー ハヴ ジス イン ブルー",
      "色は in 〜、サイズは in a larger size。",
      "Let me check.",
      "確認しますね。",
    ],
    [
      "Can I try this on?",
      "試着してもいいですか？",
      "キャナイ トライ ジス オン",
      "try on で「身につけて試す」。",
      "Sure. The fitting room is over there.",
      "どうぞ。試着室はあちらです。",
    ],
    [
      "It's too expensive.",
      "高すぎます。",
      "イッツ トゥー エクスペンシヴ",
      "too は「〜すぎる」。買わないと伝えるときに。",
    ],
    [
      "I'll take this one.",
      "これをください。",
      "アイル テイク ジス ワン",
      "買うと決めたときの一言。",
    ],
    [
      "Do you take credit cards?",
      "クレジットカードは使えますか？",
      "ドゥ ユー テイク クレジット カーズ",
      "現金は cash。Cash only. と言われたら現金のみ。",
    ],
    [
      "Can I have a bag?",
      "袋をもらえますか？",
      "キャナイ ハヴ ア バッグ",
      "Can I have 〜? は物を求めるときの万能形。",
    ],
  ],

  restaurant: [
    [
      "A table for two, please.",
      "2人です。",
      "ア テイブル フォー トゥー、プリーズ",
      "入口で人数を伝える形。数字だけ入れ替える。",
      "This way, please.",
      "こちらへどうぞ。",
    ],
    [
      "Can I see the menu?",
      "メニューを見せてください。",
      "キャナイ シー ザ メニュー",
      "メニューは「メヌー」に近い発音。",
      "Here you are.",
      "どうぞ。",
    ],
    [
      "I'll have this one.",
      "これをお願いします。",
      "アイル ハヴ ジス ワン",
      "メニューを指さしながら言えば確実に伝わる。",
    ],
    [
      "Water, please.",
      "お水をください。",
      "ウォーター、プリーズ",
      "単語＋please でも失礼にならない。",
    ],
    [
      "Is this spicy?",
      "これは辛いですか？",
      "イズ ジス スパイシー",
      "苦手なものは I can't eat 〜. で伝える。",
      "Yes, a little.",
      "はい、少しだけ。",
    ],
    [
      "It's delicious.",
      "おいしいです。",
      "イッツ デリシャス",
      "店の人に言うと喜ばれる。",
    ],
    [
      "Check, please.",
      "お会計をお願いします。",
      "チェック、プリーズ",
      "イギリスでは Bill, please. が一般的。",
    ],
    [
      "Can I get this to go?",
      "持ち帰りできますか？",
      "キャナイ ゲット ジス トゥ ゴー",
      "to go で「持ち帰り」。店内で食べるなら for here。",
    ],
  ],

  direction: [
    [
      "Excuse me, where is the station?",
      "すみません、駅はどこですか？",
      "エクスキューズ ミー、ウェア イズ ザ ステイション",
      "まず Excuse me. で呼び止めてから本題に入る。",
      "It's right over there.",
      "すぐそこです。",
    ],
    [
      "How do I get to the museum?",
      "美術館へはどう行けばいいですか？",
      "ハウ ドゥ アイ ゲット トゥ ザ ミュージアム",
      "get to 〜 で「〜にたどり着く」。",
    ],
    [
      "Is it far from here?",
      "ここから遠いですか？",
      "イズ イット ファー フロム ヒア",
      "近ければ It's close. と返ってくる。",
      "No, it's about five minutes.",
      "いいえ、5分ほどです。",
    ],
    [
      "How long does it take?",
      "どのくらいかかりますか？",
      "ハウ ロング ダズ イット テイク",
      "所要時間をきく形。料金は How much does it cost?",
      "About ten minutes.",
      "10分くらいです。",
    ],
    [
      "Go straight and turn right.",
      "まっすぐ行って右に曲がってください。",
      "ゴー ストレイト アンド ターン ライト",
      "道案内する側の言い方。left なら左。",
    ],
    [
      "It's next to the bank.",
      "銀行のとなりです。",
      "イッツ ネクスト トゥ ザ バンク",
      "向かいは across from、前は in front of。",
    ],
    [
      "Can you show me on the map?",
      "地図で示してもらえますか？",
      "キャン ユー ショウ ミー オン ザ マップ",
      "言葉で分からないときは地図を出して頼む。",
    ],
    [
      "I'm lost.",
      "道に迷いました。",
      "アイム ロスト",
      "2語で助けを求められる。まず使えるようにしたい一言。",
    ],
  ],
}

function buildPhrases(): Phrase[] {
  return SCENES.flatMap((scene) =>
    SCENE_PHRASES[scene.id].map(([en, ja, kana, note, replyEn, replyJa], i) => ({
      id: `${scene.id}-${i + 1}`,
      scene: scene.id,
      en,
      ja,
      kana,
      note,
      ...(replyEn && replyJa ? { reply: { en: replyEn, ja: replyJa } } : {}),
    }))
  )
}

export const PHRASES: Phrase[] = buildPhrases()

export function getScene(id: SceneId): Scene {
  const scene = SCENES.find((s) => s.id === id)
  if (!scene) {
    throw new Error(`未知のシーン: ${id}`)
  }
  return scene
}

export function phrasesOf(scene: SceneId): Phrase[] {
  return PHRASES.filter((phrase) => phrase.scene === scene)
}

export function sceneCount(scene: SceneId): number {
  return SCENE_PHRASES[scene].length
}
