# 学習アプリ

ブラウザだけで完結する学習アプリを2本収めています。通信もログインもありません。

| ページ | アプリ | 内容 |
| --- | --- | --- |
| `/` | かなフラッシュ | ひらがな・カタカナをフラッシュカードで覚える |
| `/toeic` | TOEIC トレーナー | 頻出フレーズと TOEIC Part 5・Part 7 を間隔反復で解く |

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

800点を目標に、頻出フレーズ・Part 5（短文穴埋め）・Part 7（読解）を解くための
個人用アプリです。収録は合計388問。

- **フレーズカード** 150枚。頻出のコロケーションと定型表現を6分類（動詞＋名詞 /
  動詞＋前置詞 / 形容詞＋前置詞 / 前置詞句 / ビジネス定型 / 名詞句）で収録。
  1枚ごとに意味・例文・和訳と、紛らわしい語との違いの補足が付く
- **Part 5** 180問。文法・語彙の10カテゴリ × 基礎12問・応用6問。
  応用は仮定法、倒置、譲歩の as、意味の近い語の使い分けなどを扱う
- **Part 7** 15セット58問。応用の2セットは、2通の文書を突き合わせないと
  解けないマルチプルパッセージ
- 難易度は **基礎（600〜730点帯）** と **応用（730〜860点帯）** を選べる
- 全問に日本語の解説つき。Part 5 は和訳、Part 7 は本文の和訳も見られる
- 解くたびに正誤を記録し、**間違えた問題は当日中、正解した問題は
  1日 → 3日 → 7日 → 14日 → 30日** の順に間隔をあけて出題する
- 1問ごとの解答時間を表示（目安はフレーズ15秒、Part 5 が20秒、Part 7 が60秒）
- 学習記録はブラウザの localStorage にだけ保存する。サーバーには何も送らない

問題はすべてこのリポジトリ用の書き下ろしで、公式問題集や市販教材からの転載は
していません。要件の詳細は
[`docs/toeic-requirements.md`](docs/toeic-requirements.md) を参照してください。

> **学習記録について**
> 記録は開いた端末のブラウザにのみ残ります。別の端末には引き継がれず、
> ブラウザのサイトデータを削除すると消えます。`localhost:3000` と
> `localhost:3001` はブラウザ上は別サイト扱いなので、記録も別になります。

### 問題を足すとき

問題データは `src/lib/toeic/` にあります。難易度帯ごとにファイルを分けています。

| ファイル | 中身 |
| --- | --- |
| `phrases.ts` | フレーズカード150枚 |
| `part5-questions.ts` | Part 5 基礎120問 |
| `part5-advanced.ts` | Part 5 応用60問 |
| `part7-sets.ts` | Part 7 基礎10セット |
| `part7-advanced.ts` | Part 7 応用5セット |

追加したら検算してください。

```bash
npm run check:toeic
```

id の重複、空所の数、選択肢の重複、正解番号の範囲、解説・和訳の有無、
フレーズの重複を検査し、正解の位置（A〜D）の分布を表示します。位置で
当てられないよう、Part 5 基礎はカテゴリごとに 3/3/3/3、応用と Part 7 は
全体でほぼ均等に配分してあります。

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
| `src/components/toeic/document-view.tsx` | Part 7 の文書表示（複数文書対応）と和訳の切替 |
| `src/components/toeic/phrase-view.tsx` | フレーズカードの表と裏 |
| `src/lib/toeic/phrases.ts` | フレーズカードのデータ |
| `src/lib/toeic/part5-questions.ts` | Part 5 基礎の問題データ |
| `src/lib/toeic/part5-advanced.ts` | Part 5 応用の問題データ |
| `src/lib/toeic/part7-sets.ts` | Part 7 基礎の文書と設問 |
| `src/lib/toeic/part7-advanced.ts` | Part 7 応用の文書と設問 |
| `src/lib/toeic/content.ts` | 収録コンテンツのまとめ口と件数 |
| `src/lib/toeic/srs.ts` | 間隔反復の計算と集計 |
| `src/lib/toeic/session.ts` | 出題セットの組み立て |
| `src/lib/toeic/storage.ts` | localStorage への読み書き |
| `src/lib/toeic/category.ts` | カテゴリ・分類・難易度の表示名と配色 |
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
