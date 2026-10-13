import { GYOSEI } from "@/lib/gyosei/content/statements-gyosei"
import { KENPO, KISO } from "@/lib/gyosei/content/statements-kiso-kenpo"
import { MINPO } from "@/lib/gyosei/content/statements-minpo"
import { CHISHIKI, SHOHO } from "@/lib/gyosei/content/statements-shoho-chishiki"
import { TRAPS } from "@/lib/gyosei/content/statements-traps"
import type { Statement } from "@/lib/gyosei/types"

export { KIJUTSU, TASHI } from "@/lib/gyosei/content/written"
export {
  SUBJECTS,
  SUBJECT_MAP,
  SUBJECT_THEME,
  topicName,
} from "@/lib/gyosei/content/subjects"

export const STATEMENTS: Statement[] = [
  ...KISO,
  ...KENPO,
  ...GYOSEI,
  ...MINPO,
  ...SHOHO,
  ...CHISHIKI,
  ...TRAPS,
]

export const STATEMENT_MAP = new Map(STATEMENTS.map((item) => [item.id, item]))
