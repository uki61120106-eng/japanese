/**
 * next/link の差し替え。
 *
 * 1枚 HTML のビルドでは Next のルーターが無く、next/link を読み込むと
 * ランタイムの process 参照が残って動かなくなる。素の <a> に置き換える。
 */
import type { ComponentProps } from "react"

export default function Link(props: ComponentProps<"a">) {
  return <a {...props} />
}
