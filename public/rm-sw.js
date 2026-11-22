/**
 * RM 計算機 の Service Worker（/rm だけを受け持つ）。public/workout-sw.js と同じ作り。
 * 一度開けば、通信のない場所でもアプリを開けるようにする。
 *
 *   画面（HTML）        : 通信を優先し、つながらなければ保存しておいたものを返す
 *   /_next/static/ など : ファイル名にハッシュが付いて中身が変わらないので、保存を優先
 *   Google Fonts        : 保存を返しつつ裏で更新する
 */
const CACHE = "rm-calculator-v1"
const PAGE = "/rm"
const PRECACHE = [
  PAGE,
  "/rm/manifest.webmanifest",
  "/rm/icons/icon-192.png",
  "/rm/icons/icon-512.png",
  "/rm/icons/apple-touch-icon.png",
]

/** 画面の HTML が読み込む JS / CSS もまとめて保存する（初回から通信なしで開けるように） */
async function precache() {
  const cache = await caches.open(CACHE)
  await cache.addAll(PRECACHE)
  const response = await cache.match(PAGE)
  if (!response) return
  const html = await response.text()
  const assets = [...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map(
    (match) => match[1]
  )
  await cache.addAll([...new Set(assets)])
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()))
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(PAGE, response.clone())
    return response
  } catch {
    return (await cache.match(PAGE)) ?? Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  const update = fetch(request)
    .then((response) => {
      // フォントは別ドメインなので中身の見えない応答（opaque）も保存する
      if (response.ok || response.type === "opaque") cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  return cached ?? update
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return
  const url = new URL(request.url)

  if (request.mode === "navigate" && url.pathname === PAGE) {
    event.respondWith(networkFirst(request))
    return
  }
  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/rm/")) {
      event.respondWith(cacheFirst(request))
    }
    return
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(request))
  }
})
