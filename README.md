# かなフラッシュ

ひらがな・カタカナをフラッシュカードで覚える学習デモアプリ。
通信は一切なく、ブラウザだけで完結します。

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

要件の詳細は [`docs/requirements.md`](docs/requirements.md) を参照してください。

## そろばん ドリル（`/soroban`）

そろばん（珠算）4〜6級レベルの練習問題アプリも同じプロジェクトに入っています。
小学生が一人で使えるよう、画面の文字はほぼひらがなにしています。

- 級（6級 / 5級 / 4級）・種目（かけざん / わりざん / みとりざん / ぜんぶまぜる）・問題数（5 / 10 / 20）を選ぶ
- 画面のテンキー（パソコンではキーボード）で答えを入れると、すぐに ○ / × と正解が出る
- 結果画面で正答数・正答率・かかった時間と、1問ずつのふりかえりが見られる
- まちがえた問題だけをもう一度解ける
- スマホ向け：出題中は1画面に収まり、問題とテンキーの間でスクロールしない。とても背の低い画面で見取算が入りきらないときは「したに つづくよ」と出す

問題はその場でランダムに作ります。わり算は必ずわりきれ、見取算は途中の合計がマイナスにならないようにしています。

級ごとの桁数・口数は `src/lib/soroban.ts` の `LEVELS` にまとめています。
検定の主催団体によって規定が少しずつ違うため、**現在の値は目安**です。
教室や受検予定の検定に合わせて数字を書きかえてください。

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000
```

本番ビルドは `npm run build` → `npm run start`。

## 共有用の1枚 HTML

リンクを渡して触ってもらいたいときは、アプリ全体を単一の HTML に束ねられます。

```bash
npm run build:demo      # dist-demo/index.html（かなフラッシュ）
npm run build:soroban   # dist-demo/soroban.html（そろばん ドリル）
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
| `src/app/soroban/page.tsx` | そろばん ドリルのページ |
| `src/components/soroban/` | そろばん ドリルの画面（設定 / 出題 / 結果 / 問題の表示） |
| `src/lib/soroban.ts` | 級ごとの出題設定と問題の生成 |
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト（`--app=kana\|soroban`） |

## 技術

Next.js (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
