// 第五章 下半場（50～65 歲）的事件（DESIGN.md §10.6）：一生一次
const weekday = (s, c) => !c.weekend;
const AGE = [50, 66];

export const CHAPTER5_EVENTS = [
  {
    id: 'pension_calc',
    age: AGE,
    title: '退休金試算',
    text: '你打開政府的退休金試算網站，輸入年資和薪水，按下「計算」。',
    choices: [
      { text: '看結果', effects: { mood: -4 }, result: '看完你又按了一次「計算」，好像多按幾次會變多。' },
      { text: '去找理財講座', effects: { money: -1500, mood: 2 }, result: '講師說退休要準備 2,000 萬。全場的人一起深呼吸。', default: true },
      { text: '「我要工作到 80 歲」', effects: { mood: 3, performance: 1 }, result: '主管聽到了，很感動。你說是開玩笑的，他說他當真了。' },
    ],
  },
  {
    id: 'internal_lecturer',
    age: AGE,
    title: '當內部講師',
    text: '人資小林：「公司想請你當內部講師，分享這些年的經驗。」台下坐著一群跟你當年一樣年輕的人。',
    condition: weekday,
    cast: 'hr',
    choices: [
      { text: '認真準備一堂課', effects: { energy: -10, management: 3, mood: 6 }, result: '你講了「簡單改一下的十種應對」，問卷滿分。有人說這是他上過最實用的課。' },
      { text: '直接講故事', effects: { mood: 4 }, result: '你講了 90 分鐘的「我們那時候」。沒有人睡著，因為大家都在偷錄給朋友聽。', default: true },
    ],
  },
  {
    id: 'handover_doc',
    age: AGE,
    title: '寫交接文件',
    text: '主管：「你先開始寫交接文件吧，以防萬一。」你打開空白文件，不知道從哪裡寫起。',
    condition: weekday,
    choices: [
      { text: '認真寫', effects: { energy: -8, performance: 2 }, result: '寫了二十頁才發現，很多事只有你知道，例如印表機要先拍左邊再按開關。', default: true },
      { text: '寫一句「有問題打給我」', effects: { mood: 3 }, result: '主管說這樣不行。你補了一句：「沒接就是在爬山。」' },
    ],
  },
  {
    id: 'classmates_retire',
    age: AGE,
    title: '同學一個個退休了',
    text: '同學群組又有人宣布：「今天是我最後一天上班！」底下一排「恭喜」和「羨慕」。',
    choices: [
      { text: '真心恭喜', effects: { mood: -2 }, result: '他隔天在群組貼了下午三點的海邊照片。你在會議室按了愛心。', default: true },
      { text: '問他退休後都在幹嘛', effects: { mood: 3 }, result: '他說：「早上爬山，下午睡覺，晚上想不起來今天星期幾。」你很想要那種生活。' },
    ],
  },
  {
    id: 'community_college',
    age: AGE,
    title: '社區大學',
    text: '社區大學的招生簡章：書法、攝影、烏克麗麗、Python 入門。你突然很想當學生。',
    choices: [
      { text: '報 Python 入門', effects: { money: -3500, programming: 4, energy: -4 }, result: '你是全班年紀最大的，也是全班最認真的。老師說你的作業最有註解。' },
      { text: '報烏克麗麗', effects: { money: -3500, mood: 8 }, result: '你學會了一首生日快樂歌，然後在每個人的生日彈。大家都很感動，也都很想阻止你。', default: true },
      { text: '下次再說', effects: { mood: -1 }, result: '你把簡章貼在冰箱上。它陪了你一整年。' },
    ],
  },
  {
    id: 'early_retirement_offer',
    age: [55, 64],
    cast: 'hr',
    title: '優退方案',
    text: '人資小林低調地遞給你一份文件：「公司有優退方案，你可以參考看看。」',
    condition: weekday,
    choices: [
      { text: '認真算一算', effects: { mood: -2 }, result: '算完發現再待幾年比較划算。但你開始每天看那份文件，像在看一張機票。（退休 v0.6 開放）', default: true },
      { text: '「我還想看看接下來的新人」', effects: { mood: 4, performance: 1 }, result: '小林笑了：「你當年也是這樣的新人。」' },
    ],
  },
  {
    id: 'head_table',
    age: AGE,
    title: '婚禮坐主桌',
    text: '年輕同事要結婚了，喜帖附註：「主桌，請上台致詞。」你第一次以長官的身分出席。',
    choices: [
      { text: '寫一份感人的致詞', effects: { energy: -4, mood: 8, money: -3600 }, result: '你講到一半哽咽了，新人也哭了。你們都不知道為什麼，但很美。' },
      { text: '「祝你們白頭偕老」就下台', effects: { money: -3600, mood: 3 }, result: '最短的致詞，最熱烈的掌聲。大家都餓了。', default: true },
    ],
  },
  {
    id: 'last_project',
    age: [60, 66],
    title: '退休前最後一個案子',
    text: '主管：「這是你退休前最後一個案子，交給你我最放心。」你看著需求單，上面寫著：「簡單改一下就好」。',
    condition: weekday,
    choices: [
      { text: '漂亮地收尾', effects: { energy: -12, performance: 3, mood: 8 }, result: '你改完了。這一次，真的很簡單。因為你已經改了四十年。' },
      { text: '交給新人，在旁邊看', effects: { management: 3, mood: 5 }, result: '新人改到半夜，你在旁邊泡茶。你終於懂當年的王經理了。', default: true },
    ],
  },
  {
    id: 'business_cards',
    age: [58, 66],
    title: '整理歷年名片',
    text: '整理抽屜時翻出一整盒名片，從「助理專員」到現在，還有好多已經不存在的公司。',
    choices: [
      { text: '做成一本名片冊', effects: { mood: 8 }, result: '你一張一張貼上去，像在翻自己的人生。最舊的那張，名字還印錯了。', default: true },
      { text: '一張一張打給他們', effects: { mood: 5, energy: -6 }, result: '一半是空號，一半說「你誰？」，有一個人記得你，你們約了吃飯。' },
    ],
  },
  {
    id: 'slang_quiz',
    age: AGE,
    title: '流行語小考',
    text: '年輕同事在聊天：「這個超有感」「他很 chill」「我直接破防」。他們轉頭問你：「你懂嗎？」',
    choices: [
      { text: '誠實說不懂', effects: { mood: 2 }, result: '他們很興奮地教你，下課前你學會了三個。隔天它們都過時了。', default: true },
      { text: '「我直接破防」', effects: { mood: 5 }, result: '全場安靜一秒，然後爆笑。用法完全錯了，但你成了今天的梗。' },
    ],
  },
  {
    id: 'reverse_mentor',
    age: AGE,
    title: '反向導師',
    text: '公司推出「反向導師計畫」：由年輕同事教資深員工用新工具。你的導師今年 24 歲。',
    condition: weekday,
    choices: [
      { text: '認真上課', effects: { programming: 2, mood: 3 }, result: '他教你做短影音。你的第一支影片拍了一百次，點閱 12，其中 11 次是你自己。', default: true },
      { text: '反過來教他職場生存術', effects: { management: 2, mood: 4 }, result: '他學會了「好的，我確認一下」。你們都覺得這堂課很值得。' },
    ],
  },
  {
    id: 'retirement_dream',
    age: AGE,
    title: '退休後要幹嘛？',
    text: '午休時你開始想：退休以後要做什麼？開咖啡店？環島？還是終於可以睡到自然醒？',
    choices: [
      { text: '開咖啡店', effects: { mood: 4 }, result: '你查了一下店租，決定改成「在家煮咖啡給自己喝」。也是一間店，只是客人只有你。' },
      { text: '環島', effects: { mood: 6 }, result: '你開始在 Google 地圖上存景點。存到第 200 個，決定分十次去。' },
      { text: '睡到自然醒', effects: { mood: 3, energy: 4 }, result: '你今天午休就先練習了。很成功。', default: true },
    ],
  },
  {
    id: 'office_move',
    age: AGE,
    title: '辦公室搬家',
    text: '公司要搬到新大樓，整理抽屜時翻出你 22 歲的員工證。照片裡的人頭髮好多。',
    condition: weekday,
    choices: [
      { text: '傳給大家看', effects: { mood: 6 }, result: '年輕同事說：「哇，好青春！」你決定把這句當作讚美。', default: true },
      { text: '默默收進口袋', effects: { mood: 3 }, result: '新辦公室的抽屜裡，你把它放在最上面。' },
    ],
  },
  {
    id: 'hiking_club',
    age: AGE,
    title: '爬山社團',
    text: '朋友拉你進爬山社團，群組每天早上五點就有人在報到：「出發！」',
    choices: [
      { text: '跟著去爬', effects: { energy: -8, energyMax: 3, mood: 8 }, result: '你爬到山頂，和一群穿螢光色外套的長輩合照。原來你也是長輩了。' },
      { text: '在群組幫大家按讚', effects: { mood: 1 }, result: '你成為群組裡最活躍的「精神成員」。', default: true },
    ],
  },
];
