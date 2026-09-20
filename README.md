# かなフラッシュ / ハングルフラッシュ

通信なしでブラウザだけで完結する学習デモアプリ。ふたつのアプリが同居しています。

## かなフラッシュ（`/`）

ひらがな・カタカナをフラッシュカードで覚える。

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

要件の詳細は [`docs/requirements.md`](docs/requirements.md) を参照してください。

## ハングルフラッシュ（`/korean`）

韓国語の単語と基本的なあいさつを、カードと4択クイズで覚える。

- あいさつ・お礼と返事・自己紹介・数字・食べもの・買いもの・移動・毎日のことば・困ったときの9分野、96語を収録
- 1語ごとに、ハングル・カタカナ読み・ローマ字・意味・使う場面のメモを表示
- 「カード」と「4択クイズ」、出題の向き（韓国語 → 日本語 / 日本語 → 韓国語）を選べる
- 結果画面で正答率が出て、まちがえた語だけ復習できる

要件の詳細は [`docs/requirements-korean.md`](docs/requirements-korean.md) を参照してください。

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000
```

本番ビルドは `npm run build` → `npm run start`。

## 共有用の1枚 HTML

リンクを渡して触ってもらいたいときは、アプリ全体を単一の HTML に束ねられます。

```bash
npm run build:demo             # dist-demo/index.html（かなフラッシュ）
npm run build:demo:korean      # dist-demo/korean.html（ハングルフラッシュ）
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
| `src/app/layout.tsx` | 共通のレイアウトと、ふたつのアプリを行き来する切り替え |
| `src/app/page.tsx` | かな: 画面の出し分け（ホーム / 練習 / 結果）と設定の保持 |
| `src/components/home-screen.tsx` | かな: 文字種・行・シャッフルの設定画面 |
| `src/components/study-screen.tsx` | かな: 出題と回答の記録 |
| `src/components/result-screen.tsx` | かな: 正答率と復習の導線 |
| `src/components/flash-card.tsx` | かな: 3Dでめくれるカード |
| `src/lib/kana.ts` | かなのデータ（文字・ローマ字・例単語） |
| `src/lib/row-theme.ts` | かな: 行ごとの配色 |
| `src/app/korean/page.tsx` | 韓国語: 画面の出し分けと設定の保持 |
| `src/app/korean/layout.tsx` | 韓国語: メタデータとハングル用フォントの読み込み |
| `src/components/korean/home-screen.tsx` | 韓国語: 練習の形・向き・分野・シャッフルの設定画面 |
| `src/components/korean/card-screen.tsx` | 韓国語: カードでの出題と回答の記録 |
| `src/components/korean/quiz-screen.tsx` | 韓国語: 4択クイズの出題と正誤の表示 |
| `src/components/korean/result-screen.tsx` | 韓国語: 正答率と復習の導線 |
| `src/components/korean/word-card.tsx` | 韓国語: 3Dでめくれるカード |
| `src/lib/korean.ts` | 韓国語のデータ（ハングル・読み・意味・メモ） |
| `src/lib/korean-study.ts` | 韓国語: デッキとクイズの選択肢の生成 |
| `src/lib/korean-theme.ts` | 韓国語: 分野ごとの配色 |
| `src/lib/study.ts` | 共通: シャッフルと集計 |
| `src/components/ui/` | shadcn/ui のコンポーネント |
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト（アプリ名を引数で指定） |

## 技術

Next.js (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

ハングルは M PLUS Rounded 1c に字形が無いため、`/korean` でのみ Noto Sans KR を
追加で読み込みます（同じ理由で Google Fonts 参照）。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
