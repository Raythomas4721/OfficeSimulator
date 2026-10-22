// 課程（DESIGN.md §9.1）。weeks × slots 是應出席次數；gain 是結業時加的技能
export const COURSES = [
  {
    id: 'leadership',
    title: '主管培訓班',
    emoji: '🧑‍💼',
    desc: '帶人、開會、排工作的基本功。想升主任以上一定要有。',
    weeks: 9,
    cost: 8_000,
    slots: 2,
    gain: { management: 10 },
    repeat: true,
  },
  {
    id: 'english',
    title: '英文會話班',
    emoji: '🗣️',
    desc: '下班後跟外師聊天，至少開會時聽得懂了。',
    weeks: 13,
    cost: 12_000,
    slots: 2,
    gain: { language: 15 },
    repeat: true,
  },
  {
    id: 'coding',
    title: '程式設計入門',
    emoji: '⌨️',
    desc: '從零開始寫程式，至少可以把每週的報表自動化。',
    weeks: 17,
    cost: 25_000,
    slots: 3,
    gain: { programming: 20 },
  },
  {
    id: 'pmp',
    title: 'PMP 專案管理',
    emoji: '📋',
    desc: '專案管理的系統課程，排時程、控風險、開會不再開成聊天會。',
    weeks: 13,
    cost: 30_000,
    slots: 2,
    gain: { management: 15 },
    minLevel: 2,
  },
  {
    id: 'mba',
    title: '在職專班（MBA）',
    emoji: '🎓',
    desc: '兩年的碩士班，學費很貴，但管理一次大幅提升。',
    weeks: 104,
    cost: 300_000,
    slots: 2,
    gain: { management: 30 },
    minLevel: 2, // 資深專員以上才能報名
  },
];

export const COURSES_BY_ID = Object.fromEntries(COURSES.map(c => [c.id, c]));
