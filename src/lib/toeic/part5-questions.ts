import type { Part5Question } from "@/lib/toeic/types"

/**
 * Part 5（短文穴埋め）の問題。
 *
 * すべてこのアプリのために書き下ろした自作問題で、公式問題集からの転載はない。
 * ここに入れるのは level: "core"（600〜730 点帯）の問題。
 * 730〜860 点帯は part5-advanced.ts に分けている。
 * 空所は types.ts の BLANK（"____"）で表す。
 *
 * 正解の位置（A〜D）はカテゴリごとに均してある。問題を足したときは
 * `npm run check:toeic` で偏りと取り違えを確認すること。
 */
export const PART5_QUESTIONS: Part5Question[] = [
  // ------------------------------------------------------------------
  // 品詞（word-form）
  // ------------------------------------------------------------------
  {
    id: "p5-wf-01",
    category: "word-form",
    level: "core",
    sentence:
      "The new scheduling system has greatly improved the ____ of the packaging department.",
    choices: ["productive", "productively", "productivity", "produce"],
    answer: 2,
    explanation:
      "空所は the と of にはさまれているので名詞が入る。名詞は produce（農産物）と productivity（生産性）だが、部署について述べる文脈に合うのは productivity。",
    translation:
      "新しいスケジュール管理システムによって、包装部門の生産性は大きく向上した。",
  },
  {
    id: "p5-wf-02",
    category: "word-form",
    level: "core",
    sentence:
      "All visitors must present a valid ____ card at the reception desk.",
    choices: ["identification", "identified", "identify", "identifiable"],
    answer: 0,
    explanation:
      "identification card（身分証明書）という複合名詞。名詞が後ろの名詞 card を修飾する形で、TOEIC では頻出の並び。",
    translation:
      "来訪者は全員、受付で有効な身分証明書を提示しなければならない。",
  },
  {
    id: "p5-wf-03",
    category: "word-form",
    level: "core",
    sentence: "Ms. Alvarez reviewed the contract ____ before signing it.",
    choices: ["care", "careful", "carefully", "caring"],
    answer: 2,
    explanation:
      "reviewed the contract で文の要素はそろっている。動詞 reviewed を修飾するのは副詞なので carefully。",
    translation:
      "アルバレスさんは署名する前に契約書を注意深く読み直した。",
  },
  {
    id: "p5-wf-04",
    category: "word-form",
    level: "core",
    sentence:
      "Finishing the lobby renovation two weeks early was a ____ achievement.",
    choices: ["remarked", "remark", "remarkable", "remarkably"],
    answer: 2,
    explanation:
      "a ____ achievement と冠詞と名詞にはさまれているので、名詞を修飾する形容詞 remarkable が入る。",
    translation:
      "ロビーの改修を2週間前倒しで終えたことは、目覚ましい成果だった。",
  },
  {
    id: "p5-wf-05",
    category: "word-form",
    level: "core",
    sentence: "Our supplier offers a wide ____ of packaging materials.",
    choices: ["selective", "selectively", "select", "selection"],
    answer: 3,
    explanation:
      "a wide ____ of ... は「幅広い〜」を表す定型。冠詞 a と形容詞 wide のあとなので名詞 selection が入る。",
    translation: "当社の仕入先は幅広い包装材を取り扱っている。",
  },
  {
    id: "p5-wf-06",
    category: "word-form",
    level: "core",
    sentence:
      "The technician explained the installation procedure ____ so that everyone could follow it.",
    choices: ["clarify", "clarity", "clear", "clearly"],
    answer: 3,
    explanation:
      "explained the procedure で文型が完成しているため、空所は動詞を修飾する副詞の位置。clearly が正解。",
    translation:
      "技術者は、全員が理解できるように設置手順をわかりやすく説明した。",
  },
  {
    id: "p5-wf-07",
    category: "word-form",
    level: "core",
    sentence:
      "Sales figures for the third quarter were ____ higher than the company had forecast.",
    choices: ["considerable", "considerably", "consideration", "consider"],
    answer: 1,
    explanation:
      "比較級 higher を強める位置なので副詞 considerably。形容詞 considerable は名詞を修飾するので入らない。",
    translation:
      "第3四半期の売上高は、会社の予測をかなり上回った。",
  },
  {
    id: "p5-wf-08",
    category: "word-form",
    level: "core",
    sentence:
      "The consultant provided a ____ analysis of our distribution costs.",
    choices: ["detail", "detailed", "details", "detailing"],
    answer: 1,
    explanation:
      "a ____ analysis と冠詞と名詞の間なので、名詞を修飾する語が入る。分詞形容詞 detailed（詳細な）が適切。",
    translation:
      "コンサルタントは当社の配送コストについて詳細な分析を提示した。",
  },
  {
    id: "p5-wf-09",
    category: "word-form",
    level: "core",
    sentence:
      "Mr. Okonkwo is in charge of the ____ of office supplies to all branches.",
    choices: ["distributed", "distribution", "distributor", "distribute"],
    answer: 1,
    explanation:
      "the ____ of ... なので名詞。名詞は distribution（配布）と distributor（販売代理店）だが、of office supplies と続くので行為を表す distribution。",
    translation:
      "オコンクォさんは全支店への事務用品の配布を担当している。",
  },
  {
    id: "p5-wf-10",
    category: "word-form",
    level: "core",
    sentence:
      "All expense claims must be submitted ____ through the company portal.",
    choices: ["electronics", "electrify", "electronic", "electronically"],
    answer: 3,
    explanation:
      "be submitted で受動態が完成しているので、それを修飾する副詞 electronically が入る。",
    translation:
      "経費精算の申請はすべて社内ポータル経由で電子的に提出しなければならない。",
  },
  {
    id: "p5-wf-11",
    category: "word-form",
    level: "core",
    sentence:
      "The firm's ____ to customer service has earned it a loyal client base.",
    choices: ["commitment", "committed", "committing", "commit"],
    answer: 0,
    explanation:
      "所有格 The firm's のあとなので名詞。commitment to ...（〜への献身）はセットで覚えたい形。",
    translation:
      "その会社の顧客サービスへの真摯な姿勢が、忠実な顧客層を生んできた。",
  },
  {
    id: "p5-wf-12",
    category: "word-form",
    level: "core",
    sentence: "The updated interface is surprisingly ____ to use.",
    choices: ["easy", "easiness", "ease", "easily"],
    answer: 0,
    explanation:
      "be 動詞 is の補語になるのは形容詞。副詞 surprisingly が形容詞 easy を修飾している形。",
    translation:
      "更新されたインターフェースは驚くほど使いやすい。",
  },

  // ------------------------------------------------------------------
  // 動詞の形・時制（verb-form）
  // ------------------------------------------------------------------
  {
    id: "p5-vf-01",
    category: "verb-form",
    level: "core",
    sentence:
      "By the time the auditors arrive next Monday, the finance team ____ all of the required documents.",
    choices: ["will have prepared", "is preparing", "prepares", "had prepared"],
    answer: 0,
    explanation:
      "By the time ... next Monday と未来の時点が示されている。その時点までに完了している動作なので未来完了 will have prepared。",
    translation:
      "来週月曜に監査人が到着するころまでに、財務チームは必要書類をすべて準備し終えているだろう。",
  },
  {
    id: "p5-vf-02",
    category: "verb-form",
    level: "core",
    sentence:
      "Mr. Yamada ____ for Meridian Logistics since he graduated from university.",
    choices: ["will work", "works", "worked", "has worked"],
    answer: 3,
    explanation:
      "since ...（〜以来）は現在まで続く期間を表すので、現在完了 has worked を使う。",
    translation:
      "山田さんは大学を卒業して以来、メリディアン物流で働いている。",
  },
  {
    id: "p5-vf-03",
    category: "verb-form",
    level: "core",
    sentence:
      "The board ____ the revised budget proposal at its meeting last Thursday.",
    choices: ["will approve", "approves", "approved", "has approved"],
    answer: 2,
    explanation:
      "last Thursday という過去の一時点を示す語があるので、現在完了ではなく過去形 approved。",
    translation:
      "取締役会は先週木曜日の会議で、修正された予算案を承認した。",
  },
  {
    id: "p5-vf-04",
    category: "verb-form",
    level: "core",
    sentence:
      "Each of the branch managers ____ a monthly report to headquarters.",
    choices: ["submitting", "to submit", "submit", "submits"],
    answer: 3,
    explanation:
      "主語は Each で単数扱い。of the branch managers は修飾語なので、動詞は三人称単数の submits。",
    translation:
      "各支店長は本社に月次報告書を提出する。",
  },
  {
    id: "p5-vf-05",
    category: "verb-form",
    level: "core",
    sentence:
      "If the shipment ____ by Friday, we will notify the client immediately.",
    choices: [
      "does not arrive",
      "is not arrived",
      "had not arrived",
      "will not arrive",
    ],
    answer: 0,
    explanation:
      "条件を表す if 節の中では、未来のことでも現在形で表す。主節に will があるのがヒント。",
    translation:
      "金曜日までに荷物が届かない場合は、ただちに顧客に連絡します。",
  },
  {
    id: "p5-vf-06",
    category: "verb-form",
    level: "core",
    sentence:
      "Before the new system was introduced, staff ____ all orders by hand.",
    choices: ["records", "had recorded", "will record", "record"],
    answer: 1,
    explanation:
      "過去の出来事（was introduced）より前の動作なので、過去完了 had recorded。",
    translation:
      "新システムが導入される前は、職員がすべての注文を手書きで記録していた。",
  },
  {
    id: "p5-vf-07",
    category: "verb-form",
    level: "core",
    sentence:
      "The seminar ____ at 9:00 A.M. tomorrow, so participants should arrive by 8:45.",
    choices: ["had begun", "began", "begins", "has begun"],
    answer: 2,
    explanation:
      "確定した予定は現在形で表せる。tomorrow があっても過去形や完了形は使えない。",
    translation:
      "セミナーは明日午前9時に始まるので、参加者は8時45分までに到着すること。",
  },
  {
    id: "p5-vf-08",
    category: "verb-form",
    level: "core",
    sentence:
      "Neither the supervisor nor the technicians ____ available for comment yesterday.",
    choices: ["is", "has been", "was", "were"],
    answer: 3,
    explanation:
      "neither A nor B は B に動詞を合わせる。B は複数の technicians、さらに yesterday があるので were。",
    translation:
      "昨日は、監督者も技術者もコメントできる状況になかった。",
  },
  {
    id: "p5-vf-09",
    category: "verb-form",
    level: "core",
    sentence:
      "The number of online orders ____ steadily over the past three years.",
    choices: ["increase", "have increased", "has increased", "are increasing"],
    answer: 2,
    explanation:
      "the number of ... は「〜の数」で単数扱い。over the past three years があるので現在完了 has increased。",
    translation:
      "オンライン注文の件数は、過去3年間で着実に増加している。",
  },
  {
    id: "p5-vf-10",
    category: "verb-form",
    level: "core",
    sentence:
      "When Mr. Sato called the office, the technicians ____ the air-conditioning unit.",
    choices: ["repaired", "were repairing", "have repaired", "repair"],
    answer: 1,
    explanation:
      "過去の一時点（when 節）に進行中だった動作なので、過去進行形 were repairing。",
    translation:
      "佐藤さんが事務所に電話したとき、技術者たちは空調設備を修理しているところだった。",
  },
  {
    id: "p5-vf-11",
    category: "verb-form",
    level: "core",
    sentence:
      "By next June, Ms. Green ____ with the firm for ten years.",
    choices: ["was", "will have been", "has been", "is"],
    answer: 1,
    explanation:
      "By next June という未来の時点までの継続なので、未来完了 will have been。",
    translation:
      "来年6月で、グリーンさんはその会社に10年間勤めたことになる。",
  },
  {
    id: "p5-vf-12",
    category: "verb-form",
    level: "core",
    sentence:
      "The maintenance crew ____ the elevators twice a year in accordance with city regulations.",
    choices: ["inspects", "inspecting", "to inspect", "inspect"],
    answer: 0,
    explanation:
      "crew は集合名詞でここでは一つのまとまりとして扱う。twice a year という習慣なので現在形 inspects。",
    translation:
      "保守作業班は、市の規則に従って年2回エレベーターを点検している。",
  },

  // ------------------------------------------------------------------
  // 態（voice）
  // ------------------------------------------------------------------
  {
    id: "p5-vo-01",
    category: "voice",
    level: "core",
    sentence:
      "The keynote speech ____ by the company president at 10:00 A.M.",
    choices: [
      "has delivered",
      "will deliver",
      "will be delivered",
      "is delivering",
    ],
    answer: 2,
    explanation:
      "主語 speech は「述べられる」側。直後に by ... があるのも受動態の合図で、will be delivered。",
    translation: "基調講演は午前10時に社長によって行われる。",
  },
  {
    id: "p5-vo-02",
    category: "voice",
    level: "core",
    sentence:
      "Visitors ____ to wear identification badges at all times while on site.",
    choices: ["are required", "requiring", "require", "requires"],
    answer: 0,
    explanation:
      "来訪者は「求められる」側なので受動態。be required to do（〜することを求められる）の形。",
    translation:
      "来訪者は構内にいる間、常に身分証バッジを着用することが求められる。",
  },
  {
    id: "p5-vo-03",
    category: "voice",
    level: "core",
    sentence: "The defective units ____ to the manufacturer last week.",
    choices: ["are returning", "returned", "were returned", "have returned"],
    answer: 2,
    explanation:
      "unit（製品）は自分で返品できないので受動態。last week があるので過去形の were returned。",
    translation: "不良品は先週、製造元に返送された。",
  },
  {
    id: "p5-vo-04",
    category: "voice",
    level: "core",
    sentence:
      "Conference Room A ____ for the entire afternoon, so please use Room B.",
    choices: ["is reserving", "reserves", "has reserved", "has been reserved"],
    answer: 3,
    explanation:
      "会議室は予約される側なので受動態。現在に影響が及んでいるので現在完了の受動態 has been reserved。",
    translation:
      "会議室Aは午後いっぱい予約が入っているので、会議室Bを使ってください。",
  },
  {
    id: "p5-vo-05",
    category: "voice",
    level: "core",
    sentence:
      "All expense claims must ____ by the department head before payment is made.",
    choices: ["be approved", "being approved", "approve", "approved"],
    answer: 0,
    explanation:
      "助動詞 must の直後は動詞の原形。申請は承認される側なので must be approved。",
    translation:
      "すべての経費申請は、支払い前に部長の承認を受けなければならない。",
  },
  {
    id: "p5-vo-06",
    category: "voice",
    level: "core",
    sentence:
      "Employees ____ a detailed explanation of the new health plan at Monday's briefing.",
    choices: ["gave", "were given", "giving", "have given"],
    answer: 1,
    explanation:
      "give A B の B が残った受動態。従業員は説明を「与えられた」側なので were given。",
    translation:
      "従業員は月曜日の説明会で、新しい健康保険制度について詳しい説明を受けた。",
  },
  {
    id: "p5-vo-07",
    category: "voice",
    level: "core",
    sentence: "The employee parking lot ____ every Saturday morning.",
    choices: ["cleans", "is cleaned", "has cleaned", "cleaning"],
    answer: 1,
    explanation:
      "駐車場は清掃される側。every Saturday morning という習慣なので現在形の受動態 is cleaned。",
    translation: "従業員用駐車場は毎週土曜日の朝に清掃される。",
  },
  {
    id: "p5-vo-08",
    category: "voice",
    level: "core",
    sentence:
      "The revised safety guidelines ____ to all branch offices next month.",
    choices: [
      "are distributing",
      "have distributed",
      "will distribute",
      "will be distributed",
    ],
    answer: 3,
    explanation:
      "guidelines は配布される側で、next month があるので未来の受動態 will be distributed。",
    translation:
      "改訂された安全指針は来月、全支店に配布される。",
  },
  {
    id: "p5-vo-09",
    category: "voice",
    level: "core",
    sentence:
      "Ms. Rivera ____ to head the overseas division after ten years in sales.",
    choices: ["has appointed", "appointing", "appointed", "was appointed"],
    answer: 3,
    explanation:
      "appoint は「任命する」。リベラさんは任命された側なので受動態 was appointed。",
    translation:
      "リベラさんは営業部門で10年を過ごしたのち、海外事業部長に任命された。",
  },
  {
    id: "p5-vo-10",
    category: "voice",
    level: "core",
    sentence:
      "The headquarters building ____ in 1987 and has been renovated twice since then.",
    choices: [
      "constructed",
      "was constructed",
      "has constructed",
      "constructs",
    ],
    answer: 1,
    explanation:
      "建物は建てられる側。in 1987 という過去の年があるので was constructed。後半の has been renovated も受動態でそろっている。",
    translation:
      "本社ビルは1987年に建設され、それ以来2度改修されている。",
  },
  {
    id: "p5-vo-11",
    category: "voice",
    level: "core",
    sentence: "Refunds ____ only with an original receipt.",
    choices: ["issue", "issues", "are issued", "issuing"],
    answer: 2,
    explanation:
      "refund（返金）は発行される側なので受動態 are issued。主語が複数であることにも注意。",
    translation: "返金は、原本のレシートがある場合にのみ行われる。",
  },
  {
    id: "p5-vo-12",
    category: "voice",
    level: "core",
    sentence: "The merger proposal is currently ____ by the legal department.",
    choices: ["being reviewed", "been reviewed", "review", "reviewing"],
    answer: 0,
    explanation:
      "currently があり「今まさに審査されている最中」。進行形の受動態 is being reviewed。",
    translation: "合併案は現在、法務部で審査中である。",
  },

  // ------------------------------------------------------------------
  // 前置詞（preposition）
  // ------------------------------------------------------------------
  {
    id: "p5-pr-01",
    category: "preposition",
    level: "core",
    sentence: "The quarterly report must be submitted ____ Friday at the latest.",
    choices: ["until", "by", "since", "during"],
    answer: 1,
    explanation:
      "by は「〜までに」で期限を表す。until は「〜までずっと」という継続で、提出という一回の動作には合わない。",
    translation: "四半期報告書は遅くとも金曜日までに提出しなければならない。",
  },
  {
    id: "p5-pr-02",
    category: "preposition",
    level: "core",
    sentence:
      "Please complete the enclosed survey ____ two weeks of receiving it.",
    choices: ["among", "through", "within", "onto"],
    answer: 2,
    explanation:
      "within +期間で「〜以内に」。within two weeks of -ing は TOEIC の定番表現。",
    translation:
      "同封のアンケートは、受け取ってから2週間以内にご記入ください。",
  },
  {
    id: "p5-pr-03",
    category: "preposition",
    level: "core",
    sentence: "The museum is closed ____ national holidays.",
    choices: ["at", "in", "on", "to"],
    answer: 2,
    explanation:
      "特定の日・曜日には on を使う。at は時刻、in は月や年に使う。",
    translation: "その博物館は祝日は休館である。",
  },
  {
    id: "p5-pr-04",
    category: "preposition",
    level: "core",
    sentence: "Ms. Lee has managed the Singapore office ____ 2015.",
    choices: ["for", "since", "during", "by"],
    answer: 1,
    explanation:
      "since +時点で「〜以来」。for は for eight years のように期間の長さと使う。",
    translation:
      "リーさんは2015年からシンガポール事務所を統括している。",
  },
  {
    id: "p5-pr-05",
    category: "preposition",
    level: "core",
    sentence: "The airport shuttle departs ____ 15-minute intervals.",
    choices: ["in", "by", "at", "on"],
    answer: 2,
    explanation:
      "at ... intervals で「〜の間隔で」。間隔や速度、割合には at を使う。",
    translation: "空港シャトルは15分間隔で発車する。",
  },
  {
    id: "p5-pr-06",
    category: "preposition",
    level: "core",
    sentence: "Online sales rose sharply ____ the holiday season.",
    choices: ["during", "since", "while", "among"],
    answer: 0,
    explanation:
      "空所のあとは the holiday season という名詞なので前置詞が必要。while は接続詞なので入らない。",
    translation:
      "オンライン販売は年末商戦の期間中に急増した。",
  },
  {
    id: "p5-pr-07",
    category: "preposition",
    level: "core",
    sentence:
      "Distribute the handouts ____ the participants before the session begins.",
    choices: ["into", "over", "between", "among"],
    answer: 3,
    explanation:
      "3者以上に配る場合は among。between は基本的に2者の間に使う。",
    translation:
      "セッションが始まる前に、参加者に資料を配ってください。",
  },
  {
    id: "p5-pr-08",
    category: "preposition",
    level: "core",
    sentence: "Payment may be made ____ credit card or bank transfer.",
    choices: ["by", "to", "on", "for"],
    answer: 0,
    explanation:
      "by +無冠詞の手段で「〜によって」。by credit card、by e-mail などの形で覚える。",
    translation:
      "支払いはクレジットカードまたは銀行振込で行えます。",
  },
  {
    id: "p5-pr-09",
    category: "preposition",
    level: "core",
    sentence: "A technician will arrive ____ 30 minutes.",
    choices: ["in", "on", "by", "until"],
    answer: 0,
    explanation:
      "in +時間の長さで「（今から）〜後に」。within なら「〜以内に」で意味が変わる。",
    translation: "技術者が30分後に到着します。",
  },
  {
    id: "p5-pr-10",
    category: "preposition",
    level: "core",
    sentence:
      "The new branch is located ____ Fifth Avenue and Oak Street.",
    choices: ["within", "along", "among", "between"],
    answer: 3,
    explanation:
      "2つの通りにはさまれた位置なので between。A and B の形が between の合図になる。",
    translation:
      "新しい支店は5番街とオーク通りの間にある。",
  },
  {
    id: "p5-pr-11",
    category: "preposition",
    level: "core",
    sentence:
      "____ the heavy rain, the outdoor ceremony proceeded as planned.",
    choices: ["Even though", "Despite", "However", "Although"],
    answer: 1,
    explanation:
      "うしろが the heavy rain という名詞なので前置詞 Despite。Although と Even though は接続詞、However は副詞。",
    translation:
      "大雨にもかかわらず、屋外での式典は予定どおり行われた。",
  },
  {
    id: "p5-pr-12",
    category: "preposition",
    level: "core",
    sentence:
      "The company has invested heavily ____ employee training programs.",
    choices: ["at", "for", "of", "in"],
    answer: 3,
    explanation:
      "invest in ...（〜に投資する）は決まった組み合わせ。動詞と前置詞のセットで覚える。",
    translation:
      "その会社は従業員研修に多額の投資をしてきた。",
  },

  // ------------------------------------------------------------------
  // 接続詞・接続副詞（conjunction）
  // ------------------------------------------------------------------
  {
    id: "p5-cj-01",
    category: "conjunction",
    level: "core",
    sentence:
      "____ the shipment was delayed, the client agreed to extend the deadline.",
    choices: ["Therefore", "Because of", "Because", "Despite"],
    answer: 2,
    explanation:
      "うしろに the shipment was delayed という文が続くので、接続詞 Because。Because of と Despite は前置詞、Therefore は副詞。",
    translation:
      "出荷が遅れたため、顧客は納期の延長に同意した。",
  },
  {
    id: "p5-cj-02",
    category: "conjunction",
    level: "core",
    sentence:
      "The new model is more expensive; ____, it uses far less electricity.",
    choices: ["although", "however", "whereas", "unless"],
    answer: 1,
    explanation:
      "セミコロンで2つの文が並んでいるので、つなぐのは接続副詞 however。接続詞はセミコロンのあとには置けない。",
    translation:
      "新型は価格が高いが、消費電力ははるかに少ない。",
  },
  {
    id: "p5-cj-03",
    category: "conjunction",
    level: "core",
    sentence:
      "Please call the help desk ____ you have trouble logging in to the system.",
    choices: ["if", "whether", "so", "such"],
    answer: 0,
    explanation:
      "「〜の場合は」という条件を表す if。whether は「〜かどうか」で意味が合わない。",
    translation:
      "システムにログインできない場合は、ヘルプデスクにお電話ください。",
  },
  {
    id: "p5-cj-04",
    category: "conjunction",
    level: "core",
    sentence:
      "____ the budget nor the timeline has been finalized.",
    choices: ["Neither", "Not only", "Either", "Both"],
    answer: 0,
    explanation:
      "nor とペアになるのは neither。neither A nor B で「AもBも〜ない」。",
    translation:
      "予算も日程も、まだ確定していない。",
  },
  {
    id: "p5-cj-05",
    category: "conjunction",
    level: "core",
    sentence:
      "Mr. Tanaka will lead the project ____ Ms. Ito returns from parental leave.",
    choices: ["by", "during", "until", "despite"],
    answer: 2,
    explanation:
      "うしろが文なので接続詞。「〜するまでずっと」という継続の until が文意に合う。",
    translation:
      "伊藤さんが育児休業から復帰するまで、田中さんがプロジェクトを率いる。",
  },
  {
    id: "p5-cj-06",
    category: "conjunction",
    level: "core",
    sentence:
      "The store offers free delivery ____ the order exceeds 50 dollars.",
    choices: ["due to", "in spite of", "as long as", "because of"],
    answer: 2,
    explanation:
      "うしろが文なので接続詞の働きをする as long as（〜する限りは）。ほかの3つはすべて前置詞句。",
    translation:
      "注文額が50ドルを超える限り、その店は無料配送を行っている。",
  },
  {
    id: "p5-cj-07",
    category: "conjunction",
    level: "core",
    sentence:
      "We hired two temporary staff members ____ meet the increased demand.",
    choices: ["so that", "in order to", "due to", "because"],
    answer: 1,
    explanation:
      "うしろが動詞の原形 meet なので in order to do（〜するために）。so that は文が続く必要がある。",
    translation:
      "増加した需要に対応するため、臨時職員を2名雇用した。",
  },
  {
    id: "p5-cj-08",
    category: "conjunction",
    level: "core",
    sentence:
      "____ she had little experience in logistics, Ms. Ford managed the transition smoothly.",
    choices: ["Therefore", "Although", "Despite", "Because of"],
    answer: 1,
    explanation:
      "うしろが文で、前後が逆接の関係なので接続詞 Although。Despite と Because of は前置詞。",
    translation:
      "物流の経験はほとんどなかったが、フォードさんは移行を滞りなく進めた。",
  },
  {
    id: "p5-cj-09",
    category: "conjunction",
    level: "core",
    sentence:
      "The pilot survey produced disappointing results. ____, the team decided to revise the strategy.",
    choices: ["Consequently", "Nevertheless", "Whereas", "Unless"],
    answer: 0,
    explanation:
      "前の文が原因、あとの文が結果。結果を導く接続副詞 Consequently が入る。",
    translation:
      "試験調査の結果は期待外れだった。そのためチームは戦略の見直しを決めた。",
  },
  {
    id: "p5-cj-10",
    category: "conjunction",
    level: "core",
    sentence:
      "The machine will not start ____ the safety cover is properly closed.",
    choices: ["because", "while", "if", "unless"],
    answer: 3,
    explanation:
      "unless は「〜でない限り」。安全カバーが閉まっていない限り動かない、という文意になる。",
    translation:
      "安全カバーが正しく閉まっていない限り、その機械は起動しない。",
  },
  {
    id: "p5-cj-11",
    category: "conjunction",
    level: "core",
    sentence:
      "The front desk will remain staffed ____ the lobby renovation is under way.",
    choices: ["during", "for", "among", "while"],
    answer: 3,
    explanation:
      "うしろが文なので接続詞 while。during は名詞が続く前置詞なので入らない。",
    translation:
      "ロビーの改修が行われている間も、受付には職員が常駐する。",
  },
  {
    id: "p5-cj-12",
    category: "conjunction",
    level: "core",
    sentence:
      "Ms. Diaz is fluent ____ in Spanish and in Portuguese.",
    choices: ["neither", "whether", "either", "both"],
    answer: 3,
    explanation:
      "and とペアになるのは both。both A and B で「AもBも両方」。",
    translation:
      "ディアスさんはスペイン語とポルトガル語の両方を流暢に話す。",
  },

  // ------------------------------------------------------------------
  // 代名詞（pronoun）
  // ------------------------------------------------------------------
  {
    id: "p5-pn-01",
    category: "pronoun",
    level: "core",
    sentence: "Employees should submit ____ time sheets by Friday afternoon.",
    choices: ["theirs", "they", "them", "their"],
    answer: 3,
    explanation:
      "うしろに名詞 time sheets があるので、名詞を修飾する所有格 their。",
    translation:
      "従業員は金曜日の午後までに勤務表を提出すること。",
  },
  {
    id: "p5-pn-02",
    category: "pronoun",
    level: "core",
    sentence: "The final decision about the venue is ____.",
    choices: ["yours", "yourself", "you", "your"],
    answer: 0,
    explanation:
      "be 動詞のあとで「あなたのもの」を表すので所有代名詞 yours。your のあとには名詞が必要。",
    translation:
      "会場についての最終判断はあなたに委ねられている。",
  },
  {
    id: "p5-pn-03",
    category: "pronoun",
    level: "core",
    sentence:
      "Ms. Harper prepared the entire presentation ____ in just two days.",
    choices: ["her", "hers", "herself", "she"],
    answer: 2,
    explanation:
      "「彼女自身で」と主語を強調する再帰代名詞 herself。文の要素としては省略できる位置にある。",
    translation:
      "ハーパーさんはわずか2日で、プレゼン資料をすべて自分で作り上げた。",
  },
  {
    id: "p5-pn-04",
    category: "pronoun",
    level: "core",
    sentence: "____ of the two proposals meets the client's budget.",
    choices: ["None", "Any", "Every", "Neither"],
    answer: 3,
    explanation:
      "2つのうちどちらも〜ない、は neither。3つ以上なら none を使う。",
    translation:
      "2つの提案は、どちらも顧客の予算に収まっていない。",
  },
  {
    id: "p5-pn-05",
    category: "pronoun",
    level: "core",
    sentence:
      "Our shipping rates are significantly lower than ____ of our competitors.",
    choices: ["they", "that", "those", "them"],
    answer: 2,
    explanation:
      "比較しているのは複数形の rates なので、繰り返しを避ける代名詞は those。単数なら that を使う。",
    translation:
      "当社の配送料金は、競合他社のそれより大幅に安い。",
  },
  {
    id: "p5-pn-06",
    category: "pronoun",
    level: "core",
    sentence:
      "If you have not received a visitor badge, please request ____ at the front desk.",
    choices: ["some", "any", "it", "one"],
    answer: 3,
    explanation:
      "不特定の「バッジを1つ」なので one。it は「その特定のもの」を指すので、まだ受け取っていない文脈に合わない。",
    translation:
      "来訪者バッジをお受け取りでない場合は、受付でお申し出ください。",
  },
  {
    id: "p5-pn-07",
    category: "pronoun",
    level: "core",
    sentence:
      "The director asked Mr. Ross and ____ to lead the internal audit.",
    choices: ["I", "me", "my", "mine"],
    answer: 1,
    explanation:
      "asked の目的語なので目的格 me。and で並んでいても格は変わらない。",
    translation:
      "部長はロスさんと私に内部監査を主導するよう依頼した。",
  },
  {
    id: "p5-pn-08",
    category: "pronoun",
    level: "core",
    sentence:
      "Most of the testing equipment in the laboratory is ____.",
    choices: ["us", "our", "ours", "ourselves"],
    answer: 2,
    explanation:
      "be 動詞のあとで「私たちのもの」を表すので所有代名詞 ours。",
    translation:
      "その研究室にある試験機器のほとんどは当方の所有物である。",
  },
  {
    id: "p5-pn-09",
    category: "pronoun",
    level: "core",
    sentence:
      "____ interested in the leadership program should contact Human Resources.",
    choices: ["Those", "Whom", "They", "Them"],
    answer: 0,
    explanation:
      "those +形容詞句で「〜な人々」。those interested in ... は掲示文でよく使われる形。",
    translation:
      "リーダー研修に関心のある方は人事部にご連絡ください。",
  },
  {
    id: "p5-pn-10",
    category: "pronoun",
    level: "core",
    sentence: "The committee will announce ____ decision on Monday.",
    choices: ["it", "its", "it's", "itself"],
    answer: 1,
    explanation:
      "名詞 decision を修飾するので所有格 its。it's は it is の短縮形で別物。",
    translation:
      "委員会は月曜日にその決定を発表する。",
  },
  {
    id: "p5-pn-11",
    category: "pronoun",
    level: "core",
    sentence: "Please help ____ to the refreshments in the lobby.",
    choices: ["yours", "yourself", "you", "your"],
    answer: 1,
    explanation:
      "help oneself to ... で「〜を自由に取って食べる」。決まった言い回しとして覚える。",
    translation:
      "ロビーの軽食はご自由にお取りください。",
  },
  {
    id: "p5-pn-12",
    category: "pronoun",
    level: "core",
    sentence:
      "All of the display samples were damaged, so the store ordered new ____.",
    choices: ["ones", "it", "them", "one"],
    answer: 0,
    explanation:
      "複数の samples の代わりなので ones。new のような形容詞のあとには it や them は置けない。",
    translation:
      "展示用の見本はすべて破損したため、店は新しいものを注文した。",
  },

  // ------------------------------------------------------------------
  // 関係詞（relative）
  // ------------------------------------------------------------------
  {
    id: "p5-rl-01",
    category: "relative",
    level: "core",
    sentence:
      "The candidate ____ resume impressed the hiring panel will be interviewed tomorrow.",
    choices: ["whose", "which", "who", "whom"],
    answer: 0,
    explanation:
      "うしろが resume という名詞で、「その候補者の履歴書」という所有の関係。所有格の関係代名詞 whose が入る。",
    translation:
      "履歴書が採用担当者に好印象を与えた候補者は、明日面接を受ける。",
  },
  {
    id: "p5-rl-02",
    category: "relative",
    level: "core",
    sentence:
      "The annual report, ____ was released yesterday, contains several corrections.",
    choices: ["which", "what", "who", "that"],
    answer: 0,
    explanation:
      "コンマで挟まれた非制限用法では that は使えない。先行詞が物なので which。",
    translation:
      "昨日公表された年次報告書には、いくつかの訂正が含まれている。",
  },
  {
    id: "p5-rl-03",
    category: "relative",
    level: "core",
    sentence:
      "Only employees ____ have completed the safety training may operate the forklift.",
    choices: ["who", "whom", "whose", "which"],
    answer: 0,
    explanation:
      "先行詞が人 employees で、関係詞節の中で主語の働きをするので主格の who。",
    translation:
      "安全講習を修了した従業員のみがフォークリフトを操作できる。",
  },
  {
    id: "p5-rl-04",
    category: "relative",
    level: "core",
    sentence:
      "This is the warehouse ____ the damaged goods are currently stored.",
    choices: ["that", "where", "what", "which"],
    answer: 1,
    explanation:
      "関係詞のうしろが完全な文で、先行詞が場所 warehouse なので関係副詞 where。",
    translation:
      "ここが、破損した商品が現在保管されている倉庫である。",
  },
  {
    id: "p5-rl-05",
    category: "relative",
    level: "core",
    sentence: "We are looking for a supplier ____ can deliver within 48 hours.",
    choices: ["where", "what", "that", "whose"],
    answer: 2,
    explanation:
      "先行詞 supplier を受けて関係詞節の主語になる。人にも組織にも使える that が正解。",
    translation:
      "当社は48時間以内に配送できる仕入先を探している。",
  },
  {
    id: "p5-rl-06",
    category: "relative",
    level: "core",
    sentence:
      "The reason ____ the flight was canceled has not been explained.",
    choices: ["what", "whose", "why", "which"],
    answer: 2,
    explanation:
      "先行詞が the reason で、うしろが完全な文。理由を表す関係副詞 why が入る。",
    translation:
      "その便が欠航になった理由は、まだ説明されていない。",
  },
  {
    id: "p5-rl-07",
    category: "relative",
    level: "core",
    sentence:
      "Mr. Blake is the colleague with ____ I shared an office for five years.",
    choices: ["which", "that", "who", "whom"],
    answer: 3,
    explanation:
      "前置詞 with の直後に置ける関係代名詞は whom のみ。with who や with that の形は取らない。",
    translation:
      "ブレイクさんは、私が5年間オフィスを共有した同僚である。",
  },
  {
    id: "p5-rl-08",
    category: "relative",
    level: "core",
    sentence: "The selection committee will hire ____ is most qualified.",
    choices: ["whom", "whoever", "whomever", "who"],
    answer: 1,
    explanation:
      "先行詞がなく、節全体が hire の目的語になる。節の中では主語なので whoever。",
    translation:
      "選考委員会は、最も適任である人を誰であれ採用する。",
  },
  {
    id: "p5-rl-09",
    category: "relative",
    level: "core",
    sentence:
      "2019 was the year ____ the company entered the Asian market.",
    choices: ["what", "whose", "when", "which"],
    answer: 2,
    explanation:
      "先行詞が the year で、うしろが完全な文。時を表す関係副詞 when が入る。",
    translation:
      "2019年は、その会社がアジア市場に参入した年だった。",
  },
  {
    id: "p5-rl-10",
    category: "relative",
    level: "core",
    sentence:
      "The revised proposal ____ the committee approved will take effect in July.",
    choices: ["who", "that", "what", "where"],
    answer: 1,
    explanation:
      "approved の目的語が欠けているので目的格の関係代名詞。先行詞が物なので that。",
    translation:
      "委員会が承認した修正案は、7月に発効する。",
  },
  {
    id: "p5-rl-11",
    category: "relative",
    level: "core",
    sentence:
      "Our new office, ____ is located near the station, will open in May.",
    choices: ["where", "that", "what", "which"],
    answer: 3,
    explanation:
      "コンマつきの非制限用法なので that は不可。うしろに is が続き主語が欠けているので、関係副詞 where でもない。which が正解。",
    translation:
      "駅の近くにある当社の新しいオフィスは、5月に開設される。",
  },
  {
    id: "p5-rl-12",
    category: "relative",
    level: "core",
    sentence:
      "____ the maintenance team recommends will be included in next year's budget.",
    choices: ["Which", "Whose", "That", "What"],
    answer: 3,
    explanation:
      "先行詞がなく「〜すること」という名詞のかたまりを作るのは関係代名詞 what。この節全体が文の主語になっている。",
    translation:
      "保守チームが推奨する内容は、来年度の予算に盛り込まれる。",
  },

  // ------------------------------------------------------------------
  // 比較（comparison）
  // ------------------------------------------------------------------
  {
    id: "p5-cm-01",
    category: "comparison",
    level: "core",
    sentence:
      "This year's advertising budget is ____ than last year's.",
    choices: ["higher", "highest", "highly", "high"],
    answer: 0,
    explanation:
      "than があるので比較級 higher。最上級 highest には the がつき、than とは組み合わせない。",
    translation:
      "今年度の広告予算は昨年度より多い。",
  },
  {
    id: "p5-cm-02",
    category: "comparison",
    level: "core",
    sentence: "The Osaka branch is the ____ of the company's five offices.",
    choices: ["larger", "largest", "largely", "large"],
    answer: 1,
    explanation:
      "the と of the ... five offices があり、3つ以上の中で最も、を表すので最上級 largest。",
    translation:
      "大阪支店は、その会社の5つの拠点の中で最大である。",
  },
  {
    id: "p5-cm-03",
    category: "comparison",
    level: "core",
    sentence:
      "The revised workflow is far ____ efficient than the previous one.",
    choices: ["more", "most", "very", "much"],
    answer: 0,
    explanation:
      "than があるので比較級を作る more。far は比較級を強める副詞で、very は比較級を強められない。",
    translation:
      "見直し後の業務手順は、以前のものよりはるかに効率的である。",
  },
  {
    id: "p5-cm-04",
    category: "comparison",
    level: "core",
    sentence: "Please respond to the client's inquiry as ____ as possible.",
    choices: ["soonest", "sooner than", "soon", "sooner"],
    answer: 2,
    explanation:
      "as ... as possible は原級を挟む形。比較級は入らない。",
    translation:
      "顧客からの問い合わせには、できるだけ早く返信してください。",
  },
  {
    id: "p5-cm-05",
    category: "comparison",
    level: "core",
    sentence:
      "Of the three finalists, Ms. Weber has the ____ international experience.",
    choices: ["many", "more", "most", "much"],
    answer: 2,
    explanation:
      "Of the three ... と3者以上の比較で the があるので最上級 most。",
    translation:
      "最終候補3名の中で、ウェーバーさんが最も海外経験が豊富である。",
  },
  {
    id: "p5-cm-06",
    category: "comparison",
    level: "core",
    sentence:
      "The upgraded model costs twice as ____ as the original version.",
    choices: ["more", "most", "many", "much"],
    answer: 3,
    explanation:
      "twice as ... as で倍数表現。cost は金額なので不可算扱いの much を使う。",
    translation:
      "改良版の価格は、元のモデルの2倍である。",
  },
  {
    id: "p5-cm-07",
    category: "comparison",
    level: "core",
    sentence:
      "Attendance at this year's trade show was slightly ____ than we had expected.",
    choices: ["low", "lower", "lowest", "lowly"],
    answer: 1,
    explanation:
      "than があるので比較級 lower。slightly は比較級を控えめに強める副詞。",
    translation:
      "今年の見本市の来場者数は、予想をわずかに下回った。",
  },
  {
    id: "p5-cm-08",
    category: "comparison",
    level: "core",
    sentence:
      "The more carefully you proofread the draft, the ____ errors you will find later.",
    choices: ["few", "fewer", "fewest", "less"],
    answer: 1,
    explanation:
      "the +比較級, the +比較級で「〜すればするほど…」。errors は可算名詞なので fewer。",
    translation:
      "原稿を丁寧に校正すればするほど、あとで見つかる誤りは少なくなる。",
  },
  {
    id: "p5-cm-09",
    category: "comparison",
    level: "core",
    sentence:
      "No other supplier in the region offers ____ rates than Harbor Freight.",
    choices: [
      "more competitive",
      "most competitive",
      "competitively",
      "competitive",
    ],
    answer: 0,
    explanation:
      "than があるので比較級。No other ... +比較級 than は最上級に近い意味を表す定番の形。",
    translation:
      "この地域で、ハーバー運送より条件のよい料金を出している業者はほかにない。",
  },
  {
    id: "p5-cm-10",
    category: "comparison",
    level: "core",
    sentence:
      "The main hall can accommodate ____ people than the east auditorium.",
    choices: ["most", "many", "much", "more"],
    answer: 3,
    explanation:
      "than があるので many の比較級 more。people は可算名詞なので much は使えない。",
    translation:
      "大ホールは東講堂より多くの人を収容できる。",
  },
  {
    id: "p5-cm-11",
    category: "comparison",
    level: "core",
    sentence:
      "The new printer is not nearly as ____ as the model it replaced.",
    choices: ["noisiest", "noise", "noisy", "noisier"],
    answer: 2,
    explanation:
      "as ... as にはさまれるのは原級。形容詞 noisy が入る。",
    translation:
      "新しいプリンターは、置き換えられた旧機種ほどうるさくはない。",
  },
  {
    id: "p5-cm-12",
    category: "comparison",
    level: "core",
    sentence:
      "Fourth-quarter sales were the ____ in the company's forty-year history.",
    choices: ["strongly", "strong", "stronger", "strongest"],
    answer: 3,
    explanation:
      "the があり、in ... history という範囲が示されているので最上級 strongest。",
    translation:
      "第4四半期の売上は、その会社の40年の歴史で最高だった。",
  },

  // ------------------------------------------------------------------
  // 準動詞（verbal）不定詞・動名詞・分詞
  // ------------------------------------------------------------------
  {
    id: "p5-vb-01",
    category: "verbal",
    level: "core",
    sentence:
      "The project manager decided ____ the kickoff meeting until next week.",
    choices: ["postponed", "postpone", "to postpone", "postponing"],
    answer: 2,
    explanation:
      "decide は to 不定詞を目的語に取る動詞。decide to do の形で覚える。",
    translation:
      "プロジェクト責任者は、着手会議を来週まで延期することにした。",
  },
  {
    id: "p5-vb-02",
    category: "verbal",
    level: "core",
    sentence: "We appreciate your ____ the customer survey so promptly.",
    choices: ["completed", "completing", "to complete", "complete"],
    answer: 1,
    explanation:
      "appreciate は動名詞を目的語に取る。所有格 your が動名詞の意味上の主語になっている。",
    translation:
      "顧客アンケートに早々にご回答いただき、ありがとうございます。",
  },
  {
    id: "p5-vb-03",
    category: "verbal",
    level: "core",
    sentence:
      "____ in 1998, the Riverton plant now employs more than 400 workers.",
    choices: ["Founding", "Founded", "To found", "Founds"],
    answer: 1,
    explanation:
      "工場は「設立された」側なので過去分詞 Founded で始まる分詞構文。",
    translation:
      "1998年に設立されたリバートン工場は、現在400人以上を雇用している。",
  },
  {
    id: "p5-vb-04",
    category: "verbal",
    level: "core",
    sentence:
      "The board is considering ____ a second distribution center next year.",
    choices: ["open", "to open", "opening", "opened"],
    answer: 2,
    explanation:
      "consider は動名詞を目的語に取る動詞。consider to do の形は取らない。",
    translation:
      "取締役会は来年、2つ目の配送センターを開設することを検討している。",
  },
  {
    id: "p5-vb-05",
    category: "verbal",
    level: "core",
    sentence:
      "Passengers waiting ____ board should remain behind the yellow line.",
    choices: ["for", "of", "at", "to"],
    answer: 3,
    explanation:
      "wait to do で「〜するのを待つ」。board は動詞（搭乗する）なので to が入る。",
    translation:
      "搭乗をお待ちのお客様は、黄色い線の内側でお待ちください。",
  },
  {
    id: "p5-vb-06",
    category: "verbal",
    level: "core",
    sentence: "The documents ____ to this message are strictly confidential.",
    choices: ["attached", "to attach", "attach", "attaching"],
    answer: 0,
    explanation:
      "documents は添付される側なので過去分詞 attached が後ろから名詞を修飾している。",
    translation:
      "このメッセージに添付された文書は極秘である。",
  },
  {
    id: "p5-vb-07",
    category: "verbal",
    level: "core",
    sentence:
      "Ms. Nakamura is looking forward to ____ the new clients at the reception.",
    choices: ["meet", "meeting", "met", "be met"],
    answer: 1,
    explanation:
      "look forward to の to は前置詞。うしろには動名詞 meeting が来る。",
    translation:
      "中村さんは歓迎会で新しい顧客に会うのを楽しみにしている。",
  },
  {
    id: "p5-vb-08",
    category: "verbal",
    level: "core",
    sentence:
      "____ heavy traffic near the airport, we left the office an hour early.",
    choices: ["To anticipate", "Anticipate", "Anticipated", "Anticipating"],
    answer: 3,
    explanation:
      "主語 we が「予想して」という能動の関係なので、現在分詞 Anticipating で始まる分詞構文。",
    translation:
      "空港周辺の渋滞を見込んで、私たちは1時間早く事務所を出た。",
  },
  {
    id: "p5-vb-09",
    category: "verbal",
    level: "core",
    sentence:
      "The contractor failed ____ the deadline specified in the agreement.",
    choices: ["meet", "meeting", "to meet", "met"],
    answer: 2,
    explanation:
      "fail to do で「〜できない、〜しそこなう」。不定詞を取る動詞として頻出。",
    translation:
      "その請負業者は、契約で定められた期限を守れなかった。",
  },
  {
    id: "p5-vb-10",
    category: "verbal",
    level: "core",
    sentence:
      "All staff members are encouraged ____ in the annual wellness program.",
    choices: ["participated", "participate", "participating", "to participate"],
    answer: 3,
    explanation:
      "encourage A to do の受動態 be encouraged to do。うしろは不定詞になる。",
    translation:
      "全職員に、年に一度の健康増進プログラムへの参加が奨励されている。",
  },
  {
    id: "p5-vb-11",
    category: "verbal",
    level: "core",
    sentence:
      "The setup instructions were unclear, leaving many customers ____.",
    choices: ["frustrated", "to frustrate", "frustrate", "frustrating"],
    answer: 0,
    explanation:
      "customers は「いらだたされた」側なので過去分詞 frustrated。frustrating なら「いらだたせるような」で物を説明する語になる。",
    translation:
      "設定手順の説明が不明瞭で、多くの顧客が不満を抱えることになった。",
  },
  {
    id: "p5-vb-12",
    category: "verbal",
    level: "core",
    sentence:
      "Before ____ the cutting machine, please read the safety manual in full.",
    choices: ["operating", "operated", "to operate", "operate"],
    answer: 0,
    explanation:
      "before は前置詞としても使え、そのうしろには動名詞 operating が来る。",
    translation:
      "裁断機を操作する前に、安全マニュアルを最後までお読みください。",
  },

  // ------------------------------------------------------------------
  // 語彙（vocabulary）
  // ------------------------------------------------------------------
  {
    id: "p5-vc-01",
    category: "vocabulary",
    level: "core",
    sentence:
      "Please ____ the enclosed form and return it in the prepaid envelope.",
    choices: ["accomplish", "finish", "complete", "achieve"],
    answer: 2,
    explanation:
      "書類に記入する、という意味では complete を使う。achieve と accomplish は目標の達成、finish は作業を終える意味。",
    translation:
      "同封の用紙にご記入のうえ、料金支払済みの封筒で返送してください。",
  },
  {
    id: "p5-vc-02",
    category: "vocabulary",
    level: "core",
    sentence:
      "The standard warranty does not ____ damage caused by improper use.",
    choices: ["contain", "cover", "include", "involve"],
    answer: 1,
    explanation:
      "保証が「対象とする」は cover。contain と include は中に含む、involve は関与させる意味。",
    translation:
      "標準保証は、不適切な使用による損傷を対象としていない。",
  },
  {
    id: "p5-vc-03",
    category: "vocabulary",
    level: "core",
    sentence:
      "The airline apologized for the ____ caused by the three-hour delay.",
    choices: ["disagreement", "interruption", "objection", "inconvenience"],
    answer: 3,
    explanation:
      "遅延による「ご不便」は inconvenience。apologize for the inconvenience は定型表現。",
    translation:
      "航空会社は3時間の遅延によりご不便をおかけしたことを謝罪した。",
  },
  {
    id: "p5-vc-04",
    category: "vocabulary",
    level: "core",
    sentence:
      "All contractors must ____ with the updated safety regulations.",
    choices: ["follow", "comply", "observe", "obey"],
    answer: 1,
    explanation:
      "うしろに with があるので comply with（〜に従う）。obey と follow、observe は前置詞なしで目的語を取る。",
    translation:
      "すべての請負業者は、改訂された安全規則を遵守しなければならない。",
  },
  {
    id: "p5-vc-05",
    category: "vocabulary",
    level: "core",
    sentence:
      "Harborline Foods plans to ____ its operations into Southeast Asia.",
    choices: ["enlarge", "expand", "increase", "extend"],
    answer: 1,
    explanation:
      "事業を地理的に広げるときは expand into ... を使う。increase は数量、enlarge は物の大きさに使う。",
    translation:
      "ハーバーライン食品は、東南アジアへの事業拡大を計画している。",
  },
  {
    id: "p5-vc-06",
    category: "vocabulary",
    level: "core",
    sentence:
      "Mr. Delgado was ____ for his outstanding contribution to the merger project.",
    choices: ["noticed", "realized", "understood", "recognized"],
    answer: 3,
    explanation:
      "功績が「評価される、表彰される」は recognize。notice は気づく、realize は理解する意味。",
    translation:
      "デルガドさんは合併案件への多大な貢献が評価された。",
  },
  {
    id: "p5-vc-07",
    category: "vocabulary",
    level: "core",
    sentence:
      "Customers should ____ the original receipt in case an exchange is needed.",
    choices: ["retain", "maintain", "sustain", "remain"],
    answer: 0,
    explanation:
      "「保管しておく」は retain。remain は自動詞で目的語を取らず、maintain は状態を維持する意味。",
    translation:
      "交換が必要になる場合に備えて、お客様はレシートの原本を保管してください。",
  },
  {
    id: "p5-vc-08",
    category: "vocabulary",
    level: "core",
    sentence:
      "The consultant made several practical ____ for improving the workflow.",
    choices: ["informations", "advices", "suggestions", "opinions"],
    answer: 2,
    explanation:
      "several のあとなので可算名詞の複数形。advice と information は不可算で複数形にできない。",
    translation:
      "コンサルタントは業務の流れを改善するための実践的な提案をいくつか行った。",
  },
  {
    id: "p5-vc-09",
    category: "vocabulary",
    level: "core",
    sentence:
      "The shipment was delayed because of ____ weather conditions along the coast.",
    choices: ["averse", "diverse", "adverse", "reverse"],
    answer: 2,
    explanation:
      "adverse weather conditions で「悪天候」。averse は「気が進まない」、diverse は「多様な」で意味が異なる。",
    translation:
      "沿岸部の悪天候のため、出荷が遅れた。",
  },
  {
    id: "p5-vc-10",
    category: "vocabulary",
    level: "core",
    sentence:
      "Attendance at the two-day orientation is ____ for all new hires.",
    choices: ["mandatory", "required to", "necessarily", "obligated"],
    answer: 0,
    explanation:
      "be 動詞のあとで「必須である」を表す形容詞は mandatory。required なら to が不要で、required to は不定詞が続く形。",
    translation:
      "2日間のオリエンテーションへの出席は、新入社員全員に義務づけられている。",
  },
  {
    id: "p5-vc-11",
    category: "vocabulary",
    level: "core",
    sentence:
      "By switching to a local supplier, the plant was able to ____ shipping costs by 18 percent.",
    choices: ["reduce", "lower down", "shorten", "decline"],
    answer: 0,
    explanation:
      "費用を下げるは reduce。decline は自動詞で「減少する」、shorten は長さや期間を短くする意味。",
    translation:
      "地元の仕入先に切り替えたことで、その工場は配送費を18パーセント削減できた。",
  },
  {
    id: "p5-vc-12",
    category: "vocabulary",
    level: "core",
    sentence:
      "The renovation is expected to be completed ____ of schedule.",
    choices: ["front", "early", "advance", "ahead"],
    answer: 3,
    explanation:
      "ahead of schedule で「予定より早く」。in advance は of schedule とは組み合わせない。",
    translation:
      "改修工事は予定より早く完了する見込みである。",
  },
]
