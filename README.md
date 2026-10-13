# かなフラッシュ

ひらがな・カタカナをフラッシュカードで覚える学習デモアプリ。
通信は一切なく、ブラウザだけで完結します。

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

要件の詳細は [`docs/requirements.md`](docs/requirements.md) を参照してください。

## 社労士 毎日30分（`/sharoushi`）

社会保険労務士試験を毎日30分・1年で目指す学習アプリも同じリポジトリに入っています。
`npm run dev` のあと http://localhost:3000/sharoushi を開いてください。

- 今日: 復習＋新しい問題10問の「今日のメニュー」、試験までの日数、学習時間、連続学習日数
- 振り返り: 間隔反復（1→3→7→14→30→60日）の復習、前回間違えた問題、苦手な問題、科目別の進み具合
- 模試: 7科目区分×2問のミニ模試（択一式・制限時間つき）と受験記録
- 計画: インプット期 → アウトプット期 → 直前期 の年間計画、試験日・目標時間の設定
- 確認: 解説の下に根拠条文へのリンク、「条文で確認した」「誤りを報告」ボタン。報告内容はコピーして修正依頼に使える

共有用の1枚 HTML は `npm run build:demo:sharoushi`（`dist-demo/sharoushi.html`）で作れます。
学習記録はブラウザの localStorage に保存されます。要件と未対応事項は
[`docs/sharoushi-requirements.md`](docs/sharoushi-requirements.md) を参照してください。

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000
```

本番ビルドは `npm run build` → `npm run start`。

## 共有用の1枚 HTML

リンクを渡して触ってもらいたいときは、アプリ全体を単一の HTML に束ねられます。

```bash
npm run build:demo      # dist-demo/index.html
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
| `src/app/sharoushi/page.tsx` | 社労士アプリの画面の出し分け |
| `src/components/sharoushi/` | 社労士アプリの各タブ・出題・模試の画面 |
| `src/lib/sharoushi/questions/` | 社労士の問題データ（一問一答、科目ごとのファイル） |
| `scripts/check-questions.mjs` | 問題データの検査（`npm run check:questions`） |
| `src/lib/sharoushi/plan.ts` | 年間計画と毎日のメニューの組み立て |
| `src/lib/sharoushi/srs.ts` | 間隔反復の計算 |
| `src/lib/sharoushi/mock.ts` | 模試の生成と採点 |
| `src/lib/sharoushi/store.ts` | 学習記録の保存（localStorage） |
| `src/lib/sharoushi/law-links.ts` | 根拠欄から条文の検索リンクを作る |
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト |

## 技術

Next.js (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
