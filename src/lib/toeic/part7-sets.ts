import type { Part7Set } from "@/lib/toeic/types"

/**
 * Part 7（読解）の文書と設問。
 *
 * すべてこのアプリのために書き下ろした自作問題で、公式問題集からの転載はない。
 * documents が1通ならシングルパッセージ、2通以上ならマルチプルパッセージ。
 * level が core なら 600〜730 点帯、advanced なら 730〜860 点帯を想定している。
 */
export const PART7_SETS: Part7Set[] = [
  {
    id: "p7-01",
    level: "core",
    documents: [
      {
        docType: "email",
        title: "Order 4471 — Revised Delivery Date",
        meta: [
          { label: "To", value: "m.reyes@brightpath-interiors.example" },
          { label: "From", value: "d.whitcombe@northgate-supply.example" },
          { label: "Date", value: "14 March" },
          { label: "Subject", value: "Order 4471 — Revised Delivery Date" },
        ],
        body: "Dear Ms. Reyes,\n\nThank you for your order of 60 oak conference chairs, placed on 8 March. I am writing to let you know that our Milton warehouse is currently out of the Walnut finish you selected. A new shipment from our manufacturer is expected on 26 March, which means we would not be able to deliver your order until 2 April — one week later than the date shown on your invoice.\n\nIf the original date is essential for your project, we can supply the same chair in the Chestnut finish from stock and deliver on the date originally agreed. The Chestnut finish is 4 dollars less per unit, and we would credit the difference to your account.\n\nPlease let me know which option you prefer by Friday, 18 March. If I do not hear from you by then, I will hold the order until the Walnut stock arrives.\n\nSincerely,\n\nDaniel Whitcombe\nCustomer Accounts, Northgate Supply",
        translation: "レイエス様\n\n3月8日にご注文いただいたオーク材の会議用椅子60脚について、お礼を申し上げます。ご選択いただいたウォールナット仕上げが、現在ミルトン倉庫で在庫切れとなっておりますことをお知らせいたします。製造元からの次回入荷は3月26日の見込みで、そうなるとご注文品のお届けは4月2日となり、請求書に記載の日付より1週間遅れることになります。\n\n当初の期日がご事情に不可欠である場合は、同じ椅子をチェストナット仕上げで在庫から手配し、当初お約束した日にお届けすることが可能です。チェストナット仕上げは1脚あたり4ドル安く、差額はお客様の口座に返金いたします。\n\n3月18日金曜日までに、どちらをご希望かお知らせください。その期日までにご連絡がない場合は、ウォールナットの入荷までご注文をお預かりいたします。\n\n敬具\n\nダニエル・ウィットコム\nノースゲート・サプライ 顧客口座担当",
      },
    ],
    questions: [
      {
        id: "p7-01-q1",
        question: "What is the purpose of the e-mail?",
        choices: [
          "To request payment for an overdue invoice",
          "To announce a change in company pricing",
          "To confirm that an order has been shipped",
          "To inform a customer of a delay and offer an alternative",
        ],
        answer: 3,
        explanation: "第1段落で在庫切れによる納期の遅れを伝え、第2段落で別仕上げという代替案を示している。メール全体の目的はこの2点で、発送済みの確認でも支払いの催促でもない。",
      },
      {
        id: "p7-01-q2",
        question: "What was the original delivery date for Order 4471?",
        choices: [
          "8 March",
          "18 March",
          "26 March",
          "2 April",
        ],
        answer: 2,
        explanation: "第1段落に、4月2日は請求書の日付より1週間遅いとある。4月2日の1週間前は3月26日。本文に直接は書かれていない逆算問題。",
      },
      {
        id: "p7-01-q3",
        question: "What will Mr. Whitcombe do if he does not receive a reply by 18 March?",
        choices: [
          "He will issue a full refund.",
          "He will cancel the order.",
          "He will ship the Chestnut chairs.",
          "He will keep the order on hold until the stock arrives.",
        ],
        answer: 3,
        explanation: "最終段落の hold the order until the Walnut stock arrives がそのまま根拠になる。",
      },
    ],
  },
  {
    id: "p7-02",
    level: "core",
    documents: [
      {
        docType: "notice",
        title: "Elevator Maintenance — Tower B",
        meta: [
          { label: "Posted", value: "26 May" },
          { label: "From", value: "Building Management Office" },
        ],
        body: "Please be advised that the two passenger elevators in Tower B will undergo their annual safety inspection from Monday, 5 June through Wednesday, 7 June.\n\nElevator 1 will be out of service on 5 June, and Elevator 2 on 6 June. Both elevators will be available on 7 June, when the inspectors will carry out load testing between 7:00 A.M. and 9:00 A.M. only. Service may be briefly interrupted during that window.\n\nThe freight elevator at the rear of the building will operate normally throughout the inspection period. Staff moving boxes, equipment or furniture should use it rather than the passenger elevators.\n\nTenants on floors 9 through 14 who require assistance during the inspection should contact the building office at extension 220 at least one day in advance.",
        translation: "Bタワーの旅客用エレベーター2基について、6月5日（月）から6月7日（水）まで年次安全点検を実施いたしますのでお知らせします。\n\n6月5日は1号機、6月6日は2号機が運休となります。6月7日は両機とも利用できますが、この日は午前7時から9時までの間のみ、点検員が荷重試験を行います。その時間帯は一時的に運転が止まることがあります。\n\n建物裏手の荷物用エレベーターは、点検期間中も通常どおり稼働します。箱・機材・什器を運ぶ職員は、旅客用ではなく荷物用をご利用ください。\n\n点検期間中に介助が必要な9階から14階のテナントの方は、前日までに内線220の管理事務所までご連絡ください。",
      },
    ],
    questions: [
      {
        id: "p7-02-q1",
        question: "On which date will both passenger elevators be in operation?",
        choices: [
          "26 May",
          "5 June",
          "6 June",
          "7 June",
        ],
        answer: 3,
        explanation: "第2段落に Both elevators will be available on 7 June とある。5日は1号機、6日は2号機が運休。",
      },
      {
        id: "p7-02-q2",
        question: "What are staff asked to do when moving large items?",
        choices: [
          "Move items before 5 June",
          "Wait until after 9:00 A.M.",
          "Use the freight elevator",
          "Contact the inspectors directly",
        ],
        answer: 2,
        explanation: "第3段落で、荷物を運ぶ際は旅客用ではなく荷物用エレベーターを使うよう求めている。",
      },
      {
        id: "p7-02-q3",
        question: "Who is asked to call extension 220?",
        choices: [
          "Anyone who finds an elevator out of service",
          "Visitors who need directions to Tower B",
          "Tenants on upper floors who need assistance",
          "Staff who wish to reschedule the inspection",
        ],
        answer: 2,
        explanation: "最終段落で、介助が必要な9階から14階のテナントに対して内線220への連絡を求めている。",
      },
    ],
  },
  {
    id: "p7-03",
    level: "core",
    documents: [
      {
        docType: "advertisement",
        title: "The Lantern Works — Flexible Workspace in Central Bradfield",
        meta: [],
        body: "Looking for a desk without a long lease? The Lantern Works offers 120 workstations across three floors of a restored textile mill, five minutes from Bradfield Interchange.\n\nDay Pass — 18 pounds. Hot desk, high-speed wi-fi, unlimited coffee, access from 8:00 A.M. to 8:00 P.M.\n\nMonthly Flex — 165 pounds. Everything in the Day Pass, plus 24-hour access and eight hours of meeting-room credit.\n\nDedicated Desk — 240 pounds. Your own desk and locker, a business mailing address, and sixteen hours of meeting-room credit.\n\nAll plans include use of the ground-floor cafe and the secure bicycle store. Printing is charged separately at 8 pence per page.\n\nQuote code LW-AUTUMN when you book online before 31 October and your first month is half price. The discount applies to the Monthly Flex and Dedicated Desk plans only.",
        translation: "長期契約なしでデスクをお探しですか。ランタン・ワークスは、改装された紡績工場の3フロアに120席のワークステーションをご用意しています。ブラッドフィールド乗換駅から徒歩5分です。\n\nデイパス 18ポンド。フリーアドレス席、高速 Wi-Fi、コーヒー飲み放題、午前8時から午後8時まで利用可。\n\nマンスリー・フレックス 165ポンド。デイパスの内容すべてに加え、24時間利用と会議室8時間分の利用権付き。\n\n専用デスク 240ポンド。専用デスクとロッカー、法人用郵便住所、会議室16時間分の利用権付き。\n\nすべてのプランで1階カフェと施錠式駐輪場をご利用いただけます。印刷は1ページ8ペンスの別料金です。\n\n10月31日までにオンラインで予約し、コード LW-AUTUMN をご提示いただくと初月半額。割引はマンスリー・フレックスと専用デスクのプランのみ対象です。",
      },
    ],
    questions: [
      {
        id: "p7-03-q1",
        question: "What is NOT included in the Day Pass?",
        choices: [
          "High-speed wi-fi",
          "Unlimited coffee",
          "Access at any hour of the day",
          "Use of the ground-floor cafe",
        ],
        answer: 2,
        explanation: "デイパスの利用時間は午前8時から午後8時まで。24時間いつでも使えるのはマンスリー・フレックス以上の特典なので、それだけがデイパスに含まれない。",
      },
      {
        id: "p7-03-q2",
        question: "According to the advertisement, what costs extra?",
        choices: [
          "A mailing address",
          "Meeting-room credit",
          "Printing",
          "Use of the bicycle store",
        ],
        answer: 2,
        explanation: "Printing is charged separately とあり、印刷のみ別料金。駐輪場は全プラン込み。",
      },
      {
        id: "p7-03-q3",
        question: "Who can use the code LW-AUTUMN?",
        choices: [
          "Anyone who visits the mill in person",
          "Customers who choose a monthly plan and book online in time",
          "Existing members who renew after 31 October",
          "Customers who buy ten or more day passes",
        ],
        answer: 1,
        explanation: "最終段落に、オンラインで10月31日までの予約が条件で、対象はマンスリー・フレックスと専用デスクのみとある。",
      },
    ],
  },
  {
    id: "p7-04",
    level: "core",
    documents: [
      {
        docType: "text-message",
        title: "Text-message chain",
        meta: [
          { label: "Participants", value: "Priya Raman, Marcus Feld" },
          { label: "Date", value: "11 October" },
        ],
        body: "Priya Raman (9:12 A.M.)\nMarcus, the caterer just called. Their van has broken down on the ring road and they will not reach the venue before 12:30.\n\nMarcus Feld (9:15 A.M.)\nThat is cutting it close. The awards lunch starts at 12:00 and the room has to be cleared by 2:00 for the afternoon panel.\n\nPriya Raman (9:17 A.M.)\nI know. They have suggested moving the buffet to the foyer so they can unload straight from the loading bay. It would save about twenty minutes.\n\nMarcus Feld (9:19 A.M.)\nThe foyer is where registration is set up. Could we push registration into the corridor by the cloakroom?\n\nPriya Raman (9:21 A.M.)\nThat works. I will ask Hana to move the desks now. Can you let the speakers know that lunch will start late?\n\nMarcus Feld (9:22 A.M.)\nOn it. I will also ask the panel chair whether she can begin ten minutes later.",
        translation: "プリヤ・ラマン（午前9時12分）\nマーカス、ケータリング業者から連絡がありました。環状道路でバンが故障して、12時30分より前には会場に着けないそうです。\n\nマーカス・フェルド（午前9時15分）\nそれはかなりぎりぎりですね。授賞式の昼食会は12時開始で、午後のパネル討論のために2時までに部屋を空けなければなりません。\n\nプリヤ・ラマン（午前9時17分）\nそうなんです。業者からは、搬入口から直接荷下ろしできるよう、ビュッフェをホワイエに移してはどうかと提案がありました。20分ほど短縮できるそうです。\n\nマーカス・フェルド（午前9時19分）\nホワイエは受付を設営している場所です。受付をクローク横の通路に移せませんか。\n\nプリヤ・ラマン（午前9時21分）\nそれで行けます。ハナにすぐ机を動かすよう頼みます。登壇者に昼食の開始が遅れると伝えてもらえますか。\n\nマーカス・フェルド（午前9時22分）\n了解しました。パネル討論の司会者にも、10分遅らせられるか聞いてみます。",
      },
    ],
    questions: [
      {
        id: "p7-04-q1",
        question: "At 9:15 A.M., what does Mr. Feld most likely mean when he writes, 'That is cutting it close'?",
        choices: [
          "He is worried that the food will be too expensive.",
          "He wants the lunch to be shortened.",
          "He thinks the caterer should be replaced.",
          "He believes there will be very little time to spare.",
        ],
        answer: 3,
        explanation: "直後に、昼食会が12時開始で2時までに片づける必要があると述べている。12時30分着では時間の余裕がほとんどない、という意味。意図問題。",
      },
      {
        id: "p7-04-q2",
        question: "What will Hana be asked to do?",
        choices: [
          "Contact the catering company",
          "Relocate the registration desks",
          "Serve the buffet in the foyer",
          "Postpone the afternoon panel",
        ],
        answer: 1,
        explanation: "午前9時21分でラマンさんが I will ask Hana to move the desks now と述べている。desks は受付の机を指す。",
      },
      {
        id: "p7-04-q3",
        question: "What does Mr. Feld agree to do?",
        choices: [
          "Move the buffet tables himself",
          "Cancel the afternoon panel",
          "Notify the speakers about the delay",
          "Meet the caterer at the loading bay",
        ],
        answer: 2,
        explanation: "ラマンさんの依頼（登壇者への連絡）に対して On it と答えている。さらに司会者にも相談すると述べている。",
      },
    ],
  },
  {
    id: "p7-05",
    level: "core",
    documents: [
      {
        docType: "article",
        title: "Ferry Service to Resume on the Kestrel Route",
        meta: [
          { label: "Source", value: "Colthorpe Evening Register" },
          { label: "Date", value: "2 September" },
        ],
        body: "COLTHORPE — Kestrel Coastal Lines will restart its passenger ferry between Colthorpe and Saltmere on 1 November, three years after the route was suspended.\n\nThe service ended in 2022, when the company's only vessel large enough for the crossing was withdrawn for repairs that were never completed. Since then, travellers between the two towns have relied on a bus that takes ninety minutes, compared with the thirty-five-minute crossing.\n\nThe restarted service will use a leased vessel, the Ardent, which carries 180 passengers but no vehicles. Kestrel's managing director, Ines Barlow, said the company had ruled out a vehicle ferry because the pier at Saltmere would need reinforcement costing an estimated 4 million pounds.\n\nInitially the Ardent will make four return crossings a day on weekdays and six at weekends. Ms. Barlow said a fifth weekday crossing would be added in the spring if bookings meet expectations.\n\nThe Colthorpe Chamber of Commerce welcomed the announcement, noting that summer visitor numbers fell by nearly a fifth after the route closed.",
        translation: "コルソープ発 — ケストレル沿岸航路は11月1日、コルソープとソルトミアを結ぶ旅客フェリーを再開する。航路の休止から3年ぶりとなる。\n\n運航は2022年に終了した。この横断に必要な大きさを備えた同社唯一の船舶が修理のため離脱し、その修理が結局完了しなかったためである。以来、両町間の移動者は所要90分のバスに頼ってきた。フェリーなら35分の距離である。\n\n再開後は、借り受けた船舶アーデント号を使用する。旅客180人を運べるが、車両は積載できない。ケストレル社のイネス・バーロウ社長によると、車両フェリーは見送った。ソルトミア側の桟橋の補強に推定400万ポンドを要するためだという。\n\n当初、アーデント号は平日1日4往復、週末は6往復する。バーロウ社長は、予約が見込みどおりであれば春に平日5往復目を追加すると述べた。\n\nコルソープ商工会議所はこの発表を歓迎し、航路休止後に夏季の来訪者数が2割近く落ち込んでいたと指摘した。",
      },
    ],
    questions: [
      {
        id: "p7-05-q1",
        question: "What is the article mainly about?",
        choices: [
          "The reopening of a ferry route",
          "Repairs to a damaged pier",
          "A new bus timetable between two towns",
          "The sale of a shipping company",
        ],
        answer: 0,
        explanation: "第1段落に11月1日の運航再開が書かれており、以降もその内容が続く。記事全体の主旨は航路の再開。",
      },
      {
        id: "p7-05-q2",
        question: "Why will the new service not carry vehicles?",
        choices: [
          "Upgrading a pier would be too expensive.",
          "Local authorities have refused permission.",
          "Demand for vehicle transport has fallen.",
          "The Ardent is too small to be licensed.",
        ],
        answer: 0,
        explanation: "第3段落に、ソルトミアの桟橋の補強に推定400万ポンドかかるため車両フェリーを見送ったとある。",
      },
      {
        id: "p7-05-q3",
        question: "What may happen in the spring?",
        choices: [
          "Ticket prices will be lowered.",
          "A second vessel will be purchased.",
          "Weekend crossings will be reduced.",
          "An extra weekday crossing will be added.",
        ],
        answer: 3,
        explanation: "第4段落で、予約が見込みどおりなら春に平日5往復目を追加するとバーロウ社長が述べている。",
      },
      {
        id: "p7-05-q4",
        question: "The word 'withdrawn' in paragraph 2 is closest in meaning to",
        choices: [
          "repaid",
          "removed",
          "reduced",
          "delayed",
        ],
        answer: 1,
        explanation: "ここでの withdraw は船舶を運航から引き上げること。同義語として最も近いのは removed。",
      },
    ],
  },
  {
    id: "p7-06",
    level: "core",
    documents: [
      {
        docType: "email",
        title: "Interview — Assistant Archivist position",
        meta: [
          { label: "To", value: "t.oyelaran@mailservice.example" },
          { label: "From", value: "s.marsh@westmere-museum.example" },
          { label: "Date", value: "11 April" },
          { label: "Subject", value: "Interview — Assistant Archivist position" },
        ],
        body: "Dear Mr. Oyelaran,\n\nThank you for your application for the Assistant Archivist post. The selection panel was impressed by your cataloguing work at the Fenwick Institute, and we would like to invite you to an interview at our Riverside site on Tuesday, 26 April, at 10:00 A.M.\n\nThe interview will last approximately 45 minutes and will be followed by a short practical exercise in which you will be asked to describe and date three items from our photographic collection. Please allow two hours in total.\n\nYou do not need to prepare a presentation. However, please bring photographic identification and the original certificates for the qualifications listed in your application.\n\nOur Riverside site has no visitor parking. The nearest public car park is on Gill Street, a six-minute walk away, and the number 14 bus stops directly outside the main entrance.\n\nPlease confirm your attendance by replying to this message no later than 18 April. If the proposed date is not convenient, let me know and I will try to offer an alternative.\n\nKind regards,\n\nSelina Marsh\nRecruitment Officer, Westmere Museum",
        translation: "オイェララン様\n\nアシスタント・アーキビスト職へのご応募ありがとうございました。選考委員会はフェンウィック研究所での目録作成のご経験に感銘を受けており、4月26日（火）午前10時に当館リバーサイド施設での面接にご案内したく存じます。\n\n面接は約45分で、その後に短い実技があります。当館の写真コレクションから3点を選び、内容の記述と年代の推定をしていただきます。全体で2時間ほどを見込んでください。\n\nプレゼンテーションの準備は不要です。ただし、写真付きの身分証明書と、応募書類に記載された資格の原本をご持参ください。\n\nリバーサイド施設に来訪者用の駐車場はありません。最寄りの公共駐車場はギル通りにあり、徒歩6分です。14番のバスが正面入口前に停車します。\n\n4月18日までに本メールへの返信で出席のご確認をお願いします。ご提案の日程がご都合に合わない場合はお知らせください。別の日程を調整いたします。\n\n敬具\n\nセリーナ・マーシュ\nウェストミア博物館 採用担当",
      },
    ],
    questions: [
      {
        id: "p7-06-q1",
        question: "What is indicated about the interview?",
        choices: [
          "It will include a practical task.",
          "It will be rescheduled if it rains.",
          "It will require a prepared presentation.",
          "It will be conducted by telephone.",
        ],
        answer: 0,
        explanation: "第2段落に、面接のあとに写真資料を扱う実技があると書かれている。プレゼンの準備は不要と第3段落にあるので、事前発表を求める選択肢は誤り。",
      },
      {
        id: "p7-06-q2",
        question: "What is Mr. Oyelaran asked to bring?",
        choices: [
          "Samples of his cataloguing work",
          "Identification and original certificates",
          "A parking permit for the Riverside site",
          "A printed copy of his application",
        ],
        answer: 1,
        explanation: "第3段落に photographic identification と original certificates を持参するようにとある。",
      },
      {
        id: "p7-06-q3",
        question: "What is suggested about the Riverside site?",
        choices: [
          "It is difficult to reach by public transport.",
          "Candidates cannot leave a car there.",
          "It has recently moved to Gill Street.",
          "It is closed to the public on Tuesdays.",
        ],
        answer: 1,
        explanation: "第4段落に来訪者用の駐車場がないとある。14番のバスが正面に停まるので、公共交通で行きにくいとする選択肢は本文と逆。",
      },
      {
        id: "p7-06-q4",
        question: "By when must Mr. Oyelaran reply?",
        choices: [
          "26 April",
          "The day of the interview",
          "11 April",
          "18 April",
        ],
        answer: 3,
        explanation: "最終段落に no later than 18 April とある。26 April は面接日なので混同しないこと。",
      },
    ],
  },
  {
    id: "p7-07",
    level: "core",
    documents: [
      {
        docType: "notice",
        title: "Autumn Training Programme — Registration Now Open",
        meta: [
          { label: "From", value: "Learning and Development Team" },
          { label: "Posted", value: "20 September" },
        ],
        body: "The Learning and Development team is pleased to announce the autumn schedule. All sessions are held in the Brunel Room unless otherwise stated.\n\nSpreadsheet Essentials — 12 October, 9:30 to 12:30. For staff who use spreadsheets occasionally and want to work faster. No prior knowledge assumed.\n\nReport Writing for Officers — 19 October, 13:30 to 16:30. Open to staff at grade 5 and above.\n\nDifficult Conversations — 26 October, full day, Annexe Room 2. Limited to 12 participants.\n\nData Protection Refresher — 2 November, 10:00 to 11:30, delivered online.\n\nRegister through the staff portal. Places are allocated in the order that requests are received, except for Difficult Conversations, where line-manager approval is required before a place is confirmed.\n\nStaff who register and then do not attend, without notifying us at least 48 hours beforehand, may be asked to meet the cost of the place.",
        translation: "人材育成チームより、秋期の研修日程をお知らせします。別段の記載がない限り、すべてブルネル室で実施します。\n\nスプレッドシート基礎 — 10月12日 9時30分〜12時30分。表計算ソフトをときどき使う職員向け。事前知識は不要。\n\n職員のための報告書作成 — 10月19日 13時30分〜16時30分。グレード5以上の職員が対象。\n\n難しい対話の進め方 — 10月26日 終日、別館2号室。定員12名。\n\n個人情報保護の再確認 — 11月2日 10時〜11時30分、オンライン開催。\n\n申込は職員ポータルから。席は申込順に割り当てますが、「難しい対話の進め方」のみ、席の確定前に直属の上司の承認が必要です。\n\n申込後、48時間前までの連絡なく欠席した職員には、受講費用のご負担をお願いする場合があります。",
      },
    ],
    questions: [
      {
        id: "p7-07-q1",
        question: "Which session requires approval from a line manager?",
        choices: [
          "Data Protection Refresher",
          "Spreadsheet Essentials",
          "Report Writing for Officers",
          "Difficult Conversations",
        ],
        answer: 3,
        explanation: "申込方法の段落に、Difficult Conversations のみ直属の上司の承認が必要と明記されている。",
      },
      {
        id: "p7-07-q2",
        question: "What is indicated about Report Writing for Officers?",
        choices: [
          "It is not open to every member of staff.",
          "It lasts a full day.",
          "It is held online.",
          "It has a limit of 12 participants.",
        ],
        answer: 0,
        explanation: "grade 5 and above と対象が限定されている。終日なのは Difficult Conversations、オンラインは Data Protection Refresher。",
      },
      {
        id: "p7-07-q3",
        question: "What may happen to staff who miss a session without giving notice?",
        choices: [
          "They will be removed from the staff portal.",
          "They may have to pay for the place.",
          "They will be placed on a waiting list.",
          "They must attend the online session instead.",
        ],
        answer: 1,
        explanation: "最終段落に may be asked to meet the cost of the place とある。meet the cost は費用を負担するという意味。",
      },
    ],
  },
  {
    id: "p7-08",
    level: "core",
    documents: [
      {
        docType: "form",
        title: "Guest Comment Card — The Marlow Hotel",
        meta: [
          { label: "Guest", value: "Ravi Ganesan (Room 412)" },
          { label: "Dates of stay", value: "3-6 May" },
          { label: "Purpose of visit", value: "Business" },
        ],
        body: "Please rate the following, where 1 is poor and 5 is excellent.\n\nCheck-in speed: 5\nRoom cleanliness: 5\nBreakfast: 2\nWi-fi reliability: 2\nValue for money: 3\n\nComments:\n\nThe front desk staff could not have been more helpful. I arrived at 1:00 A.M. after a cancelled flight and was checked in within three minutes. The room itself was spotless and quiet, which is rare for a hotel on a main road.\n\nTwo things let the stay down. The wi-fi dropped out repeatedly in the afternoons, which was a real problem because I had video calls booked on two of the three days. And breakfast finishes at 9:00 A.M., which seems early for a hotel that markets itself to business travellers. I missed it twice.\n\nI would stay again if the wi-fi were fixed. I have stayed at the Marlow in Ashgrove four times and never had this problem there.",
        translation: "以下の項目を5段階で評価してください（1が不可、5が優）。\n\nチェックインの速さ: 5\n客室の清潔さ: 5\n朝食: 2\nWi-Fi の安定性: 2\n価格に対する満足度: 3\n\n自由記述:\n\nフロント係の対応はこれ以上ないほど親切でした。欠航に遭って午前1時に到着しましたが、3分でチェックインできました。客室自体も塵ひとつなく静かで、幹線道路沿いのホテルとしては珍しいことです。\n\n残念だった点が2つあります。ひとつは Wi-Fi が午後に何度も切れたことです。3日のうち2日はビデオ会議の予定があったので、これは実害がありました。もうひとつは朝食が午前9時で終わることです。ビジネス客向けをうたうホテルとしては早すぎるように思います。2回食べ損ねました。\n\nWi-Fi が改善されればまた泊まります。アッシュグローブのマーロウには4回泊まっていますが、そこでこの問題が起きたことはありません。",
      },
    ],
    questions: [
      {
        id: "p7-08-q1",
        question: "What is suggested about Mr. Ganesan?",
        choices: [
          "He was given a discount on his room.",
          "He was travelling with colleagues.",
          "He has stayed at another Marlow hotel before.",
          "He complained to the front desk during his stay.",
        ],
        answer: 2,
        explanation: "最終段落に、アッシュグローブのマーロウに4回泊まったとある。別の店舗の利用歴が示唆されている。",
      },
      {
        id: "p7-08-q2",
        question: "What problem did Mr. Ganesan report?",
        choices: [
          "The room was noisy at night.",
          "Check-in took longer than expected.",
          "The internet connection was unreliable.",
          "The hotel was far from the main road.",
        ],
        answer: 2,
        explanation: "Wi-Fi が午後に繰り返し切れたと書かれている。客室は静かで、チェックインは3分と高評価なので他の選択肢は本文と逆。",
      },
      {
        id: "p7-08-q3",
        question: "Why did Mr. Ganesan miss breakfast?",
        choices: [
          "It ended earlier than he expected.",
          "It required an additional charge.",
          "It was fully booked on two days.",
          "It was served in a different building.",
        ],
        answer: 0,
        explanation: "朝食が午前9時で終わることを early と評し、2回食べ損ねたと述べている。",
      },
    ],
  },
  {
    id: "p7-09",
    level: "core",
    documents: [
      {
        docType: "article",
        title: "Picking Robots Arrive at Denholm Foods",
        meta: [
          { label: "Source", value: "Trentside Business Weekly" },
          { label: "Date", value: "14 January" },
        ],
        body: "Denholm Foods has begun using automated picking units at its Trentside depot, the first of the company's six sites to adopt the technology.\n\nThe units, supplied by Arkwright Robotics, travel along fixed rails above the storage racks and lower a gripping arm to retrieve individual cases. Denholm says the system can assemble a standard 40-case pallet in eleven minutes, against twenty-six minutes for a worker with a forklift.\n\nOperations director Colin Mbeki stressed that no jobs would be lost. Twelve staff who previously worked in picking have moved to quality checking and loading, roles the company had struggled to fill. Mr. Mbeki said the depot had been carrying four vacancies for most of the year.\n\nNot everyone is convinced. Rosa Lindqvist of the Transport and Distribution Union said that while Denholm had honoured its commitment at Trentside, the union would watch the remaining five sites closely.\n\nDenholm expects to decide by March whether to install the system at its Kirkby depot.",
        translation: "デンホルム食品は、トレントサイド配送センターで自動ピッキング装置の運用を始めた。同社6拠点のうち、この技術を導入した最初の拠点となる。\n\nアークライト・ロボティクス社が納入したこの装置は、保管棚の上に固定されたレールを移動し、アームを降ろして箱を1つずつ取り出す。同社によると、標準的な40箱のパレットを11分で組み上げられる。フォークリフトを使う作業員では26分かかっていた。\n\n運営部長のコリン・ムベキ氏は、雇用の削減はないと強調した。これまでピッキングに従事していた職員12名は、品質検査と積み込みの業務に移った。いずれも同社が人員確保に苦労していた職種である。ムベキ氏によれば、同センターでは年間の大半で4名の欠員を抱えていた。\n\nすべての関係者が納得しているわけではない。運輸配送労働組合のローザ・リンドクヴィスト氏は、トレントサイドでは同社が約束を守ったとしつつ、残る5拠点を注視していくと述べた。\n\nデンホルム社は、カークビー配送センターへの導入可否を3月までに判断する見込みである。",
      },
    ],
    questions: [
      {
        id: "p7-09-q1",
        question: "What is stated about the automated units?",
        choices: [
          "They assemble pallets faster than a forklift operator.",
          "They are used at all six of the company's sites.",
          "They can be moved between depots easily.",
          "They were designed by Denholm Foods.",
        ],
        answer: 0,
        explanation: "第2段落に11分と26分の比較がある。導入は6拠点のうち1拠点目だと第1段落にあるので、全拠点で使われているとする選択肢は誤り。",
      },
      {
        id: "p7-09-q2",
        question: "What happened to the twelve picking staff?",
        choices: [
          "They were given new roles at the same site.",
          "They were offered early retirement.",
          "They were trained to repair the robots.",
          "They were transferred to the Kirkby depot.",
        ],
        answer: 0,
        explanation: "第3段落に、品質検査と積み込みの業務に移ったとある。雇用は失われていない。",
      },
      {
        id: "p7-09-q3",
        question: "What does Ms. Lindqvist imply about the other five sites?",
        choices: [
          "They already employ too many staff.",
          "The outcome there is not yet assured.",
          "They belong to a different company.",
          "They will not adopt the technology.",
        ],
        answer: 1,
        explanation: "トレントサイドでは約束が守られたと認めつつ watch ... closely と述べている。残る拠点では同じ結果になるとまだ確信していない、という含み。",
      },
      {
        id: "p7-09-q4",
        question: "What will Denholm Foods decide by March?",
        choices: [
          "Whether to extend the system to another depot",
          "Whether to renew its contract with the union",
          "How many vacancies to advertise",
          "Which supplier to use for new forklifts",
        ],
        answer: 0,
        explanation: "最終段落に、カークビー配送センターへの導入可否を3月までに判断するとある。",
      },
    ],
  },
  {
    id: "p7-10",
    level: "core",
    documents: [
      {
        docType: "email",
        title: "Change to invoice submission — effective 1 July",
        meta: [
          { label: "To", value: "All budget holders" },
          { label: "From", value: "Accounts Payable" },
          { label: "Date", value: "6 June" },
        ],
        body: "From 1 July, all supplier invoices must be submitted through the Finance Hub rather than by e-mail to the accounts inbox. The inbox will remain open until 31 July to catch invoices already in circulation, and will then be closed permanently.\n\nWhat changes for you: when an invoice arrives in the Hub, the named budget holder receives an automatic notification and has five working days to approve or query it. If no action is taken within five working days, the invoice escalates to the head of service. Under the current e-mail process there was no fixed deadline.\n\nWhat does not change: purchase-order thresholds, the 30-day payment terms we offer suppliers, and the requirement to obtain three quotations for purchases above 10,000 pounds.\n\nDrop-in sessions will run in the Finance Hub training room on 17, 19 and 24 June, from 12:00 to 14:00. No booking is needed. A recorded walkthrough will be added to the intranet on 20 June for anyone who cannot attend.\n\nIf you hold a delegated approval for a colleague who will be on leave in July, please tell us before 27 June so that we can set up the correct permissions.",
        translation: "7月1日より、取引先からの請求書はすべて、経理受信箱へのメールではなく Finance Hub 経由で提出していただきます。受信箱は、すでに流通している請求書を受けるため7月31日まで開けておき、その後は恒久的に閉鎖します。\n\n変わる点: 請求書が Hub に届くと、指定された予算管理者に自動通知が届き、5営業日以内に承認または照会を行います。5営業日以内に対応がない場合、請求書は所管部長へ引き上げられます。現行のメール方式では期限の定めがありませんでした。\n\n変わらない点: 発注書の基準額、取引先に提示している30日以内の支払条件、1万ポンドを超える調達で3社見積もりを取る要件。\n\n相談会は6月17日・19日・24日の12時から14時まで、Finance Hub 研修室で随時受付にて実施します。予約は不要です。参加できない方向けに、6月20日にイントラネットへ操作動画を掲載します。\n\n7月に休暇を取る同僚の承認権限を代行している方は、権限設定のため6月27日までにご連絡ください。",
      },
    ],
    questions: [
      {
        id: "p7-10-q1",
        question: "What is the main purpose of the e-mail?",
        choices: [
          "To remind staff about overdue payments",
          "To introduce new payment terms for suppliers",
          "To report the results of an audit",
          "To announce a change in how invoices are submitted",
        ],
        answer: 3,
        explanation: "第1段落で提出方法の変更を告知し、以降はその運用の説明が続く。支払条件は変わらないと第3段落にあるので、新しい支払条件の導入とする選択肢は誤り。",
      },
      {
        id: "p7-10-q2",
        question: "What happens if a budget holder takes no action within five working days?",
        choices: [
          "The invoice is passed to the head of service.",
          "The budget holder loses access to the Hub.",
          "The invoice is returned to the supplier.",
          "The invoice is paid automatically.",
        ],
        answer: 0,
        explanation: "第2段落に escalates to the head of service とある。escalate は上位者へ引き上げるという意味。",
      },
      {
        id: "p7-10-q3",
        question: "What will NOT change on 1 July?",
        choices: [
          "The way invoices are received",
          "The payment terms offered to suppliers",
          "The address used for the accounts inbox",
          "The deadline for approving invoices",
        ],
        answer: 1,
        explanation: "第3段落の What does not change に、30日の支払条件が挙げられている。承認の期限と請求書の受付方法は、いずれも変更される点。",
      },
      {
        id: "p7-10-q4",
        question: "What should some staff do before 27 June?",
        choices: [
          "Submit all outstanding invoices",
          "Report delegated approvals for July",
          "Book a place at a drop-in session",
          "Watch the recorded walkthrough",
        ],
        answer: 1,
        explanation: "最終段落に、7月に休暇を取る同僚の承認を代行する場合は6月27日までに連絡するようにとある。相談会は予約不要なので、席の予約を求める選択肢は誤り。",
      },
    ],
  },
]
