// 班底故事線（DESIGN.md §5.5、§10.6）：班底跟著你一起變老，一條故事線是好幾張依序出現的卡
// 每一步要等上一步出現過、而且隔一段時間；story 讓抽選權重加倍（EVENTS.storyWeight），免得錯過年紀就斷掉
const weekday = (s, c) => !c.weekend;
const seen = (s, id) => (s.events.counts[id] ?? 0) > 0;
const after = (id, days) => s => seen(s, id) && s.day - s.events.last[id] >= days;
const both = (...fns) => (s, c) => fns.every(f => f(s, c));

// 班底離開公司以後，辦公室裡的事件就不再找他（events.js 套用到有 cast 的一般事件）
export const CAST_PRESENT = {
  akai: s => !seen(s, 'akai_drink_shop') || seen(s, 'akai_comeback'),
  xiaomei: s => !seen(s, 'xiaomei_quit'),
  boss: s => !seen(s, 'boss_farewell'),
};

const akaiShopDone = s => seen(s, 'akai_shop_boom') || seen(s, 'akai_shop_bust');

export const CAST_EVENTS = [
  // ── 😪 阿凱：想離職 → 開手搖飲店 → 爆紅或倒了 → 回來上班 → 約你爬山 ──
  {
    id: 'akai_job_hunt',
    story: 'akai',
    age: [23, 28],
    cast: 'akai',
    title: '阿凱想離職',
    text: '午休時阿凱小聲說：「我在偷偷找工作，你要不要一起看看？」',
    condition: s => s.day > 120,
    choices: [
      { text: '聽他說說看', effects: { mood: 3 }, result: '他說想開一家店，「當自己的老闆，就不用聽王經理說簡單改一下了。」' },
      { text: '勸他再撐一下', effects: { mood: -1 }, result: '阿凱：「好吧，再撐一年。」他說這句話已經三年了。', default: true },
    ],
  },
  {
    id: 'akai_drink_shop',
    story: 'akai',
    age: [27, 33],
    cast: 'akai',
    title: '阿凱要開手搖飲店',
    text: '阿凱遞出辭呈，約你吃飯：「我要開手搖飲店了！要不要投資 5 萬？當股東，以後喝飲料免費。」',
    condition: after('akai_job_hunt', 500),
    choices: [
      {
        text: '投資 5 萬',
        effects: { money: -50000, mood: 4 },
        flags: { akaiInvested: true },
        hint: s => (s.money < 50000 ? '存款不夠 5 萬，會先掏空存款' : ''),
        result: '阿凱抱著你說：「兄弟／姊妹，我不會讓你失望的。」你決定先不去看那條街上已經有幾家手搖店。',
      },
      { text: '開幕去捧場就好', effects: { money: -500, mood: 4 }, result: '你點了一杯招牌，喝起來很像別家的招牌。阿凱說這叫「致敬」。', default: true },
      { text: '「那條街已經有 12 家了耶」', effects: { mood: 1 }, result: '阿凱：「所以大家都知道要去那條街買飲料啊！」你竟然無法反駁。' },
    ],
  },
  {
    id: 'akai_shop_boom',
    story: 'akai',
    age: [31, 38],
    cast: 'akai',
    title: '阿凱的店爆紅了',
    text: '阿凱的店推出「肝苦人特調」，在脆上爆紅，門口排了一百公尺。他打電話給你，聲音在發抖。',
    condition: both(after('akai_drink_shop', 900), s => !akaiShopDone(s)),
    choices: [
      {
        text: '去店裡恭喜他',
        effects: s => (s.flags.akaiInvested ? { money: 150000, mood: 15 } : { mood: 6 }),
        result: '阿凱：「有投資的，分紅已經匯過去了。沒投資的……這杯請你。」他把整條街的生意都搶走了。',
        default: true,
      },
      { text: '「肝苦人特調是我的人生」', effects: { mood: 8 }, result: '阿凱說這杯的靈感就是你。你不知道該驕傲還是難過。' },
    ],
  },
  {
    id: 'akai_shop_bust',
    story: 'akai',
    age: [31, 38],
    cast: 'akai',
    title: '阿凱的店收了',
    text: '阿凱傳來一張照片：店門口貼著「頂讓」。後面跟著一句：「出來喝一杯嗎？」',
    condition: both(after('akai_drink_shop', 900), s => !akaiShopDone(s)),
    choices: [
      { text: '陪他喝到天亮', effects: { money: -1500, energy: -10, mood: 4 }, result: '阿凱說：「至少我當過三年老闆。」你說：「至少你不用再聽客人說半糖少冰去冰微糖。」他笑了。', default: true },
      { text: '幫他寫履歷', effects: { energy: -5, mood: 3 }, result: '他的履歷上寫：「創業經驗：三年。」你幫他改成「營運管理：三年」。聽起來好多了。' },
    ],
  },
  {
    id: 'akai_comeback',
    story: 'akai',
    age: [38, 47],
    cast: 'akai',
    title: '阿凱回來了',
    text: '新同事報到，座位就在你隔壁。他放下包包：「好久不見。外面繞了一圈，還是這裡的冷氣最涼。」是阿凱。',
    condition: both(akaiShopDone, s => s.day - Math.max(s.events.last.akai_shop_boom ?? -Infinity, s.events.last.akai_shop_bust ?? -Infinity) >= 1000, weekday),
    choices: [
      { text: '「歡迎回來」', effects: { mood: 8 }, result: '第一天他就教新人怎麼看起來很忙。有些東西，繞了一圈都不會變。', default: true },
      { text: '「這次換我教你摸魚」', effects: { mood: 10, performance: -1 }, result: '阿凱很感動：「你出師了。」你們一起看著 Excel 滑手機。' },
    ],
  },
  {
    id: 'akai_hiking',
    story: 'akai',
    age: [55, 66],
    cast: 'akai',
    title: '阿凱約你爬山',
    text: '阿凱提早退休了，每天早上傳山頂的照片給你：「這週六一起來吧，這裡沒有群組，也沒有 KPI。」',
    condition: after('akai_comeback', 1500),
    choices: [
      { text: '去爬', effects: { energy: -8, energyMax: 2, mood: 12 }, result: '山頂上你們吃著御飯糰，聊起當年那個 50 個分頁的 Excel。阿凱說：「那時候真好。」你說：「現在也很好。」', default: true },
      { text: '「等我退休」', effects: { mood: 2 }, result: '阿凱說：「那我先幫你佔一個位置。」他傳了一張石頭的照片：「這是你的。」' },
    ],
  },

  // ── 🙋 小美：結婚 → 產假 → 離職經營團購 → 團購帝國 → 小孩來實習 ──
  {
    id: 'xiaomei_wedding',
    story: 'xiaomei',
    age: [26, 32],
    cast: 'xiaomei',
    title: '小美的喜帖',
    text: '小美笑得很燦爛，遞給你一張粉紅色的喜帖：「下個月，一定要來喔！」',
    condition: weekday,
    choices: [
      { text: '包大紅包', effects: { money: -3600, mood: 8 }, result: '婚禮上小美哭得很慘，阿凱也哭了。你們都不知道阿凱為什麼哭。', default: true },
      { text: '人到就好', effects: { money: -2000, mood: 4 }, result: '你吃到了傳說中的龍蝦。小美說她記得每個人包多少。你希望她是開玩笑的。' },
    ],
  },
  {
    id: 'xiaomei_maternity',
    story: 'xiaomei',
    age: [29, 35],
    cast: 'xiaomei',
    title: '小美請產假',
    text: '小美挺著肚子交接：「這三個月我的工作先交給你！福委、團購群、訂飲料，都在這份清單裡。」清單有四頁。',
    condition: both(after('xiaomei_wedding', 365), weekday),
    choices: [
      {
        text: '全部接下來',
        effects: { performance: 3, mood: -3 },
        forceSlots: { activity: 'overtime', weeks: 2, slots: [1, 3] },
        result: '你才知道小美一個人做了五個人的事。訂飲料群組每天問你：「今天喝什麼？」',
      },
      { text: '跟大家分著做', effects: { management: 2, mood: 1 }, result: '你分配得很好。三個月後小美回來，發現大家都瘦了。', default: true },
    ],
  },
  {
    id: 'xiaomei_quit',
    story: 'xiaomei',
    age: [32, 39],
    cast: 'xiaomei',
    title: '小美要離職了',
    text: '小美：「我要離職了！我想在家帶小孩，順便經營團購社團。」她已經有三千個成員了。',
    condition: both(after('xiaomei_maternity', 300), weekday),
    choices: [
      { text: '幫她辦歡送會', effects: { money: -800, mood: 6 }, result: '歡送會上，小美用團購價幫大家訂了蛋糕。她連自己的歡送會都在團購。', default: true },
      { text: '加入她的社團', effects: { mood: 4, money: -1200 }, result: '加入第一天你就跟了三團。小美說你是 VIP。你的錢包說你是受害者。' },
    ],
  },
  {
    id: 'xiaomei_empire',
    story: 'xiaomei',
    age: [42, 51],
    cast: 'xiaomei',
    title: '小美的團購帝國',
    text: '小美的團購社團有二十萬人了，她還出了自有品牌。她打給你：「要不要幫我們拍一支上班族代言影片？」',
    condition: after('xiaomei_quit', 1500),
    choices: [
      { text: '拍！', effects: { money: 20000, mood: 8, energy: -5 }, result: '影片標題：「資深社畜也推薦的雞蛋糕」。你在留言區被叫「社畜代表」，竟然有點驕傲。', default: true },
      { text: '「我不上鏡啦」', effects: { mood: 2 }, result: '小美寄了一箱雞蛋糕給你：「那這箱幫我試吃。」你吃了一週。' },
    ],
  },
  {
    id: 'xiaomei_kid_intern',
    story: 'xiaomei',
    age: [52, 63],
    cast: 'xiaomei',
    title: '小美的小孩來實習',
    text: '新的實習生報到，自我介紹：「我媽媽說，叫我來找你。」是小美的小孩，長得跟她一模一樣。',
    condition: both(after('xiaomei_empire', 1000), weekday),
    choices: [
      { text: '好好帶她／他', effects: { management: 3, mood: 8, energy: -5 }, result: '第一天他就在群組問大家要不要團購雞蛋糕。有些東西會遺傳。', default: true },
      { text: '告訴他媽媽當年的糗事', effects: { mood: 10 }, result: '他笑到不行，回家告訴小美。小美傳來一張貓咪哭哭的貼圖，跟三十年前一模一樣。' },
    ],
  },

  // ── 👔 王經理：升處長 → 想挖你 → 退休 → 在公園跳廣場舞 ──
  {
    id: 'boss_promoted',
    story: 'boss',
    age: [28, 35],
    cast: 'boss',
    title: '王經理升官了',
    text: '公告：王經理升任處長。他的辦公室變大了，但大家還是叫他「王經理」，他自己也是。',
    condition: weekday,
    choices: [
      { text: '去恭喜他', effects: { mood: 2, performance: 1 }, result: '他拍拍你的肩：「以後還是一樣，有事簡單改一下就好。」有些東西升官也不會變。', default: true },
      { text: '「那以後要叫你王處長嗎？」', effects: { mood: 4 }, result: '他想了一下：「叫王經理就好，處長聽起來好像很累。」' },
    ],
  },
  {
    id: 'boss_poach',
    story: 'boss',
    age: [35, 42],
    cast: 'boss',
    title: '王經理想挖你',
    text: '王經理把你叫進辦公室：「我要成立一個新部門，你要不要過來？會比較辛苦，但我需要你。」',
    condition: both(after('boss_promoted', 700), weekday),
    choices: [
      { text: '跟他走', effects: { performance: 3, management: 3, mood: -2, energy: -6 }, result: '新部門什麼都沒有，連印表機都要自己裝。但你第一次覺得，王經理是真的相信你。' },
      { text: '「我想留在原本的地方」', effects: { mood: 3 }, result: '他點點頭：「好，但我的門永遠開著。」然後他把門關上了，因為冷氣會跑掉。', default: true },
    ],
  },
  {
    id: 'boss_farewell',
    story: 'boss',
    age: [45, 54],
    cast: 'boss',
    title: '王經理的退休歡送會',
    text: '王經理要退休了。歡送會上，主持人說：「接下來請跟王經理最久的同事上台說幾句話。」大家都看著你。',
    condition: both(after('boss_poach', 1000), weekday),
    choices: [
      { text: '說一段真心話', effects: { mood: 10 }, result: '你說：「謝謝你當年每一個『簡單改一下』，我才變成現在的我。」王經理哭了。他說他也不知道當年那些到底簡不簡單。', default: true },
      { text: '送他一張「簡單改一下」的匾額', effects: { mood: 12, money: -2000 }, result: '全場笑翻。王經理說要掛在家裡客廳，讓老婆每天看。' },
    ],
  },
  {
    id: 'boss_square_dance',
    story: 'boss',
    age: [55, 66],
    cast: 'boss',
    title: '公園裡的王經理',
    text: '週末去公園散步，遠遠看到一群人在跳廣場舞。最前面帶舞的那個人，是王經理。',
    condition: after('boss_farewell', 700),
    choices: [
      { text: '加入他們', effects: { mood: 10, energy: -4 }, result: '王經理：「來來來，這個動作很簡單，跟著做一下就好。」一點都不簡單。', default: true },
      { text: '偷拍傳給阿凱', effects: { mood: 6 }, result: '阿凱秒回：「他終於找到適合他的 KPI 了。」' },
    ],
  },

  // ── 👩 媽媽：學會貼圖 → 住院 → 要不要搬回家 → 聊你小時候 ──
  {
    id: 'mom_stickers',
    story: 'mom',
    age: [30, 37],
    cast: 'mom',
    title: '媽媽學會用貼圖',
    text: '媽媽學會買 LINE 貼圖了。今天她傳了 27 張貼圖給你，一個字都沒有。',
    choices: [
      { text: '回她一整套', effects: { mood: 6 }, result: '你們用貼圖聊了一小時。最後她傳了一張「晚安」，你們都沒說什麼，但好像說了很多。', default: true },
      { text: '打電話問她怎麼了', effects: { mood: 4 }, result: '她說：「沒事啊，就是想讓你看看我新買的貼圖。」她買了 12 套。' },
    ],
  },
  {
    id: 'mom_hospital',
    story: 'mom',
    major: true,
    age: [38, 47],
    cast: 'mom',
    title: '媽媽住院了',
    text: '凌晨接到電話，媽媽輕微中風住院了。醫生說發現得早，但需要住院觀察一段時間，出院後也要有人陪著復健。',
    condition: after('mom_stickers', 1000),
    choices: [
      {
        text: '請假自己照顧',
        effects: { energy: -15, mood: -4, performance: -2, money: -5000 },
        result: '你在病房陪了兩週，學會了換尿布、餵藥和跟隔壁床的阿伯聊天。媽媽說你笨手笨腳的，但每天都說「你來了喔」。',
      },
      { text: '請看護，下班去看她', effects: { money: -60000, energy: -6, mood: -2 }, result: '每天下班趕去醫院，看護阿姨比你還了解媽媽的口味。媽媽偷偷跟你說：「她煮的稀飯比你好吃。」', default: true },
      { text: '跟家人排班輪流', effects: { money: -20000, energy: -10, mood: -2 }, result: '家族群組第一次不是傳長輩圖，而是在排班。媽媽說：「你們吵什麼，我好得很。」' },
    ],
  },
  {
    id: 'mom_move_home',
    story: 'mom',
    major: true,
    age: [45, 56],
    cast: 'mom',
    title: '要不要搬回家住？',
    text: '媽媽出院後恢復得不錯，但一個人住你還是不放心。她說：「我自己可以啦。」說完把藥盒弄掉了。',
    condition: after('mom_hospital', 365),
    choices: [
      { text: '搬回家', effects: { mood: 4, energy: -4 }, result: '回到從小住的房間，牆上還貼著國中的獎狀。媽媽每天問你幾點回家，你發現自己不再覺得煩了。' },
      { text: '搬到附近', effects: { money: -10000, mood: 3 }, result: '走路五分鐘的距離。每天晚上她都「剛好煮太多」，叫你過來吃。', default: true },
      { text: '裝視訊鏡頭', effects: { money: -3000, mood: -1 }, result: '她第一天就學會對鏡頭比讚。第二天就學會把它轉向牆壁。' },
    ],
  },
  {
    id: 'mom_old_stories',
    story: 'mom',
    age: [55, 66],
    cast: 'mom',
    title: '你小時候',
    text: '吃完晚飯，媽媽翻出一本舊相簿：「你看你小時候，每天都說長大要當老闆。」',
    condition: after('mom_move_home', 700),
    choices: [
      { text: '陪她一頁一頁看', effects: { mood: 12 }, result: '你們看到很晚。最後一頁是你第一天上班穿西裝的照片，她說：「那天我在門口看你走了好久。」', default: true },
      { text: '「我沒當老闆，對不起喔」', effects: { mood: 8 }, result: '媽媽笑了：「當什麼都好，你現在這樣就很好。」' },
    ],
  },
];
