# かなフラッシュ / ドロップクエスト

ブラウザだけで完結する、通信もログインもない小さなアプリを2つ収録しています。

| アプリ | パス | 内容 | 要件定義 |
| --- | --- | --- | --- |
| かなフラッシュ | `/` | ひらがな・カタカナをフラッシュカードで覚える学習アプリ | [`docs/requirements.md`](docs/requirements.md) |
| ドロップクエスト | `/puzzle` | ドロップをつないで戦うパズルRPG | [`docs/puzzle-requirements.md`](docs/puzzle-requirements.md) |

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # 盤面判定とダメージ計算のテスト
```

本番ビルドは `npm run build` → `npm run start`。

## かなフラッシュ

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

## ドロップクエスト

- 6×5 の盤面でドロップを動かし、3つ以上つなげて攻撃する（連鎖・コンボあり）
- 火・水・木・光・闇・回復の6種。属性相性とリーダースキルでダメージが変わる
- モンスター15種。ダンジョンのクリア報酬で仲間が増え、経験値と合成で育つ
- ダンジョンは5つ。クリアすると次が解放される
- 手持ち・編成・クリア状況は localStorage に保存される（端末を変えると引き継がれません）

遊んだ記録を消したいときは、ブラウザの開発者ツールで `dropquest.save.v1` を削除してください。

## 共有用の1枚 HTML

ファイルを渡して触ってもらいたいときは、両方のアプリを単一の HTML に束ねられます。

```bash
npm run build:demo                      # dist-demo/index.html
npm run build:demo -- dist-demo/a.html  # 出力先を変えるとき
```

表示に使う文字のフォントだけを埋め込むので、生成後はネット接続なしで動きます
（生成時のみ Google Fonts への通信が必要。取得できない場合は CDN 参照に切り替わります）。

Next.js のルーティングは使えないので、画面はハッシュで切り替えます
（`#` がかなフラッシュ、`#puzzle` がドロップクエスト）。ファイルを直接開いた
（`file://`）状態でも進行状況は保存されますが、ブラウザの設定によっては
保存できないことがあります。

## Vercel へのデプロイ

環境変数もビルド設定も不要です。

1. [vercel.com/new](https://vercel.com/new) を開き、このリポジトリを Import する
2. Framework Preset が **Next.js** になっていることを確認する（自動検出されます）
3. Deploy を押す

Production は `main`、それ以外のブランチへの push は自動でプレビュー URL が作られます。

## 構成

### かなフラッシュ

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

### ドロップクエスト

| パス | 役割 |
| --- | --- |
| `src/app/puzzle/page.tsx` | 画面の出し分け（ホーム / バトル / 結果 / 編成）と保存データの受け渡し |
| `src/components/puzzle/quest-home.tsx` | パーティ、ダンジョン選択、操作時間の設定 |
| `src/components/puzzle/battle-screen.tsx` | バトルの進行（コンボ演出・ダメージ・敵の行動） |
| `src/components/puzzle/orb-board.tsx` | 盤面の表示とドラッグ操作、操作の制限時間 |
| `src/components/puzzle/monster-screen.tsx` | パーティ編成と合成強化 |
| `src/components/puzzle/quest-result.tsx` | クリア報酬の表示 |
| `src/lib/puzzle/board.ts` | 盤面の生成、コンボ判定、落下・補充・連鎖 |
| `src/lib/puzzle/battle.ts` | 属性相性、ダメージと回復の計算、敵の行動 |
| `src/lib/puzzle/party.ts` | ステータス、レベルと経験値、合成 |
| `src/lib/puzzle/save.ts` | 保存データの初期化・復元、クリア報酬の適用 |
| `src/lib/puzzle/save-store.ts` | localStorage を React から購読するストア |
| `src/lib/puzzle/monsters.ts` | モンスター図鑑（バランス調整はここ） |
| `src/lib/puzzle/dungeons.ts` | 敵とダンジョン（バランス調整はここ） |
| `src/lib/puzzle/element-theme.ts` | 属性ごとの配色と記号 |

### 共通

| パス | 役割 |
| --- | --- |
| `src/components/ui/` | shadcn/ui のコンポーネント |
| `tests/puzzle/` | 盤面判定・ダメージ計算・育成・保存のテスト |
| `scripts/run-tests.mjs` | テストの実行（esbuild で束ねて `node --test`） |
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト |
| `scripts/demo-entry.tsx` | 1枚 HTML の入り口（ハッシュで画面を切り替える） |
| `scripts/demo-link.tsx` | 1枚 HTML での `next/link` の代わり |

## 技術

Next.js (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
