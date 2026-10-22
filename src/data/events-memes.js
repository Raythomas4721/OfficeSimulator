// 不限年紀的時事梗事件（DESIGN.md §10.6）：一生一次，任何章節都可能遇到
// 梗會過時，過時了直接改這裡（§10.5）
const weekday = (s, c) => !c.weekend;

export const MEME_EVENTS = [
  {
    id: 'after_hours_msg',
    cast: 'boss',
    title: '下班後的訊息',
    text: '晚上九點，王經理傳來：「不急，明天再看就好。」後面附了一份 30 頁的簡報。',
    choices: [
      { text: '馬上打開來看', effects: { energy: -6, performance: 2, mood: -3 }, result: '你看完了。他說的「不急」，你的身體不同意。' },
      { text: '真的明天再看', effects: { mood: 2 }, result: '早上打開，他已經傳了第二句：「看了嗎？」', default: true },
      { text: '把手機調成飛航模式', effects: { mood: 5 }, chance: { p: 0.3, effects: { performance: -2 }, result: '飛航模式起飛了，但隔天被問「昨天怎麼找不到你」。' }, result: '你降落在一個沒有訊息的平行世界。' },
    ],
  },
  {
    id: 'guilt_trip',
    cast: 'boss',
    title: '「大家都很辛苦耶」',
    text: '你想請特休，王經理嘆了一口氣：「大家都很辛苦耶，你確定這時候要請？」',
    condition: weekday,
    choices: [
      { text: '那我不請了', effects: { mood: -5, performance: 1 }, result: '你的特休繼續躺在系統裡，跟你一樣累。' },
      { text: '「對啊，所以我要休息一下」', effects: { mood: 6, energy: 8, performance: -1 }, result: '王經理愣住了，然後說好。原來情緒勒索的解法是不接球。', default: true },
    ],
  },
  {
    id: 'meeting_email',
    title: '這個會議可以用一封信解決',
    text: '一小時的會議，前 50 分鐘在等投影機，最後 10 分鐘的結論是「會後再寄信確認」。',
    condition: weekday,
    choices: [
      { text: '認真做會議紀錄', effects: { performance: 1, energy: -3 }, result: '會議紀錄只有一行：「下次再開會討論。」', default: true },
      { text: '在筆記本畫投影機', effects: { mood: 4 }, result: '你畫了一台非常寫實的投影機。這是今天最有產出的時刻。' },
      { text: '提議下次改用 email', effects: { mood: 2 }, result: '大家都同意，於是排了一個會議來討論要不要改用 email。' },
    ],
  },
  {
    id: 'bonus_depends',
    title: '年終「要看公司狀況」',
    text: '有人在會議上問今年年終，主管笑著說：「要看公司狀況喔。」公司狀況是什麼，沒有人知道。',
    condition: (s, c) => !c.weekend && c.month >= 10,
    choices: [
      { text: '默默開始存錢', effects: { mood: -2 }, result: '你把「公司狀況」加進每天的祈禱裡。', default: true },
      { text: '在脆上匿名發文', effects: { mood: 4 }, result: '「我們公司說年終看狀況」，底下 800 則留言：「你們公司跟我們同一家嗎？」' },
    ],
  },
  {
    id: 'group_buy_fail',
    cast: 'xiaomei',
    title: '團購踩雷',
    text: '小美揪的網紅麻辣鍋到了。打開包裝，湯底是一塊很小的固體。',
    choices: [
      { text: '還是煮來吃', effects: { mood: -2 }, result: '味道像加了辣椒的水。大家一起吃完，然後一起去吃鹹酥雞。', default: true },
      { text: '寫一篇負評', effects: { mood: 3 }, result: '你的負評被網紅回覆：「謝謝您的寶貴意見，下次送您一包。」你不想要。' },
      { text: '安慰小美', effects: { mood: 4 }, result: '小美說下次一定不會踩雷，然後貼了下一個團購連結。' },
    ],
  },
  {
    id: 'big_iced_milk',
    title: '大冰奶之爭',
    text: '脆上又在吵：「早餐店的大冰奶到底該不該漲價？」你剛好手上拿著一杯大冰奶。',
    choices: [
      { text: '加入論戰', effects: { mood: -2, energy: -3 }, result: '吵了一個早上，你的大冰奶已經變成常溫奶了。' },
      { text: '默默喝完', effects: { mood: 3 }, result: '不管漲不漲，它都是你早上唯一的快樂。', default: true },
    ],
  },
  {
    id: 'dutch_date',
    title: '約會該不該 AA？',
    text: '朋友傳來一篇脆文：「第一次約會該不該 AA？」底下吵了五千則。朋友問：「你站哪邊？」',
    choices: [
      { text: 'AA', effects: { mood: 1 }, result: '朋友說你很理性。你說主要是因為你沒錢。', default: true },
      { text: '看情況', effects: { mood: 2 }, result: '你說了一段非常有道理的話，朋友說「所以到底是哪邊」。' },
      { text: '「我先要有約會」', effects: { mood: -2 }, result: '朋友沉默了。這是今天最真實的一句話。（戀愛 v0.4 開放）' },
    ],
  },
  {
    id: 'mbti_match',
    cast: 'xiaomei',
    title: 'MBTI 配對',
    text: '小美：「你是什麼 MBTI？我要幫部門做座位配對！」',
    choices: [
      { text: '認真做測驗', effects: { mood: 3, energy: -2 }, result: '你做了三次，得到三個不同的結果。小美說你是「隱藏型人格」。' },
      { text: '「我是上班型人格」', effects: { mood: 4 }, result: '小美把你排在阿凱旁邊：「你們是同一種人。」你們都沒有否認。', default: true },
    ],
  },
  {
    id: 'fire_dream',
    title: '財富自由的夢',
    text: '你看了一支影片：「我 35 歲財富自由，靠的是這三個習慣。」你也想要。',
    choices: [
      { text: '開始照著做', effects: { mood: 2, money: 2000 }, result: '第一個習慣是早上五點起床。你在第二天就放棄了，但省下了一杯咖啡錢。' },
      { text: '算一下自己要幾年', effects: { mood: -5 }, result: '計算機說你可以在 87 歲財富自由。你決定換一台計算機。', default: true },
      { text: '買一張樂透', effects: { money: -50, mood: 3 }, result: '最快的財富自由方案。沒中，但作夢的那兩天很快樂。' },
    ],
  },
  {
    id: 'bento_price',
    title: '便當又漲了',
    text: '公司樓下的便當店貼出公告：「因原物料上漲，即日起調整價格。」雞腿便當從 80 變成 120。',
    condition: weekday,
    choices: [
      { text: '照吃', effects: { money: -600, mood: -1 }, result: '你算了一下，一年多花一萬。這隻雞腿越來越珍貴了。', default: true },
      { text: '開始自己帶便當', effects: { energy: -4, mood: 2, money: 1000 }, result: '第一週很有成就感，第二週你的便當連續五天都是炒蛋。' },
    ],
  },
];
