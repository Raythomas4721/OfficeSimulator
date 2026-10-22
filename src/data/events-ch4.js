// 第四章 中年（40～50 歲）的事件（DESIGN.md §10.6）：一生一次，年紀範圍稍微跨到下一章
const weekday = (s, c) => !c.weekend;
const AGE = [40, 52];

export const CHAPTER4_EVENTS = [
  {
    id: 'presbyopia',
    age: AGE,
    title: '老花眼報到',
    text: '看手機時，你發現自己的手越伸越遠。眼科醫生說：「老花喔，很正常。」',
    choices: [
      { text: '配一副老花眼鏡', effects: { money: -3000, mood: -2 }, result: '戴上去的那一刻，世界清楚了，你也老了。', default: true },
      { text: '把手機字體調到最大', effects: { mood: 2 }, result: '現在一個畫面只放得下五個字。同事從你背後經過都能看到你在聊什麼。' },
    ],
  },
  {
    id: 'midlife_career',
    age: AGE,
    title: '中年轉職的念頭',
    text: '深夜睡不著，你打開人力銀行，搜尋條件：「40 歲以上」「不用加班」「有意義」。結果：0 筆。',
    choices: [
      { text: '去上職涯諮詢', effects: { money: -2500, mood: 4 }, result: '諮詢師說你的強項是「很穩定」。你不知道該不該高興。（轉職 v0.5 開放）' },
      { text: '關掉，明天還要上班', effects: { mood: -2 }, result: '你把搜尋條件存了起來，取名叫「以後」。', default: true },
    ],
  },
  {
    id: 'young_boss',
    age: AGE,
    title: '小你 15 歲的主管',
    text: '新主管報到了，他比你小 15 歲。第一次開會，他說：「我們來對齊一下顆粒度。」',
    condition: weekday,
    choices: [
      { text: '認真學新的說法', effects: { mood: -2, performance: 2 }, result: '你學會了「對齊」「顆粒度」「抓手」。你還是不知道它們是什麼意思，但會用了。' },
      { text: '「好的，我們對齊」', effects: { mood: 2 }, result: '你說得很有自信，他很滿意。職場就是這樣，自信比顆粒度重要。', default: true },
    ],
  },
  {
    id: 'reunion_health',
    age: AGE,
    title: '同學聚會比健檢報告',
    text: '二十年前比成績，十年前比薪水，今年大家拿出手機在比健檢報告。',
    choices: [
      { text: '跟著比', effects: { mood: -3 }, result: '你的尿酸拿了第二名。這是你畢業後第一次拿名次。' },
      { text: '「我們聊點開心的」', effects: { mood: 3 }, result: '大家安靜三秒，然後開始聊退休。這已經是最開心的話題了。', default: true },
    ],
  },
  {
    id: 'labor_insurance_news',
    age: AGE,
    title: '勞保會不會破產？',
    text: '新聞標題：「勞保恐提前破產！」脆上留言：「繳了二十年，到時候領得到嗎？」',
    choices: [
      { text: '認真算自己能領多少', effects: { energy: -4, mood: -4 }, result: '算完以後你決定再算一次，因為第一次的數字太難過了。' },
      { text: '開始存退休金', effects: { money: -10000, mood: 2 }, result: '你開了一個帳戶，名字叫「靠自己」。', default: true },
      { text: '「到時候再說」', effects: { mood: 4 }, result: '到時候的你應該會很生氣。但那是到時候的事。' },
    ],
  },
  {
    id: 'what_is_your_job',
    age: AGE,
    title: '「你的工作到底在做什麼？」',
    text: '姪子寫作業要訪問大人：「你的工作到底在做什麼？」你張開嘴，然後愣住了。',
    choices: [
      { text: '認真解釋', effects: { mood: -2 }, result: '你講了十分鐘，他寫下：「開會、回信、說好的。」好像也沒錯。' },
      { text: '「我在拯救世界」', effects: { mood: 5 }, result: '他寫下「超級英雄」，拿了全班最高分。你覺得這二十年值得了。', default: true },
    ],
  },
  {
    id: 'new_system_rollout',
    age: AGE,
    title: '新系統上線了',
    text: '公司全面換成新的 AI 系統，教育訓練影片 40 分鐘，講師講話的速度是 1.5 倍速。',
    condition: weekday,
    choices: [
      { text: '請年輕同事教你', effects: { mood: -1, programming: 2 }, result: '他教得很耐心。最後一句是「你按這裡就好，其他的不要碰」。', default: true },
      { text: '自己摸索', effects: { energy: -6, programming: 3 }, result: '摸了一下午，你發現最常用的按鈕是「上一步」。', chance: { p: 0.3, effects: { performance: -2 }, result: '你不小心把全部門的報表刪了。還好有備份，但你的名字被寫進了 SOP。' } },
      { text: '繼續用 Excel', effects: { mood: 3, performance: -1 }, result: '你成為公司最後一個 Excel 守護者，大家敬佩又同情。' },
    ],
  },
  {
    id: 'doctor_diet',
    age: AGE,
    title: '醫生叫你減重',
    text: '醫生看著報告：「你要減個 5 公斤喔。」你說好，回家的路上買了一杯全糖珍奶。',
    choices: [
      { text: '認真開始', effects: { mood: -4, energyMax: 3 }, result: '三個月減了 4 公斤。最後那一公斤，你決定讓它留下來陪你。' },
      { text: '從明天開始', effects: { mood: 2 }, result: '明天是一個很美好的日子，所以你決定一直保留它。', default: true },
    ],
  },
  {
    id: 'midlife_crisis',
    age: AGE,
    title: '中年危機',
    text: '你突然很想做點什麼：買重機、學衝浪、組樂團、去西藏。總之不是上班。',
    choices: [
      { text: '去學衝浪', effects: { money: -8000, mood: 12, energy: -10 }, result: '你站起來了兩秒，被浪打下來二十次。那兩秒是你今年最快樂的時刻。' },
      { text: '買一台重機', effects: { money: -150000, mood: 15 }, result: '騎了三次，現在它停在車庫，你每週去擦一次，像在探望它。' },
      { text: '買一把吉他', effects: { money: -5000, mood: 6 }, result: '你學會了三個和弦，這就夠了。中年危機最便宜的解法。', default: true },
    ],
  },
  {
    id: 'mentor_newbie',
    age: AGE,
    title: '帶一個新人',
    text: '主管說：「這個新人交給你帶，你資歷最深。」新人看你的眼神，跟當年的你一模一樣。',
    condition: weekday,
    choices: [
      { text: '把壓箱寶都教給他', effects: { energy: -8, management: 4, mood: 4 }, result: '你教他怎麼看起來很忙。阿凱當年教你的，終於傳下去了。' },
      { text: '「有問題再問我」', effects: { management: 1 }, result: '他一次都沒問。後來你才知道，他都問 AI。', default: true },
    ],
  },
  {
    id: 'doomscroll_3am',
    age: AGE,
    title: '半夜滑脆到三點',
    text: '十一點躺上床，「再滑一下就好」，回過神來已經三點了。你看完了一個陌生人的婚禮、一場吵架，和七個貓咪影片。',
    choices: [
      { text: '放下手機睡覺', effects: { energy: -6 }, result: '你閉上眼睛，腦袋裡還在播貓咪影片。', default: true },
      { text: '既然都三點了，乾脆看完', effects: { energy: -14, mood: 4 }, result: '你知道了很多不需要知道的事。早上的會議，你用意志力撐過去了。' },
    ],
  },
  {
    id: 'office_esports',
    age: AGE,
    title: '年輕同事邀你打電動',
    text: '年輕同事組了電競社：「大哥大姐要不要一起玩？我們缺一個坦。」',
    choices: [
      { text: '玩！', effects: { mood: 8, energy: -6 }, result: '你被打爆了一整晚，但他們說你是最可靠的坦。原來你上班也是在當坦。' },
      { text: '「我在旁邊幫你們加油」', effects: { mood: 3 }, result: '你負責訂消夜。他們說你是最強的輔助。', default: true },
    ],
  },
  {
    id: 'insurance_review',
    age: AGE,
    title: '保單健檢',
    text: '保險業務：「你這個年紀，保障真的不夠喔。萬一……」他停在「萬一」很久。',
    choices: [
      { text: '加保', effects: { money: -20000, mood: 2 }, result: '你買到了安心。安心每年要繳兩萬。' },
      { text: '「我再想想」', effects: { mood: -1 }, result: '他說沒關係，之後每年生日都會傳訊息祝你「健康平安」。', default: true },
    ],
  },
  {
    id: 'twenty_year_trip',
    age: AGE,
    title: '畢業二十週年',
    text: '大學群組沉寂了十年，突然有人說：「畢業二十週年，我們辦一次旅行吧！」',
    choices: [
      { text: '報名', effects: { money: -12000, mood: 12, energy: -6 }, result: '大家都老了，但一喝酒就變回二十歲。隔天也全部變回四十幾歲。' },
      { text: '在群組按讚', effects: { mood: 1 }, result: '最後只有五個人去，照片很好看。你決定下一個十年一定去。', default: true },
    ],
  },
];
