/**
 * 場面ごとの、ひとまとまりの会話。聞き流しで通しで聞くためのデータ。
 * フレーズ集（phrases.ts）と同じ語彙・文型の範囲で組み立てている。
 */
import type { SceneId } from "@/lib/phrases"

/** you = 自分が言う側、other = 相手 */
export type Speaker = "you" | "other"

export type DialogueLine = {
  speaker: Speaker
  en: string
  ja: string
  /** 読み方のカタカナ */
  kana: string
}

export type Dialogue = {
  /** 一意な ID（例: "restaurant-1"） */
  id: string
  scene: SceneId
  /** 会話の題（例: "レストランで注文する"） */
  title: string
  /** どういう場面かの一言 */
  situation: string
  lines: DialogueLine[]
}

/** [話し手, 英語, 日本語, カタカナ] */
type Line = [Speaker, string, string, string]

type Source = {
  scene: SceneId
  title: string
  situation: string
  lines: Line[]
}

const SOURCES: Source[] = [
  {
    scene: "greeting",
    title: "朝、知り合いに会う",
    situation: "すれちがいざまの短いやりとり",
    lines: [
      ["you", "Good morning, Emma.", "おはよう、エマ。", "グッド モーニング、エマ"],
      ["other", "Good morning! How are you?", "おはよう！ 元気？", "グッド モーニング！ ハウ アー ユー"],
      ["you", "I'm fine, thank you. And you?", "元気だよ、ありがとう。そっちは？", "アイム ファイン、サンキュー。アンド ユー"],
      ["other", "I'm good. Are you busy today?", "元気だよ。今日は忙しい？", "アイム グッド。アー ユー ビジー トゥデイ"],
      ["you", "A little. See you later.", "少しね。またあとで。", "ア リトル。シー ユー レイター"],
      ["other", "See you. Have a good day.", "またね。よい一日を。", "シー ユー。ハヴ ア グッド デイ"],
    ],
  },
  {
    scene: "greeting",
    title: "夜、別れぎわ",
    situation: "食事に招かれ、帰るときのやりとり",
    lines: [
      ["you", "It's late. I should go.", "もう遅いね。帰らないと。", "イッツ レイト。アイ シュッド ゴー"],
      ["other", "OK. Thanks for coming.", "うん。来てくれてありがとう。", "オーケー。サンクス フォー カミング"],
      ["you", "Thank you for dinner. It was delicious.", "夕食をありがとう。おいしかったよ。", "サンキュー フォー ディナー。イット ワズ デリシャス"],
      ["other", "I'm glad you like it.", "気に入ってもらえてうれしいよ。", "アイム グラッド ユー ライク イット"],
      ["you", "Good night. See you tomorrow.", "おやすみ。また明日。", "グッド ナイト。シー ユー トゥモロー"],
      ["other", "Good night. Sleep well.", "おやすみ。よく眠ってね。", "グッド ナイト。スリープ ウェル"],
    ],
  },
  {
    scene: "greeting",
    title: "ひさしぶりに会う",
    situation: "再会したときの切り出し方",
    lines: [
      ["other", "Hello! Long time no see.", "やあ！ ひさしぶり。", "ハロー！ ロング タイム ノー シー"],
      ["you", "Hi! How are you?", "やあ！ 元気？", "ハイ！ ハウ アー ユー"],
      ["other", "I'm good, thank you. And you?", "元気だよ、ありがとう。そっちは？", "アイム グッド、サンキュー。アンド ユー"],
      ["you", "I'm fine. You look well.", "元気だよ。元気そうだね。", "アイム ファイン。ユー ルック ウェル"],
      ["other", "Thanks! Are you free now?", "ありがとう！ いま時間ある？", "サンクス！ アー ユー フリー ナウ"],
      ["you", "Yes. Let's have a coffee.", "うん。コーヒーでも飲もう。", "イエス。レッツ ハヴ ア コーヒー"],
    ],
  },
  {
    scene: "self",
    title: "はじめて会った人と話す",
    situation: "名前・出身・仕事をひととおり伝える",
    lines: [
      ["you", "Hello. I'm Ken. Nice to meet you.", "こんにちは。ケンです。はじめまして。", "ハロー。アイム ケン。ナイス トゥ ミート ユー"],
      ["other", "Nice to meet you, too. I'm Emma.", "こちらこそ、はじめまして。エマです。", "ナイス トゥ ミート ユー、トゥー。アイム エマ"],
      ["you", "Where are you from?", "ご出身はどちらですか？", "ウェア アー ユー フロム"],
      ["other", "I'm from Canada. How about you?", "カナダです。あなたは？", "アイム フロム カナダ。ハウ アバウト ユー"],
      ["you", "I'm from Japan. I live in Tokyo.", "日本です。東京に住んでいます。", "アイム フロム ジャパン。アイ リヴ イン トーキョー"],
      ["other", "Oh, nice! What do you do?", "いいですね！ お仕事は？", "オー、ナイス！ ワット ドゥ ユー ドゥー"],
      ["you", "I work at a city office.", "市役所で働いています。", "アイ ワーク アット ア シティ オフィス"],
    ],
  },
  {
    scene: "self",
    title: "仕事のことをきかれる",
    situation: "勤め先と、仕事の中身を伝える",
    lines: [
      ["other", "What do you do?", "お仕事は何ですか？", "ワット ドゥ ユー ドゥー"],
      ["you", "I work at a city office.", "市役所で働いています。", "アイ ワーク アット ア シティ オフィス"],
      ["other", "That sounds interesting.", "面白そうですね。", "ザット サウンズ インタレスティング"],
      ["you", "It is. I help people every day.", "そうなんです。毎日、人の手助けをしています。", "イット イズ。アイ ヘルプ ピープル エヴリ デイ"],
      ["other", "Do you like your job?", "お仕事は好きですか？", "ドゥ ユー ライク ユア ジョブ"],
      ["you", "Yes, I like it very much.", "はい、とても好きです。", "イエス、アイ ライク イット ヴェリー マッチ"],
    ],
  },
  {
    scene: "self",
    title: "趣味の話をする",
    situation: "週末の過ごし方から話を広げる",
    lines: [
      ["you", "What do you do on weekends?", "週末は何をしていますか？", "ワット ドゥ ユー ドゥー オン ウィークエンズ"],
      ["other", "I play tennis. How about you?", "テニスをします。あなたは？", "アイ プレイ テニス。ハウ アバウト ユー"],
      ["you", "I like music. I play the guitar.", "音楽が好きです。ギターを弾きます。", "アイ ライク ミュージック。アイ プレイ ザ ギター"],
      ["other", "That's cool. Are you good?", "いいですね。上手なんですか？", "ザッツ クール。アー ユー グッド"],
      ["you", "Not really. I'm still learning.", "そうでもないです。まだ練習中で。", "ノット リアリー。アイム スティル ラーニング"],
      ["other", "Let's play together sometime.", "いつか一緒にやりましょう。", "レッツ プレイ トゥゲザー サムタイム"],
    ],
  },
  {
    scene: "thanks",
    title: "落とし物を拾ってもらう",
    situation: "お礼を言って、相手が返す",
    lines: [
      ["other", "Excuse me. Is this your phone?", "すみません。これはあなたの電話ですか？", "エクスキューズ ミー。イズ ジス ユア フォン"],
      ["you", "Oh, yes! Thank you very much.", "あ、そうです！ ありがとうございます。", "オー、イエス！ サンキュー ヴェリー マッチ"],
      ["other", "You're welcome.", "どういたしまして。", "ユア ウェルカム"],
      ["you", "Thanks for your help.", "助かりました。", "サンクス フォー ユア ヘルプ"],
      ["other", "Any time. Have a good day.", "いつでもどうぞ。よい一日を。", "エニー タイム。ハヴ ア グッド デイ"],
      ["you", "You too.", "あなたも。", "ユー トゥー"],
    ],
  },
  {
    scene: "thanks",
    title: "待ち合わせに遅れる",
    situation: "おわびして、理由を伝える",
    lines: [
      ["you", "I'm sorry I'm late.", "遅れてすみません。", "アイム ソーリー アイム レイト"],
      ["other", "No worries. Come in.", "気にしないで。どうぞ入って。", "ノー ワリーズ。カム イン"],
      ["you", "The train was late.", "電車が遅れてしまって。", "ザ トレイン ワズ レイト"],
      ["other", "That happens. Are you OK?", "よくあることですよ。大丈夫ですか？", "ザット ハプンズ。アー ユー オーケー"],
      ["you", "Yes, thank you.", "はい、ありがとうございます。", "イエス、サンキュー"],
      ["other", "Let's start, then.", "では、始めましょう。", "レッツ スタート、ゼン"],
    ],
  },
  {
    scene: "thanks",
    title: "手伝ってもらう",
    situation: "声をかけて、助けてもらう",
    lines: [
      ["you", "Excuse me. Could you help me?", "すみません。手伝ってもらえますか？", "エクスキューズ ミー。クッジュー ヘルプ ミー"],
      ["other", "Sure. What do you need?", "もちろん。何が必要ですか？", "シュア。ワット ドゥ ユー ニード"],
      ["you", "I can't open this door.", "このドアが開かないんです。", "アイ キャント オープン ジス ドア"],
      ["other", "Let me try. Here you go.", "やってみますね。はい、どうぞ。", "レット ミー トライ。ヒア ユー ゴー"],
      ["you", "Thanks for your help.", "助かりました、ありがとう。", "サンクス フォー ユア ヘルプ"],
      ["other", "Any time.", "いつでもどうぞ。", "エニー タイム"],
    ],
  },
  {
    scene: "airport",
    title: "駅で切符を買う",
    situation: "行き先・支払い・出発時刻をきく",
    lines: [
      ["you", "Excuse me. One ticket to Osaka, please.", "すみません。大阪まで1枚ください。", "エクスキューズ ミー。ワン チケット トゥ オオサカ、プリーズ"],
      ["other", "That'll be thirty dollars.", "30ドルになります。", "ザットル ビー サーティー ダラーズ"],
      ["you", "Do you take credit cards?", "クレジットカードは使えますか？", "ドゥ ユー テイク クレジット カーズ"],
      ["other", "Yes, we do.", "はい、使えます。", "イエス、ウィー ドゥー"],
      ["you", "What time does the train leave?", "電車は何時に出ますか？", "ワット タイム ダズ ザ トレイン リーヴ"],
      ["other", "At three thirty, from platform two.", "3時30分、2番線からです。", "アット スリー サーティー、フロム プラットフォーム トゥー"],
      ["you", "Thank you very much.", "ありがとうございます。", "サンキュー ヴェリー マッチ"],
    ],
  },
  {
    scene: "airport",
    title: "入国審査",
    situation: "目的と滞在期間をきかれる",
    lines: [
      ["other", "Good morning. May I see your passport?", "おはようございます。パスポートを見せてください。", "グッド モーニング。メイ アイ シー ユア パスポート"],
      ["you", "Here you are.", "どうぞ。", "ヒア ユー アー"],
      ["other", "What's the purpose of your visit?", "訪問の目的は何ですか？", "ワッツ ザ パーパス オブ ユア ヴィジット"],
      ["you", "I'm here for sightseeing.", "観光で来ました。", "アイム ヒア フォー サイトシーイング"],
      ["other", "How long will you stay?", "どのくらい滞在しますか？", "ハウ ロング ウィル ユー ステイ"],
      ["you", "For one week.", "1週間です。", "フォー ワン ウィーク"],
      ["other", "Enjoy your stay.", "よい滞在を。", "エンジョイ ユア ステイ"],
    ],
  },
  {
    scene: "airport",
    title: "電車に乗り遅れる",
    situation: "次の便と乗り場をきく",
    lines: [
      ["you", "Excuse me. I missed my train.", "すみません。電車に乗り遅れました。", "エクスキューズ ミー。アイ ミスト マイ トレイン"],
      ["other", "No problem. The next one is in ten minutes.", "大丈夫ですよ。次のは10分後です。", "ノー プロブレム。ザ ネクスト ワン イズ イン テン ミニッツ"],
      ["you", "Can I use this ticket?", "この切符は使えますか？", "キャナイ ユーズ ジス チケット"],
      ["other", "Yes, you can.", "はい、使えます。", "イエス、ユー キャン"],
      ["you", "Which platform?", "何番線ですか？", "ウィッチ プラットフォーム"],
      ["other", "Platform three.", "3番線です。", "プラットフォーム スリー"],
      ["you", "Thank you very much.", "ありがとうございます。", "サンキュー ヴェリー マッチ"],
    ],
  },
  {
    scene: "shopping",
    title: "お店で服を買う",
    situation: "値段をきいて、試着して、買うまで",
    lines: [
      ["other", "Hello. Can I help you?", "こんにちは。何かお探しですか？", "ハロー。キャナイ ヘルプ ユー"],
      ["you", "Yes. How much is this?", "はい。これはいくらですか？", "イエス。ハウ マッチ イズ ジス"],
      ["other", "It's twenty dollars.", "20ドルです。", "イッツ トゥエンティ ダラーズ"],
      ["you", "Can I try this on?", "試着してもいいですか？", "キャナイ トライ ジス オン"],
      ["other", "Of course. The fitting room is over there.", "もちろんです。試着室はあちらです。", "オブ コース。ザ フィッティング ルーム イズ オーヴァー ゼア"],
      ["you", "Thanks. I'll take this one.", "ありがとう。これをください。", "サンクス。アイル テイク ジス ワン"],
    ],
  },
  {
    scene: "shopping",
    title: "色とサイズをきく",
    situation: "ほしい色と大きさを伝える",
    lines: [
      ["you", "Excuse me. Do you have this in blue?", "すみません。これの青はありますか？", "エクスキューズ ミー。ドゥ ユー ハヴ ジス イン ブルー"],
      ["other", "Let me check. Yes, we do.", "確認しますね。はい、あります。", "レット ミー チェック。イエス、ウィー ドゥー"],
      ["you", "Do you have a bigger size?", "もっと大きいサイズはありますか？", "ドゥ ユー ハヴ ア ビガー サイズ"],
      ["other", "Here you are.", "こちらです。", "ヒア ユー アー"],
      ["you", "Can I try this on?", "試着してもいいですか？", "キャナイ トライ ジス オン"],
      ["other", "Of course. The fitting room is over there.", "もちろん。試着室はあちらです。", "オブ コース。ザ フィッティング ルーム イズ オーヴァー ゼア"],
    ],
  },
  {
    scene: "shopping",
    title: "レジでお会計",
    situation: "支払い方法と袋を頼む",
    lines: [
      ["other", "Is that all?", "以上でよろしいですか？", "イズ ザット オール"],
      ["you", "Yes. How much is it?", "はい。いくらですか？", "イエス。ハウ マッチ イズ イット"],
      ["other", "Forty dollars, please.", "40ドルです。", "フォーティ ダラーズ、プリーズ"],
      ["you", "Do you take credit cards?", "クレジットカードは使えますか？", "ドゥ ユー テイク クレジット カーズ"],
      ["other", "Yes. Here's your receipt.", "はい。レシートです。", "イエス。ヒアズ ユア レシート"],
      ["you", "Can I have a bag?", "袋をもらえますか？", "キャナイ ハヴ ア バッグ"],
      ["other", "Of course. Here you are.", "もちろんです。どうぞ。", "オブ コース。ヒア ユー アー"],
    ],
  },
  {
    scene: "restaurant",
    title: "レストランで注文する",
    situation: "席に案内され、料理と飲み物を頼む",
    lines: [
      ["you", "A table for two, please.", "2人です。", "ア テイブル フォー トゥー、プリーズ"],
      ["other", "This way, please. Here's the menu.", "こちらへどうぞ。メニューです。", "ジス ウェイ、プリーズ。ヒアズ ザ メニュー"],
      ["you", "Thank you. I'll have this one.", "ありがとう。これをお願いします。", "サンキュー。アイル ハヴ ジス ワン"],
      ["other", "Good choice. Anything to drink?", "いいですね。お飲み物は？", "グッド チョイス。エニシング トゥ ドリンク"],
      ["you", "Water, please.", "お水をください。", "ウォーター、プリーズ"],
      ["other", "Still or sparkling?", "普通のお水ですか、炭酸水ですか？", "スティル オア スパークリング"],
      ["you", "Still, please.", "普通ので、お願いします。", "スティル、プリーズ"],
    ],
  },
  {
    scene: "restaurant",
    title: "食べられないものを伝える",
    situation: "辛さを確かめて、別の料理にする",
    lines: [
      ["other", "Are you ready to order?", "ご注文はお決まりですか？", "アー ユー レディ トゥ オーダー"],
      ["you", "Is this spicy?", "これは辛いですか？", "イズ ジス スパイシー"],
      ["other", "Yes, a little.", "はい、少しだけ。", "イエス、ア リトル"],
      ["you", "I can't eat spicy food.", "辛いものが食べられないんです。", "アイ キャント イート スパイシー フード"],
      ["other", "Then how about this one? It's not spicy.", "でしたら、こちらはいかがですか？ 辛くないですよ。", "ゼン ハウ アバウト ジス ワン？ イッツ ノット スパイシー"],
      ["you", "That sounds good. I'll have this one.", "いいですね。それをお願いします。", "ザット サウンズ グッド。アイル ハヴ ジス ワン"],
    ],
  },
  {
    scene: "restaurant",
    title: "食べ終わってお会計",
    situation: "感想を伝えて、持ち帰りを頼む",
    lines: [
      ["other", "How was everything?", "お食事はいかがでしたか？", "ハウ ワズ エヴリシング"],
      ["you", "It was delicious. Thank you.", "おいしかったです。ありがとう。", "イット ワズ デリシャス。サンキュー"],
      ["other", "I'm glad you like it.", "気に入っていただけてうれしいです。", "アイム グラッド ユー ライク イット"],
      ["you", "Check, please.", "お会計をお願いします。", "チェック、プリーズ"],
      ["other", "Sure. I'll be right back.", "かしこまりました。すぐにお持ちします。", "シュア。アイル ビー ライト バック"],
      ["you", "Can I get this to go?", "これ、持ち帰りできますか？", "キャナイ ゲット ジス トゥ ゴー"],
      ["other", "Of course. I'll box it up.", "もちろんです。お包みしますね。", "オブ コース。アイル ボックス イット アップ"],
    ],
  },
  {
    scene: "direction",
    title: "道をたずねる",
    situation: "行き方・かかる時間・地図で確認する",
    lines: [
      ["you", "Excuse me. How do I get to the station?", "すみません。駅へはどう行けばいいですか？", "エクスキューズ ミー。ハウ ドゥ アイ ゲット トゥ ザ ステイション"],
      ["other", "Go straight and turn right.", "まっすぐ行って右に曲がってください。", "ゴー ストレイト アンド ターン ライト"],
      ["you", "Is it far from here?", "ここから遠いですか？", "イズ イット ファー フロム ヒア"],
      ["other", "No, it's about five minutes.", "いいえ、5分ほどです。", "ノー、イッツ アバウト ファイヴ ミニッツ"],
      ["you", "Can you show me on the map?", "地図で示してもらえますか？", "キャン ユー ショウ ミー オン ザ マップ"],
      ["other", "Sure. We're here now.", "もちろん。いまここですよ。", "シュア。ウィア ヒア ナウ"],
      ["you", "Got it. Thank you very much.", "わかりました。ありがとうございます。", "ガット イット。サンキュー ヴェリー マッチ"],
    ],
  },
  {
    scene: "direction",
    title: "バスで美術館へ行く",
    situation: "乗り物と所要時間をきく",
    lines: [
      ["you", "Excuse me. How do I get to the museum?", "すみません。美術館へはどう行けばいいですか？", "エクスキューズ ミー。ハウ ドゥ アイ ゲット トゥ ザ ミュージアム"],
      ["other", "Take the bus from here.", "ここからバスに乗ってください。", "テイク ザ バス フロム ヒア"],
      ["you", "How long does it take?", "どのくらいかかりますか？", "ハウ ロング ダズ イット テイク"],
      ["other", "About ten minutes.", "10分くらいです。", "アバウト テン ミニッツ"],
      ["you", "Which bus should I take?", "どのバスに乗ればいいですか？", "ウィッチ バス シュッド アイ テイク"],
      ["other", "Number five. It stops in front of the museum.", "5番です。美術館の前に止まります。", "ナンバー ファイヴ。イット ストップス イン フロント オブ ザ ミュージアム"],
      ["you", "Got it. Thanks!", "わかりました。ありがとう！", "ガット イット。サンクス"],
    ],
  },
  {
    scene: "direction",
    title: "道に迷う",
    situation: "行き先を伝えて、目印で教わる",
    lines: [
      ["you", "Excuse me. I'm lost.", "すみません。道に迷いました。", "エクスキューズ ミー。アイム ロスト"],
      ["other", "Where do you want to go?", "どこへ行きたいですか？", "ウェア ドゥ ユー ウォント トゥ ゴー"],
      ["you", "I want to go to this hotel.", "このホテルに行きたいんです。", "アイ ウォント トゥ ゴー トゥ ジス ホテル"],
      ["other", "It's next to the bank. Go straight and turn left.", "銀行のとなりです。まっすぐ行って左に曲がってください。", "イッツ ネクスト トゥ ザ バンク。ゴー ストレイト アンド ターン レフト"],
      ["you", "Is it far from here?", "ここから遠いですか？", "イズ イット ファー フロム ヒア"],
      ["other", "No, about five minutes.", "いいえ、5分ほどです。", "ノー、アバウト ファイヴ ミニッツ"],
      ["you", "Thank you very much.", "ありがとうございます。", "サンキュー ヴェリー マッチ"],
    ],
  },
]

const seen = new Map<SceneId, number>()

export const DIALOGUES: Dialogue[] = SOURCES.map((source) => ({
  // 場面ごとに 1 から振る（restaurant-1, restaurant-2 ...）
  id: `${source.scene}-${(seen.set(source.scene, (seen.get(source.scene) ?? 0) + 1), seen.get(source.scene))}`,
  scene: source.scene,
  title: source.title,
  situation: source.situation,
  lines: source.lines.map(([speaker, en, ja, kana]) => ({ speaker, en, ja, kana })),
}))

export function dialoguesOf(scene: SceneId): Dialogue[] {
  return DIALOGUES.filter((dialogue) => dialogue.scene === scene)
}

/** その場面の会話に含まれるセリフの数 */
export function dialogueLineCount(scene: SceneId): number {
  return dialoguesOf(scene).reduce((sum, d) => sum + d.lines.length, 0)
}
