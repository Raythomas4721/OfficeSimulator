// 第二章 闖蕩（25～30 歲）的事件（DESIGN.md §10.6）：一生一次，年紀範圍稍微跨到下一章
const weekday = (s, c) => !c.weekend;
const AGE = [25, 32];

export const CHAPTER2_EVENTS = [
  {
    id: 'million_salary_post',
    age: AGE,
    title: '脆上的年薪百萬文',
    text: '睡前滑脆：「27 歲，年薪破百萬，分享我的心路歷程。」底下三千個愛心。',
    choices: [
      { text: '點進去認真看', effects: { mood: -6, performance: 1 }, result: '看完才發現他家是開公司的。心路歷程的第一步是出生。' },
      { text: '滑走', effects: { mood: -1 }, result: '下一篇是「25 歲存到 300 萬」。演算法很懂怎麼傷你。', default: true },
      { text: '留言「恭喜，請問有缺乾弟／乾妹嗎」', effects: { mood: 5 }, result: '你的留言比本文還多讚。' },
    ],
  },
  {
    id: 'stock_buddy',
    age: AGE,
    title: '朋友揪你存股',
    text: '朋友：「存股啦！每個月扣一點，長期持有，時間會幫你賺錢。」',
    choices: [
      {
        text: '開戶，每月定期定額',
        effects: { money: -10000, mood: 2 },
        chance: { p: 0.6, effects: { money: 13000, mood: 4 }, result: '一年後真的賺了一點。你開始在脆上教別人「長期持有」。', otherwise: { money: 8000, mood: -3 }, otherwiseResult: '第三天就跌了，你每天開 App 看十次，最後認賠賣掉。' },
      },
      { text: '先觀望', result: '朋友：「你會後悔的。」你們約好一年後再看誰後悔。', default: true },
    ],
  },
  {
    id: 'gym_sales',
    age: AGE,
    title: '健身房業務的熱情',
    text: '路過健身房被攔下：「今天簽約送三堂教練課！你骨架很適合練喔！」',
    choices: [
      { text: '簽兩年約', effects: { money: -24000, energyMax: 3, mood: 3 }, result: '辦完卡的那一刻最有運動的感覺。之後去了幾次，你不想算。' },
      { text: '「我回去考慮」', effects: { mood: 1 }, result: '業務加了你 LINE，之後每週一問候你的骨架。', default: true },
      { text: '假裝在講電話快步走過', effects: { energy: -1 }, result: '你對著沒有在通話的手機說了五分鐘「好好好」。' },
    ],
  },
  {
    id: 'best_man',
    age: AGE,
    title: '被邀請當伴郎／伴娘',
    text: '好朋友要結婚了：「你一定要來當我的伴郎／伴娘！」包紅包、租禮服、還要練舞。',
    choices: [
      { text: '義不容辭', effects: { money: -6600, energy: -10, mood: 10 }, result: '你在婚禮上跳了一段被錄下來的舞，從此是家族群組的傳說。' },
      { text: '只當賓客', effects: { money: -3600, mood: 3 }, result: '坐在台下看朋友哭得亂七八糟，你也有點想哭。', default: true },
    ],
  },
  {
    id: 'headhunter_call',
    age: AGE,
    title: '第一次被獵頭聯絡',
    text: 'LinkedIn 跳出訊息：「您好，我們有一個非常適合您的機會。」你第一次被獵頭找上門。',
    choices: [
      { text: '聊聊看', effects: { mood: 6 }, result: '最後沒換工作，但知道自己有市場，走路都有風。（轉職 v0.5 開放）' },
      { text: '已讀', effects: { mood: 2 }, result: '截圖傳給阿凱炫耀，他說他上週也收到了。', default: true },
    ],
  },
  {
    id: 'quiet_quitting',
    age: AGE,
    cast: 'akai',
    title: '安靜離職',
    text: '阿凱：「聽過安靜離職嗎？不用真的辭職，只做份內的事就好。」',
    condition: weekday,
    choices: [
      { text: '試一週看看', effects: { mood: 8, performance: -2 }, result: '準時下班一週，晚餐變好吃了，王經理的眉頭變深了。' },
      { text: '我還有夢想', effects: { performance: 1, mood: -1 }, result: '阿凱拍拍你：「夢想的薪水另計喔。」', default: true },
    ],
  },
  {
    id: 'massage_gun',
    age: AGE,
    title: '演算法推坑',
    text: '滑了三秒按摩槍的影片，接下來一週你的動態全部都是按摩槍。',
    choices: [
      { text: '買了', effects: { money: -3500, mood: 5 }, result: '用了兩週，現在它是一個很好用的曬衣架。' },
      { text: '狂按「不感興趣」', effects: { mood: -1 }, result: '演算法改推你按摩椅。它覺得你只是嫌太便宜。', default: true },
    ],
  },
  {
    id: 'ex_wedding_story',
    age: AGE,
    title: '限動看到前任',
    text: '半夜滑限動，看到前任穿著婚紗的照片。演算法到底在想什麼。',
    choices: [
      { text: '默默按愛心', effects: { mood: -3 }, result: '按完你才想到，對方會看到。你盯著天花板到三點。' },
      { text: '滑走，去吃消夜', effects: { money: -200, mood: 2 }, result: '鹹酥雞不會離開你。', default: true },
      { text: '封鎖演算法（關掉 App）', effects: { mood: 4, energy: 3 }, result: '你早早睡了。這是今年最成熟的決定。' },
    ],
  },
  {
    id: 'return_to_office',
    age: AGE,
    cast: 'boss',
    title: '大家回辦公室吧',
    text: '公司公告：「為了促進交流，從下個月起全員回辦公室上班。」',
    condition: weekday,
    choices: [
      { text: '乖乖回去', effects: { mood: -3, performance: 1 }, result: '回來第一天，大家都戴著耳機用 Teams 開會。交流促進了。', default: true },
      { text: '在問卷寫三百字心得', effects: { mood: 3 }, result: '人資小林說謝謝你的意見。意見被收進一個叫「意見」的資料夾。' },
    ],
  },
  {
    id: 'japan_or_save',
    age: AGE,
    title: '日本自由行還是存錢',
    text: '機票特價，大阪來回 6,999。朋友在群組敲碗：「走啦！」',
    choices: [
      { text: '說走就走', effects: { money: -30000, mood: 15, energy: -4 }, result: '回來行李箱比去的時候重八公斤，存款輕了三萬。值得。' },
      { text: '存錢', effects: { mood: -3 }, result: '朋友每天在限動曬拉麵。你吃著超商的拉麵按愛心。', default: true },
    ],
  },
  {
    id: 'million_by_thirty',
    age: [27, 31],
    title: '30 歲前存到 100 萬？',
    text: '影片標題：「30 歲前沒存到 100 萬，你就輸了。」你打開網銀看了一下。',
    choices: [
      { text: '開始記帳', effects: { mood: -2, money: 3000 }, result: '記了一個月，發現最大的支出是「不知道」。', default: true },
      { text: '「我就爛」', effects: { mood: 5 }, result: '你輸了，但你還有心情。心情不能存，但你決定先存心情。' },
    ],
  },
  {
    id: 'coffee_mlm',
    age: AGE,
    title: '老同學約喝咖啡',
    text: '好久不見的同學約你喝咖啡，聊了十分鐘，他拿出一份「改變人生的機會」。',
    choices: [
      { text: '聽他說完', effects: { energy: -6, mood: -4 }, result: '兩小時後你只記得「被動收入」四個字。咖啡是你付的。' },
      { text: '「我先去一下廁所」', effects: { mood: 2 }, result: '你從廁所直接走了。這是你人生第一次落跑。', default: true },
    ],
  },
  {
    id: 'succulent',
    age: AGE,
    title: '養多肉植物',
    text: '聽說多肉植物很好養，三週不澆水都沒關係。你買了一盆放在桌上。',
    choices: [
      { text: '每天澆水，好好照顧', effects: { mood: -2 }, result: '它被你澆死了。多肉需要的不是愛，是放生。' },
      { text: '照網路說的放著不管', effects: { mood: 3 }, result: '它活得比你還好。你開始思考誰才是植物。', default: true },
    ],
  },
  {
    id: 'introvert_organizer',
    age: AGE,
    cast: 'xiaomei',
    title: '部門活動交給你辦',
    text: '福委會輪值抽籤，小美興奮地宣布：「這次部門活動由你辦！」你是全部門最 i 的人。',
    condition: weekday,
    choices: [
      { text: '認真辦一場密室逃脫', effects: { energy: -10, mood: 2, performance: 2, management: 2 }, result: '王經理卡在第一關一小時，這是大家最開心的一天。' },
      { text: '辦「下午茶＋提早下班」', effects: { mood: 6 }, result: '史上最高滿意度。i 人的智慧：最好的活動就是沒有活動。', default: true },
    ],
  },
];
