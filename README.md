# アプリ集

ブラウザだけで動くアプリを収録しています。トップページから選びます。

| アプリ | パス | 内容 |
| --- | --- | --- |
| かなフラッシュ | `/kana` | ひらがな・カタカナ92字をフラッシュカードで覚える |
| えいかいわフラッシュ | `/english` | 初心者向けの英会話フレーズ56個と会話21本を、聞き流し・カード・発音チェックで覚える |
| おうち筋トレ20 | `/workout` | 道具なし・毎日20分の自宅トレーニング |
| RM 計算機 | `/rm` | 最大挙上重量（1RM）の推定 |

## かなフラッシュ

日本語の文字がまだ読めない人向け。通信は一切なく、ブラウザだけで完結します。

- ひらがな46字 / カタカナ46字（合計92枚）を収録
- 練習したい行を選んで出題、シャッフルの ON / OFF
- カードをタップすると、読み方（ローマ字）と例単語が見られる
- セット終了後に正答率が出て、まちがえたカードだけ復習できる

要件の詳細は [`docs/kana-requirements.md`](docs/kana-requirements.md) を参照してください。

## えいかいわフラッシュ

英語の初心者（中学1〜2年程度の語彙・文型）向け。

- 7場面 × 8フレーズ（合計56フレーズ）を収録
  - あいさつ / 自己紹介 / お礼とおわび
  - 空港と移動 / 買い物 / レストラン / 道をたずねる
- 練習のしかたは3つ
  - **聞き流す** — やりとりを英語と日本語訳で続けて読み上げ、操作せずに流し続ける
    - **会話**（1場面3本、計21本のやりとり）か、**フレーズ**（1件ずつ＋相手の返事）を選べる
    - 自分と相手で声を変えるので、会話として聞こえる
  - **聞いて覚える** — カードをめくって、自分のペースで覚える
  - **声に出す** — マイクで聞き取って、言えたかどうかを判定する
- 日本語を見て英語を思い出し、タップして答え合わせ
- 裏面には英語・カタカナ読み・使い方のひとこと・相手の返事の例

要件の詳細は [`docs/english-requirements.md`](docs/english-requirements.md) を参照してください。

### スマホで使う

ホーム画面に追加できるウェブアプリ（PWA）になっています。一度開けば通信がなくても起動します。

1. 下の「Vercel へのデプロイ」で公開する（スマホから開くには https の URL が必要）
2. スマホのブラウザで `https://<公開先>/english` を開く
3. iPhone は Safari の共有ボタン →「ホーム画面に追加」、Android は表示される「ホーム画面に追加する」ボタン
   （出ない場合はブラウザのメニュー →「ホーム画面に追加」）

ホーム画面から開くとブラウザのバーが消えて画面を広く使えます。学習の記録は保存していないため、
追加のタイミングは問いません。

| ファイル | 役割 |
| --- | --- |
| `public/english/manifest.webmanifest` | アプリ名・アイコン・起動 URL（`/english`） |
| `public/english/icons/` | アイコン（`icon.svg` が元絵） |
| `public/english-sw.js` | オフライン用の Service Worker（`/english` だけを受け持つ） |
| `src/lib/pwa.ts` | Service Worker の登録と「ホーム画面に追加」の判定（ほかのアプリと共通） |
| `src/components/install-hint.tsx` | 「ホーム画面に追加」の案内カード（ほかのアプリと共通） |

### 音声機能について

読み上げも聞き取りも、ブラウザ内蔵の Web Speech API を使います。**サーバーも API キーも
不要**です。ただし2点、あらかじめ把握しておいてください。

1. **聞き取りは Firefox では使えません**（Chrome / Edge / Safari 系は対応）。
   非対応の環境では「声に出す」タブを選べないようにしてあります。
2. **聞き流しは、この画面を開いている間だけ続きます。** ほかのアプリに切り替えたり画面を
   消したりすると止まります（再生中は画面を消さないようにしていますが、
   ポケットに入れて聞く使い方には向きません）。
3. **「声に出す」モードでは、ブラウザが音声をベンダーのサーバーへ送ることがあります。**
   Web Speech API の仕様は認識処理の場所を実装に委ねており、Chrome は外部で処理します。
   アプリ自身は何も送信しませんが、かなフラッシュのように「通信は一切ない」とは
   言い切れません。読み上げるのは同梱の定型フレーズのみで、個人情報を話させる設計には
   していません。

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
| `src/lib/pwa.ts` | Service Worker の登録と「ホーム画面に追加」の判定（RM 計算機と共通） |
| `src/components/install-hint.tsx` | 「ホーム画面に追加」の案内カード（RM 計算機と共通） |
1枚の HTML にする場合は `npm run build:workout`（`dist-demo/workout.html`）。

## RM 計算機（`/rm`）

挙げた重量と回数から、最大挙上重量（1RM）を推定するページです。

- 7つの推定式（Epley / Brzycki / Lander / Lombardi / Mayhew / O'Conner / Wathan）と、その平均で計算
- 1〜20RM の換算表（プレートの刻み 0.5 / 1.25 / 2.5 / 5 kg に丸め）
- 筋力アップ・筋肥大・筋持久力ごとの重量の目安
- 前回の入力だけ端末のブラウザに保存（通信なし）
- スマホのホーム画面に追加できる（PWA）。一度開けば通信がなくても起動する

スマホで使う手順は筋トレ版と同じで、開く URL が `https://<公開先>/rm` になります。
ファイルは `public/rm/`（マニフェスト・アイコン）と `public/rm-sw.js`（Service Worker）。

要件は [`docs/rm-requirements.md`](docs/rm-requirements.md)。1枚の HTML にする場合は `npm run build:rm`（`dist-demo/rm.html`）。

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000
```

本番ビルドは `npm run build` → `npm run start`。

## 共有用の1枚 HTML

リンクを渡して触ってもらいたいときは、アプリ全体を単一の HTML に束ねられます。

```bash
npm run build:demo            # すべてのアプリを dist-demo/ に出力
npm run build:demo:english    # えいかいわフラッシュだけ
npm run build:demo:kana       # かなフラッシュだけ
npm run build:workout         # おうち筋トレ20 だけ
npm run build:rm              # RM 計算機だけ
```

表示に使う文字のフォントだけを埋め込むので、生成後はネット接続なしで動きます
（生成時のみ Google Fonts への通信が必要。取得できない場合は CDN 参照に切り替わります）。

1枚 HTML にはルーティングが無いため、アプリごとに別々のファイルになります。

## Vercel へのデプロイ

環境変数もビルド設定も不要です。

1. [vercel.com/new](https://vercel.com/new) を開き、このリポジトリを Import する
2. Framework Preset が **Next.js** になっていることを確認する（自動検出されます）
3. Deploy を押す

Production は `main`、それ以外のブランチへの push は自動でプレビュー URL が作られます。

## 構成

| パス | 役割 |
| --- | --- |
| `src/app/page.tsx` | トップページ（アプリの選択） |
| `src/app/kana/page.tsx` | かなフラッシュのルート |
| `src/app/english/page.tsx` | えいかいわフラッシュのルート |
| `src/components/app-shell.tsx` | 各アプリ共通の外枠とトップへ戻る導線 |
| `src/components/kana/` | かなフラッシュの画面 |
| `src/components/english/` | えいかいわフラッシュの画面 |
| `src/lib/kana.ts` | かなのデータ（文字・ローマ字・例単語） |
| `src/lib/phrases.ts` | 英会話フレーズのデータ（場面・英語・日本語・使い方・相手の返事） |
| `src/lib/dialogues.ts` | 場面ごとの会話データ（話し手・英語・日本語・カタカナ） |
| `src/lib/stream.ts` | 聞き流し用に、フレーズと会話を同じ形へそろえる |
| `src/lib/study.ts` / `src/lib/english-study.ts` | デッキの生成と集計 |
| `src/lib/speech.ts` | 読み上げ（英語・日本語）と聞き取り（Web Speech API）のラッパー |
| `src/lib/wake-lock.ts` | 聞き流し中に画面を消さないようにする |
| `src/lib/pronunciation.ts` | 聞き取り結果とお手本の照合 |
| `src/lib/row-theme.ts` / `src/lib/scene-theme.ts` | 行・場面ごとの配色 |
| `src/lib/shuffle.ts` | 出題順のシャッフル（かな・えいかいわ共通） |
| `src/components/ui/` | shadcn/ui のコンポーネント |
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト（アプリ名を渡すとそれだけを出力） |
| `src/app/workout/` | おうち筋トレ20 のページ |
| `src/components/workout/` | 今日 / トレーニング中 / 終了 / 記録 / 目標 の各画面 |
| `src/lib/workout/` | 種目データ、20分の組み立て、カロリー推定、目標計算、保存 |
| `src/app/rm/` | RM 計算機のページ |
| `src/components/rm/rm-calculator.tsx` | 入力・推定 1RM・式の比較・換算表・目的別の目安 |
| `src/lib/rm/` | 推定式と丸め、前回入力の保存 |

## 技術

Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
