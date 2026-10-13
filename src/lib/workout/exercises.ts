/**
 * 道具を使わない種目のデータ。
 *
 * met は身体活動の強度（安静時 = 1）。成人の身体活動の強度表
 * （Compendium of Physical Activities）の自重トレーニングの区分を目安にした概算値で、
 * 消費カロリーの「推定」にだけ使う。
 *   - 強め（ジャンプ・バーピーなど）: 8.0
 *   - 中くらい（スクワット・ランジ・腕立てなど）: 3.8〜5.0
 *   - 軽め（体幹の静止系・ゆっくりした動き）: 2.8
 *   - ストレッチ: 2.3
 */

export type ExerciseId =
  | "march"
  | "arm-circle"
  | "hip-circle"
  | "torso-twist"
  | "squat"
  | "wide-squat"
  | "reverse-lunge"
  | "glute-bridge"
  | "calf-raise"
  | "wall-sit"
  | "push-up"
  | "pike-push-up"
  | "plank"
  | "side-plank"
  | "plank-shoulder-tap"
  | "bird-dog"
  | "dead-bug"
  | "crunch"
  | "superman"
  | "mountain-climber"
  | "jumping-jack"
  | "step-jack"
  | "squat-jump"
  | "squat-calf"
  | "burpee"
  | "step-burpee"
  | "high-knees"
  | "skater"
  | "side-lunge"
  | "cat-cow"
  | "stretch-quad"
  | "stretch-hamstring"
  | "stretch-chest"
  | "stretch-glute"
  | "breathing"

export type Exercise = {
  id: ExerciseId
  name: string
  /** 主に効く部位 */
  target: string
  /** 画面と音声で伝える動きのポイント（短く2〜3個） */
  cues: string[]
  met: number
  /** 跳ぶ・足音が出る種目。静音モードでは quietAlternative に置き換える */
  jumps?: boolean
  quietAlternative?: ExerciseId
  /** きついときの軽い版（画面にヒントとして出す） */
  easier?: string
}

const LIST: Exercise[] = [
  // ウォームアップ
  {
    id: "march",
    name: "その場足踏み",
    target: "全身",
    cues: ["腕を大きく振る", "ももを腰の高さまで上げる"],
    met: 3.5,
  },
  {
    id: "arm-circle",
    name: "肩まわし",
    target: "肩・肩甲骨",
    cues: ["指先を肩に置く", "ひじで大きな円をかく", "半分で逆回し"],
    met: 2.5,
  },
  {
    id: "hip-circle",
    name: "股関節まわし",
    target: "股関節",
    cues: ["片ひざを上げて外へ開く", "左右交互に"],
    met: 2.5,
  },
  {
    id: "torso-twist",
    name: "体ひねり",
    target: "背中・わき腹",
    cues: ["足は肩幅、腰は正面", "胸から左右にひねる"],
    met: 2.5,
  },

  // 下半身
  {
    id: "squat",
    name: "スクワット",
    target: "太もも・お尻",
    cues: ["足は肩幅、つま先はやや外", "椅子に座るようにお尻を引く", "ひざはつま先と同じ向き"],
    met: 5.0,
    easier: "浅めにしゃがむ",
  },
  {
    id: "wide-squat",
    name: "ワイドスクワット",
    target: "内もも・お尻",
    cues: ["足を大きく開く", "上体はまっすぐのまま腰を落とす"],
    met: 5.0,
    easier: "浅めにしゃがむ",
  },
  {
    id: "reverse-lunge",
    name: "バックランジ（左右交互）",
    target: "太もも・お尻",
    cues: ["片足を大きく後ろへ引く", "前のひざは90度", "前足のかかとで押し戻す"],
    met: 4.0,
    easier: "壁に手をついて行う",
  },
  {
    id: "side-lunge",
    name: "サイドランジ（左右交互）",
    target: "内もも・お尻",
    cues: ["横へ大きく一歩", "曲げた側のお尻を引く", "反対の脚はのばす"],
    met: 4.0,
    easier: "歩幅を小さくする",
  },
  {
    id: "glute-bridge",
    name: "ヒップリフト",
    target: "お尻・もも裏",
    cues: ["あお向けでひざを立てる", "お尻を上げて肩からひざを一直線", "上で1秒止める"],
    met: 3.5,
  },
  {
    id: "calf-raise",
    name: "カーフレイズ",
    target: "ふくらはぎ",
    cues: ["かかとを高く上げる", "ゆっくり下ろす"],
    met: 2.8,
  },
  {
    id: "wall-sit",
    name: "空気椅子（壁）",
    target: "太もも",
    cues: ["背中を壁につける", "ひざ90度で止まる", "呼吸は止めない"],
    met: 3.8,
    easier: "ひざの角度を浅くする",
  },

  // 上半身
  {
    id: "push-up",
    name: "腕立て伏せ",
    target: "胸・腕",
    cues: ["手は肩幅より少し広く", "頭からかかとを一直線", "胸を床に近づける"],
    met: 5.0,
    easier: "ひざをついて行う",
  },
  {
    id: "pike-push-up",
    name: "パイクプッシュアップ",
    target: "肩・腕",
    cues: ["お尻を高く上げて「へ」の字", "頭を手の間へ下ろす"],
    met: 5.0,
    easier: "ひじを軽く曲げるだけにする",
  },

  // 体幹
  {
    id: "plank",
    name: "プランク",
    target: "おなか・体幹",
    cues: ["ひじは肩の真下", "お尻を上げすぎない", "おなかに力を入れて呼吸"],
    met: 3.0,
    easier: "ひざをついて行う",
  },
  {
    id: "side-plank",
    name: "サイドプランク",
    target: "わき腹",
    cues: ["ひじは肩の真下", "体を一直線", "半分で左右を交代"],
    met: 3.0,
    easier: "下のひざをつく",
  },
  {
    id: "plank-shoulder-tap",
    name: "ショルダータッチ",
    target: "体幹・肩",
    cues: ["腕立ての姿勢", "片手で反対の肩にタッチ", "腰を揺らさない"],
    met: 4.0,
    easier: "ひざをついて行う",
  },
  {
    id: "bird-dog",
    name: "バードドッグ",
    target: "背中・体幹",
    cues: ["四つんばいになる", "右手と左足を同時にのばす", "左右交互にゆっくり"],
    met: 2.8,
  },
  {
    id: "dead-bug",
    name: "デッドバグ",
    target: "おなか",
    cues: ["あお向けで手足を上げる", "腰を床に押しつける", "対角の手足をのばす"],
    met: 2.8,
  },
  {
    id: "crunch",
    name: "クランチ",
    target: "おなか",
    cues: ["ひざを立ててあお向け", "おへそをのぞきこむ", "肩甲骨が浮くまで"],
    met: 3.8,
  },
  {
    id: "superman",
    name: "スーパーマン",
    target: "背中",
    cues: ["うつ伏せで手足をのばす", "手足を同時に少し浮かせる", "首は前を向かない"],
    met: 3.0,
  },
  {
    id: "cat-cow",
    name: "キャット＆カウ",
    target: "背骨",
    cues: ["四つんばいになる", "吐きながら背中を丸める", "吸いながら胸を開く"],
    met: 2.3,
  },

  // 有酸素（跳ぶ種目には静音の代わりを用意する）
  {
    id: "mountain-climber",
    name: "マウンテンクライマー",
    target: "全身・おなか",
    cues: ["腕立ての姿勢", "ひざを交互に胸へ引く", "お尻は肩の高さ"],
    met: 8.0,
    easier: "ゆっくり1回ずつ",
  },
  {
    id: "jumping-jack",
    name: "ジャンピングジャック",
    target: "全身",
    cues: ["跳んで手足を開く", "跳んで閉じる"],
    met: 8.0,
    jumps: true,
    quietAlternative: "step-jack",
  },
  {
    id: "step-jack",
    name: "ステップジャック",
    target: "全身",
    cues: ["片足ずつ横へ出す", "同時に腕を頭上へ", "リズムよく交互に"],
    met: 4.5,
  },
  {
    id: "squat-jump",
    name: "スクワットジャンプ",
    target: "下半身",
    cues: ["しゃがんでから真上に跳ぶ", "ひざを柔らかく着地"],
    met: 8.0,
    jumps: true,
    quietAlternative: "squat-calf",
  },
  {
    id: "squat-calf",
    name: "スクワット＋背のび",
    target: "下半身",
    cues: ["しゃがむ", "立ち上がってつま先立ち", "跳ばずに大きく"],
    met: 5.5,
  },
  {
    id: "burpee",
    name: "バーピー",
    target: "全身",
    cues: ["しゃがんで手をつく", "足を後ろへ跳ばす", "戻って真上にジャンプ"],
    met: 8.0,
    jumps: true,
    quietAlternative: "step-burpee",
  },
  {
    id: "step-burpee",
    name: "ステップバーピー",
    target: "全身",
    cues: ["しゃがんで手をつく", "片足ずつ後ろへ引く", "片足ずつ戻して立つ"],
    met: 6.0,
  },
  {
    id: "high-knees",
    name: "もも上げ",
    target: "全身",
    cues: ["その場で軽く走る", "ももを腰の高さまで"],
    met: 8.0,
    jumps: true,
    quietAlternative: "march",
  },
  {
    id: "skater",
    name: "スケーター",
    target: "お尻・脚",
    cues: ["横へ跳んで片足で着地", "後ろ脚は斜め後ろへ"],
    met: 7.0,
    jumps: true,
    quietAlternative: "side-lunge",
  },

  // クールダウン
  {
    id: "stretch-quad",
    name: "太もも前のストレッチ",
    target: "太もも前",
    cues: ["片足首を持ってかかとをお尻へ", "半分で左右交代"],
    met: 2.3,
  },
  {
    id: "stretch-hamstring",
    name: "もも裏のストレッチ",
    target: "もも裏",
    cues: ["座って片脚をのばす", "背すじをのばしたまま前へ倒す", "半分で左右交代"],
    met: 2.3,
  },
  {
    id: "stretch-chest",
    name: "胸のストレッチ",
    target: "胸・肩",
    cues: ["手を後ろで組む", "胸を開いて肩甲骨を寄せる"],
    met: 2.3,
  },
  {
    id: "stretch-glute",
    name: "お尻のストレッチ",
    target: "お尻",
    cues: ["あお向けで片足首を反対のひざへ", "ひざを胸へ引き寄せる", "半分で左右交代"],
    met: 2.3,
  },
  {
    id: "breathing",
    name: "深呼吸",
    target: "全身",
    cues: ["鼻から4秒吸う", "口から8秒かけて吐く"],
    met: 1.3,
  },
]

export const EXERCISES: Record<ExerciseId, Exercise> = Object.fromEntries(
  LIST.map((exercise) => [exercise.id, exercise])
) as Record<ExerciseId, Exercise>

/** 静音モードなら跳ぶ種目を代わりの種目に置き換える */
export function resolveExercise(id: ExerciseId, quiet: boolean): Exercise {
  const exercise = EXERCISES[id]
  if (quiet && exercise.jumps && exercise.quietAlternative) {
    return EXERCISES[exercise.quietAlternative]
  }
  return exercise
}
