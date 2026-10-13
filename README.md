# かなフラッシュ

ひらがな・カタカナをフラッシュカードで覚える学習デモアプリ。
通信は一切なく、ブラウザだけで完結します。

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

要件の詳細は [`docs/requirements.md`](docs/requirements.md) を参照してください。

## おうち筋トレ20（`/workout`）

同じアプリの中に、道具を使わない自宅トレーニングのアプリも入っています。

- 毎日20分（ウォームアップ3分 + メイン14分 + ストレッチ3分）、曜日ごとにメニューが変わる
- 初級 / 中級 / 上級、ジャンプしない静音モード、音声ガイド付きのタイマー
- 体重を記録して「1年で −3kg」の目標ラインと比べられる
- 全種目に動きのアニメーション図、食事の工夫のワンタップ記録
- 毎日のリマインダー（スマホのカレンダーに登録 / アプリを開いている間の通知）
- 記録は端末のブラウザに保存（通信なし）。「設定」タブからバックアップ・復元できる

要件は [`docs/workout-requirements.md`](docs/workout-requirements.md)。

### スマホで使う

ホーム画面に追加できるウェブアプリ（PWA）になっています。一度開けば通信がなくても起動します。

1. 下の「Vercel へのデプロイ」で公開する（スマホから開くには https の URL が必要）
2. スマホのブラウザで `https://<公開先>/workout` を開く
3. iPhone は Safari の共有ボタン →「ホーム画面に追加」、Android は表示される「ホーム画面に追加する」ボタン
   （出ない場合はブラウザのメニュー →「ホーム画面に追加」）

記録は端末のブラウザに保存されます。iPhone では Safari とホーム画面のアプリで保存場所が分かれるため、
記録を始める前に追加してください。

| ファイル | 役割 |
| --- | --- |
| `public/workout/manifest.webmanifest` | アプリ名・アイコン・起動 URL（`/workout`） |
| `public/workout/icons/` | アイコン（`icon.svg` が元絵） |
| `public/workout-sw.js` | オフライン用の Service Worker（`/workout` だけを受け持つ） |
| `src/lib/workout/pwa.ts` | Service Worker の登録と「ホーム画面に追加」の判定 |
1枚の HTML にする場合は `npm run build:workout`（`dist-demo/workout.html`）。

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
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト（`--app workout` で筋トレ版） |
| `src/app/workout/` | おうち筋トレ20 のページ |
| `src/components/workout/` | 今日 / トレーニング中 / 終了 / 記録 / 目標 の各画面 |
| `src/lib/workout/` | 種目データ、20分の組み立て、カロリー推定、目標計算、保存 |

## 技術

Next.js (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
