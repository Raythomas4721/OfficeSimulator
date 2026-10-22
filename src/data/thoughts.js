// 主角台詞（DESIGN.md §13.3）
// urgent 的優先，符合就只說這組；其他符合的台詞混在一起輪流說
// c：{ kind（work／sick／hospital）, season（spring／summer／autumn／winter）, overtimeHeavy, studying }
export const THOUGHTS = [
  { urgent: true, when: (s, c) => c.kind === 'hospital', lines: ['好想出院…', '醫院的飯好清淡…', '以後要好好照顧自己。'] },
  { urgent: true, when: (s, c) => c.kind === 'sick', lines: ['咳咳…', '好好休息吧…', '躺著追劇也不錯。'] },
  { urgent: true, when: s => s.vitals.energy < 20, lines: ['好想睡覺…', '眼皮好重…', '咖啡已經沒用了…', '我的肝在跟我說話。'] },
  { urgent: true, when: s => s.vitals.mood < 20, lines: ['好想放假…', '什麼時候才有連假…', '不想上班…', '我就爛。'] },
  { urgent: true, when: s => s.money < 0, lines: ['帳戶怎麼是負的…', '月底要吃泡麵了…', '錢包比我的心還空。'] },
  { when: (s, c) => c.overtimeHeavy, lines: ['最近好常加班…', '辦公室比家還熟了。', '加班費是用命換的。', '警衛伯伯都跟我說晚安了。'] },
  { when: (s, c) => c.studying, lines: ['下班還要上課，好累…', '學費不能白繳！', '作業寫完了嗎…', '沉沒成本是最好的鬧鐘。'] },
  { when: s => s.vitals.energyMax >= 112, lines: ['最近有運動，精神好多了。', '爬樓梯不會喘了！', '健身房的年費終於有回本的感覺。'] },
  { when: s => s.skills.management >= 30, lines: ['帶人好像也沒那麼難了。', '我好像越來越懂王經理了，有點可怕。'] },
  { when: (s, c) => c.season === 'spring', lines: ['春天了，好想去賞花。', '梅雨季要來了…', '花粉跟工作一樣，躲不掉。'] },
  { when: (s, c) => c.season === 'summer', lines: ['好熱…冷氣開強一點。', '想去海邊。', '出門五分鐘，流汗兩小時。'] },
  { when: (s, c) => c.season === 'autumn', lines: ['天氣變涼了，好舒服。', '快到年底了…', '年終會有幾個月呢…'] },
  { when: (s, c) => c.season === 'winter', lines: ['好冷，不想離開被窩。', '想吃薑母鴨。', '被窩是世界上最難離職的地方。'] },
  { when: s => s.vitals.mood >= 80, lines: ['今天狀態不錯！', '上班好像也沒那麼糟。', '今天的我，連王經理都愛。'] },
  { when: () => true, lines: ['今天也要加油。', '午餐吃什麼好呢？', '好想下班…', '再撐一下就週末了。', '收到～', '這個會議可以用一封信解決吧。', '便當又漲了嗎…'] },
];
