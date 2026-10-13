/**
 * 問題データの1行。科目ごとのファイルにこの形で並べる。
 * [ID, 記述が正しければ true, 問題文, 解説, 根拠条文]
 *
 * ID は学習記録のキー。一度公開したら変えないこと（内容の修正は可）。
 */
export type Entry = [
  id: string,
  answer: boolean,
  statement: string,
  explanation: string,
  basis: string,
]
