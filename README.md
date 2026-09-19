# 学習アプリ

ブラウザだけで完結する学習アプリを2本収めています。通信もログインもありません。

| ページ | アプリ | 内容 |
| --- | --- | --- |
| `/` | かなフラッシュ | ひらがな・カタカナをフラッシュカードで覚える |
| `/toeic` | TOEIC トレーナー | TOEIC Part 5・Part 7 を間隔反復で解く |

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000
```

本番ビルドは `npm run build` → `npm run start`。

---

## かなフラッシュ（`/`）

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

要件の詳細は [`docs/requirements.md`](docs/requirements.md) を参照してください。

### 共有用の1枚 HTML

リンクを渡して触ってもらいたいときは、かなフラッシュを単一の HTML に束ねられます。

```bash
npm run build:demo      # dist-demo/index.html
```

表示に使う文字のフォントだけを埋め込むので、生成後はネット接続なしで動きます
（生成時のみ Google Fonts への通信が必要。取得できない場合は CDN 参照に切り替わります）。

束ねる対象は `/` のページだけです。TOEIC トレーナーは含まれないため、`/` に置いた
TOEIC への導線はこのビルドでは消えます（`NEXT_PUBLIC_SINGLE_FILE_DEMO` で切り替え）。

---

## TOEIC トレーナー（`/toeic`）

700点前後を目標に、Part 5（短文穴埋め）と Part 7（読解）を解くための個人用アプリです。

- **Part 5** 120問。文法・語彙の10カテゴリ（品詞・動詞の形・態・前置詞・接続詞・
  代名詞・関係詞・比較・準動詞・語彙）× 各12問
- **Part 7** 10文書・34問。Eメール、お知らせ、広告、記事、チャット、帳票
- 全問に日本語の解説つき。Part 5 は和訳、Part 7 は本文の和訳も見られる
- 解くたびに正誤を記録し、**間違えた問題は当日中、正解した問題は
  1日 → 3日 → 7日 → 14日 → 30日** の順に間隔をあけて出題する
- 1問ごとの解答時間を表示（目安は Part 5 が20秒、Part 7 が60秒）
- 学習記録はブラウザの localStorage にだけ保存する。サーバーには何も送らない

問題はすべてこのリポジトリ用の書き下ろしで、公式問題集や市販教材からの転載は
していません。要件の詳細は
[`docs/toeic-requirements.md`](docs/toeic-requirements.md) を参照してください。

### 問題を足すとき

問題データは `src/lib/toeic/part5-questions.ts` と
`src/lib/toeic/part7-passages.ts` にあります。追加したら検算してください。

```bash
npm run check:toeic
```

id の重複、空所の数、選択肢の重複、正解番号の範囲、解説・和訳の有無を検査し、
正解の位置（A〜D）の分布を表示します。位置で当てられないよう、Part 5 は
カテゴリごとに 3/3/3/3 に均してあります。

---

## Vercel へのデプロイ

環境変数もビルド設定も不要です。

1. [vercel.com/new](https://vercel.com/new) を開き、このリポジトリを Import する
2. Framework Preset が **Next.js** になっていることを確認する（自動検出されます）
3. Deploy を押す

Production は `main`、それ以外のブランチへの push は自動でプレビュー URL が作られます。

## 構成

| パス | 役割 |
| --- | --- |
| `src/app/page.tsx` | かなフラッシュの画面の出し分け（ホーム / 練習 / 結果） |
| `src/components/home-screen.tsx` | 文字種・行・シャッフルの設定画面 |
| `src/components/study-screen.tsx` | 出題と回答の記録 |
| `src/components/result-screen.tsx` | 正答率と復習の導線 |
| `src/components/flash-card.tsx` | 3Dでめくれるカード |
| `src/lib/kana.ts` | かなのデータ（文字・ローマ字・例単語） |
| `src/lib/study.ts` | デッキの生成、シャッフル、集計 |
| `src/lib/row-theme.ts` | 行ごとの配色 |
| `src/app/toeic/page.tsx` | TOEIC トレーナーの画面の出し分けと設定の保持 |
| `src/app/toeic/layout.tsx` | TOEIC ページのメタ情報と背景 |
| `src/components/toeic/toeic-home-screen.tsx` | 集計・メニュー・出題範囲の設定画面 |
| `src/components/toeic/toeic-study-screen.tsx` | 出題、計時、正誤判定と解説 |
| `src/components/toeic/toeic-result-screen.tsx` | 正答率、カテゴリ別、復習の導線 |
| `src/components/toeic/choice-list.tsx` | 4択の選択肢 |
| `src/components/toeic/passage-view.tsx` | Part 7 の文書表示と和訳の切替 |
| `src/lib/toeic/part5-questions.ts` | Part 5 の問題データ（120問） |
| `src/lib/toeic/part7-passages.ts` | Part 7 の文書と設問（10文書34問） |
| `src/lib/toeic/srs.ts` | 間隔反復の計算と集計 |
| `src/lib/toeic/session.ts` | 出題セットの組み立て |
| `src/lib/toeic/storage.ts` | localStorage への読み書き |
| `src/lib/toeic/category.ts` | カテゴリの表示名と配色 |
| `src/components/ui/` | shadcn/ui のコンポーネント |
| `scripts/build-demo.mjs` | かなフラッシュを1枚の HTML へ束ねるスクリプト |
| `scripts/check-toeic-data.mjs` | TOEIC の問題データの検算 |

## 技術

Next.js (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。TOEIC トレーナーの英文だけは、
読みやすさを優先して端末標準のサンセリフ（`.font-english`）に切り替えています。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
