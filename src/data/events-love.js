// 感情事件（DESIGN.md §9.4）：認識、曖昧、交往中的個人事件與共通事件、告白、談談、分手
// 選項的 love 欄位：{ meet: 角色 id } 認識、{ stage: 'dating' } 開始交往、{ end: true } 結束；chance 也可以帶 love / otherwiseLove
// cast 寫角色 id 是那個人；寫 'partner' 是目前的對象。文字裡的 {伴侶} 會換成對方的名字
import { EVENTS, LOVE } from './balance.js';
import { canMeet, meetWeight, weeklySlots } from './partners.js';

// 感情事件只在有對象時碰得到，權重和有年紀範圍的事件同級（EVENTS.weight × ageWeight）
const LOVE_WEIGHT = EVENTS.weight * EVENTS.ageWeight;
const dating = s => s.love.stage === 'dating';
const together = (s, days) => dating(s) && s.day - s.love.since >= days;

// 認識事件：單身、偏好符合時才會出現，這週社交越多越容易
const meet = (id, age, extra = () => 1) => ({
  id: `meet_${id}`,
  age,
  cast: id,
  condition: s => canMeet(s, id),
  weight: s => 10 * meetWeight(s) * extra(s),
});

// 交往滿 personalDays 天，依序出現那個人的三張個人事件（由 love.js 觸發）
const personal = (id, i) => ({ id: `date_${id}_${i + 1}`, followUp: true, cast: id });

export const LOVE_EVENTS = [
  // ── 💪 阿哲：健身教練 ──
  {
    ...meet('azhe', [23, 36], s => 1 + weeklySlots(s.schedule, 'exercise')),
    title: '健身房的教練',
    text: '你在健身房舉一個很輕的啞鈴，一位教練走過來：「你的姿勢有點危險喔，我幫你調一下。」他叫阿哲，笑起來很陽光。',
    choices: [
      { text: '請他教你', effects: { mood: 6 }, love: { meet: 'azhe' }, result: '他教了你半小時，最後加了你 LINE：「之後有問題隨時問我。」第一則訊息是蛋白粉的比價表。', default: true },
      { text: '「謝謝，我只是來吹冷氣的」', effects: { mood: 3 }, result: '他愣了一下，笑著走開了。你繼續吹冷氣，覺得錯過了什麼。' },
    ],
  },
  {
    id: 'crush_azhe',
    followUp: true, // 認識滿 crushDays 天由 love.js 觸發
    cast: 'azhe',
    title: '阿哲約你晨跑',
    text: '阿哲傳訊息：「週六早上六點，河濱晨跑，要不要？跑完請你吃早餐。」',
    choices: [
      { text: '六點就六點', effects: { energy: -6, affinity: 10, mood: 4 }, result: '你跑了兩公里就喘到說不出話，他一直陪在旁邊。早餐他點了三顆茶葉蛋，全是蛋白質。', default: true },
      { text: '「八點可以嗎」', effects: { affinity: 4 }, result: '他說好。八點的河濱很熱，但你們聊得很開心。' },
      { text: '「我週六的運動是翻身」', effects: { affinity: -4, mood: 3 }, result: '他回了一個「哈哈哈」，然後傳來一份新手訓練菜單。' },
    ],
  },
  {
    ...personal('azhe', 0),
    title: '練腿日',
    text: '阿哲：「今天是練腿日！一起去吧？」你上次練腿是三天前，到現在下樓梯還會發抖。',
    choices: [
      { text: '一起去', effects: { energy: -8, energyMax: 2, affinity: 6 }, result: '你們練完一起扶著欄杆下樓。這大概就是戀愛的樣子。', default: true },
      { text: '「我在旁邊幫你拍照」', effects: { affinity: 3, mood: 3 }, result: '你拍了五十張，他選了一張當大頭貼。' },
    ],
  },
  {
    ...personal('azhe', 1),
    title: '冰箱裡的雞胸肉',
    text: '你打開冰箱，裡面有 24 盒雞胸肉，貼著阿哲的字條：「一天兩盒，不要偷吃泡麵。」',
    choices: [
      { text: '乖乖吃', effects: { mood: -2, energyMax: 2, affinity: 5 }, result: '吃到第十盒，你開始在夢裡看到雞。但體力真的變好了。', default: true },
      { text: '雞胸肉配泡麵', effects: { mood: 5, affinity: -2 }, result: '你覺得這是兩全其美。阿哲看到泡麵碗，沉默了很久。' },
    ],
  },
  {
    ...personal('azhe', 2),
    title: '阿哲的比賽',
    text: '阿哲要參加健美比賽，前一個月每天只吃水煮餐，脾氣變得有點差。',
    choices: [
      { text: '陪他一起吃水煮餐', effects: { mood: -4, affinity: 10 }, result: '比賽那天他拿了第三名，下台後第一句話是：「走，吃鹹酥雞。」', default: true },
      { text: '在他面前吃炸雞', effects: { mood: 4, affinity: -8 }, result: '他看著你，眼神像在看一個仇人。你們吵了這段感情的第一架。' },
    ],
  },

  // ── 💻 柏宇：工程師 ──
  {
    ...meet('boyu', [24, 39]),
    title: '桌遊局',
    text: '朋友的桌遊局多了一個人，叫柏宇。他整晚講不到十句話，但每一局都贏。',
    choices: [
      { text: '問他怎麼贏的', effects: { mood: 5 }, love: { meet: 'boyu' }, result: '他講了二十分鐘機率。回家後收到他的 LINE，是一篇整理好的攻略，三千字。', default: true },
      { text: '專心輸', effects: { mood: 2 }, result: '你輸了一整晚。散場時他小聲說「下次見」，你沒聽清楚。' },
    ],
  },
  {
    id: 'crush_boyu',
    followUp: true, // 認識滿 crushDays 天由 love.js 觸發
    cast: 'boyu',
    title: '很長的訊息',
    text: '柏宇當面講話很少，但今天傳了一則超長的訊息，從「今天的雲很好看」講到他對人生的看法。',
    choices: [
      { text: '認真回一則一樣長的', effects: { energy: -3, affinity: 10 }, result: '你們用訊息聊到兩點。隔天在公司打瞌睡，但心情很好。', default: true },
      { text: '回一個貼圖', effects: { affinity: -3 }, result: '他回：「嗯。」你覺得這個「嗯」裡面有一整篇文章。' },
      { text: '直接打電話給他', chance: { p: 0.5, effects: { affinity: 12 }, result: '他嚇了一跳，但你們講了一小時。他說：「原來講話也不錯。」', otherwise: { affinity: -2 }, otherwiseResult: '他沒接，三分鐘後傳來：「怎麼了？打字就好。」' } },
    ],
  },
  {
    ...personal('boyu', 0),
    title: '在家看影集',
    text: '柏宇說週末的約會計畫是：「在家看影集，我已經排好片單了。」片單是一份 Excel，有評分和預計時長。',
    choices: [
      { text: '照片單看', effects: { mood: 6, energy: 4, affinity: 6 }, result: '你們看了九集，中間只講了「要不要叫外送」。完美的約會。', default: true },
      { text: '「我們出門走走嘛」', effects: { affinity: 2, money: -800 }, result: '他陪你去逛街，全程在幫你比價。' },
    ],
  },
  {
    ...personal('boyu', 1),
    title: '他幫你寫了一個程式',
    text: '你隨口抱怨每天整理報表很煩，週末柏宇就寫了一個小程式給你：「按這裡，三秒就好。」',
    choices: [
      { text: '感動到想哭', effects: { programming: 2, performance: 2, affinity: 8 }, result: '你在公司用了它，主管問你怎麼突然變那麼快。你說：「愛的力量。」', default: true },
      { text: '「那你可以幫我寫週報嗎」', effects: { mood: 3, affinity: -2 }, result: '他想了一下：「可以，但我要寫一個會亂掰的 AI。」你們都覺得這樣不太好。' },
    ],
  },
  {
    ...personal('boyu', 2),
    title: '見朋友',
    text: '你帶柏宇參加朋友聚會。他一整晚坐在角落，後來你發現他在幫大家修手機。',
    choices: [
      { text: '把他拉進聊天', effects: { affinity: 4, mood: 3 }, result: '他被問到工作，講了半小時伺服器。大家聽不懂，但都覺得他很可愛。', default: true },
      { text: '讓他繼續修', effects: { affinity: 6 }, result: '回家路上他說：「謝謝你沒有逼我聊天。」i 人的愛，就是給彼此空間。' },
    ],
  },

  // ── ☕ 承恩：咖啡店老闆 ──
  {
    ...meet('chengen', [25, 41]),
    title: '樓下的咖啡店',
    text: '公司樓下開了一家咖啡店。第三次去的時候，老闆不用問就幫你做了「燕麥拿鐵、少冰」。他說他叫承恩。',
    choices: [
      { text: '「你怎麼記得？」', effects: { mood: 6 }, love: { meet: 'chengen' }, result: '他說：「你每次都一臉很累，所以我記得。」杯子上畫了一個打哈欠的拉花。', default: true },
      { text: '外帶就走', effects: { mood: 2 }, result: '你走出門才發現杯子上寫著「加油」。' },
    ],
  },
  {
    id: 'crush_chengen',
    followUp: true, // 認識滿 crushDays 天由 love.js 觸發
    cast: 'chengen',
    title: '打烊後的咖啡',
    text: '你加班到很晚，經過咖啡店時燈還亮著。承恩探出頭：「剛好有一杯沒賣掉，要不要？」',
    choices: [
      { text: '進去坐一下', effects: { energy: 3, mood: 6, affinity: 10 }, result: '你們聊到十一點。那杯咖啡根本不是沒賣掉，是他剛剛才做的。', default: true },
      { text: '「我要回家睡覺」', effects: { energy: 4, affinity: 2 }, result: '他把咖啡換成熱可可：「那喝這個，比較好睡。」' },
    ],
  },
  {
    ...personal('chengen', 0),
    title: '手沖課',
    text: '承恩說要教你手沖：「水溫 92 度，悶蒸 30 秒，畫圈要慢。」你只想喝。',
    choices: [
      { text: '認真學', effects: { affinity: 6, mood: 4 }, result: '你沖出來的咖啡很苦，他喝完說：「很有個性。」然後偷偷倒掉了。', default: true },
      { text: '「你沖我喝」', effects: { affinity: 3, mood: 6 }, result: '他笑著說好。從此你家多了一套手沖器材，只有他會用。' },
    ],
  },
  {
    ...personal('chengen', 1),
    title: '「又加班喔？」',
    text: '承恩傳來一張照片：一份冷掉的晚餐。「我煮了你喜歡的咖哩，你又加班喔？」',
    choices: [
      { text: '馬上回家', effects: { performance: -1, affinity: 8, mood: 5 }, result: '咖哩熱過一次還是很好吃。他說：「工作做不完的，咖哩會冷掉。」', default: true },
      { text: '「再一個小時」', effects: { performance: 1, affinity: -6 }, result: '一小時變成三小時。回到家，咖哩在冰箱裡，旁邊有一張字條：「記得微波。」' },
    ],
  },
  {
    ...personal('chengen', 2),
    title: '他想開第二家店',
    text: '承恩說想開第二家店，但要拿出所有的存款。「你覺得呢？」',
    choices: [
      { text: '支持他', effects: { affinity: 10, mood: 3 }, result: '新店開幕那天，他在菜單上加了一款叫你名字的咖啡。是燕麥拿鐵、少冰。', default: true },
      { text: '「先穩一點吧」', effects: { affinity: -3 }, result: '他想了一夜，決定再等兩年。早上他還是幫你做了咖啡，畫了一個問號。' },
    ],
  },

  // ── 📸 詩涵：行銷 ──
  {
    ...meet('shihan', [24, 36]),
    title: '婚禮上的伴娘',
    text: '朋友的婚禮上，伴娘詩涵負責炒熱氣氛，整場跑來跑去，最後拉著你一起跳了一段。',
    choices: [
      { text: '跳就跳', effects: { mood: 8, energy: -4 }, love: { meet: 'shihan' }, result: '你們的舞被錄下來，她發在限動標記你。追蹤數一晚多了 30 個。', default: true },
      { text: '假裝去拿飲料', effects: { mood: 1 }, result: '你在飲料區躲了二十分鐘。回來時她在跟別人跳了。' },
    ],
  },
  {
    id: 'crush_shihan',
    followUp: true, // 認識滿 crushDays 天由 love.js 觸發
    cast: 'shihan',
    title: '網美咖啡廳',
    text: '詩涵約你去一家網美咖啡廳：「這家超難訂！」你們到了以後，她拍了四十分鐘的照，咖啡已經冷了。',
    choices: [
      { text: '幫她拍', effects: { energy: -3, affinity: 10 }, result: '你拍了兩百張，她選了一張，說你是她遇過最會拍的人。你決定把這句話寫進履歷。', default: true },
      { text: '先喝咖啡', effects: { mood: 3, affinity: -3 }, result: '你喝完了，她還在拍。她說：「你很懂得活在當下耶。」不確定是不是稱讚。' },
    ],
  },
  {
    ...personal('shihan', 0),
    title: '週末行程表',
    text: '詩涵傳來這週末的行程：早午餐、市集、展覽、夜市、KTV。「還有一個空檔，你想去哪？」',
    choices: [
      { text: '全部跟', effects: { energy: -10, mood: 8, money: -3000, affinity: 8 }, result: '週一上班時你的腿還在痠，但手機相簿多了 300 張照片。', default: true },
      { text: '「空檔可以拿來睡覺嗎」', effects: { energy: 4, affinity: -3 }, result: '她笑了：「好啦，睡一小時。」然後幫你訂了一間可以睡午覺的咖啡廳。' },
    ],
  },
  {
    ...personal('shihan', 1),
    title: '限動沒有你',
    text: '詩涵發了週末出遊的限動，二十張照片，你只出現在一張的角落。她說：「哎呀那張比較好看嘛。」',
    choices: [
      { text: '「那下次換我拍你」', effects: { affinity: 5, mood: 2 }, result: '下次她發了一張只有你的照片，配文：「我的專屬攝影師。」你截圖存起來了。', default: true },
      { text: '默默在意', effects: { mood: -4 }, result: '你在意了三天，她完全沒發現。後來你自己發了一篇限動，標記她。' },
    ],
  },
  {
    ...personal('shihan', 2),
    title: '她被挖角了',
    text: '詩涵被挖角去另一家公司，薪水多三成，但要常常出差。她問：「你覺得我應該去嗎？」',
    choices: [
      { text: '「去啊，你很棒」', effects: { affinity: 10, mood: -2 }, result: '她去了。出差時每天晚上視訊，從各地傳伴手禮的照片給你。你們變得更好了。', default: true },
      { text: '「那我們怎麼辦？」', effects: { affinity: -4 }, result: '她沉默了一下：「我還沒想到這個。」那晚你們聊了很久。' },
    ],
  },

  // ── 🩺 雅婷：護理師 ──
  {
    ...meet('yating', [25, 39]),
    title: '朋友介紹',
    text: '朋友說：「我有個朋友是護理師，人很直，你們應該很合。」第一次見面，雅婷看了你一眼：「你最近睡不到六小時吧？」',
    choices: [
      { text: '「你怎麼知道」', effects: { mood: 5 }, love: { meet: 'yating' }, result: '她指了指你的黑眼圈，然後給了你一張睡眠衛教單。你們交換了 LINE。', default: true },
      { text: '「我睡很多啊」', effects: { mood: 1 }, result: '她看著你，沒說話。那個眼神讓你那晚十點就睡了。' },
    ],
  },
  {
    id: 'crush_yating',
    followUp: true, // 認識滿 crushDays 天由 love.js 觸發
    cast: 'yating',
    title: '輪班的約會',
    text: '雅婷這週上大夜班，她說：「我早上八點下班，可以一起吃早餐。」那是你上班前的一小時。',
    choices: [
      { text: '提早出門陪她吃', effects: { energy: -4, affinity: 10 }, result: '她邊吃蛋餅邊打瞌睡，最後靠在你肩上睡著了。你遲到了十分鐘，但覺得值得。', default: true },
      { text: '約週末', effects: { affinity: 3 }, result: '週末她要補眠。你們的約會延到了下下週。' },
    ],
  },
  {
    ...personal('yating', 0),
    title: '「你這不是累，是爆肝」',
    text: '你說最近有點累，雅婷立刻拿出血壓計：「坐好。」量完她皺眉：「你這不是累，是爆肝。」',
    choices: [
      { text: '乖乖聽她的', effects: { energy: 8, mood: 2, affinity: 6 }, result: '她幫你排了一週的作息表，貼在冰箱上。你第一次十一點前睡覺。', default: true },
      { text: '「我年輕，沒事」', effects: { affinity: -4 }, result: '她給你看了一張報告：「這是我病人，跟你同年。」你那晚十點就睡了。' },
    ],
  },
  {
    ...personal('yating', 1),
    title: '她累了',
    text: '雅婷值完連續夜班，一進門就倒在沙發上：「今天什麼都不要問我。」',
    choices: [
      { text: '煮一碗麵給她', effects: { energy: -3, affinity: 10 }, result: '麵有點糊，她吃完說：「好久沒有人煮東西給我吃了。」', default: true },
      { text: '安靜陪她', effects: { affinity: 6, mood: 2 }, result: '你們在沙發上坐了兩個小時，什麼都沒說，她說這是最好的約會。' },
    ],
  },
  {
    ...personal('yating', 2),
    title: '要不要換工作',
    text: '雅婷說醫院人力越來越缺，她每天都在想要不要離開臨床。「我是不是很沒用？」',
    choices: [
      { text: '「你已經很努力了」', effects: { affinity: 10, mood: -2 }, result: '她哭了一下，然後說要再撐一年看看。你知道不管她選哪個，你都會陪著。', default: true },
      { text: '幫她查職缺', effects: { affinity: 6, energy: -3 }, result: '你們一起看了好多職缺。她說：「原來我也有選擇。」光是這樣就輕鬆很多。' },
    ],
  },

  // ── 📚 宜蓁：國中老師 ──
  {
    ...meet('yizhen', [26, 43], s => 1 + weeklySlots(s.schedule, 'study')),
    title: '社區大學的同學',
    text: '社區大學的課，坐你旁邊的宜蓁筆記寫得超整齊，還用三種顏色。下課時她問：「你剛剛那段有聽懂嗎？」',
    choices: [
      { text: '「完全沒有，可以借筆記嗎」', effects: { mood: 5 }, love: { meet: 'yizhen' }, result: '她笑了，把筆記拍照傳給你，還附上重點整理。她說她是國中老師，職業病。', default: true },
      { text: '「有啊」（其實沒有）', effects: { mood: 1 }, result: '她點點頭，下週換座位了。你的筆記還是一片空白。' },
    ],
  },
  {
    id: 'crush_yizhen',
    followUp: true, // 認識滿 crushDays 天由 love.js 觸發
    cast: 'yizhen',
    title: '改作業的夜晚',
    text: '宜蓁說今晚要改 120 本週記：「你可以來陪我嗎？我請你吃鹹酥雞。」',
    choices: [
      { text: '去幫忙', effects: { energy: -5, affinity: 10, mood: 4 }, result: '你負責蓋「閱」的章，蓋了 120 次。有一本週記寫「老師最近看起來很開心」，她臉紅了。', default: true },
      { text: '視訊陪她', effects: { affinity: 5 }, result: '你們視訊了三小時，她改作業，你看她改作業。不知道為什麼很好看。' },
    ],
  },
  {
    ...personal('yizhen', 0),
    title: '家長群組',
    text: '晚上十點，宜蓁的手機還在響。家長群組：「老師，我家小孩說作業太多。」「老師，明天要帶什麼？」',
    choices: [
      { text: '幫她泡一杯茶', effects: { affinity: 6, mood: 2 }, result: '她回完最後一則訊息，喝了一口茶：「原來被照顧是這種感覺。」', default: true },
      { text: '「你也有下班的權利」', effects: { affinity: 4, mood: 3 }, result: '她想了一下，第一次把手機轉成靜音。隔天早上有 47 則未讀。' },
    ],
  },
  {
    ...personal('yizhen', 1),
    title: '寒假要去哪',
    text: '宜蓁的寒假有三週，她排好了旅行計畫。你的特休只剩兩天。',
    choices: [
      { text: '請假陪她去', effects: { money: -20000, mood: 12, performance: -2, affinity: 10 }, result: '在京都的寺廟前，她說：「我教了十年地理，第一次真的來。」', default: true },
      { text: '「你先去，我週末飛過去」', effects: { money: -12000, mood: 6, affinity: 5 }, result: '你週五下班直接去機場。她在出口舉著一張寫你名字的紙，像在接機。' },
    ],
  },
  {
    ...personal('yizhen', 2),
    title: '她的學生畢業了',
    text: '宜蓁帶的第一屆學生畢業了，畢業典禮上她哭得比學生還慘，還拉你去當「老師的家屬」。',
    choices: [
      { text: '去', effects: { mood: 8, affinity: 10 }, result: '學生們起鬨：「老師的男朋友！女朋友！」你們都臉紅了。有個學生說：「老師最近都不罵人了，謝謝你。」', default: true },
      { text: '在外面等她', effects: { affinity: 4 }, result: '她出來時抱著一大束花，說：「下次一起進去。」' },
    ],
  },

  // ── 交往中的共通事件 ──
  {
    id: 'love_anniversary',
    followUp: true, // 交往滿一年由 love.js 觸發
    cast: 'partner',
    title: '交往一週年',
    text: '下班時你突然想起來：今天好像是交往一週年？你打開行事曆，確定是今天，而且你什麼都沒準備。',
    choices: [
      { text: '衝去買花和蛋糕', effects: { money: -2500, affinity: 6 }, result: '你氣喘吁吁地出現，{伴侶}笑著說：「我也忘了，剛剛才想起來。」', default: true },
      { text: '假裝早就準備好了', chance: { p: 0.4, effects: { affinity: 8 }, result: '你帶{伴侶}去吃了路邊攤，說是「回到初心」。對方居然很感動。', otherwise: { affinity: -6 }, otherwiseResult: '對方看穿了，但還是笑著陪你吃了泡麵。泡麵是你們的一週年晚餐。' } },
    ],
  },
  {
    id: 'love_meet_parents',
    cast: 'partner',
    weight: LOVE_WEIGHT,
    condition: s => together(s, 400),
    title: '見家長',
    text: '{伴侶}說：「我爸媽想見你。」你開始搜尋「見家長 穿什麼」「見家長 帶什麼伴手禮」「見家長 不要說什麼」。',
    choices: [
      { text: '準備了一整週', effects: { energy: -5, money: -3000, affinity: 8 }, result: '對方的媽媽問了你薪水、有沒有買房、什麼時候結婚。你終於知道過年被問是在練習什麼了。', default: true },
      { text: '「做自己就好」', chance: { p: 0.5, effects: { affinity: 6, mood: 4 }, result: '對方的爸爸跟你聊了兩小時釣魚。你不會釣魚，但他很滿意。', otherwise: { affinity: -3, mood: -4 }, otherwiseResult: '你說了一個冷笑話，全桌安靜了五秒。{伴侶}在桌下踩了你一腳。' } },
    ],
  },
  {
    id: 'love_move_in',
    cast: 'partner',
    weight: LOVE_WEIGHT,
    condition: s => together(s, 500),
    title: '要不要同居？',
    text: '{伴侶}：「我們每週都在對方家過夜，乾脆住一起吧？房租還可以省一半。」',
    choices: [
      { text: '好啊', effects: { money: 6000, affinity: 6 }, result: '搬家那天你才發現，兩個人的東西加起來需要三台車。還有，對方擠牙膏是從中間擠的。', default: true },
      { text: '「再想想」', effects: { affinity: -2 }, result: '對方說好。你們繼續每週在兩個家之間搬東西，像兩隻很忙的寄居蟹。' },
    ],
  },
  {
    id: 'love_mbti',
    cast: 'partner',
    weight: LOVE_WEIGHT,
    condition: s => together(s, 120),
    title: 'MBTI 合不合',
    text: '{伴侶}傳來一篇脆文：「這兩個 MBTI 在一起註定會吵架！」剛好就是你們兩個。',
    choices: [
      { text: '「那我們來證明它是錯的」', effects: { affinity: 5 }, result: '你們開始在每次吵架後說「看吧，脆說的是錯的」，然後就吵不下去了。', default: true },
      { text: '認真研究', effects: { energy: -3, affinity: -1 }, result: '你們研究了一晚，最後為了「誰比較像 J 人」吵了一架。脆說對了。' },
    ],
  },
  {
    id: 'love_trip_fight',
    cast: 'partner',
    weight: LOVE_WEIGHT,
    condition: s => together(s, 200),
    title: '一起出國',
    text: '第一次一起出國，第一天就為了「要排滿行程還是隨便走走」吵起來了。',
    choices: [
      { text: '各退一步', effects: { money: -25000, mood: 10, affinity: 6 }, result: '早上照行程走，下午隨便走。你們在迷路的巷子裡找到了最好吃的一家店。', default: true },
      { text: '各玩各的一天', effects: { money: -25000, mood: 6, affinity: -2 }, result: '晚上在飯店會合，兩個人都買了要送對方的禮物，而且是同一個。' },
    ],
  },
  {
    id: 'love_work_first',
    cast: 'partner',
    weight: LOVE_WEIGHT * 2,
    condition: s => dating(s) && weeklySlots(s.schedule, 'overtime') >= LOVE.overtimeSlots,
    title: '「你是不是比較愛工作？」',
    text: '這週你又加了好幾天班。{伴侶}傳來一句：「你是不是比較愛工作？」後面沒有表情符號。',
    choices: [
      { text: '週末推掉所有事陪對方', effects: { affinity: 10, mood: 4 }, forceSlots: { activity: 'social', days: 7, slots: [5] }, result: '週六你們在家耍廢了一整天。{伴侶}說：「這才是你。」', default: true },
      { text: '「這陣子真的比較忙」', effects: { affinity: -8 }, result: '{伴侶}回：「好。」你知道這個「好」不太好。' },
      { text: '「工作又不會陪我變老」', effects: { affinity: 12, mood: 3 }, result: '你說完自己都覺得很肉麻。對方回了十個愛心，和一張你加班時的偷拍照。' },
    ],
  },

  // ── 系統觸發：告白、談談、分手（§9.4）──
  {
    id: 'love_confess',
    followUp: true,
    major: true,
    cast: 'partner',
    title: '要告白嗎？',
    text: '和{伴侶}越來越常聊天，一起吃飯、一起散步，誰都沒有說破。今天散步回家的路上，空氣突然安靜下來。',
    choices: [
      {
        text: '「我喜歡你」',
        hint: s => `成功機率約 ${Math.round(Math.min(1, s.love.affinity / 100 + LOVE.confessBonus) * 100)}%`,
        chance: {
          p: s => s.love.affinity / 100 + LOVE.confessBonus,
          effects: { mood: 15, affinity: 10 },
          love: { stage: 'dating' },
          result: '{伴侶}愣了一下，然後笑了：「你怎麼現在才說。」你們在路燈下站了很久。',
          otherwise: { mood: -8, affinity: -LOVE.confessFail },
          otherwiseResult: '{伴侶}低下頭：「我還沒想清楚，可以再給我一點時間嗎？」回家的路變得好長。',
        },
        default: true,
      },
      { text: '再觀察一下', result: '你們聊了天氣、聊了明天的午餐，就是沒聊到重點。也許下次吧。' },
      { text: '當朋友就好', effects: { mood: -3 }, love: { end: true }, result: '你們還是會在群組裡互相按讚。有些人，當朋友剛剛好。' },
    ],
  },
  {
    id: 'love_talk',
    followUp: true,
    major: true,
    cast: 'partner',
    title: '我們是不是該談談',
    text: '{伴侶}：「我們是不是該談談？最近感覺你都很忙，我們好像只剩下傳『晚安』。」',
    choices: [
      { text: '好好談', effects: { affinity: 20, mood: -3, energy: -4 }, result: '你們談到半夜，講了很多一直沒說的話。最後{伴侶}說：「那這週末，只屬於我們。」', default: true },
      { text: '「也許我們該分開一陣子」', effects: { mood: -25 }, love: { end: true }, result: '{伴侶}沉默了很久，最後說：「好，謝謝你。」你們把對方的東西裝箱，像在整理一段人生。' },
    ],
  },
  {
    id: 'love_dumped',
    followUp: true,
    major: true,
    cast: 'partner',
    title: '{伴侶}想分手',
    text: '{伴侶}約你喝咖啡，咖啡還沒上就開口了：「我想了很久，我們分手吧。你沒有不好，只是我們走著走著就散了。」',
    choices: [
      { text: '回家大哭一場', effects: { mood: -25, energy: -10 }, love: { end: true }, result: '你哭了一整晚，隔天腫著眼睛上班。隔壁同事什麼都沒問，默默在你桌上放了一杯珍奶。', default: true },
      { text: '找朋友喝到天亮', effects: { mood: -20, energy: -15, money: -2000 }, love: { end: true }, result: '朋友陪你喝到天亮，說了一百次「下一個會更好」。你不知道會不會，但謝謝他們。' },
    ],
  },
];
