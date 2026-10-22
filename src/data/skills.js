// 技能（DESIGN.md §6）：管理、外語、程式；v0.2 的「專業」在 M8 拿掉
export const SKILL_LIST = [
  { id: 'management', label: '管理', use: '升主任以上需要；上主管培訓班、在職專班提升' },
  { id: 'language', label: '外語', use: '上英文會話班提升；接待外國客戶這類事件用得到，之後轉職加分（v0.5）' },
  { id: 'programming', label: '程式', use: '上程式設計入門提升；寫程式自動化這類事件用得到，之後轉職加分（v0.5）' },
];

export const SKILL_LABELS = Object.fromEntries(SKILL_LIST.map(s => [s.id, s.label]));
