// 第三章 而立（30～40 歲）的事件（DESIGN.md §10.6）：一生一次，年紀範圍稍微跨到下一章
const weekday = (s, c) => !c.weekend;
const AGE = [30, 42];

export const CHAPTER3_EVENTS = [
  {
    id: 'reunion_kids',
    age: AGE,
    title: '同學會都帶小孩',
    text: '同學會的地點從熱炒店改成親子餐廳。一進門，你是唯一沒有推嬰兒車的人。',
    choices: [
      { text: '幫大家抱小孩', effects: { energy: -6, mood: 4 }, result: '抱了五個小孩，被吐了兩次。他們說你很有天分。' },
      { text: '負責吃', effects: { money: -600, mood: 3 }, result: '大人都在餵小孩，整桌菜都是你的。', default: true },
      { text: '聊工作', effects: { mood: -3 }, result: '你一開口講 KPI，全桌都安靜了，一個小孩哭了。' },
    ],
  },
  {
    id: 'mortgage_math',
    age: AGE,
    title: '第一次認真算房貸',
    text: '打開房貸試算：總價 1,500 萬，頭期 300 萬，每月繳 4 萬 5，繳 30 年。',
    choices: [
      { text: '認真研究看房', effects: { energy: -5, mood: -6 }, result: '看了五間，每間都說「這個價錢明年就沒了」。（買房 v0.5 開放）' },
      { text: '關掉網頁', effects: { mood: -2 }, result: '你算了一下：不吃不喝 22 年。所以你決定先吃。', default: true },
      { text: '研究「30 歲買房」的脆文', effects: { mood: -4 }, result: '留言區吵起來了：一半說「爸媽贊助的」，一半說「你不努力」。' },
    ],
  },
  {
    id: 'health_check_red',
    age: AGE,
    title: '健檢第一次紅字',
    text: '公司健檢報告出來了，膽固醇那一欄是紅色的，旁邊寫著「建議追蹤」。',
    choices: [
      { text: '開始少吃炸的', effects: { mood: -3, energyMax: 2 }, result: '你改吃鹹酥雞的九層塔。這也是一種進步。', default: true },
      { text: '拍照傳群組比慘', effects: { mood: 4 }, result: '大家紛紛貼出自己的紅字。群組史上最團結的一天。' },
    ],
  },
  {
    id: 'peer_is_boss',
    age: AGE,
    title: '同期變成你的主管',
    text: '組織調整公告：跟你同期進來、一起吃過泡麵的同事，從下週起是你的主管。',
    condition: weekday,
    choices: [
      { text: '真心恭喜，好好配合', effects: { mood: -2, performance: 2 }, result: '第一次一對一面談，你們都很尷尬，最後聊起當年的泡麵。', default: true },
      { text: '私下叫他「長官」', effects: { mood: 4 }, result: '他求你不要再這樣叫了。你決定叫到他升官為止。' },
    ],
  },
  {
    id: 'so_easy_to_read',
    age: AGE,
    title: '「好懂喔」',
    text: '你在會議上講了一個梗，新進同事笑著說：「哈哈，好懂喔。」你不確定這是不是稱讚。',
    choices: [
      { text: '問他什麼意思', effects: { mood: -4 }, result: '他解釋了三分鐘，你更不懂了。你終於成為看不懂梗的那一代。' },
      { text: '「對，我就是這麼好懂」', effects: { mood: 3 }, result: '他愣了一下，說你這樣講也很好懂。你們打成平手。', default: true },
    ],
  },
  {
    id: 'you_say_simple_change',
    age: AGE,
    title: '你也說了「簡單改一下」',
    text: '你拿著需求單走到新人座位：「這個簡單改一下就好，明天要。」說完你自己愣住了。',
    condition: weekday,
    choices: [
      { text: '收回，自己改', effects: { energy: -8, performance: 1, mood: 2 }, result: '你改到半夜才發現一點都不簡單。王經理，對不起。' },
      { text: '「……後天也可以」', effects: { management: 2, mood: 1 }, result: '新人鬆了一口氣。你懂了，主管不是壞人，只是沒有自己改過。', default: true },
    ],
  },
  {
    id: 'side_hustle',
    age: AGE,
    title: '斜槓的誘惑',
    text: '脆上滿滿的「下班後經營副業，月入五萬」。你也想當斜槓青年。',
    choices: [
      {
        text: '下班接案',
        effects: { energy: -12, mood: -2 },
        chance: { p: 0.5, effects: { money: 15000, mood: 6 }, result: '真的賺到一筆！雖然時薪算下來比正職還低。', otherwise: { money: 2000, mood: -3 }, otherwiseResult: '客戶改了 14 版，最後只付了訂金。' },
      },
      { text: '開 Podcast', effects: { mood: 5, energy: -4 }, result: '錄了三集，聽眾有你媽、阿凱，和一個不認識的人。你很珍惜那個人。' },
      { text: '下班的斜槓是睡覺', effects: { energy: 6 }, result: '你斜躺在沙發上。這也是斜槓。', default: true },
    ],
  },
  {
    id: 'ai_replace_me',
    age: AGE,
    title: 'AI 會取代我嗎？',
    text: '公司導入 AI 工具，第一天就把你一週的工作做完了。茶水間大家都在小聲討論。',
    condition: weekday,
    choices: [
      { text: '認真學會用它', effects: { energy: -6, programming: 3, performance: 2 }, result: '你現在是部門的 AI 小幫手。AI 沒取代你，取代你的是會用 AI 的你。' },
      { text: '問 AI 它會不會取代我', effects: { mood: 2 }, result: 'AI 說「不會的，我只是您的好幫手」。說得很誠懇，所以更可怕。', default: true },
    ],
  },
  {
    id: 'relative_loan',
    age: AGE,
    title: '遠房親戚來借錢',
    text: '一個你只在過年見過一次的表叔打電話來：「最近手頭比較緊，可以先借我五萬嗎？」',
    choices: [
      { text: '借了', effects: { money: -50000, mood: -2 }, result: '表叔說下個月還。你在行事曆上寫了「下個月」，後面加了一個問號。' },
      { text: '「我也很緊」', effects: { mood: -1 }, result: '表叔：「沒關係，你最近在哪上班？」你掛電話的手很穩。', default: true },
      { text: '介紹他去看理財影片', effects: { mood: 3 }, result: '他再也沒打來了。' },
    ],
  },
  {
    id: 'sneeze_back',
    age: AGE,
    title: '打個噴嚏閃到腰',
    text: '早上起床打了一個噴嚏，腰「喀」了一聲。你保持著彎腰的姿勢，一動也不能動。',
    choices: [
      { text: '請半天假去推拿', effects: { money: -1500, energy: -5 }, result: '師傅說：「你這是三十歲的腰。」你很想問三十歲的腰怎麼了。', default: true },
      { text: '貼藥布硬撐上班', effects: { energy: -10, mood: -4, performance: 1 }, result: '一整天用機器人的姿勢走路，同事以為你在練新舞步。' },
    ],
  },
  {
    id: 'layoff_rumor',
    age: AGE,
    title: '裁員的傳聞',
    text: '茶水間傳出消息：「聽說要裁員了。」接著每個人都開始很認真上班。',
    condition: weekday,
    choices: [
      { text: '默默更新履歷', effects: { mood: -3, energy: -3 }, result: '更新到一半發現，這幾年做的事很難寫成一句話。' },
      { text: '照常上班', effects: { mood: -2 }, result: '一個月後，傳聞變成「聽說不裁了」。你也不知道該不該高興。', default: true },
      { text: '突然變成全公司最熱情的人', effects: { performance: 2, energy: -6 }, result: '你主動幫王經理倒茶，他嚇到以為你要離職。' },
    ],
  },
  {
    id: 'stock_crash',
    age: AGE,
    title: '存股遇到大跌',
    text: '新聞：「股市重挫，千股跌停。」群組裡沒有人在說「長期持有」了。',
    choices: [
      { text: '恐慌賣出', effects: { money: -8000, mood: -6 }, result: '你賣在最低點。隔週就漲回來了。股市好像在針對你。' },
      { text: '卸載 App，長期持有', effects: { mood: 3 }, result: '眼不見為淨。三個月後打開，居然漲回來了。原來長期持有的祕訣是忘記密碼。', default: true },
      { text: '加碼！', chance: { p: 0.6, effects: { money: 12000, mood: 8 }, result: '你成了群組裡唯一敢說「我早就說了」的人。', otherwise: { money: -10000, mood: -8 }, otherwiseResult: '跌更深了。你決定這個月吃泡麵。' } },
    ],
  },
  {
    id: 'parents_fake_news',
    age: AGE,
    cast: 'mom',
    title: '爸媽轉傳的新聞',
    text: '媽媽在家族群組轉傳：「緊急！喝冰水會讓心臟凍結！請轉給你關心的人！」',
    choices: [
      { text: '貼查證連結', effects: { mood: -2 }, result: '媽媽回：「寧可信其有。」然後轉傳了查證連結，標題寫「這個也要看」。' },
      { text: '回一個「謝謝媽」', effects: { mood: 2 }, result: '媽媽很開心，又轉傳了三則。', default: true },
      { text: '當面教她怎麼查證', effects: { energy: -4, mood: 4 }, result: '她學會了。現在換她查證你轉傳的東西。' },
    ],
  },
];
