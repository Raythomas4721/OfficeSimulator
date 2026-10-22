// 事件資料（DESIGN.md §10）。邏輯程式不寫死任何事件，要加事件只改 src/data/ 底下的事件檔
import { FIRST_YEAR_EVENTS } from './events-first-year.js';
import { STUDY_EVENTS } from './events-study.js';
import { CRISIS_EVENTS } from './events-crisis.js';
import { LIFE_EVENTS } from './events-life.js';
import { HOLIDAY_EVENTS } from './events-holidays.js';
import { CHAPTER1_EVENTS } from './events-ch1.js';
import { CHAPTER2_EVENTS } from './events-ch2.js';
import { CHAPTER3_EVENTS } from './events-ch3.js';
import { CHAPTER4_EVENTS } from './events-ch4.js';
import { CHAPTER5_EVENTS } from './events-ch5.js';
import { MEME_EVENTS } from './events-memes.js';
import { CAST_EVENTS, CAST_PRESENT } from './events-cast.js';
import { LOVE_EVENTS } from './events-love.js';
// 事件在一天開始時（06:00）跳出，所以文字用「今天」「昨晚」的角度寫
// c：今天的日曆 { month, date, weekday（0 = 週日）, weekend }
// 欄位：on（劇情事件的日子，見 events-first-year.js）、cast（固定班底，見 cast.js）
// 選項欄位：effects、chance { p, effects, then, result, otherwise, otherwiseResult }、
//           delayed { days, effects }、forceSlots { activity, weeks, slots }、sickLeave、result、default
// effects 可用：money、energy、mood、performance、技能（management、language、programming）、energyMax（體力上限）；
//   illness: 'collapse' 直接病倒、'hospital' 直接住院；effects 和 chance.p 也可以是 s => … 的函式
// hint：選項按鈕下方的說明（s => 文字），例如看技能的成功機率
// crisis：選了之後寫進 state.crisis（被約談、債務協商）；事件的 major: true 代表重大抉擇，離線時停下來
// 工作表現一年大約只累積 36，所以事件的影響控制在 ±1～4；預設選項（離線時自動選）盡量接近中性

const weekday = (s, c) => !c.weekend;

export const EVENT_LIST = [
  {
    id: 'line_at_midnight',
    cast: 'boss',
    title: '深夜的 LINE',
    text: '昨晚 11 點，王經理在工作群組 @ 你：「明天早上要的資料好了嗎？」',
    condition: weekday,
    choices: [
      { text: '馬上回覆並開電腦', effects: { performance: 2, energy: -10, mood: -8 }, result: '王經理回了一個讚。你用一晚的睡眠換到一個讚。' },
      { text: '已讀，明天再說', effects: { mood: -2 }, chance: { p: 0.3, then: 'boss_unhappy' }, result: '應該沒事吧…', default: true },
      { text: '裝作沒看到', effects: { performance: -2, mood: 3 }, result: '眼不見為淨。手機翻過去放，世界就安靜了。' },
    ],
  },
  {
    id: 'simple_change',
    cast: 'boss',
    title: '「簡單改一下就好」',
    text: '王經理拿著需求單走過來：「這個簡單改一下就好，明天要。」',
    condition: weekday,
    choices: [
      { text: '熬夜改完', effects: { performance: 3, energy: -18, mood: -8 }, result: '改到半夜兩點，總算交出去了。' },
      { text: '協商時程', effects: { mood: 1 }, result: '王經理勉強同意延到後天。', default: true },
      { text: '「好的」（內心：簡單你來改）', effects: { mood: 3, energy: -8 }, result: '你面帶微笑改到十點。內心的 OS 比程式碼還長。' },
    ],
  },
  {
    id: 'coworker_quit',
    cast: 'boss',
    title: '同事離職了',
    text: '隔壁組的同事今天提離職，王經理說他手上的工作要分給你。',
    condition: weekday,
    choices: [
      {
        text: '接下來',
        effects: { performance: 3, mood: -5 },
        forceSlots: { activity: 'overtime', weeks: 1, slots: [1, 3] },
        result: '工作量一下子變多了。薪水沒有。',
      },
      { text: '婉拒', effects: { performance: -1, mood: -2 }, result: '王經理臉色不太好看。', default: true },
    ],
  },
  {
    id: 'lunch_invite',
    cast: 'xiaomei',
    title: '同事揪午餐',
    text: '小美：「中午一起去吃那家新開的拉麵？」',
    condition: weekday,
    choices: [
      { text: '一起去', effects: { money: -250, mood: 5 }, result: '拉麵很好吃，聊得很開心。' },
      { text: '自己吃便當', result: '安靜吃完便當，滑了一下手機。i 人的充電時間。', default: true },
      { text: '「我在減肥」', effects: { mood: -1 }, result: '說完你去樓下買了一份雞排。' },
    ],
  },
  {
    id: 'year_end_bonus',
    title: '年終只有一個月',
    text: '年終入帳了，只有一個月。看著存款，心裡有點不是滋味。',
    followUp: true, // 年終發放時考核是 C 才會出現
    choices: [
      { text: '忍一下，明年再拚', effects: { mood: -5 }, result: '深呼吸，明年再說。', default: true },
      { text: '打開人力銀行看看', effects: { mood: 3 }, result: '看了一下職缺，每一家都寫「年終保障 2 個月起」。先放在心裡。（轉職 v0.5 開放）' },
    ],
  },
  {
    id: 'boss_blame',
    cast: 'boss',
    title: '王經理甩鍋',
    text: '會議上，王經理把專案延誤說成是你的問題。',
    condition: weekday,
    choices: [
      { text: '吞下去', effects: { mood: -10 }, result: '回到座位，默默把這筆記在心裡。心裡的帳本已經寫到第三本了。', default: true },
      {
        text: '據理力爭',
        chance: {
          p: 0.5,
          effects: { performance: 2, mood: 5 },
          result: '你拿出紀錄，王經理只好改口。',
          otherwise: { performance: -2, mood: -5 },
          otherwiseResult: '氣氛很僵，王經理記住你了。',
        },
      },
    ],
  },
  {
    id: 'sick_day',
    repeat: true, // 日常：感冒會一再發生
    cooldownDays: 365,
    title: '好像感冒了',
    text: [
      '早上起床喉嚨痛、頭有點暈。',
      '鼻塞到用嘴巴呼吸，衛生紙一包接一包。',
      '辦公室有一半的人在咳嗽，今天輪到你了。',
      '季節交替，身體比氣象預報更早知道天氣變了。',
    ],
    weight: s => (s.vitals.energy < 40 ? 40 : 6), // 體力越低越容易感冒
    choices: [
      { text: '請病假休息', effects: { money: -500 }, sickLeave: 2, result: '看了醫生，在家休息兩天。醫生說「多喝水、多休息」，跟你媽說的一樣。', default: true },
      {
        text: '吃顆藥硬撐',
        effects: { performance: -1 },
        chance: {
          p: 0.3,
          effects: { illness: 'collapse' },
          result: '撐到下午，整個人倒下了…',
          otherwiseResult: '總算撐過去了。',
        },
      },
    ],
  },
  {
    id: 'friday_drink',
    cast: 'akai',
    title: '下班後有人揪',
    text: '阿凱：「今天週五，下班去熱炒店喝一杯？」',
    condition: (s, c) => c.weekday === 5,
    choices: [
      { text: '去！', effects: { money: -600, mood: 10 }, delayed: { days: 1, effects: { energy: -15 } }, result: '喝得很開心，明天大概會很累。' },
      { text: '回家休息', result: '早點回家也不錯。', default: true },
      { text: '「我先去，你們慢慢來」', effects: { money: -300, mood: 6 }, result: '你吃完最好吃的那盤蝦就先走了。高手。' },
    ],
  },
  {
    id: 'new_project',
    cast: 'boss',
    title: '新專案',
    text: '王經理指派你負責一個新專案，接下來會很忙。',
    condition: weekday,
    choices: [
      {
        text: '接下來',
        effects: { performance: 4, mood: -3 },
        forceSlots: { activity: 'overtime', weeks: 2, slots: [0, 2, 4] },
        result: '是個表現的好機會。王經理說的「好機會」，通常都要加班。',
      },
      { text: '推掉', effects: { performance: -1 }, result: '王經理轉頭找了別人。那個別人看了你一眼。', default: true },
    ],
  },
  {
    id: 'salary_day_shopping',
    title: '想買的東西在特價',
    text: '月初手頭比較鬆，一直想買的耳機剛好在特價。',
    condition: (s, c) => c.date <= 10,
    choices: [
      { text: '買了！', effects: { money: -3500, mood: 10 }, result: '戴上新耳機，通勤都開心了。降噪開下去，連王經理的聲音都消失了。' },
      { text: '忍住', effects: { mood: -2 }, result: '把它加進願望清單。清單上的東西已經可以開一間店了。', default: true },
    ],
  },
  {
    id: 'drink_order',
    repeat: true, // 日常
    cast: 'xiaomei',
    title: '揪團訂飲料',
    text: [
      '下午三點，小美在群組揪團訂飲料。',
      '小美：「新開的那家手搖第二杯半價，誰要？」群組瞬間十個人+1。',
      '下午茶時間到，小美在群組發了菜單，還附註「微糖去冰是基本禮貌」。',
    ],
    condition: weekday,
    choices: [
      { text: '跟一杯', effects: { money: -60, mood: 3 }, result: '半糖少冰，續命成功。' },
      { text: '不跟', result: '喝白開水比較健康。你看著大家的珍奶，覺得健康也沒那麼重要。', default: true },
    ],
  },
  {
    id: 'last_minute_meeting',
    cast: 'boss',
    title: '下班前的會議',
    text: '下班前 5 分鐘，王經理說：「大家來開個短會。」',
    condition: weekday,
    choices: [
      { text: '留下來', effects: { performance: 1, energy: -6, mood: -5 }, result: '「短會」開了一個小時。短的是會議記錄。', default: true },
      { text: '說等等有事', effects: { performance: -1, mood: 2 }, result: '準時走了，背後有點涼。' },
    ],
  },
  {
    id: 'voluntary_overtime',
    cast: 'boss',
    title: '「大家都自願留下來」',
    text: '王經理說：「這週大家就自願留下來，把案子趕完吧。」',
    condition: weekday,
    choices: [
      { text: '留下', effects: { performance: 2, energy: -12, mood: -6 }, result: '自願的，所以沒有加班費。你學會了「自願」的新定義。' },
      { text: '準時下班', effects: { performance: -1, mood: 3 }, result: '大家的眼神有點微妙。', default: true },
    ],
  },
  {
    id: 'wedding_invite',
    age: [24, 40],
    title: '收到喜帖',
    text: '大學同學要結婚了！你已經五年沒跟他說過話，但喜帖還是寄來了。',
    choices: [
      { text: '出席', effects: { money: -2000, mood: 6 }, result: '婚禮很感人，菜也很好吃。同桌的人你一個都不認識，但你們一起搶到了最後一隻蝦。', default: true },
      { text: '禮到人不到', effects: { money: -1200 }, result: '請同學幫忙帶紅包。他說：「你人沒來，紅包比較厚喔？」' },
    ],
  },
  {
    id: 'typhoon_day',
    repeat: true, // 日常：每年都有颱風
    title: '颱風假！',
    text: [
      '颱風來了，今天停班停課！',
      '颱風假宣布了！脆上已經有人在比誰的泡麵囤得比較多。',
      '颱風假，但主管在群組說：「大家在家也可以看一下信喔。」',
    ],
    condition: (s, c) => !c.weekend && c.month >= 7 && c.month <= 9,
    choices: [
      { text: '在家耍廢', effects: { mood: 12, energy: 10 }, result: '泡麵配追劇，完美的一天。窗外風雨交加，你的心情風和日麗。', default: true },
      { text: '遠端工作', effects: { performance: 1, mood: -3 }, result: '颱風天也在回信…' },
    ],
  },
  {
    id: 'mrt_delay',
    repeat: true, // 日常
    title: '捷運延誤',
    text: [
      '捷運號誌故障，看起來會遲到。',
      '車廂廣播：「列車將在此稍作停留。」你在心裡默默算了一下全勤獎金。',
      '下雨天的捷運擠到你的雙腳離地，到站時已經用掉今天一半的體力。',
    ],
    condition: weekday,
    choices: [
      { text: '用跑的', effects: { energy: -6 }, result: '氣喘吁吁，剛好趕上打卡。' },
      { text: '傳訊息說會晚到', effects: { performance: -1 }, result: '主管回了一個「OK」。你研究了五分鐘這個 OK 是生氣還是沒事。', default: true },
    ],
  },
  {
    id: 'coffee_spill',
    title: '咖啡打翻了',
    text: '一個不小心，咖啡全倒在鍵盤上。',
    condition: weekday,
    choices: [
      { text: '自己買新的', effects: { money: -1500 }, result: '順便換了一把喜歡的鍵盤。', default: true },
      { text: '跟公司申請', effects: { mood: -4 }, result: '填了三張表單，等了兩週才拿到。拿到的鍵盤少了一個 Enter 鍵。' },
      { text: '拿吹風機吹一吹', chance: { p: 0.4, effects: { mood: 5 }, result: '居然活過來了！只是每次按 A 都會聞到拿鐵。', otherwise: { money: -1500, mood: -3 }, otherwiseResult: '鍵盤發出最後一聲「嗶」，安詳地走了。' } },
    ],
  },
  {
    id: 'parents_call',
    cast: 'mom',
    title: '媽媽的電話',
    text: '媽媽打電話來：「什麼時候回家？」',
    choices: [
      { text: '這週末回家', effects: { money: -1500, mood: 12 }, result: '吃了一桌好菜，還被塞了一堆水果。回程的背包比去的時候重五公斤。', default: true },
      { text: '說最近很忙', effects: { mood: -5 }, result: '掛掉電話後有點愧疚。三分鐘後媽媽傳來一張長輩圖：「忙碌的你，也要記得休息」。' },
    ],
  },
  {
    id: 'invoice_lottery',
    title: '統一發票中獎',
    text: '對了一下發票，中了 200 元！',
    condition: (s, c) => c.month % 2 === 1 && c.date >= 25, // 單數月 25 日開獎
    choices: [
      { text: '拿去買飲料', effects: { mood: 4 }, result: '小確幸。對了二十年發票，最高紀錄還是 200。' },
      { text: '存起來', effects: { money: 200 }, result: '積少成多。', default: true },
    ],
  },
  {
    id: 'elevator_boss',
    title: '電梯裡的大老闆',
    text: '電梯門一開，裡面只有大老闆。',
    condition: weekday,
    choices: [
      {
        text: '自我介紹',
        chance: {
          p: 0.5,
          effects: { performance: 2 },
          result: '老闆點點頭：「年輕人不錯。」',
          otherwise: { mood: -5 },
          otherwiseResult: '講到一半電梯就到了，好尷尬…',
        },
      },
      { text: '低頭滑手機', result: '安靜地度過了最長的 20 秒。手機沒有訊號，你滑的是桌布。', default: true },
    ],
  },
  {
    id: 'boss_unhappy',
    cast: 'boss',
    title: '王經理不太高興',
    text: '王經理把你叫進會議室：「昨天的訊息怎麼沒回？」',
    followUp: true, // 只由 line_at_midnight 觸發
    choices: [
      { text: '道歉，馬上補交', effects: { performance: 1, mood: -5 }, result: '王經理：「下次早點回。」', default: true },
      { text: '裝傻', effects: { performance: -2 }, result: '王經理嘆了一口氣。' },
    ],
  },
];

EVENT_LIST.push(
  ...FIRST_YEAR_EVENTS,
  ...HOLIDAY_EVENTS,
  ...STUDY_EVENTS,
  ...CRISIS_EVENTS,
  ...LIFE_EVENTS,
  ...CHAPTER1_EVENTS,
  ...CHAPTER2_EVENTS,
  ...CHAPTER3_EVENTS,
  ...CHAPTER4_EVENTS,
  ...CHAPTER5_EVENTS,
  ...MEME_EVENTS,
  ...CAST_EVENTS,
  ...LOVE_EVENTS,
);

// 班底離開公司後（例如阿凱去開店、王經理退休），有他出場的一般事件就不再出現；劇情、節日、故事線不受影響
for (const e of EVENT_LIST) {
  const present = CAST_PRESENT[e.cast];
  if (!present || e.on || e.story || e.followUp) continue;
  const own = e.condition;
  e.condition = own ? (s, c) => present(s) && own(s, c) : present;
}

export const EVENTS_BY_ID = Object.fromEntries(EVENT_LIST.map(e => [e.id, e]));
