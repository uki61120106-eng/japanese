/** 根拠欄で使っている略称と正式名 */
const ABBREVIATIONS: [short: string, full: string][] = [
  ["労基法", "労働基準法"],
  ["労基則", "労働基準法施行規則"],
  ["安衛法", "労働安全衛生法"],
  ["安衛令", "労働安全衛生法施行令"],
  ["安衛則", "労働安全衛生規則"],
  ["労災法", "労働者災害補償保険法"],
  ["労災則", "労働者災害補償保険法施行規則"],
  ["雇保法", "雇用保険法"],
  ["雇保則", "雇用保険法施行規則"],
  ["徴収法", "労働保険の保険料の徴収等に関する法律"],
  ["徴収則", "労働保険の保険料の徴収等に関する法律施行規則"],
  ["健保法", "健康保険法"],
  ["健保令", "健康保険法施行令"],
  ["健保則", "健康保険法施行規則"],
  ["厚年法", "厚生年金保険法"],
  ["厚年令", "厚生年金保険法施行令"],
  ["国年法", "国民年金法"],
  ["国年令", "国民年金法施行令"],
  ["割増賃金令", "労働基準法第三十七条第一項の時間外及び休日の割増賃金に係る率の最低限度を定める政令"],
  ["育児・介護休業法", "育児休業、介護休業等育児又は家族介護を行う労働者の福祉に関する法律"],
  ["男女雇用機会均等法", "雇用の分野における男女の均等な機会及び待遇の確保等に関する法律"],
  ["労働施策総合推進法", "労働施策の総合的な推進並びに労働者の雇用の安定及び職業生活の充実等に関する法律"],
  ["高齢者医療確保法", "高齢者の医療の確保に関する法律"],
  ["高年齢者雇用安定法", "高年齢者等の雇用の安定等に関する法律"],
  ["パートタイム・有期雇用労働法", "短時間労働者及び有期雇用労働者の雇用管理の改善等に関する法律"],
  ["労働者派遣法", "労働者派遣事業の適正な運営の確保及び派遣労働者の保護等に関する法律"],
  ["個別労働紛争解決促進法", "個別労働関係紛争の解決の促進に関する法律"],
]

export type LawLink = {
  /** 画面に出す文字（根拠欄の区切りそのまま） */
  label: string
  url: string
}

/**
 * 根拠欄（例: "労基法20条1項、労災法22条の2"）を条文の検索リンクにする。
 * e-Gov 法令検索のサイト内を検索する（通知・要領は厚生労働省の資料を検索）。法令IDを直書きしないのは、
 * ID の誤りでリンク切れになるより、検索で該当条文にたどり着ける方が確実なため。
 * 「附則9条」のように法令名が省略された区切りは、直前の法令名を引き継ぐ。
 */
export function lawLinks(basis: string): LawLink[] {
  let currentLaw = ""
  return basis
    .split("、")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((label) => {
      // 通知・要領は e-Gov に載っていないので、厚生労働省の資料を探す
      if (/通知|通達|要領/.test(label)) {
        const query = `${currentLaw} ${label} 厚生労働省`.trim()
        return { label, url: searchUrl(query) }
      }
      let law = ""
      let article = label
      const abbr = ABBREVIATIONS.find(([short]) => label.startsWith(short))
      if (abbr) {
        law = abbr[1]
        article = label.slice(abbr[0].length)
      } else {
        const match = label.match(/^(.+?(?:法|令|規則))((?:附則)?\d.*|附則.*)?$/)
        if (match && !/^(?:附則|\d)/.test(label)) {
          law = match[1]
          article = match[2] ?? ""
        }
      }
      if (law) currentLaw = law
      return { label, url: searchUrl(`${currentLaw} ${article} site:laws.e-gov.go.jp`.trim()) }
    })
}

function searchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}
