# 学習デモアプリ

ブラウザだけで動く学習デモアプリを2つ収録しています。トップページから選びます。

| アプリ | パス | 内容 |
| --- | --- | --- |
| かなフラッシュ | `/kana` | ひらがな・カタカナ92字をフラッシュカードで覚える |
| えいかいわフラッシュ | `/english` | 初心者向けの英会話フレーズ56個を聞いて・声に出して覚える |

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
- 日本語を見て英語を思い出し、タップして答え合わせ
- 裏面には英語・カタカナ読み・使い方のひとこと・相手の返事の例
- 「聞く」「ゆっくり」でブラウザに読み上げさせられる
- 「声に出す」モードでは、マイクで聞き取って言えたかどうかを判定する

要件の詳細は [`docs/english-requirements.md`](docs/english-requirements.md) を参照してください。

### 音声機能について

読み上げも聞き取りも、ブラウザ内蔵の Web Speech API を使います。**サーバーも API キーも
不要**です。ただし2点、あらかじめ把握しておいてください。

1. **聞き取りは Firefox では使えません**（Chrome / Edge / Safari 系は対応）。
   非対応の環境では「声に出す」タブを選べないようにしてあります。
2. **「声に出す」モードでは、ブラウザが音声をベンダーのサーバーへ送ることがあります。**
   Web Speech API の仕様は認識処理の場所を実装に委ねており、Chrome は外部で処理します。
   アプリ自身は何も送信しませんが、かなフラッシュのように「通信は一切ない」とは
   言い切れません。読み上げるのは同梱の定型フレーズのみで、個人情報を話させる設計には
   していません。

## 使い方

```bash
npm install
npm run dev     # http://localhost:3000
```

本番ビルドは `npm run build` → `npm run start`。

## 共有用の1枚 HTML

リンクを渡して触ってもらいたいときは、アプリ全体を単一の HTML に束ねられます。

```bash
npm run build:demo            # dist-demo/kana.html と dist-demo/english.html
npm run build:demo:english    # えいかいわフラッシュだけ
npm run build:demo:kana       # かなフラッシュだけ
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
| `src/lib/phrases.ts` | 英会話フレーズのデータ（場面・英語・日本語・使い方） |
| `src/lib/study.ts` / `src/lib/english-study.ts` | デッキの生成と集計 |
| `src/lib/speech.ts` | 読み上げ・聞き取り（Web Speech API）のラッパー |
| `src/lib/pronunciation.ts` | 聞き取り結果とお手本の照合 |
| `src/lib/row-theme.ts` / `src/lib/scene-theme.ts` | 行・場面ごとの配色 |
| `src/lib/shuffle.ts` | 出題順のシャッフル（両アプリ共通） |
| `src/components/ui/` | shadcn/ui のコンポーネント |
| `scripts/build-demo.mjs` | 共有用に1枚の HTML へ束ねるスクリプト |

## 技術

Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui

フォント（M PLUS Rounded 1c）は Google Fonts から読み込みます。next/font で
self-host すると、日本語が unicode-range で 500 個以上の woff2 に分割されて
ビルド成果物に入ってしまうためです。読み込めない環境では、端末内蔵の
丸ゴシック系フォントにフォールバックします。

> shadcn/ui のコンポーネントは `src/components/ui/` に取り込み済みです。
> 追加する場合は `npx shadcn@latest add <component>` を実行してください
> （`ui.shadcn.com` への通信が必要です）。
