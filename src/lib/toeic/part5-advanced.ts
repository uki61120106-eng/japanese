import type { Part5Question } from "@/lib/toeic/types"

/**
 * Part 5（短文穴埋め）のうち level: "advanced"（730〜860 点帯）の問題。
 *
 * すべてこのアプリのために書き下ろした自作問題で、公式問題集からの転載はない。
 * core との違いは、仮定法・倒置・譲歩の as といった構文と、
 * 意味が近い語の使い分けを問う点にある。
 */
export const PART5_ADVANCED: Part5Question[] = [
  // ------------------------------------------------------------------
  // 品詞（word-form）
  // ------------------------------------------------------------------
  {
    id: "p5a-wf-01",
    category: "word-form",
    level: "advanced",
    sentence:
      "Ms. Farrow's summary of the findings was both concise and ____.",
    choices: ["persuasive", "persuasively", "persuade", "persuasion"],
    answer: 0,
    explanation:
      "both A and B は同じ品詞を並べる。A が形容詞 concise なので、B も形容詞 persuasive になる。",
    translation:
      "ファロウさんによる調査結果の要約は、簡潔でありながら説得力もあった。",
  },
  {
    id: "p5a-wf-02",
    category: "word-form",
    level: "advanced",
    sentence:
      "Repeated delays in the permit process proved ____ to the project schedule.",
    choices: ["detrimental", "detrimentally", "detriments", "detriment"],
    answer: 0,
    explanation:
      "prove は「〜だと分かる」の意味で補語を取る。補語になるのは形容詞 detrimental（有害な）。",
    translation:
      "許認可手続きの度重なる遅れは、工程に悪影響を及ぼすことが明らかになった。",
  },
  {
    id: "p5a-wf-03",
    category: "word-form",
    level: "advanced",
    sentence:
      "____ with the safety protocol will result in immediate suspension of site access.",
    choices: ["Comply", "Compliant", "Compliance", "Noncompliance"],
    answer: 3,
    explanation:
      "文の主語なので名詞。名詞は Compliance と Noncompliance の2つだが、停止処分につながるのは「守らないこと」なので Noncompliance。品詞だけでなく意味まで見る必要がある。",
    translation:
      "安全手順を守らない場合、ただちに立ち入りを停止される。",
  },
  {
    id: "p5a-wf-04",
    category: "word-form",
    level: "advanced",
    sentence:
      "The firm operates with a high degree of ____ in its supply chain.",
    choices: ["transparently", "transparency", "transparencies", "transparent"],
    answer: 1,
    explanation:
      "a high degree of のあとは名詞。transparency（透明性）はこの意味では不可算なので、複数形にはしない。",
    translation:
      "その会社は、供給網において高い透明性を保って事業を行っている。",
  },
  {
    id: "p5a-wf-05",
    category: "word-form",
    level: "advanced",
    sentence: "All applicants are asked to provide two professional ____.",
    choices: ["referral", "references", "referrals", "refer"],
    answer: 1,
    explanation:
      "応募書類で求められる「推薦状・照会先」は reference。referral は「紹介・送致」で別の意味。",
    translation:
      "応募者は全員、職務上の推薦者2名分を提出するよう求められている。",
  },
  {
    id: "p5a-wf-06",
    category: "word-form",
    level: "advanced",
    sentence:
      "Attendance figures have remained ____ stable despite the change of venue.",
    choices: ["remarked", "remark", "remarkable", "remarkably"],
    answer: 3,
    explanation:
      "形容詞 stable を修飾するので副詞 remarkably。形容詞 remarkable は名詞を修飾する位置にしか入らない。",
    translation:
      "会場が変わったにもかかわらず、来場者数は驚くほど安定している。",
  },

  // ------------------------------------------------------------------
  // 動詞の形・時制（verb-form）
  // ------------------------------------------------------------------
  {
    id: "p5a-vf-01",
    category: "verb-form",
    level: "advanced",
    sentence:
      "Had the shipment been insured, the company ____ the full value of the goods.",
    choices: [
      "would have recovered",
      "will have recovered",
      "recovered",
      "would recover",
    ],
    answer: 0,
    explanation:
      "Had + 主語 + 過去分詞 は If 節の if を省いた倒置。過去の事実に反する仮定なので、主節は would have +過去分詞。",
    translation:
      "その積荷に保険がかけられていたら、会社は商品の全額を回収できていただろう。",
  },
  {
    id: "p5a-vf-02",
    category: "verb-form",
    level: "advanced",
    sentence:
      "The finance director insisted that every invoice ____ before the end of the quarter.",
    choices: ["is settled", "be settled", "was settled", "settles"],
    answer: 1,
    explanation:
      "insist, demand, request などのあとの that 節は動詞の原形（仮定法現在）。受動なら be +過去分詞の形になる。",
    translation:
      "財務部長は、すべての請求書を四半期末までに清算するよう強く求めた。",
  },
  {
    id: "p5a-vf-03",
    category: "verb-form",
    level: "advanced",
    sentence:
      "Not until the third quarter ____ the full effect of the new pricing structure.",
    choices: [
      "did the company feel",
      "the company has felt",
      "has the company felt",
      "the company felt",
    ],
    answer: 0,
    explanation:
      "否定語句 Not until が文頭に出ると、そのあとは疑問文と同じ語順（倒置）になる。過去の話なので did + 原形。",
    translation:
      "第3四半期になって初めて、その会社は新しい価格体系の影響を本格的に実感した。",
  },
  {
    id: "p5a-vf-04",
    category: "verb-form",
    level: "advanced",
    sentence:
      "Were the board to approve the proposal, construction ____ in March.",
    choices: ["begins", "began", "would begin", "will begin"],
    answer: 2,
    explanation:
      "Were + 主語 + to do は If 節の倒置で、実現の可能性が低い仮定を表す。主節は would +原形。",
    translation:
      "仮に取締役会がその案を承認すれば、着工は3月になるだろう。",
  },
  {
    id: "p5a-vf-05",
    category: "verb-form",
    level: "advanced",
    sentence: "It is essential that the emergency exits ____ clear at all times.",
    choices: ["remained", "are remaining", "remain", "remains"],
    answer: 2,
    explanation:
      "It is essential that ... の that 節も仮定法現在で動詞は原形。主語が複数でも三単現の s は付かない。",
    translation:
      "非常口は常に物が置かれていない状態でなければならない。",
  },
  {
    id: "p5a-vf-06",
    category: "verb-form",
    level: "advanced",
    sentence:
      "The report noted that productivity ____ steadily since the new system was introduced.",
    choices: ["rises", "rose", "had risen", "will rise"],
    answer: 2,
    explanation:
      "報告した時点（過去）よりも前から続いていた変化なので過去完了 had risen。主節が過去形のときの時制の一致。",
    translation:
      "その報告書は、新システム導入以来、生産性が着実に上がってきたと指摘した。",
  },

  // ------------------------------------------------------------------
  // 態（voice）
  // ------------------------------------------------------------------
  {
    id: "p5a-vo-01",
    category: "voice",
    level: "advanced",
    sentence:
      "The revised proposal is expected ____ at next week's board meeting.",
    choices: ["discussing", "being discussed", "to discuss", "to be discussed"],
    answer: 3,
    explanation:
      "be expected to do の形。提案は議論される側なので、不定詞を受動にして to be discussed。",
    translation:
      "修正案は来週の取締役会で議論される見込みである。",
  },
  {
    id: "p5a-vo-02",
    category: "voice",
    level: "advanced",
    sentence: "Having ____ twice, the contract was finally signed in October.",
    choices: ["been revised", "being revised", "revise", "revised"],
    answer: 0,
    explanation:
      "主語 contract は改訂される側。完了形の分詞構文を受動にした Having been revised の形になる。",
    translation:
      "2度の改訂を経て、その契約はようやく10月に締結された。",
  },
  {
    id: "p5a-vo-03",
    category: "voice",
    level: "advanced",
    sentence: "The conveyor system needs ____ before the annual inspection.",
    choices: ["service", "to service", "servicing", "serviced"],
    answer: 2,
    explanation:
      "need のあとの動名詞は受動の意味を持ち、needs servicing で「点検される必要がある」。need to be serviced と同じ意味になる。",
    translation:
      "そのコンベヤー設備は、年次点検の前に整備が必要である。",
  },
  {
    id: "p5a-vo-04",
    category: "voice",
    level: "advanced",
    sentence:
      "All personnel are required to ____ of any schedule change at least 24 hours in advance.",
    choices: ["notify", "be notified", "notifying", "have notified"],
    answer: 1,
    explanation:
      "notify A of B の A が主語に立った受動態。be required to のあとは原形なので be notified。",
    translation:
      "全職員は、予定変更について遅くとも24時間前までに知らされることになっている。",
  },
  {
    id: "p5a-vo-05",
    category: "voice",
    level: "advanced",
    sentence:
      "The production delay can ____ to a shortage of imported components.",
    choices: ["attributing", "have attributed", "attribute", "be attributed"],
    answer: 3,
    explanation:
      "attribute A to B（AをBのせいにする）の A が主語になった受動態。助動詞 can のあとなので be attributed。",
    translation:
      "生産の遅れは、輸入部品の不足によるものと考えられる。",
  },
  {
    id: "p5a-vo-06",
    category: "voice",
    level: "advanced",
    sentence:
      "Little ____ about the cause of the power outage at the time of the announcement.",
    choices: ["was known", "had known", "knowing", "knew"],
    answer: 0,
    explanation:
      "否定的な意味の Little が文頭に出た倒置。原因は「知られている」側なので受動態 was known。",
    translation:
      "発表の時点では、停電の原因についてほとんど分かっていなかった。",
  },

  // ------------------------------------------------------------------
  // 前置詞（preposition）
  // ------------------------------------------------------------------
  {
    id: "p5a-pr-01",
    category: "preposition",
    level: "advanced",
    sentence: "The revised travel policy takes effect ____ 1 April.",
    choices: ["as well as", "as of", "as for", "as to"],
    answer: 1,
    explanation:
      "as of +日付で「〜付けで、〜から」。as for と as to は「〜について」、as well as は「〜と同様に」。",
    translation: "改訂された出張規程は4月1日付けで発効する。",
  },
  {
    id: "p5a-pr-02",
    category: "preposition",
    level: "advanced",
    sentence:
      "The contractor is liable ____ any damage caused during installation.",
    choices: ["with", "of", "for", "to"],
    answer: 2,
    explanation:
      "be liable for ... で「〜に対して責任がある」。be liable to は「〜しがちである」で意味が変わる。",
    translation:
      "請負業者は、設置中に生じた損害について責任を負う。",
  },
  {
    id: "p5a-pr-03",
    category: "preposition",
    level: "advanced",
    sentence: "The quarterly figures are broadly ____ line with our forecast.",
    choices: ["on", "at", "by", "in"],
    answer: 3,
    explanation:
      "in line with ... で「〜と一致して、〜に沿って」。TOEIC の報告文で頻出の言い回し。",
    translation:
      "四半期の数字は、おおむね当社の予測と一致している。",
  },
  {
    id: "p5a-pr-04",
    category: "preposition",
    level: "advanced",
    sentence: "The agreement is subject ____ approval by the regulator.",
    choices: ["for", "of", "with", "to"],
    answer: 3,
    explanation:
      "be subject to ... で「〜を条件とする、〜を受ける」。この to は前置詞なので、うしろには名詞か動名詞が来る。",
    translation:
      "その契約は規制当局の承認を条件としている。",
  },
  {
    id: "p5a-pr-05",
    category: "preposition",
    level: "advanced",
    sentence: "Travel expenses may be claimed ____ submission of a receipt.",
    choices: ["within", "among", "toward", "upon"],
    answer: 3,
    explanation:
      "upon +名詞で「〜し次第、〜のときに」。書き言葉で on よりも硬い言い方として使われる。",
    translation:
      "出張費は、領収書の提出をもって請求できる。",
  },
  {
    id: "p5a-pr-06",
    category: "preposition",
    level: "advanced",
    sentence:
      "The maintenance crew worked ____ the clock to restore the production line.",
    choices: ["across", "around", "about", "over"],
    answer: 1,
    explanation:
      "work around the clock で「24時間ぶっ通しで働く」。時計を一周する、というイメージの決まった言い方。",
    translation:
      "保守班は生産ラインを復旧させるため、昼夜を問わず作業した。",
  },

  // ------------------------------------------------------------------
  // 接続詞・接続副詞（conjunction）
  // ------------------------------------------------------------------
  {
    id: "p5a-cj-01",
    category: "conjunction",
    level: "advanced",
    sentence:
      "____ the contract states otherwise, payment is due within 30 days of invoicing.",
    choices: ["Owing to", "In case of", "Unless", "Despite"],
    answer: 2,
    explanation:
      "うしろが文なので接続詞。「契約に別段の定めがない限り」という意味の Unless が入る。残り3つは前置詞句。",
    translation:
      "契約に別段の定めがない限り、支払いは請求後30日以内に行う。",
  },
  {
    id: "p5a-cj-02",
    category: "conjunction",
    level: "advanced",
    sentence:
      "Experienced ____ she is, Ms. Duval still reviews the safety manual each year.",
    choices: ["so", "that", "which", "as"],
    answer: 3,
    explanation:
      "形容詞 +as +主語 +動詞で「〜ではあるが」という譲歩を表す。Experienced as she is = Although she is experienced。",
    translation:
      "経験豊富ではあるが、デュヴァルさんは毎年欠かさず安全マニュアルを読み返している。",
  },
  {
    id: "p5a-cj-03",
    category: "conjunction",
    level: "advanced",
    sentence:
      "The vendor will replace the unit free of charge ____ it proves faulty within one year.",
    choices: ["in spite of", "provided", "despite", "owing to"],
    answer: 1,
    explanation:
      "provided (that) は「〜という条件であれば」を表す接続詞。ほかの3つは前置詞句で、うしろに文は続けられない。",
    translation:
      "1年以内に不具合が判明した場合に限り、販売業者は無償で交換する。",
  },
  {
    id: "p5a-cj-04",
    category: "conjunction",
    level: "advanced",
    sentence:
      "____ much the team prepared, some weather-related delays were unavoidable.",
    choices: ["Whenever", "Wherever", "However", "Whatever"],
    answer: 2,
    explanation:
      "However +much/形容詞 で「どれほど〜でも」。この However は接続副詞の「しかし」ではなく複合関係副詞。",
    translation:
      "どれだけ入念に準備しても、天候による遅れは避けられなかった。",
  },
  {
    id: "p5a-cj-05",
    category: "conjunction",
    level: "advanced",
    sentence:
      "The office will close at noon on Friday, ____ the annual inventory count.",
    choices: ["even though", "whereas", "as long as", "owing to"],
    answer: 3,
    explanation:
      "うしろが the annual inventory count という名詞なので前置詞句 owing to（〜のため）。残り3つは接続詞。",
    translation:
      "年次棚卸しのため、金曜日は正午に業務を終了する。",
  },
  {
    id: "p5a-cj-06",
    category: "conjunction",
    level: "advanced",
    sentence: "____ the figures have been verified, we will publish the report.",
    choices: ["During", "Despite", "Besides", "Once"],
    answer: 3,
    explanation:
      "Once は「いったん〜すれば」を表す接続詞。うしろに文が続けられるのはこれだけ。",
    translation:
      "数字の検証が済み次第、報告書を公表する。",
  },

  // ------------------------------------------------------------------
  // 代名詞（pronoun）
  // ------------------------------------------------------------------
  {
    id: "p5a-pn-01",
    category: "pronoun",
    level: "advanced",
    sentence: "Each of the three proposals has ____ own strengths.",
    choices: ["it", "its", "their", "theirs"],
    answer: 1,
    explanation:
      "主語は Each で単数扱いなので、受ける代名詞も単数の its。of the three proposals に引かれて their としないこと。",
    translation:
      "3つの提案には、それぞれ固有の強みがある。",
  },
  {
    id: "p5a-pn-02",
    category: "pronoun",
    level: "advanced",
    sentence:
      "The two project leads congratulated ____ on the successful launch.",
    choices: ["theirs", "them", "themselves", "each other"],
    answer: 3,
    explanation:
      "2人が互いに祝ったので each other。themselves だと「自分自身を祝った」になり意味が変わる。",
    translation:
      "2人のプロジェクト責任者は、立ち上げの成功を互いにたたえ合った。",
  },
  {
    id: "p5a-pn-03",
    category: "pronoun",
    level: "advanced",
    sentence:
      "Neither of the two contractors submitted ____ final estimate on time.",
    choices: ["its", "their", "theirs", "it"],
    answer: 0,
    explanation:
      "neither は単数扱いなので所有格も単数の its。会社を指すので his or her ではなく its を使う。",
    translation:
      "2社の請負業者は、いずれも最終見積もりを期限までに提出しなかった。",
  },
  {
    id: "p5a-pn-04",
    category: "pronoun",
    level: "advanced",
    sentence: "____ of the three candidate sites meets all of the criteria.",
    choices: ["None", "Neither", "Either", "Both"],
    answer: 0,
    explanation:
      "3つ以上について「どれも〜ない」と言うときは None。Neither と Either は2つのときにしか使えない。",
    translation:
      "候補地3か所のうち、すべての条件を満たすものはない。",
  },
  {
    id: "p5a-pn-05",
    category: "pronoun",
    level: "advanced",
    sentence: "The company prides ____ on its record of on-time delivery.",
    choices: ["its", "itself", "themselves", "it"],
    answer: 1,
    explanation:
      "pride oneself on ... で「〜を誇りにする」。主語が company なので再帰代名詞は itself。",
    translation:
      "その会社は、納期を守ってきた実績を誇りにしている。",
  },
  {
    id: "p5a-pn-06",
    category: "pronoun",
    level: "advanced",
    sentence: "The new scanner differs little from ____ it replaced.",
    choices: ["those", "it", "that", "the one"],
    answer: 3,
    explanation:
      "うしろに it replaced という修飾節が続くので、可算名詞の代わりになる the one。単独の that は人や物の代わりにはこの形で使えない。",
    translation:
      "新しいスキャナーは、置き換えられた旧機種とほとんど変わらない。",
  },

  // ------------------------------------------------------------------
  // 関係詞（relative）
  // ------------------------------------------------------------------
  {
    id: "p5a-rl-01",
    category: "relative",
    level: "advanced",
    sentence:
      "The supplier, ____ contract expires in June, has requested a price review.",
    choices: ["whose", "which", "that", "who"],
    answer: 0,
    explanation:
      "うしろが contract という名詞で「その業者の契約」という所有の関係。所有格の関係代名詞 whose は人にも組織にも使える。",
    translation:
      "契約が6月に満了するその仕入先は、価格の見直しを求めている。",
  },
  {
    id: "p5a-rl-02",
    category: "relative",
    level: "advanced",
    sentence:
      "We interviewed six candidates, three of ____ had overseas experience.",
    choices: ["who", "them", "whom", "which"],
    answer: 2,
    explanation:
      "前置詞 of のあとで人を受けるので whom。them を使うと文が2つになり、接続詞がないため成立しない。",
    translation:
      "6名の候補者を面接し、そのうち3名は海外勤務の経験があった。",
  },
  {
    id: "p5a-rl-03",
    category: "relative",
    level: "advanced",
    sentence:
      "The council approved the redevelopment plan, ____ surprised many residents.",
    choices: ["what", "it", "which", "that"],
    answer: 2,
    explanation:
      "前の文の内容全体を受ける非制限用法の which。この用法で that は使えない。",
    translation:
      "議会はその再開発計画を承認し、そのことが多くの住民を驚かせた。",
  },
  {
    id: "p5a-rl-04",
    category: "relative",
    level: "advanced",
    sentence: "____ is responsible for the error must report it immediately.",
    choices: ["However", "Whoever", "Whomever", "Whichever"],
    answer: 1,
    explanation:
      "節全体が文の主語になり、節の中でも主語の働きをするので Whoever。目的語の位置なら Whomever。",
    translation:
      "その誤りの責任者が誰であれ、ただちに報告しなければならない。",
  },
  {
    id: "p5a-rl-05",
    category: "relative",
    level: "advanced",
    sentence: "This is precisely the sort of delay ____ we cannot afford.",
    choices: ["whose", "where", "that", "what"],
    answer: 2,
    explanation:
      "先行詞 the sort of delay があり、afford の目的語が欠けている。先行詞があるので what は使えず that が入る。",
    translation:
      "これはまさに、当社が許容できない種類の遅れである。",
  },
  {
    id: "p5a-rl-06",
    category: "relative",
    level: "advanced",
    sentence:
      "The warehouse has three emergency exits, none of ____ is clearly marked.",
    choices: ["them", "that", "what", "which"],
    answer: 3,
    explanation:
      "前置詞 of のあとで物を受けるので which。that は前置詞の直後には置けない。",
    translation:
      "その倉庫には非常口が3か所あるが、どれも表示がはっきりしていない。",
  },

  // ------------------------------------------------------------------
  // 比較（comparison）
  // ------------------------------------------------------------------
  {
    id: "p5a-cm-01",
    category: "comparison",
    level: "advanced",
    sentence: "Of the two bids, the second is by far ____ practical.",
    choices: ["most", "more", "the more", "the most"],
    answer: 2,
    explanation:
      "2つのうちで「より〜なほう」と限定するときは the +比較級。3つ以上なら the most を使う。",
    translation:
      "2件の入札のうち、2件目のほうが断然現実的である。",
  },
  {
    id: "p5a-cm-02",
    category: "comparison",
    level: "advanced",
    sentence:
      "Third-quarter sales were no ____ than they had been in the previous quarter.",
    choices: ["highest", "more high", "high", "higher"],
    answer: 3,
    explanation:
      "than があるので比較級 higher。no +比較級 は「少しも〜ない」と差がないことを強調する形。",
    translation:
      "第3四半期の売上は、前四半期と比べて少しも伸びていなかった。",
  },
  {
    id: "p5a-cm-03",
    category: "comparison",
    level: "advanced",
    sentence:
      "The sooner the replacement parts arrive, ____ we can resume production.",
    choices: ["soonest", "the soonest", "sooner", "the sooner"],
    answer: 3,
    explanation:
      "the +比較級, the +比較級 で「〜すればするほど…」。後半にも the が必要。",
    translation:
      "交換部品が早く届くほど、それだけ早く生産を再開できる。",
  },
  {
    id: "p5a-cm-04",
    category: "comparison",
    level: "advanced",
    sentence:
      "Few industries have changed as ____ as logistics over the past decade.",
    choices: ["dramatic", "dramatically", "more dramatic", "most dramatically"],
    answer: 1,
    explanation:
      "as ... as にはさまれるのは原級。have changed という動詞を修飾するので副詞 dramatically。",
    translation:
      "過去10年で物流ほど劇的に変わった業界はほとんどない。",
  },
  {
    id: "p5a-cm-05",
    category: "comparison",
    level: "advanced",
    sentence:
      "Of all the options considered, relocating the depot proved ____ costly.",
    choices: ["the less", "least", "the least", "less"],
    answer: 2,
    explanation:
      "Of all the options と3つ以上の比較なので最上級。「最も〜でない」は the least +形容詞。",
    translation:
      "検討したすべての選択肢のうち、配送センターの移転が最も費用を抑えられることが分かった。",
  },
  {
    id: "p5a-cm-06",
    category: "comparison",
    level: "advanced",
    sentence:
      "No sooner had the system gone live ____ complaints began to arrive.",
    choices: ["than", "then", "when", "that"],
    answer: 0,
    explanation:
      "No sooner ... than ... で「〜するやいなや」。No sooner が文頭に出るため had + 主語の倒置になっている。than と then の取り違えに注意。",
    translation:
      "システムが稼働した途端、苦情が届き始めた。",
  },

  // ------------------------------------------------------------------
  // 準動詞（verbal）
  // ------------------------------------------------------------------
  {
    id: "p5a-vb-01",
    category: "verbal",
    level: "advanced",
    sentence:
      "The steering committee recommends ____ the product launch until the second quarter.",
    choices: ["to postpone", "postponing", "postponed", "postpone"],
    answer: 1,
    explanation:
      "recommend は動名詞を目的語に取る。recommend to do の形は取らない。",
    translation:
      "運営委員会は、製品の発売を第2四半期まで延期することを勧めている。",
  },
  {
    id: "p5a-vb-02",
    category: "verbal",
    level: "advanced",
    sentence:
      "____ having limited resources, the team delivered the project on schedule.",
    choices: ["However", "Despite", "Although", "Because"],
    answer: 1,
    explanation:
      "うしろが動名詞 having なので前置詞 Despite。Although と Because は接続詞で、主語と動詞のある文が続く必要がある。",
    translation:
      "限られた資源しかなかったにもかかわらず、チームは予定どおりに成果を出した。",
  },
  {
    id: "p5a-vb-03",
    category: "verbal",
    level: "advanced",
    sentence: "With margins this thin, the firm cannot afford ____ another delay.",
    choices: ["risked", "risk", "to risk", "risking"],
    answer: 2,
    explanation:
      "afford は to 不定詞を取る動詞。can afford to do で「〜する余裕がある」。",
    translation:
      "これほど利幅が薄い状況では、その会社にこれ以上の遅延を冒す余裕はない。",
  },
  {
    id: "p5a-vb-04",
    category: "verbal",
    level: "advanced",
    sentence: "With the contract ____, the team can begin detailed planning.",
    choices: ["signed", "to sign", "sign", "signs"],
    answer: 0,
    explanation:
      "with +名詞 +過去分詞 で「〜が…された状態で」。契約は署名される側なので signed。",
    translation:
      "契約が締結されたので、チームは詳細な計画づくりに入れる。",
  },
  {
    id: "p5a-vb-05",
    category: "verbal",
    level: "advanced",
    sentence:
      "Rather than ____ new equipment outright, the plant chose to lease it.",
    choices: ["buys", "buy", "to buy", "bought"],
    answer: 1,
    explanation:
      "rather than は前後を同じ形でそろえる。うしろの chose to lease と対応させて、原形 buy が入る。",
    translation:
      "その工場は新しい設備を買い取るのではなく、リースすることを選んだ。",
  },
  {
    id: "p5a-vb-06",
    category: "verbal",
    level: "advanced",
    sentence: "The regulations require all chemical waste ____ of properly.",
    choices: ["dispose", "to dispose", "to be disposed", "disposing"],
    answer: 2,
    explanation:
      "require A to do の形。廃棄物は処分される側なので不定詞を受動にして to be disposed of。",
    translation:
      "規則により、化学廃棄物はすべて適切に処分されなければならない。",
  },

  // ------------------------------------------------------------------
  // 語彙（vocabulary）
  // ------------------------------------------------------------------
  {
    id: "p5a-vc-01",
    category: "vocabulary",
    level: "advanced",
    sentence:
      "The external auditor's findings ____ our concerns about inventory control.",
    choices: ["corresponded", "correlated", "corroborated", "collaborated"],
    answer: 2,
    explanation:
      "corroborate は「（別の証拠が）裏づける」。collaborate は「協働する」、correspond と correlate は前置詞 with を伴う自動詞で目的語を直接取らない。",
    translation:
      "外部監査人の調査結果は、在庫管理に関する当社の懸念を裏づけた。",
  },
  {
    id: "p5a-vc-02",
    category: "vocabulary",
    level: "advanced",
    sentence:
      "The controller was asked to ____ the discrepancy in the quarterly figures.",
    choices: ["account for", "count on", "allow for", "stand for"],
    answer: 0,
    explanation:
      "account for は「〜を説明する、〜の理由を示す」。count on は「頼る」、allow for は「考慮に入れる」、stand for は「表す」。",
    translation:
      "経理責任者は、四半期の数字の食い違いについて説明を求められた。",
  },
  {
    id: "p5a-vc-03",
    category: "vocabulary",
    level: "advanced",
    sentence: "Budget constraints ____ the scope of the pilot programme.",
    choices: ["curtailed", "deterred", "withheld", "suspended"],
    answer: 0,
    explanation:
      "curtail は「（規模や範囲を）縮小する」。deter は「思いとどまらせる」、withhold は「差し控える」、suspend は「一時停止する」で、いずれも scope とは結びつかない。",
    translation:
      "予算の制約により、試験導入の対象範囲は縮小された。",
  },
  {
    id: "p5a-vc-04",
    category: "vocabulary",
    level: "advanced",
    sentence: "All new hires must ____ to the company's code of conduct.",
    choices: ["adhere", "attach", "cling", "stick"],
    answer: 0,
    explanation:
      "adhere to ... で「（規則などを）守る」。規則を目的語に取る堅い言い方で、TOEIC の社内文書で頻出する。",
    translation:
      "新入社員は全員、会社の行動規範を遵守しなければならない。",
  },
  {
    id: "p5a-vc-05",
    category: "vocabulary",
    level: "advanced",
    sentence:
      "The consolidation is ____ to save the group 400,000 dollars annually.",
    choices: ["propelled", "projected", "protracted", "prospected"],
    answer: 1,
    explanation:
      "be projected to do で「〜する見込みである」。protracted は「長引いた」、propel は「推進する」で意味が合わない。",
    translation:
      "この統合により、グループ全体で年間40万ドルの経費削減が見込まれている。",
  },
  {
    id: "p5a-vc-06",
    category: "vocabulary",
    level: "advanced",
    sentence:
      "The supervisor's brief explanation did little to ____ the team's concerns.",
    choices: ["allay", "relay", "delay", "convey"],
    answer: 0,
    explanation:
      "allay は「（不安などを）和らげる」。relay は「伝達する」、convey は「伝える」で、concerns を打ち消す意味にはならない。",
    translation:
      "上司の短い説明では、チームの不安はほとんど解消されなかった。",
  },
]
