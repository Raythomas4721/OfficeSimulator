// 新人第一年事件包（DESIGN.md §10.3）：劇情分散在第一年；節日在 events-holidays.js
// 格式同 events.js；on.day 是開局後第幾天（只出現一次）
// cast 對應 cast.js 的固定班底，卡片上會顯示是誰

export const FIRST_YEAR_EVENTS = [
  // ── 第一年的劇情（日子錯開節日，避免卡片擠在一起） ──
  {
    id: 'welcome_dinner',
    on: { day: 1 },
    cast: 'boss',
    title: '迎新聚餐',
    text: '王經理宣布：「今天下班幫新人辦迎新！」熱炒店已經訂好了。',
    choices: [
      {
        text: '喝到最後一攤',
        effects: { mood: 8 },
        delayed: { days: 1, effects: { energy: -15 } },
        result: '阿凱說你酒量不錯，小美加了你 LINE。你也加入了第一個群組：「熱炒續攤群」。',
      },
      { text: '吃飽就先回家', effects: { mood: 3 }, result: '王經理笑著說：「年輕人要早點休息啊。」這是你最後一次聽到他叫你早點休息。', default: true },
    ],
  },
  {
    id: 'line_groups',
    on: { day: 16 },
    cast: 'xiaomei',
    title: '被拉進 30 個群組',
    text: '一早打開手機，你已經被拉進 30 個 LINE 群組：部門群、專案群、訂便當群、福委會群……',
    choices: [
      { text: '全部開提醒', effects: { mood: -4, performance: 1 }, result: '手機震了一整天，但什麼都沒漏掉。' },
      {
        text: '全部靜音',
        effects: { mood: 2 },
        chance: { p: 0.2, effects: { performance: -2 }, result: '……結果漏看了王經理在群組的交辦。' },
        result: '世界安靜了。原來 30 個群組靜音之後，手機是可以安靜的。',
        default: true,
      },
    ],
  },
  {
    id: 'excel_master',
    on: { day: 63 },
    cast: 'boss',
    title: '「你 Excel 應該很會吧？」',
    text: '王經理丟來一個有 50 個分頁的 Excel：「年輕人，這個你應該很會吧？」',
    choices: [
      { text: '熬夜上網自學', effects: { performance: 3, energy: -12, mood: -4 }, result: '學會了 VLOOKUP，覺得自己變強了。從此全部門的 Excel 都會來找你。' },
      { text: '老實說不太會', effects: { mood: 1 }, result: '王經理：「沒關係，問小美。」小美教得很仔細。', default: true },
    ],
  },
  {
    id: 'group_buy',
    on: { day: 114 },
    cast: 'xiaomei',
    title: '小美的團購',
    text: '小美在群組貼了一個連結：「團購雞蛋糕！滿 10 份免運～」',
    choices: [
      { text: '跟一份', effects: { money: -150, mood: 4 }, result: '下午茶時間，大家圍在一起吃雞蛋糕。' },
      { text: '已讀', effects: { mood: -1 }, result: '小美貼了一張貓咪哭哭的貼圖。你的「已讀」被她記住了。', default: true },
    ],
  },
  {
    id: 'akai_slacking',
    on: { day: 147 },
    cast: 'akai',
    title: '阿凱的摸魚教學',
    text: '阿凱湊過來小聲說：「新人，教你怎麼看起來很忙。」',
    choices: [
      { text: '好啊，教我', effects: { mood: 6, performance: -2 }, result: '學會了「開著 Excel 滑手機」的絕技。進階班是「走路要拿一疊紙」。' },
      { text: '我還是認真做事', effects: { performance: 1, mood: -1 }, result: '阿凱：「你會後悔的。」他說完就去茶水間待了 40 分鐘。', default: true },
    ],
  },
  {
    id: 'stay_tonight',
    on: { day: 254 },
    cast: 'boss',
    title: '「這週可以留晚一點嗎？」',
    text: '王經理走過來：「客戶這週很急，大家每天留晚一點好嗎？」',
    choices: [
      {
        text: '留下來',
        effects: { performance: 3, mood: -3 },
        forceSlots: { activity: 'overtime', weeks: 1, slots: [0, 1, 2, 3, 4] },
        result: '連續加班一週，週五王經理請大家喝珍奶。一杯珍奶換一週，這個匯率你記住了。',
      },
      { text: '說這週有事', effects: { performance: -1, mood: 2 }, result: '王經理：「好吧，那我找別人。」別人是阿凱。阿凱說他也有事。', default: true },
    ],
  },
  {
    id: 'first_salary',
    on: { day: 35 },
    cast: 'mom',
    title: '第一份薪水',
    text: '第一份完整的月薪入帳了！看著存款數字，有點不真實。',
    choices: [
      { text: '包孝親費給爸媽', effects: { money: -5000, mood: 12 }, result: '媽媽在電話那頭說「不用啦」，但聽得出來很開心。' },
      { text: '全部存起來', effects: { mood: 2 }, result: '存款數字看起來很安心。這份安心大概撐到下個月 5 號。', default: true },
      { text: '犒賞自己吃燒肉', effects: { money: -2000, mood: 8 }, result: '吃完燒肉，覺得一切都值得了。衣服上的味道提醒你，值得了三天。' },
    ],
  },
  {
    id: 'weekly_report',
    on: { day: 288 },
    cast: 'boss',
    title: '第一次寫週報',
    text: '王經理：「新人這週開始寫週報喔，格式照小美的。」',
    choices: [
      { text: '認真寫三頁', effects: { performance: 2, energy: -6 }, result: '王經理只看了第一行。你在第三頁藏了一句「有人看到這裡嗎」，至今沒人發現。' },
      { text: '照格式隨便填', effects: { mood: 1 }, result: '「本週持續推進各項工作。」完美。', default: true },
    ],
  },
  {
    id: 'team_outing',
    on: { day: 235 },
    cast: 'xiaomei',
    title: '部門出遊報名',
    text: '福委會公告：春天部門出遊去宜蘭，要自付 1,500 元。',
    choices: [
      { text: '報名！', effects: { money: -1500, mood: 10 }, result: '小美興奮地說要準備桌遊。她準備了十二盒，遊覽車上就開始玩。' },
      { text: '不去了', result: '那個週末可以好好睡一覺。週一大家都在聊宜蘭，你在聊你的床。', default: true },
    ],
  },

  {
    id: 'probation_talk',
    on: { day: 150 }, // 排在第一次考核附近；被間隔擋住時會往後延，所以文字寫成「試用期結束」
    cast: 'hr',
    title: '試用期面談',
    text: '人資小林找你面談：「試用期差不多結束囉！這陣子你覺得這份工作怎麼樣？」',
    choices: [
      { text: '很喜歡，想好好發展', effects: { performance: 2, mood: -1 }, result: '小林點點頭：「王經理也說你表現不錯。」你決定相信這句話不是每個新人都聽過。' },
      { text: '老實說有點累', effects: { mood: 4 }, result: '小林：「新人都會這樣，慢慢來。」她說她第一年也哭過三次，在廁所。', default: true },
    ],
  },

  // ── 隨機事件：固定班底與職場梗 ──
  {
    id: 'im_lazy',
    title: '「我就爛」',
    text: '今天醒來，完全不想努力。',
    choices: [
      { text: '今天就躺平吧', effects: { mood: 10, performance: -2 }, result: '我就爛，但我很快樂。' },
      { text: '還是撐一下', effects: { mood: -2, performance: 1 }, result: '社畜的一天，平安結束。明天的你會繼續撐，因為房租不會躺平。', default: true },
    ],
  },
  {
    id: 'printer_jam',
    repeat: true, // 日常
    cast: 'boss',
    title: '印表機又卡紙',
    text: [
      '王經理十分鐘後要開會，印表機偏偏在這時候卡紙。',
      '印表機顯示「缺紙」，打開來明明是滿的。它只是不想上班，跟你一樣。',
      '新的印表機到了，第一天就卡紙。有些東西換了也沒用。',
    ],
    condition: (s, c) => !c.weekend,
    choices: [
      {
        text: '徒手修理',
        chance: {
          p: 0.6,
          effects: { performance: 2 },
          result: '喀一聲修好了，你是辦公室英雄。',
          otherwise: { mood: -4 },
          otherwiseResult: '手黑了，紙還是卡著。',
        },
      },
      { text: '衝去便利商店印', effects: { money: -50, energy: -3 }, result: '氣喘吁吁，剛好趕上會議。', default: true },
    ],
  },
  {
    id: 'elder_meme',
    repeat: true, // 日常：長輩圖永遠不會停
    cast: 'mom',
    title: '早安長輩圖',
    text: [
      '媽媽傳來今天的長輩圖：「早安，平安喜樂」，背景是一朵發光的蓮花。',
      '媽媽傳來一張長輩圖：「認同請分享」，下面還附了一則來路不明的養生新知。',
      '家族群組一早就有三張不同的「早安」，其中一張還會閃。',
      '媽媽轉傳了一段影片：「這個一定要看完！」影片長 17 分鐘。',
    ],
    choices: [
      { text: '回一張更閃的', effects: { mood: 3 }, result: '媽媽回了三個讚。' },
      { text: '已讀', result: '媽媽又傳了一張。', default: true },
    ],
  },
  {
    id: 'broke_end_of_month',
    cast: 'akai',
    title: '月底吃土',
    text: '月底了，錢包快見底。',
    condition: (s, c) => c.date >= 22 && s.money < 20000,
    choices: [
      { text: '吃泡麵撐到月初', effects: { mood: -4, energy: -2 }, result: '泡麵吃到有點膩。你研究出 12 種泡麵的吃法，可以出一本書了。', default: true },
      {
        text: '跟阿凱借 3,000',
        effects: { money: 3000, mood: -2 },
        delayed: { days: 10, effects: { money: -3000 } },
        result: '阿凱：「下個月記得還喔。」',
      },
    ],
  },
  {
    id: 'kpi_push',
    cast: 'boss',
    title: '月底衝 KPI',
    text: '王經理：「這個月 KPI 還差一點，大家衝一下！」',
    condition: (s, c) => !c.weekend && c.date >= 20,
    choices: [
      { text: '拚了', effects: { performance: 3, energy: -10, mood: -4 }, result: '總算達標，王經理鬆了一口氣。下個月的 KPI 也調高了一口氣。' },
      { text: '盡力就好', result: '差一點點，下個月再說。「下個月再說」是你這個月最常說的話。', default: true },
    ],
  },
];
