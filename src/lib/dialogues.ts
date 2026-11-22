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
]

export const DIALOGUES: Dialogue[] = SOURCES.map((source, i) => ({
  id: `${source.scene}-${i + 1}`,
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
