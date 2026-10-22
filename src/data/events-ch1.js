// 第一章 新鮮人（22～25 歲）的事件（DESIGN.md §10.6）：一生一次，年紀範圍稍微跨到下一章
// 欄位同 events.js；梗照 §10.5 的準則寫，過時了直接改這裡
const weekday = (s, c) => !c.weekend;
const AGE = [22, 28];

export const CHAPTER1_EVENTS = [
  {
    id: 'ai_weekly_report',
    age: AGE,
    cast: 'boss',
    title: '「用 AI 寫一下就好」',
    text: '王經理：「週報那種東西，你用 AI 寫一下就好啦，年輕人不是最會這個？」',
    condition: weekday,
    choices: [
      { text: '自己寫，順便檢查 AI', effects: { performance: 2, energy: -5 }, result: '你寫完又請 AI 潤稿，最後兩個版本長得一模一樣。', default: true },
      {
        text: '讓 AI 寫完直接交',
        effects: { mood: 4 },
        chance: {
          p: 0.7,
          effects: { performance: 1 },
          result: '王經理：「這週寫得比平常好喔。」你笑得有點心虛。',
          otherwise: { performance: -2, mood: -4 },
          otherwiseResult: 'AI 幫你寫了一個不存在的專案，王經理問那是什麼。',
        },
      },
    ],
  },
  {
    id: 'can_we_talk',
    age: AGE,
    cast: 'boss',
    title: '「方便聊一下嗎？」',
    text: '下午兩點，王經理傳來一句：「方便聊一下嗎？」後面沒有任何說明。',
    condition: weekday,
    choices: [
      { text: '腦內預演被罵十種版本', effects: { mood: -5, energy: -4 }, result: '焦慮了一下午，結果他只是要問便當訂哪家。', default: true },
      { text: '回「方便～」加三個表情', effects: { mood: 2 }, result: '他問你週五要不要團購雞排。你把表情符號收回來了。' },
    ],
  },
  {
    id: 'first_rent',
    age: AGE,
    title: '第一次自己租房',
    text: '終於要搬出來住了。仲介帶你看了一間雅房：「空間精巧，機能完善。」',
    choices: [
      { text: '租雅房，省錢', effects: { money: -8000, mood: -2 }, result: '床的旁邊就是門，門的旁邊就是牆。精巧，真的很精巧。', default: true },
      { text: '咬牙租套房', effects: { money: -18000, mood: 8 }, result: '有自己的浴室，人生第一次覺得自己像個大人。存款不像。' },
      { text: '「我覺得家裡也不錯」', effects: { mood: 3 }, result: '媽媽很開心，但每天問你幾點回家。' },
    ],
  },
  {
    id: 'reunion_salary',
    age: AGE,
    title: '同學會比薪水',
    text: '大學同學會，才坐下五分鐘，就有人問：「欸你們現在月薪多少？」',
    choices: [
      { text: '老實說', effects: { mood: -5 }, result: '說完才知道有人在竹科，年終是你的一整年。' },
      { text: '「還在摸索啦」', effects: { mood: 1 }, result: '大家都說「還在摸索」，原來全班都在摸索。', default: true },
      { text: '狂吃不講話', effects: { money: -800, mood: 5 }, result: '你吃了三盤炸物，成為今晚唯一的贏家。' },
    ],
  },
  {
    id: 'friend_sos',
    age: AGE,
    title: '「急！在線等」',
    text: '大學朋友半夜傳訊息：「急！在線等！Excel 怎麼讓兩欄合在一起？」',
    choices: [
      { text: '熬夜遠端教學', effects: { energy: -8, mood: 3 }, result: '教完已經一點，他回了一個「讚」就下線了，從此消失。' },
      { text: '丟一個教學影片連結', effects: { mood: 1 }, result: '他說：「太長了，你直接幫我弄好嗎？」', default: true },
      { text: '假裝已經睡了', effects: { energy: 2 }, result: '隔天看到他在脆上發文：「求救一整晚沒人理，人情好冷。」' },
    ],
  },
  {
    id: 'group_read_no_reply',
    age: AGE,
    cast: 'xiaomei',
    title: '「收到」要不要加波浪？',
    text: '王經理在群組貼公告，大家都回了「收到」。輪到你，你突然不確定該回「收到」「收到～」還是「收到！」',
    condition: weekday,
    choices: [
      { text: '「收到～」', effects: { mood: 1 }, result: '小美私訊你：「加波浪比較不兇喔，你很懂。」', default: true },
      { text: '「收到！」', effects: { performance: 1 }, result: '王經理覺得你很有幹勁，交給你三件事。' },
      { text: '已讀不回', chance: { p: 0.5, effects: { mood: -4 }, result: '王經理在群組點名：「還有人沒回喔～」', otherwise: { mood: 3 }, otherwiseResult: '沒人發現。你學會了職場隱身術。' } },
    ],
  },
  {
    id: 'introvert_mc',
    age: AGE,
    cast: 'xiaomei',
    title: 'i 人被抽中當主持',
    text: '小美：「尾牙主持人用抽籤的喔！恭喜你！」你是全部門最 i 的人。',
    condition: (s, c) => !c.weekend && c.month >= 10, // 尾牙前幾個月
    choices: [
      { text: '硬著頭皮上', effects: { mood: -4, energy: -8, performance: 2 }, result: '你全程看稿，但講到冷笑話時大家居然笑了。e 人說你很有潛力。' },
      { text: '跟阿凱換', effects: { mood: 3 }, result: '阿凱用一杯珍奶的代價接下主持，然後把你排進表演節目。', default: true },
    ],
  },
];
