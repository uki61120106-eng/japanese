# かなフラッシュ

ひらがな・カタカナをフラッシュカードで覚える学習デモアプリ。
通信は一切なく、ブラウザだけで完結します。

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

要件の詳細は [`docs/requirements.md`](docs/requirements.md) を参照してください。

### インドネシア語会話「Ayo Bicara!」（`/indonesian`）

場面別の会話で、インドネシア語を読んで・聞いて・ロールプレイで練習するページ。

- 6場面（あいさつ・自己紹介・買い物・レストラン・道案内・ホテル）を収録
- 各セリフにカタカナ読みと日本語訳、ブラウザ内蔵の音声で読み上げ（ゆっくり再生あり）
- ロールプレイでは役を選び、自分の番に日本語の意味に合う文を3択で選んで会話を進める

要件と、次の段階（AI との自由会話）の論点は
[`docs/indonesian-requirements.md`](docs/indonesian-requirements.md) を参照してください。

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000（インドネシア語は /indonesian）
```

本番ビルドは `npm run build` → `npm run start`。

## 共有用の1枚 HTML

リンクを渡して触ってもらいたいときは、アプリ全体を単一の HTML に束ねられます。

```bash
npm run build:demo               # dist-demo/index.html（かなフラッシュ）
npm run build:demo:indonesian    # dist-demo/indonesian.html（Ayo Bicara!）
```

表示に使う文字のフォントだけを埋め込むので、生成後はネット接続なしで動きます
（生成時のみ Google Fonts への通信が必要。取得できない場合は CDN 参照に切り替わります）。

## Vercel へのデプロイ

環境変数もビルド設定も不要です。

1. [vercel.com/new](https://vercel.com/new) を開き、このリポジトリを Import する
2. Framework Preset が **Next.js** になっていることを確認する（自動検出されます）
3. Deploy を押す

Production は `main`、それ以外のブランチへの push は自動でプレビュー URL が作られます。

## 構成

| パス | 役割 |
| --- | --- |
| `src/app/page.tsx` | 画面の出し分け（ホーム / 練習 / 結果）と設定の保持 |
| `src/components/home-screen.tsx` | 文字種・行・シャッフルの設定画面 |
| `src/components/study-screen.tsx` | 出題と回答の記録 |
| `src/components/result-screen.tsx` | 正答率と復習の導線 |
| `src/components/flash-card.tsx` | 3Dでめくれるカード |
| `src/lib/kana.ts` | かなのデータ（文字・ローマ字・例単語） |
| `src/lib/study.ts` | デッキの生成、シャッフル、集計 |
| `src/lib/row-theme.ts` | 行ごとの配色 |
| `src/components/ui/` | shadcn/ui のコンポーネント |
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト |
| `src/app/indonesian/page.tsx` | インドネシア語会話ページ |
| `src/components/indonesian/` | 場面一覧・会話表示・ロールプレイの画面 |
| `src/lib/indonesian/scenes.ts` | 会話データ（文・カタカナ読み・訳・語彙） |
| `src/lib/indonesian/roleplay.ts` | ロールプレイの出題（選択肢の生成） |
| `src/lib/indonesian/use-speech.ts` | ブラウザ内蔵の読み上げ |

## 技術

Next.js (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
