import type { Part7Set } from "@/lib/toeic/types"

/**
 * Part 7 のうち level: "advanced"（730〜860 点帯）のセット。
 *
 * すべてこのアプリのために書き下ろした自作問題で、公式問題集からの転載はない。
 * core との違いは次の3点。
 *  - 2通の文書を突き合わせないと解けない設問（マルチプルパッセージ）を含む
 *  - 本文に書かれていないことを条件から導く設問を増やしている
 *  - 言い換え（paraphrase）を挟み、本文の語がそのまま選択肢に出ない
 */
export const PART7_ADVANCED: Part7Set[] = [
  {
    id: "p7a-01",
    level: "advanced",
    documents: [
      {
        docType: "advertisement",
        title: "Meridian Skills — Autumn Workshop Series",
        meta: [],
        body: "All workshops take place at our Kingsway centre and include lunch.\n\nNegotiation Essentials — 14 October — 240 pounds\nData Storytelling — 21 October — 290 pounds\nManaging Remote Teams — 28 October — 265 pounds\nProcurement Fundamentals — 4 November — 310 pounds\n\nGroup rate: book three or more places on the same workshop and every place is reduced by 15 percent.\n\nMembers of the Institute of Public Administration receive 10 percent off a single booking. The two reductions cannot be combined; where both would apply, we charge the lower total.\n\nCancellations received more than 14 days before the workshop are refunded in full. After that point, half the fee is retained.",
        translation:
          "すべての研修はキングズウェイ研修所で実施し、昼食が付きます。\n\n交渉の基礎 — 10月14日 — 240ポンド\nデータで語る技術 — 10月21日 — 290ポンド\n遠隔チームの管理 — 10月28日 — 265ポンド\n調達実務の基本 — 11月4日 — 310ポンド\n\n団体料金: 同一研修に3名以上お申し込みの場合、全員分を15パーセント割引します。\n\n行政管理協会の会員は、1名分のお申し込みにつき10パーセント割引となります。両方の割引は併用できません。どちらも当てはまる場合は、金額の安くなるほうを適用します。\n\n研修日の14日より前にご連絡いただいた取消は全額返金します。それ以降は半額を申し受けます。",
      },
      {
        docType: "email",
        title: "Booking for 28 October",
        meta: [
          { label: "To", value: "bookings@meridian-skills.example" },
          { label: "From", value: "n.okafor@bradfield-dc.example" },
          { label: "Date", value: "2 October" },
          { label: "Subject", value: "Booking for 28 October" },
        ],
        body: "Dear Bookings Team,\n\nI would like to reserve four places on the workshop you are running on 28 October. Three of the four attendees, including myself, are members of the Institute of Public Administration.\n\nCould you confirm which reduction applies in our case, and the total we should expect to be invoiced? I understand from your brochure that the two cannot be applied together.\n\nOne further question. Our finance office will not release payment without a purchase order number, and the number is not usually issued until the month after the expense is incurred. Would you be able to invoice us after the workshop rather than in advance?\n\nKind regards,\n\nNaomi Okafor\nBradfield District Council",
        translation:
          "ご予約担当者様\n\n10月28日に実施される研修に4名分の席を確保したく存じます。私を含む4名のうち3名が、行政管理協会の会員です。\n\n当方の場合にどちらの割引が適用されるのか、また請求額の見込みをご確認いただけますでしょうか。パンフレットから、両方の併用はできないと理解しております。\n\nもう1点お伺いします。当方の財務担当課は発注番号がなければ支払いを実行できず、その番号は通常、費用が発生した翌月まで発行されません。事前ではなく研修後にご請求いただくことは可能でしょうか。\n\n敬具\n\nナオミ・オカフォー\nブラッドフィールド地区議会",
      },
    ],
    questions: [
      {
        id: "p7a-01-q1",
        question: "Which workshop does Ms. Okafor intend to attend?",
        choices: [
          "Procurement Fundamentals",
          "Negotiation Essentials",
          "Data Storytelling",
          "Managing Remote Teams",
        ],
        answer: 3,
        explanation:
          "メールには日付 28 October しか書かれていない。広告の一覧でその日に行われるのは Managing Remote Teams。2つの文書を突き合わせて特定する設問。",
      },
      {
        id: "p7a-01-q2",
        question: "Which reduction will apply to Ms. Okafor's booking?",
        choices: [
          "The 10 percent member reduction, because most attendees are members",
          "The 15 percent group rate, because she is booking four places",
          "Both reductions, applied one after the other",
          "Neither, because the booking is made by an organization",
        ],
        answer: 1,
        explanation:
          "団体料金は同一研修に3名以上。4名なので条件を満たす。会員割引は1名分にしか効かず、併用もできないため、安くなるのは15パーセントのほう。",
      },
      {
        id: "p7a-01-q3",
        question: "What does Ms. Okafor ask Meridian Skills to do?",
        choices: [
          "Send the invoice after the workshop has taken place",
          "Provide a receipt for the lunch charge",
          "Move the workshop to a later date",
          "Reserve seats at the front of the room",
        ],
        answer: 0,
        explanation:
          "メール後半で、発注番号の発行が翌月になるため、事前ではなく研修後の請求が可能かと尋ねている。",
      },
      {
        id: "p7a-01-q4",
        question:
          "A delegate cancels a place ten days before a workshop. What can the delegate expect?",
        choices: [
          "A full refund",
          "A refund of half the fee",
          "A credit toward a future workshop",
          "No refund of any kind",
        ],
        answer: 1,
        explanation:
          "広告の最終段落に、14日より前なら全額返金、それ以降は半額を申し受けるとある。10日前は「それ以降」に当たる。",
      },
      {
        id: "p7a-01-q5",
        question: "What is stated about all of the workshops?",
        choices: [
          "They are limited to 30 participants.",
          "They can be attended online.",
          "They are held at the same location.",
          "They last two full days.",
        ],
        answer: 2,
        explanation:
          "広告の冒頭に All workshops take place at our Kingsway centre とある。昼食が付くことも同じ文に書かれている。",
      },
    ],
  },
  {
    id: "p7a-02",
    level: "advanced",
    documents: [
      {
        docType: "article",
        title: "Bus Operators Hire Again as Route Funding Returns",
        meta: [
          { label: "Source", value: "Granton Regional Review" },
          { label: "Date", value: "18 February" },
        ],
        body: "GRANTON — Two of the region's three bus operators have begun recruiting drivers for the first time since 2023, after the transport authority restored funding on 14 rural routes.\n\nCalderway Coaches says it needs 40 drivers by June. Fenwick Transit is advertising 25 posts. The third operator, Ravensmoor Lines, has said it will not expand, citing uncertainty over whether the funding will continue beyond the two-year period for which it has been agreed.\n\nRecruitment will not be straightforward. The average age of a driver in the region is 54, and the licence required takes about four months to obtain. Calderway has said it will meet the cost of training, currently around 3,000 pounds, for candidates who commit to two years of service.\n\nPassenger groups have welcomed the announcement while remaining cautious. Restoring the routes is the easy part, said Deborah Aitken of Rural Transport Watch. Keeping them running once the funding period ends is the question nobody has answered.\n\nThe authority is expected to publish the restored timetables in April.",
        translation:
          "グラントン発 — 交通局が農村部14路線への補助を復活させたことを受け、地域の3つのバス事業者のうち2社が2023年以来初めて運転士の採用を始めた。\n\nコールダーウェイ・コーチズは6月までに40名が必要だとしている。フェンウィック・トランジットは25名を募集中である。3社目のレイヴンズムーア・ラインズは、合意されている2年間の期間を超えて補助が続くかどうか不透明だとして、増員しない方針を示した。\n\n採用は容易ではない。この地域の運転士の平均年齢は54歳で、必要な免許の取得には約4か月かかる。コールダーウェイは、2年間の勤務を約束する応募者について、現在およそ3,000ポンドかかる訓練費用を負担すると表明した。\n\n利用者団体は発表を歓迎しつつ、慎重な姿勢を崩していない。「路線を戻すことは簡単なほうです」と、農村交通ウォッチのデボラ・エイトキン氏は述べた。「補助の期間が終わったあとも走らせ続けられるのか。そこに誰も答えていません」\n\n交通局は4月に復活後の時刻表を公表する見込みである。",
      },
    ],
    questions: [
      {
        id: "p7a-02-q1",
        question: "What is the article mainly about?",
        choices: [
          "The merger of two regional bus operators",
          "New licensing rules for bus drivers",
          "A rise in fares on rural bus routes",
          "Driver recruitment following a change in funding",
        ],
        answer: 3,
        explanation:
          "第1段落で補助復活を受けた採用再開を伝え、以降もその話が続く。運賃や合併には触れていない。",
      },
      {
        id: "p7a-02-q2",
        question: "Why is Ravensmoor Lines not hiring?",
        choices: [
          "It does not operate on the restored routes.",
          "It doubts that the funding will be extended.",
          "It is being sold to another operator.",
          "It has already recruited enough drivers.",
        ],
        answer: 1,
        explanation:
          "第2段落に、合意された2年間を超えて補助が続くか不透明だとして増員しないとある。",
      },
      {
        id: "p7a-02-q3",
        question: "What is Calderway Coaches offering to applicants?",
        choices: [
          "Payment of training costs in return for a commitment",
          "A guaranteed route close to their home",
          "Reduced working hours during the first year",
          "A signing bonus paid after six months",
        ],
        answer: 0,
        explanation:
          "第3段落に、2年間の勤務を約束する応募者の訓練費用を負担するとある。無条件ではない点が答えの根拠。",
      },
      {
        id: "p7a-02-q4",
        question: "What does Ms. Aitken suggest about the restored routes?",
        choices: [
          "Their long-term future has not been settled.",
          "They should be run by a single operator.",
          "They were closed for the wrong reasons.",
          "They will attract more passengers than before.",
        ],
        answer: 0,
        explanation:
          "路線を戻すのは簡単なほうで、補助終了後に走らせ続けられるかに誰も答えていない、という発言。継続性への疑問を示している。",
      },
      {
        id: "p7a-02-q5",
        question:
          "The word 'restored' in paragraph 1 is closest in meaning to",
        choices: ["repaid", "replaced", "reinstated", "repaired"],
        answer: 2,
        explanation:
          "ここでの restore は、いったん打ち切られた補助を元に戻すこと。reinstate（復活させる）が最も近い。",
      },
    ],
  },
  {
    id: "p7a-03",
    level: "advanced",
    documents: [
      {
        docType: "notice",
        title: "Hallam Electric — Repair and Recycling Counter",
        meta: [{ label: "Effective", value: "1 September" }],
        body: "From 1 September, Hallam Electric will operate a repair counter at all six of our branches.\n\nWhat we offer:\n\nFree assessment of any small appliance, whether or not it was bought from us.\n\nA quotation before any work begins. If you decline the quotation, there is nothing to pay.\n\nRecycling of an old appliance: free when it is brought in alongside a repair, otherwise 6 pounds.\n\nLoan units while your item is with us. The loan scheme covers kettles, toasters and microwaves only.\n\nTurnaround is normally five working days. Items that need a part from the manufacturer may take up to three weeks; where this is likely, we will say so when we give you the quotation.\n\nThe counter is open Monday to Saturday, 9:00 to 17:00. No appointment is needed, but Saturdays are busy and we suggest arriving before 11:00.",
        translation:
          "9月1日より、ハラム電機は全6店舗で修理カウンターを運営します。\n\n提供する内容:\n\n小型家電の点検は無料です。当店でお買い上げでない品もお受けします。\n\n作業前に必ずお見積もりを出します。お見積もりをお断りいただいた場合、費用は一切かかりません。\n\n古い家電の引き取り: 修理と併せてお持ち込みの場合は無料、それ以外は6ポンドです。\n\nお預かり中の代替機の貸し出し。貸し出しの対象は電気ケトル・トースター・電子レンジに限ります。\n\n仕上がりは通常5営業日です。メーカーから部品を取り寄せる必要がある品は最大3週間かかることがあります。その見込みがある場合は、お見積もりの際にお伝えします。\n\nカウンターの営業は月曜から土曜の9時から17時です。予約は不要ですが、土曜は混み合いますので11時より前のご来店をお勧めします。",
      },
      {
        docType: "review",
        title: "Customer review — Denby Road branch",
        meta: [
          { label: "Reviewer", value: "T. Nwachukwu" },
          { label: "Rating", value: "4 out of 5" },
          { label: "Posted", value: "12 October" },
        ],
        body: "I took in a four-year-old food processor that had stopped mid-cycle. I had bought it elsewhere, so I half expected to be turned away, but it was looked at there and then at no charge and I was quoted 38 pounds.\n\nTwo things are worth knowing. First, the repair took eleven days rather than the usual five, because a motor had to come from the manufacturer. I was told this at the time I was quoted, so it was not a surprise, but it is worth planning around. Second, I had assumed I could borrow a replacement while I waited, and that turned out not to be the case for my item. That was my own misreading of the notice rather than anything the staff did.\n\nThey also took away my old microwave when I collected the processor, and did not charge me for it.\n\nI would use the counter again, though next time I would check the loan arrangements first.",
        translation:
          "使用4年のフードプロセッサーが動作の途中で止まってしまい、持ち込みました。他店で購入したものだったので断られるかと思っていましたが、その場で無料で見てもらい、38ポンドの見積もりが出ました。\n\n知っておくとよい点が2つあります。ひとつは、通常5日のところ修理に11日かかったことです。モーターをメーカーから取り寄せる必要があったためです。見積もりの時点で説明を受けていたので驚きはしませんでしたが、日程には余裕を見ておくべきです。もうひとつは、待っている間に代替機を借りられると思い込んでいたのですが、私の品は対象外でした。これは店側ではなく、私が案内を読み違えていたためです。\n\n受け取りの際には古い電子レンジも引き取ってもらい、料金はかかりませんでした。\n\nまた利用したいと思いますが、次回は代替機の扱いを先に確認するつもりです。",
      },
    ],
    questions: [
      {
        id: "p7a-03-q1",
        question: "What is suggested about Mr. Nwachukwu's food processor?",
        choices: [
          "It was repaired free of charge.",
          "It was replaced rather than repaired.",
          "It was still covered by its warranty.",
          "It was purchased from a different retailer.",
        ],
        answer: 3,
        explanation:
          "レビュー冒頭に I had bought it elsewhere とある。お知らせにも当店購入品でなくてよいと書かれており、両方が整合する。",
      },
      {
        id: "p7a-03-q2",
        question: "Why did the repair take longer than the usual turnaround?",
        choices: [
          "A component had to be ordered from the manufacturer.",
          "The item was sent to a different branch.",
          "The branch was short of staff.",
          "The customer delayed accepting the quotation.",
        ],
        answer: 0,
        explanation:
          "レビューにモーターの取り寄せとあり、お知らせにもメーカー部品が必要な品は最大3週間かかるとある。11日はその範囲に収まる。",
      },
      {
        id: "p7a-03-q3",
        question:
          "Why was Mr. Nwachukwu not charged for taking away the microwave?",
        choices: [
          "Because he left a review of the service",
          "Because it was bought at Hallam Electric",
          "Because it was brought in together with a repair",
          "Because the fee is waived in October",
        ],
        answer: 2,
        explanation:
          "お知らせでは、引き取りは修理と併せて持ち込む場合のみ無料で、それ以外は6ポンド。レビューでは修理品の受け取り時に引き取ってもらっている。2文書の突き合わせが必要。",
      },
      {
        id: "p7a-03-q4",
        question: "What had Mr. Nwachukwu misunderstood?",
        choices: [
          "The opening hours of the counter",
          "The cost of the assessment",
          "Which items the loan scheme covers",
          "Which branch offered the service",
        ],
        answer: 2,
        explanation:
          "代替機を借りられると思い込んでいたが対象外だった、と本人が述べている。お知らせでは対象は電気ケトル・トースター・電子レンジに限られる。",
      },
      {
        id: "p7a-03-q5",
        question:
          "According to the notice, what should customers do if they visit on a Saturday?",
        choices: [
          "Use a different branch",
          "Bring proof of purchase",
          "Book an appointment in advance",
          "Come before 11:00",
        ],
        answer: 3,
        explanation:
          "お知らせの最終段落に、土曜は混み合うので11時より前の来店を勧めるとある。予約は不要とも書かれているので他の選択肢は誤り。",
      },
    ],
  },
  {
    id: "p7a-04",
    level: "advanced",
    documents: [
      {
        docType: "email",
        title: "Re: Loading bay access — Unit 12",
        meta: [
          { label: "To", value: "r.santos@santos-print.example" },
          { label: "From", value: "k.abiodun@wellbrook-estates.example" },
          { label: "Date", value: "9 November" },
          { label: "Subject", value: "Re: Loading bay access — Unit 12" },
        ],
        body: "Dear Mr. Santos,\n\nThank you for your message of 6 November about deliveries to Unit 12.\n\nI have looked at the access log. Between 1 and 31 October, the bay was occupied by vehicles from Unit 12 on 46 occasions, for an average of 52 minutes. The lease sets a limit of 30 minutes per vehicle, and the bay is shared by five units. I mention this not to assign blame, but because it explains why two other tenants have raised the same issue from the opposite direction.\n\nYou asked for a dedicated slot between 7:00 and 9:00. I cannot grant that under the current lease, which gives no tenant priority over another. What I can do is two things. First, a booking board will be installed at the bay entrance from 1 December, so that a slot can be reserved a day ahead. Second, I have asked the waste contractor to move its Tuesday collection from 8:00 to 6:30, which should free the bay during the window you describe as your busiest.\n\nIf congestion persists after February, I will put a lease variation to all five tenants. That would require their agreement, which I am not in a position to assume.\n\nKind regards,\n\nKemi Abiodun\nWellbrook Estates",
        translation:
          "サントス様\n\n12号区画への配送について、11月6日にお送りいただいたご連絡ありがとうございます。\n\n入退場記録を確認いたしました。10月1日から31日までの間、12号区画の車両が荷さばき場を占有した回数は46回、1回あたりの平均は52分でした。賃貸借契約では1台あたり30分を上限としており、この荷さばき場は5区画で共用しています。責任を問うために申し上げているのではなく、他の2つのテナントから逆の立場で同じ問題が指摘されている理由をご説明するためです。\n\n午前7時から9時までの専用枠をご要望でしたが、現行の契約ではどのテナントにも優先権を与えていないため、お認めできません。代わりに2点対応します。ひとつは、12月1日より荷さばき場の入口に予約ボードを設置し、前日から枠を確保できるようにすることです。もうひとつは、廃棄物処理業者に火曜日の収集を8時から6時30分へ前倒しするよう依頼したことです。これにより、御社が最も忙しいとされる時間帯に荷さばき場が空くはずです。\n\n2月を過ぎても混雑が続く場合は、5つのテナント全体に契約条件の変更を諮ります。ただしそれには全員の同意が必要で、得られるものと決めてかかることはできません。\n\n敬具\n\nケミ・アビオドゥン\nウェルブルック・エステーツ",
      },
    ],
    questions: [
      {
        id: "p7a-04-q1",
        question: "Why did Mr. Santos write to Ms. Abiodun?",
        choices: [
          "To request a reduction in his rent",
          "To report damage to a shared facility",
          "To ask for exclusive use of the bay at certain hours",
          "To complain about the waste collection schedule",
        ],
        answer: 2,
        explanation:
          "第3段落に You asked for a dedicated slot between 7:00 and 9:00 とある。専用枠の要望が発端。",
      },
      {
        id: "p7a-04-q2",
        question: "What do the access log figures indicate?",
        choices: [
          "Unit 12 used the bay less often than other tenants.",
          "The bay was empty for most of October.",
          "The log was not kept accurately.",
          "Unit 12's vehicles stayed longer than the lease allows.",
        ],
        answer: 3,
        explanation:
          "平均52分に対し、契約上の上限は1台30分。本文は「超過している」とは書いていないので、2つの数字を比べて判断する。",
      },
      {
        id: "p7a-04-q3",
        question: "What will happen on 1 December?",
        choices: [
          "A system for reserving slots will begin.",
          "Unit 12 will be given priority access.",
          "The lease will be revised.",
          "Waste collection will move to 6:30.",
        ],
        answer: 0,
        explanation:
          "12月1日から予約ボードを設置し、前日から枠を確保できるようにする、と述べている。収集時間の前倒しには日付が示されていない。",
      },
      {
        id: "p7a-04-q4",
        question: "Why does Ms. Abiodun mention the waste contractor?",
        choices: [
          "To ask Mr. Santos to contact the contractor directly",
          "To explain a change that should ease the morning congestion",
          "To suggest that the contractor caused the damage",
          "To announce that the contract will be terminated",
        ],
        answer: 1,
        explanation:
          "火曜の収集を早めることで、サントス氏が最も忙しいと述べた時間帯に荷さばき場が空くと説明している。",
      },
      {
        id: "p7a-04-q5",
        question: "What does Ms. Abiodun imply about a lease variation?",
        choices: [
          "It has already been drafted.",
          "It would take effect in February.",
          "It might not be accepted by the other tenants.",
          "It would apply only to Unit 12.",
        ],
        answer: 2,
        explanation:
          "全員の同意が必要で、それを前提にはできないと述べている。通るとは限らない、という含みを読み取る。",
      },
    ],
  },
  {
    id: "p7a-05",
    level: "advanced",
    documents: [
      {
        docType: "schedule",
        title: "Regional Procurement Forum — Day 2 Programme",
        meta: [
          { label: "Date", value: "Thursday 16 March" },
          { label: "Venue", value: "Ashcombe Conference Centre" },
        ],
        body: "08:30  Registration and coffee — Atrium\n09:00  Opening remarks — Hall A — Dr. Ana Belova\n09:20  Keynote: social value in tendering — Hall A — Sir Martin Okoye\n10:15  Break — Atrium\n10:35  Parallel sessions\n        A. Framework agreements in practice — Hall A\n        B. Contract management after award — Room 3\n        C. Working with small suppliers — Room 4\n12:00  Lunch — Atrium\n13:00  Workshop: writing evaluation criteria — Room 3 (booked in advance; 30 places)\n13:00  Open clinic: bring your own tender — Room 4 (no booking required)\n15:00  Panel: what the new regulations change — Hall A\n15:00  Session C repeated — Room 4\n16:15  Close\n\nDelegates who booked the 13:00 workshop should collect a wristband when they register. Places not claimed by 12:30 are released to the waiting list.\n\nSession C is repeated at 15:00 for delegates who chose a different parallel session in the morning.",
        translation:
          "8:30  受付・コーヒー — アトリウム\n9:00  開会あいさつ — ホールA — アナ・ベロヴァ博士\n9:20  基調講演: 入札における社会的価値 — ホールA — マーティン・オコエ卿\n10:15  休憩 — アトリウム\n10:35  分科会\n        A. 枠組協定の実務 — ホールA\n        B. 契約締結後の管理 — 3号室\n        C. 小規模事業者との取引 — 4号室\n12:00  昼食 — アトリウム\n13:00  ワークショップ: 評価基準の書き方 — 3号室（事前予約制・定員30名）\n13:00  オープン相談会: 自分の入札書類を持参 — 4号室（予約不要）\n15:00  パネル討論: 新規則で何が変わるか — ホールA\n15:00  分科会C 再演 — 4号室\n16:15  閉会\n\n13時のワークショップを予約した方は、受付時にリストバンドをお受け取りください。12時30分までに引き取られなかった席は、キャンセル待ちに回されます。\n\n分科会Cは、午前に別の分科会を選んだ方のために15時に再演します。",
      },
    ],
    questions: [
      {
        id: "p7a-05-q1",
        question: "What must delegates who booked the 13:00 workshop do?",
        choices: [
          "Pay an additional fee at the door",
          "Pick up a wristband at registration",
          "Submit a tender document in advance",
          "Sign in again after lunch",
        ],
        answer: 1,
        explanation:
          "注記に、予約した方は受付時にリストバンドを受け取るようにとある。",
      },
      {
        id: "p7a-05-q2",
        question: "What happens at 12:30?",
        choices: [
          "Unclaimed workshop places are given to others.",
          "The keynote speaker takes questions.",
          "Lunch is served in the Atrium.",
          "The afternoon rooms are opened.",
        ],
        answer: 0,
        explanation:
          "12時30分までに引き取られなかった席はキャンセル待ちに回される、と明記されている。昼食は12時開始。",
      },
      {
        id: "p7a-05-q3",
        question:
          "A delegate attended session A in the morning and now wants to hear about small suppliers. Where should the delegate go at 15:00?",
        choices: ["Room 3", "Room 4", "The Atrium", "Hall A"],
        answer: 1,
        explanation:
          "小規模事業者の話題は分科会C。Cは15時に4号室で再演され、対象は午前に別の分科会を選んだ人。午前にAを選んでいるので条件に合う。",
      },
      {
        id: "p7a-05-q4",
        question: "What is indicated about the open clinic?",
        choices: [
          "It takes place in Hall A.",
          "It is repeated later in the day.",
          "It is limited to 30 participants.",
          "It requires no advance reservation.",
        ],
        answer: 3,
        explanation:
          "オープン相談会には no booking required とある。定員30名で事前予約制なのは同時刻のワークショップのほう。",
      },
    ],
  },
]
