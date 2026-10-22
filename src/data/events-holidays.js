// 每年固定的節日（DESIGN.md §10.2、§10.6）：on.month + on.date 是每年那天
// 同一個日子的事件是同一個節日的不同版本，依年紀出現、每個版本一生一次；版本的年紀不重疊
import { CAST_PRESENT } from './events-cast.js';

export const HOLIDAY_EVENTS = [
  // ── 過年 ──
  {
    id: 'lunar_new_year',
    age: [22, 28],
    on: { month: 2, date: 10 },
    cast: 'mom',
    title: '過年',
    text: '過年回家，親戚圍著你問：「薪水多少？有沒有對象？」',
    choices: [
      { text: '包紅包給長輩', effects: { money: -6000, mood: 6 }, result: '長輩笑得合不攏嘴，問題就變少了。紅包是最好的消音器。' },
      { text: '老實回答薪水', effects: { mood: -6 }, result: '親戚們開始比較誰家小孩賺比較多……你家輸了。' },
      { text: '默默吃年夜飯', effects: { mood: 2 }, result: '佛跳牆、雞湯、長年菜，吃到撐。嘴巴塞滿就不用回答問題。', default: true },
    ],
  },
  {
    id: 'lunar_new_year_marriage',
    age: [28, 35],
    on: { month: 2, date: 10 },
    cast: 'mom',
    title: '過年被催婚',
    text: '年夜飯吃到一半，阿姨夾了一塊雞給你：「你也老大不小了，什麼時候要結婚？」全桌安靜下來。',
    choices: [
      { text: '「在努力了」', effects: { mood: -3 }, result: '阿姨馬上拿出手機：「我同事的兒子／女兒也單身喔。」你的努力被接管了。' },
      { text: '「阿姨你今年氣色好好喔」', effects: { mood: 4 }, result: '阿姨很開心地聊了二十分鐘保養，完全忘了剛剛的問題。轉移話題是一門藝術。', default: true },
      { text: '「我先把房貸搞定」', effects: { mood: 1 }, result: '全桌開始討論房價，你成功把火力轉移到整個社會。' },
    ],
  },
  {
    id: 'lunar_new_year_red_envelope',
    age: [35, 45],
    on: { month: 2, date: 10 },
    cast: 'mom',
    title: '過年包紅包',
    text: '過年回家，一群姪子姪女排成一排：「恭喜發財，紅包拿來！」你終於變成發紅包的那一邊。',
    choices: [
      { text: '每人 2,000', effects: { money: -12000, mood: 6 }, result: '小孩們歡呼。你突然懂了，當年的長輩包完紅包為什麼要去躺一下。' },
      { text: '每人 600，說「重點是心意」', effects: { money: -3600, mood: 2 }, result: '最小的姪子打開紅包，看了你一眼。那個眼神你會記一輩子。', default: true },
      { text: '發「未來的你會感謝我」理財書', effects: { money: -1500, mood: 3 }, result: '小孩們都哭了。媽媽說你跟你爸一樣。' },
    ],
  },
  {
    id: 'lunar_new_year_cook',
    age: [45, 55],
    on: { month: 2, date: 10 },
    cast: 'mom',
    title: '年夜飯換你煮',
    text: '媽媽：「今年年夜飯你來煮吧，我教你。」你看著廚房，覺得比任何專案都難。',
    choices: [
      { text: '認真學媽媽的佛跳牆', effects: { energy: -10, mood: 10, money: -3000 }, result: '從早上燉到晚上。味道差了一點，媽媽說「這樣剛好」。你知道她在說謊，也知道她很開心。' },
      { text: '訂外燴年菜', effects: { money: -8000, mood: 4 }, result: '大家吃得很開心。媽媽偷偷說：「明年還是我煮好了。」', default: true },
    ],
  },
  {
    id: 'lunar_new_year_elder',
    age: [55, 66],
    on: { month: 2, date: 10 },
    cast: 'mom',
    title: '你變成長輩了',
    text: '過年聚餐，你看著剛出社會的姪子，嘴巴自己動了起來：「薪水多少？有沒有對象？」',
    choices: [
      { text: '馬上道歉', effects: { mood: 3 }, result: '姪子笑了：「沒關係，我早就準備好答案了：還在摸索。」你們都笑了，是同一個答案。', default: true },
      { text: '包一個大紅包當封口費', effects: { money: -6000, mood: 6 }, result: '問題消失了。原來長輩包紅包是在道歉。' },
    ],
  },

  // ── 母親節 ──
  {
    id: 'mothers_day',
    age: [22, 30],
    on: { month: 5, date: 10 },
    cast: 'mom',
    title: '母親節',
    text: '母親節到了，要怎麼表示一下？',
    choices: [
      { text: '訂餐廳帶媽媽吃飯', effects: { money: -3000, mood: 10 }, result: '媽媽嘴上說太貴，還是拍了很多照片，而且每一張都傳到家族群組。' },
      { text: '回傳一張長輩圖', effects: { mood: 3 }, result: '媽媽回：「哈哈哈你也會傳這個」', default: true },
    ],
  },
  {
    id: 'mothers_day_no_money',
    age: [30, 45],
    on: { month: 5, date: 10 },
    cast: 'mom',
    title: '「不要花錢啦」',
    text: '你問媽媽母親節想要什麼，她說：「不要花錢啦，你們好好的就好。」',
    choices: [
      { text: '聽她的，不花錢', effects: { mood: -3 }, result: '母親節當天，媽媽在群組貼了鄰居女兒送的按摩椅照片。你懂了。' },
      { text: '還是帶她去吃飯', effects: { money: -4000, mood: 10 }, result: '她一直說「太貴了」，然後點了兩份甜點。', default: true },
      { text: '送一台按摩椅', effects: { money: -30000, mood: 12 }, result: '她說「浪費錢」，然後每天坐在上面看韓劇。' },
    ],
  },
  {
    id: 'mothers_day_clinic',
    age: [45, 66],
    on: { month: 5, date: 10 },
    cast: 'mom',
    title: '陪媽媽回診',
    text: '今年母親節剛好是媽媽回診的日子。她說：「你去忙就好，我自己去。」',
    choices: [
      { text: '請假陪她去', effects: { mood: 8, energy: -4 }, result: '在候診室等了兩小時，你們聊了很多小時候的事。她跟每個護理師介紹你。', default: true },
      { text: '幫她叫車', effects: { money: -500, mood: -2 }, result: '她回來說醫生很好，車子很舒服。然後問你下次要不要一起去。' },
    ],
  },

  // ── 端午 ──
  {
    id: 'dragon_boat',
    age: [22, 35],
    on: { month: 6, date: 15 },
    cast: 'xiaomei',
    condition: CAST_PRESENT.xiaomei, // 小美離職後就沒人帶粽子來了
    title: '端午節的粽子',
    text: '小美帶了自己包的粽子來，還問：「你是北部粽派還是南部粽派？」',
    choices: [
      { text: '北部粽', effects: { mood: 3 }, result: '小美：「南部粽才是粽子！」辦公室吵了一下午。' },
      { text: '南部粽', effects: { mood: 3 }, result: '阿凱：「北部粽才是油飯！」辦公室吵了一下午。' },
      { text: '都好吃', effects: { mood: 4 }, result: '圓滑。小美多給了你一顆。', default: true },
    ],
  },
  {
    id: 'dragon_boat_wrap',
    age: [35, 66],
    on: { month: 6, date: 15 },
    cast: 'mom',
    title: '跟媽媽學包粽子',
    text: '媽媽：「今年你來幫忙包粽子，再不學，以後就沒人會了。」',
    choices: [
      { text: '認真學', effects: { energy: -6, mood: 8 }, result: '你包的粽子形狀很有創意，煮完全部散開。媽媽說第一年都這樣，她第一年也是。', default: true },
      { text: '負責吃', effects: { mood: 4 }, result: '你吃了五顆，媽媽說你小時候也是這樣。有些事情不會變。' },
    ],
  },

  // ── 冷氣大戰 ──
  {
    id: 'aircon_war',
    age: [22, 40],
    on: { month: 8, date: 20 },
    cast: 'akai',
    condition: CAST_PRESENT.akai,
    title: '冷氣大戰',
    text: '辦公室冷氣 23 度，你冷到發抖，旁邊的阿凱還在喊熱。',
    choices: [
      { text: '默默帶件外套', effects: { mood: -1 }, result: '包成粽子繼續上班。八月的粽子。', default: true },
      {
        text: '偷偷把冷氣調高',
        chance: {
          p: 0.3,
          effects: { performance: -2, mood: -3 },
          result: '被王經理抓到：「誰動了冷氣？」',
          otherwise: { mood: 4 },
          otherwiseResult: '整個下午都很舒服，沒人發現。',
        },
      },
    ],
  },
  {
    id: 'aircon_war_cold',
    age: [40, 66],
    on: { month: 8, date: 20 },
    title: '你變成怕冷的那一個',
    text: '八月的辦公室，年輕同事把冷氣調到 22 度。你從抽屜拿出外套、毯子和一個暖暖包。',
    choices: [
      { text: '默默穿上外套', effects: { mood: -1 }, result: '你穿得像要去合歡山。年輕同事問你是不是感冒了。', default: true },
      { text: '「冷氣調高一點好嗎」', effects: { mood: 3 }, result: '他們很有禮貌地調高了。然後你聽到有人小聲說：「好像我爸。」' },
    ],
  },

  // ── 中秋 ──
  {
    id: 'mid_autumn',
    age: [22, 30],
    on: { month: 9, date: 25 },
    cast: 'akai',
    title: '中秋烤肉',
    text: '中秋連假，阿凱在社區頂樓辦烤肉，問你要不要來。',
    choices: [
      { text: '去！', effects: { money: -500, mood: 8, energy: -4 }, result: '烤肉醬沾太多，但很開心。衣服上的烤肉味三天都洗不掉。' },
      { text: '在家耍廢', effects: { mood: 4, energy: 6 }, result: '一個人吃月餅也不錯。', default: true },
    ],
  },
  {
    id: 'mid_autumn_sit',
    age: [30, 50],
    on: { month: 9, date: 25 },
    title: '烤肉只想坐著吃',
    text: '中秋烤肉，年輕人搶著顧火。你看了看自己的腰，默默拉了一張椅子。',
    choices: [
      { text: '坐著等吃', effects: { mood: 6, energy: 2 }, result: '你成為烤肉圈最專業的評審。每一片肉都說「再烤一下」。', default: true },
      { text: '硬要去顧火', effects: { mood: 4, energy: -8 }, result: '你烤得很好，但站了一小時，隔天腰說了很多話。' },
    ],
  },
  {
    id: 'mid_autumn_tea',
    age: [50, 66],
    on: { month: 9, date: 25 },
    cast: 'mom',
    title: '月餅配茶就好',
    text: '中秋節晚上，你和媽媽坐在陽台，一壺熱茶、一盒月餅，沒有烤肉。',
    choices: [
      { text: '陪她看月亮', effects: { mood: 10 }, result: '媽媽說：「你小時候都吵著要烤肉。」你說現在這樣比較好。這次是真心的。', default: true },
      { text: '還是烤一點肉', effects: { mood: 6, energy: -3 }, result: '你烤了三片肉，媽媽吃了一片就說太油。你們笑了很久。' },
    ],
  },

  // ── 連假 ──
  {
    id: 'national_day',
    age: [22, 30],
    on: { month: 10, date: 8 },
    cast: 'xiaomei',
    title: '連假要去哪？',
    text: '雙十連假快到了，小美在群組問大家要去哪玩。',
    choices: [
      { text: '出國小旅行', effects: { money: -15000, mood: 15 }, result: '去了一趟沖繩，曬得很黑。回來上班第一天，大家都知道你出國了。' },
      { text: '回老家', effects: { money: -1500, mood: 8 }, result: '被餵了三天，胖了兩公斤。', default: true },
      { text: '在家補眠', effects: { energy: 10, mood: 3 }, result: '睡到自然醒，人生的意義。' },
    ],
  },
  {
    id: 'national_day_sleep',
    age: [30, 66],
    on: { month: 10, date: 8 },
    title: '連假只想睡',
    text: '四天連假。年輕的時候會排滿行程，現在你的行程表只有一行：「睡覺」。',
    choices: [
      { text: '睡滿四天', effects: { energy: 15, mood: 6 }, result: '你醒來的時候已經是連假最後一天的晚上。完美的連假。', default: true },
      { text: '還是出門走走', effects: { money: -3000, mood: 8, energy: -5 }, result: '景點人比風景多，塞車兩小時。你在車上睡得很好。' },
    ],
  },

  // ── 雙 11 ──
  {
    id: 'double_eleven',
    age: [22, 35],
    on: { month: 11, date: 11 },
    title: '雙 11',
    text: '雙 11 購物節，購物車已經塞滿了。',
    choices: [
      { text: '全部結帳', effects: { money: -8000, mood: 10 }, result: '接下來一週每天都在等包裹。快樂是買得到的，而且有分期。' },
      { text: '只買衛生紙', effects: { money: -300, mood: 1 }, result: '理性消費，荷包保住了。衛生紙夠用到明年雙 11。', default: true },
    ],
  },
  {
    id: 'double_eleven_supplements',
    age: [35, 50],
    on: { month: 11, date: 11 },
    title: '購物車只剩保健食品',
    text: '雙 11 打開購物車：魚油、葉黃素、益生菌、葡萄糖胺。你什麼時候變成這樣的？',
    choices: [
      { text: '全部結帳', effects: { money: -6000, mood: 3, energyMax: 1 }, result: '包裹到的時候，你把它們排成一排，像在排隊照顧你。', default: true },
      { text: '加一件喜歡的衣服', effects: { money: -8000, mood: 7 }, result: '衣服到了，穿起來很好看。你配著葉黃素拍了一張照。' },
    ],
  },
  {
    id: 'double_eleven_coupons',
    age: [50, 66],
    on: { month: 11, date: 11 },
    title: '優惠券怎麼疊？',
    text: '雙 11 的規則：滿千折百、跨店再折、限時加碼、會員點數 5 倍。你看了二十分鐘，還是不知道怎麼算。',
    choices: [
      { text: '請年輕同事幫忙', effects: { money: -3000, mood: 5 }, result: '他三秒鐘就幫你疊好了，省了 800 塊。你請他喝了一杯手搖，又花了 80。', default: true },
      { text: '直接原價買', effects: { money: -4000, mood: 2 }, result: '你算了一下時薪，覺得原價買比較划算。這是人生的智慧。' },
    ],
  },

  // ── 尾牙 ──
  {
    id: 'year_end_party',
    age: [22, 30],
    on: { month: 1, date: 15 },
    cast: 'boss',
    title: '尾牙',
    text: '公司尾牙，主持人拿著麥克風問：「有沒有人要上台表演？」',
    choices: [
      {
        text: '上台表演',
        chance: {
          p: 0.5,
          effects: { money: 10000, mood: 12 },
          result: '表演大成功，還抽到現金 1 萬元！',
          otherwise: { mood: -8 },
          otherwiseResult: '唱到破音，全場陷入沉默……社死。影片在部門群組活了三年。',
        },
      },
      { text: '坐在台下吃', effects: { mood: 3 }, result: '佛跳牆很好吃，抽到一包衛生紙。', default: true },
    ],
  },
  {
    id: 'year_end_party_prize',
    age: [30, 45],
    on: { month: 1, date: 15 },
    cast: 'boss',
    title: '尾牙抽獎',
    text: '尾牙抽到最後一個大獎，主持人念出名字——是你！獎品是一台機車，或是換現金 5 萬。',
    choices: [
      { text: '換現金', effects: { money: 50000, mood: 12 }, result: '台下有人喊「請客！」，你請了全部門飲料，還剩 48,000。' },
      { text: '牽機車回家', effects: { money: 35000, mood: 10 }, result: '你牽著它走了一段路，才想起你沒有車位。最後賣掉了，賠了一萬五。', default: true },
    ],
  },
  {
    id: 'year_end_party_speech',
    age: [45, 66],
    on: { month: 1, date: 15 },
    title: '尾牙致詞',
    text: '主持人：「接下來請資深同仁上台致詞！」你這才發現，資深同仁說的是你。',
    choices: [
      { text: '講一段感性的話', effects: { mood: 8, management: 1 }, result: '你講了自己第一年在尾牙唱破音的故事，台下的新人笑得最大聲。', default: true },
      { text: '「大家吃飯吧」', effects: { mood: 5 }, result: '史上最短的致詞，全場起立鼓掌。大家真的都餓了。' },
    ],
  },
];
