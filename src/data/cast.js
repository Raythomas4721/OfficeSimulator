// 固定班底（DESIGN.md §10.4）：在事件裡反覆出現的同事，v0.4 起會變成有好感度的 NPC
export const CAST = [
  { id: 'boss', name: '王經理', role: '直屬主管', emoji: '👔', desc: '口頭禪是「簡單改一下就好」，其實人不壞。' },
  { id: 'xiaomei', name: '小美', role: '熱心同事', emoji: '🙋', desc: '團購、訂飲料、辦活動都找她。' },
  { id: 'akai', name: '阿凱', role: '厭世同事', emoji: '😪', desc: '躺平代表，摸魚技術一流。' },
  { id: 'hr', name: '人資小林', role: '人資', emoji: '📋', desc: '帶你過第一天的人，試用期面談也是她。' },
  { id: 'mom', name: '媽媽', role: '家人', emoji: '👩', desc: '每天早上準時傳長輩圖。' },
];

export const CAST_BY_ID = Object.fromEntries(CAST.map(c => [c.id, c]));

// 人際分頁的「現況」（§9.4）：依故事線走到哪裡（events-cast.js），由後往前找第一個出現過的
export const CAST_STATUS = {
  boss: [
    ['boss_square_dance', '退休了，在公園帶廣場舞。'],
    ['boss_farewell', '退休了，聽說每天都在公園。'],
    ['boss_promoted', '升處長了，但大家還是叫他王經理。'],
  ],
  xiaomei: [
    ['xiaomei_kid_intern', '團購帝國的老闆，小孩來你們公司實習。'],
    ['xiaomei_empire', '團購社團二十萬人，還出了自有品牌。'],
    ['xiaomei_quit', '離職在家帶小孩，順便經營團購社團。'],
    ['xiaomei_maternity', '當媽媽了，群組的頭貼換成寶寶。'],
    ['xiaomei_wedding', '結婚了，團購照開。'],
  ],
  akai: [
    ['akai_hiking', '提早退休，每天早上傳山頂的照片給你。'],
    ['akai_comeback', '繞了一圈回到公司，坐在你隔壁。'],
    ['akai_shop_boom', '手搖飲店爆紅，現在是阿凱老闆。'],
    ['akai_shop_bust', '店收了，說要再想想人生。'],
    ['akai_drink_shop', '離職開了手搖飲店。'],
  ],
  mom: [
    ['mom_old_stories', '最近常翻舊相簿，講你小時候的事。'],
    ['mom_move_home', '出院後恢復得不錯，你們住得很近。'],
    ['mom_hospital', '住過一次院，現在要定期回診。'],
    ['mom_stickers', '學會買貼圖了，現在貼圖比字多。'],
  ],
};

export const castStatus = (state, c) => CAST_STATUS[c.id]?.find(([id]) => state.events.counts[id])?.[1] ?? c.desc;
