/**
 * 種目の動きを見せる棒人間のポーズ。
 * 100 × 100 の座標で、床は y = 90。横向きの図は右を向いている。
 * 各種目は2つ以上のポーズを持ち、図はポーズの間を行き来して動きを見せる。
 *
 * 関節の名前: h 頭 / n 首（肩） / b 背中の中ほど（省略すると首と腰の中点）/ p 腰
 *            kf ff 手前の脚（ひざ・足）/ kb fb 奥の脚 / ef hf 手前の腕（ひじ・手）/ eb hb 奥の腕
 */
import type { ExerciseId } from "@/lib/workout/exercises"

export type Point = [number, number]

export type Pose = {
  h: Point
  n: Point
  b?: Point
  p: Point
  kf: Point
  ff: Point
  kb: Point
  fb: Point
  ef: Point
  hf: Point
  eb: Point
  hb: Point
}

export type Motion = {
  frames: Pose[]
  /** 1往復の秒数 */
  seconds: number
}

function pose(base: Pose, patch: Partial<Pose> = {}): Pose {
  return { ...base, ...patch }
}

/** 全身を上下にずらす（ジャンプ・背のび用）。足は残すかどうか選べる */
function lift(base: Pose, dy: number, keepFeet = false): Pose {
  const next = Object.fromEntries(
    Object.entries(base).map(([key, [x, y]]) => [key, [x, y - dy]])
  ) as unknown as Pose
  if (keepFeet) {
    next.ff = base.ff
    next.fb = base.fb
  }
  return next
}

// 横向きに立つ
const STAND: Pose = {
  h: [50, 16],
  n: [50, 27],
  p: [50, 52],
  kf: [51, 70],
  ff: [51, 89],
  kb: [49, 70],
  fb: [49, 89],
  ef: [52, 39],
  hf: [53, 51],
  eb: [48, 39],
  hb: [47, 51],
}

// 正面を向いて立つ
const FRONT: Pose = {
  h: [50, 15],
  n: [50, 26],
  p: [50, 52],
  kf: [45, 70],
  ff: [44, 89],
  kb: [55, 70],
  fb: [56, 89],
  ef: [42, 38],
  hf: [40, 51],
  eb: [58, 38],
  hb: [60, 51],
}

// スクワットの一番下（横向き）
const SQUAT_LOW: Pose = {
  h: [55, 36],
  n: [52, 45],
  p: [36, 67],
  kf: [57, 69],
  ff: [52, 89],
  kb: [56, 70],
  fb: [50, 89],
  ef: [63, 46],
  hf: [74, 45],
  eb: [62, 47],
  hb: [73, 46],
}

const SQUAT_HIGH = pose(STAND, { ef: [61, 31], hf: [72, 31], eb: [60, 32], hb: [71, 32] })

// 腕立ての上（右が頭）
const PUSH_UP: Pose = {
  h: [73, 58],
  n: [66, 62],
  p: [42, 74],
  kf: [29, 81],
  ff: [16, 88],
  kb: [29, 81],
  fb: [16, 88],
  ef: [66, 75],
  hf: [66, 88],
  eb: [66, 75],
  hb: [66, 88],
}

// ひじをついたプランク
const PLANK: Pose = {
  h: [72, 66],
  n: [64, 70],
  p: [42, 76],
  kf: [29, 82],
  ff: [16, 88],
  kb: [29, 82],
  fb: [16, 88],
  ef: [64, 88],
  hf: [76, 88],
  eb: [64, 88],
  hb: [76, 88],
}

// あお向け（左が頭）・ひざを立てる
const SUPINE: Pose = {
  h: [16, 82],
  n: [25, 85],
  p: [50, 86],
  kf: [62, 70],
  ff: [72, 88],
  kb: [62, 70],
  fb: [72, 88],
  ef: [36, 88],
  hf: [46, 88],
  eb: [36, 88],
  hb: [46, 88],
}

// 四つんばい（右が頭）
const QUAD: Pose = {
  h: [70, 60],
  n: [62, 65],
  p: [38, 66],
  kf: [38, 88],
  ff: [19, 88],
  kb: [38, 88],
  fb: [19, 88],
  ef: [62, 77],
  hf: [62, 88],
  eb: [62, 77],
  hb: [62, 88],
}

// うつ伏せ（右が頭）
const PRONE: Pose = {
  h: [77, 84],
  n: [68, 86],
  p: [44, 87],
  kf: [28, 88],
  ff: [12, 88],
  kb: [28, 88],
  fb: [12, 88],
  ef: [80, 88],
  hf: [92, 88],
  eb: [80, 88],
  hb: [92, 88],
}

// しゃがんで手を床につく（バーピー）
const CROUCH: Pose = {
  h: [67, 50],
  n: [60, 56],
  p: [43, 70],
  kf: [58, 73],
  ff: [50, 89],
  kb: [57, 74],
  fb: [48, 89],
  ef: [64, 72],
  hf: [66, 88],
  eb: [63, 72],
  hb: [65, 88],
}

const MARCH_A = pose(STAND, {
  kf: [61, 57],
  ff: [60, 74],
  ef: [44, 38],
  hf: [40, 47],
  eb: [56, 38],
  hb: [62, 31],
})
const MARCH_B = pose(STAND, {
  kb: [61, 57],
  fb: [60, 74],
  ef: [56, 38],
  hf: [62, 31],
  eb: [44, 38],
  hb: [40, 47],
})

const ARMS_UP_FRONT: Partial<Pose> = {
  ef: [38, 18],
  hf: [34, 7],
  eb: [62, 18],
  hb: [66, 7],
}

export const MOTIONS: Record<ExerciseId, Motion> = {
  march: { frames: [MARCH_A, MARCH_B], seconds: 1.4 },
  "arm-circle": {
    frames: [
      pose(STAND, { ef: [64, 22], hf: [54, 27], eb: [63, 23], hb: [53, 28] }),
      pose(STAND, { ef: [52, 9], hf: [53, 26], eb: [51, 10], hb: [52, 27] }),
      pose(STAND, { ef: [37, 22], hf: [47, 27], eb: [38, 23], hb: [48, 28] }),
    ],
    seconds: 2.4,
  },
  "hip-circle": {
    frames: [FRONT, pose(FRONT, { kf: [32, 58], ff: [38, 74] }), FRONT, pose(FRONT, { kb: [68, 58], fb: [62, 74] })],
    seconds: 3,
  },
  "torso-twist": {
    frames: [
      pose(FRONT, { ef: [40, 32], hf: [28, 30], eb: [46, 34], hb: [34, 34] }),
      pose(FRONT, { ef: [54, 34], hf: [66, 34], eb: [60, 32], hb: [72, 30] }),
    ],
    seconds: 2,
  },

  squat: { frames: [SQUAT_HIGH, SQUAT_LOW], seconds: 2.4 },
  "wide-squat": {
    frames: [
      pose(FRONT, { kf: [40, 70], ff: [32, 89], kb: [60, 70], fb: [68, 89], ef: [42, 36], hf: [50, 41], eb: [58, 36], hb: [50, 41] }),
      pose(FRONT, {
        h: [50, 29],
        n: [50, 40],
        p: [50, 64],
        kf: [35, 68],
        ff: [32, 89],
        kb: [65, 68],
        fb: [68, 89],
        ef: [42, 50],
        hf: [50, 55],
        eb: [58, 50],
        hb: [50, 55],
      }),
    ],
    seconds: 2.4,
  },
  "reverse-lunge": {
    frames: [
      STAND,
      pose(STAND, {
        h: [47, 30],
        n: [47, 41],
        p: [46, 66],
        kf: [64, 68],
        ff: [64, 89],
        kb: [37, 84],
        fb: [20, 88],
        ef: [49, 53],
        hf: [50, 64],
        eb: [45, 53],
        hb: [44, 64],
      }),
    ],
    seconds: 2.6,
  },
  "side-lunge": {
    frames: [
      pose(FRONT, { ef: [42, 42], hf: [50, 47], eb: [58, 42], hb: [50, 47] }),
      pose(FRONT, {
        h: [42, 30],
        n: [42, 41],
        p: [40, 64],
        kf: [28, 72],
        ff: [26, 89],
        kb: [56, 76],
        fb: [72, 89],
        ef: [36, 52],
        hf: [42, 57],
        eb: [48, 52],
        hb: [42, 57],
      }),
    ],
    seconds: 2.6,
  },
  "glute-bridge": {
    frames: [
      SUPINE,
      pose(SUPINE, { h: [16, 83], p: [50, 70], kf: [65, 66], kb: [65, 66] }),
    ],
    seconds: 2.6,
  },
  "calf-raise": { frames: [STAND, lift(STAND, 5, true)], seconds: 1.8 },
  "wall-sit": {
    frames: [
      pose(STAND, {
        h: [34, 25],
        n: [34, 36],
        p: [34, 62],
        kf: [54, 62],
        ff: [54, 89],
        kb: [53, 63],
        fb: [53, 89],
        ef: [37, 49],
        hf: [42, 60],
        eb: [36, 49],
        hb: [41, 60],
      }),
      pose(STAND, {
        h: [34, 24],
        n: [34, 35],
        p: [34, 62],
        kf: [54, 62],
        ff: [54, 89],
        kb: [53, 63],
        fb: [53, 89],
        ef: [37, 48],
        hf: [42, 59],
        eb: [36, 48],
        hb: [41, 59],
      }),
    ],
    seconds: 4,
  },

  "push-up": {
    frames: [
      PUSH_UP,
      pose(PUSH_UP, { h: [72, 76], n: [64, 80], p: [41, 84], kf: [28, 86], kb: [28, 86], ef: [56, 79], eb: [56, 79] }),
    ],
    seconds: 2.4,
  },
  "pike-push-up": {
    frames: [
      pose(PUSH_UP, { h: [63, 76], n: [60, 69], p: [42, 54], kf: [33, 71], kb: [33, 71], ff: [24, 88], fb: [24, 88], ef: [63, 78], eb: [63, 78] }),
      pose(PUSH_UP, { h: [65, 84], n: [60, 77], p: [42, 56], kf: [33, 72], kb: [33, 72], ff: [24, 88], fb: [24, 88], ef: [56, 80], eb: [56, 80] }),
    ],
    seconds: 2.4,
  },

  plank: { frames: [PLANK, pose(PLANK, { p: [42, 77], h: [72, 67] })], seconds: 4 },
  "side-plank": {
    frames: [
      pose(PLANK, { p: [44, 73], n: [64, 62], h: [70, 56], ef: [66, 88], hf: [76, 88], kf: [30, 81], kb: [30, 81], eb: [62, 50], hb: [62, 38] }),
      pose(PLANK, { p: [44, 71], n: [64, 61], h: [70, 55], ef: [66, 88], hf: [76, 88], kf: [30, 80], kb: [30, 80], eb: [62, 49], hb: [62, 37] }),
    ],
    seconds: 4,
  },
  "plank-shoulder-tap": {
    frames: [
      pose(PUSH_UP, { ef: [72, 72], hf: [64, 64] }),
      pose(PUSH_UP, { eb: [72, 72], hb: [64, 64] }),
    ],
    seconds: 1.6,
  },
  "bird-dog": {
    frames: [
      QUAD,
      pose(QUAD, { ef: [72, 63], hf: [84, 61], kf: [24, 65], ff: [9, 63] }),
    ],
    seconds: 3,
  },
  "dead-bug": {
    frames: [
      pose(SUPINE, { ef: [27, 73], hf: [29, 61], eb: [27, 73], hb: [29, 61], kf: [50, 70], ff: [66, 70], kb: [50, 70], fb: [66, 70] }),
      pose(SUPINE, { ef: [15, 76], hf: [4, 80], eb: [27, 73], hb: [29, 61], kf: [66, 83], ff: [82, 85], kb: [50, 70], fb: [66, 70] }),
    ],
    seconds: 3,
  },
  crunch: {
    frames: [
      pose(SUPINE, { ef: [22, 76], hf: [14, 80], eb: [22, 76], hb: [14, 80] }),
      pose(SUPINE, { h: [24, 67], n: [31, 74], ef: [34, 64], hf: [22, 70], eb: [34, 64], hb: [22, 70] }),
    ],
    seconds: 2.4,
  },
  superman: {
    frames: [
      PRONE,
      pose(PRONE, { h: [78, 77], n: [68, 82], ef: [80, 79], hf: [92, 75], eb: [80, 79], hb: [92, 75], kf: [28, 85], kb: [28, 85], ff: [12, 81], fb: [12, 81] }),
    ],
    seconds: 3,
  },
  "cat-cow": {
    frames: [
      pose(QUAD, { b: [50, 55], h: [66, 72] }),
      pose(QUAD, { b: [50, 73], h: [71, 55] }),
    ],
    seconds: 4,
  },

  "mountain-climber": {
    frames: [
      pose(PUSH_UP, { kf: [52, 75], ff: [44, 85] }),
      pose(PUSH_UP, { kb: [52, 75], fb: [44, 85] }),
    ],
    seconds: 0.9,
  },
  "jumping-jack": {
    frames: [
      FRONT,
      lift(pose(FRONT, { kf: [41, 70], ff: [34, 88], kb: [59, 70], fb: [66, 88], ...ARMS_UP_FRONT }), 3),
    ],
    seconds: 1.1,
  },
  "step-jack": {
    frames: [
      FRONT,
      pose(FRONT, { kf: [40, 70], ff: [32, 89], ...ARMS_UP_FRONT }),
      FRONT,
      pose(FRONT, { kb: [60, 70], fb: [68, 89], ...ARMS_UP_FRONT }),
    ],
    seconds: 2.4,
  },
  "squat-jump": {
    frames: [SQUAT_LOW, lift(pose(STAND, { ef: [57, 20], hf: [63, 11], eb: [56, 20], hb: [62, 11] }), 8)],
    seconds: 1.6,
  },
  "squat-calf": {
    frames: [SQUAT_LOW, lift(pose(STAND, { ef: [57, 20], hf: [63, 11], eb: [56, 20], hb: [62, 11] }), 4, true)],
    seconds: 2.4,
  },
  burpee: { frames: [STAND, CROUCH, PUSH_UP, CROUCH], seconds: 3 },
  "step-burpee": {
    frames: [STAND, CROUCH, pose(PUSH_UP, { kf: [52, 75], ff: [44, 85] }), PUSH_UP, CROUCH],
    seconds: 4.5,
  },
  "high-knees": { frames: [lift(MARCH_A, 2), lift(MARCH_B, 2)], seconds: 0.8 },
  skater: {
    frames: [
      pose(FRONT, { h: [42, 29], n: [43, 40], p: [41, 62], kf: [37, 74], ff: [35, 89], kb: [48, 76], fb: [58, 86], ef: [50, 46], hf: [58, 52], eb: [36, 46], hb: [28, 42] }),
      pose(FRONT, { h: [58, 29], n: [57, 40], p: [59, 62], kb: [63, 74], fb: [65, 89], kf: [52, 76], ff: [42, 86], eb: [50, 46], hb: [42, 52], ef: [64, 46], hf: [72, 42] }),
    ],
    seconds: 1.6,
  },

  "stretch-quad": {
    frames: [
      pose(STAND, { kb: [49, 71], fb: [40, 57], eb: [44, 46], hb: [40, 57] }),
      pose(STAND, { kb: [48, 72], fb: [39, 55], eb: [43, 45], hb: [39, 55] }),
    ],
    seconds: 4,
  },
  "stretch-hamstring": {
    frames: [
      pose(STAND, { h: [42, 50], n: [38, 60], p: [32, 86], kf: [55, 87], ff: [78, 88], kb: [55, 87], fb: [78, 88], ef: [46, 70], hf: [56, 80], eb: [46, 70], hb: [56, 80] }),
      pose(STAND, { h: [59, 66], n: [51, 70], p: [32, 86], kf: [55, 87], ff: [78, 88], kb: [55, 87], fb: [78, 88], ef: [62, 78], hf: [72, 84], eb: [62, 78], hb: [72, 84] }),
    ],
    seconds: 4,
  },
  "stretch-chest": {
    frames: [
      pose(STAND, { ef: [46, 40], hf: [42, 53], eb: [46, 40], hb: [42, 53] }),
      pose(STAND, { h: [49, 16], ef: [43, 39], hf: [36, 50], eb: [43, 39], hb: [36, 50] }),
    ],
    seconds: 4,
  },
  "stretch-glute": {
    frames: [
      pose(SUPINE, { kf: [58, 64], ff: [72, 72], kb: [70, 72], fb: [55, 64], ef: [40, 74], hf: [55, 66], eb: [40, 74], hb: [55, 66] }),
      pose(SUPINE, { kf: [50, 62], ff: [64, 66], kb: [64, 68], fb: [50, 60], ef: [36, 72], hf: [49, 63], eb: [36, 72], hb: [49, 63] }),
    ],
    seconds: 4,
  },
  breathing: {
    frames: [FRONT, pose(lift(FRONT, 1, true), { ef: [38, 36], hf: [34, 48], eb: [62, 36], hb: [66, 48] })],
    seconds: 6,
  },
}
