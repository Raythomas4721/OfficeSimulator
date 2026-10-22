// 人生章節（DESIGN.md §5.5）：滿那個年紀的生日（7/1）跳開場卡；生活小事也依章節分池
// age 是這一章開始的年紀，到下一章開始前都算這一章
export const CHAPTERS = [
  {
    n: 1,
    age: 22,
    title: '新鮮人的肝還很新',
    text: '二十二歲，第一份工作。什麼都不懂，但肝還很新，熬夜隔天照樣上班。',
  },
  {
    n: 2,
    age: 25,
    title: '月光族的覺醒',
    text: '二十五歲。朋友開始結婚、換工作、在脆上曬存款，你終於開始思考：錢到底都去哪了？',
  },
  {
    n: 3,
    age: 30,
    title: '三十而立，腰先不立',
    text: '三十歲。有人買房、有人結婚，也有人說三十歲才剛開始。熬夜的代價，從睡一天變成要補三天。',
  },
  {
    n: 4,
    age: 40,
    title: '腰開始痛的年紀',
    text: '四十歲。爸媽變老了，新人的梗聽不懂了。不過你也比以前更清楚，什麼對自己才是重要的。',
  },
  {
    n: 5,
    age: 50,
    title: '下半場，倒數計時',
    text: '五十歲。離退休越來越近。回頭看看這一路，好像也走了很遠。',
  },
];

export const CHAPTER_NUMBERS = ['一', '二', '三', '四', '五'];
export const RETIRE_AGE = 65; // 最後一章到這裡結束（v0.6 人生回顧）

export const chapterOfAge = age => [...CHAPTERS].reverse().find(c => age >= c.age) ?? CHAPTERS[0];
