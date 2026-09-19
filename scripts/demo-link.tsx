/**
 * 共有用デモでの next/link の代わり。
 * 1枚の HTML には Next.js のルーティングがないので、ハッシュで行き来する。
 * （build-demo.mjs の alias で next/link をこのファイルに差し替えている）
 */
import type { AnchorHTMLAttributes } from "react"

type DemoLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

export default function DemoLink({ href, children, ...rest }: DemoLinkProps) {
  const hash = href === "/" ? "#" : `#${href.replace(/^\//, "")}`
  return (
    <a href={hash} {...rest}>
      {children}
    </a>
  )
}
