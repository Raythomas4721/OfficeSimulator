// 人生章節與生活小事（DESIGN.md §5.5）
import { TIDBITS as PACE } from '../data/balance.js';
import { CHAPTERS, RETIRE_AGE, chapterOfAge } from '../data/chapters.js';
import { TIDBITS } from '../data/tidbits.js';
import { ageOn, calendarOf, dayOfDate } from '../core/calendar.js';
import { addLog } from '../core/state.js';
import { pushCard } from './cards.js';

export const chapterOf = state => chapterOfAge(ageOn(state.day));

// 當天結算時呼叫：滿 25、30、40、50 歲的生日跳開場卡
export function checkChapter(state) {
  const c = calendarOf(state.day);
  if (c.month !== 7 || c.date !== 1) return;
  const chapter = CHAPTERS.find(ch => ch.age === ageOn(state.day) && ch.n > 1);
  if (!chapter || state.flags.chapters[chapter.n] != null) return;
  state.flags.chapters[chapter.n] = state.day;
  addLog(state, { kind: 'chapter', n: chapter.n });
  pushCard(state, { kind: 'notice', id: 'chapter', data: { n: chapter.n } });
}

// 這一章最後一天（下一章開始、或退休的前一天）
function chapterEnd(chapter) {
  const nextAge = CHAPTERS.find(ch => ch.n === chapter.n + 1)?.age ?? RETIRE_AGE;
  const { year } = calendarOf(0);
  return dayOfDate(year + (nextAge - CHAPTERS[0].age), 7, 1) - 1;
}

// 每天呼叫：這一章還沒說過的小事，平均分散在這一章剩下的日子裡（不用 rng，免得改變事件的亂數）
export function rollTidbit(state) {
  if (state.day - state.tidbits.lastDay < PACE.minGapDays) return;
  const chapter = chapterOf(state);
  const left = TIDBITS.filter(t => t.ch === chapter.n && !state.tidbits.seen[t.id]);
  if (!left.length) return;
  const daysLeft = chapterEnd(chapter) - state.day;
  const every = Math.max(PACE.minGapDays, Math.floor(daysLeft / left.length));
  if (state.day - state.tidbits.lastDay < every) return;
  const t = left[state.day % left.length]; // 用日子挑，看起來隨機但可重現
  state.tidbits.seen[t.id] = state.day;
  state.tidbits.lastDay = state.day;
  addLog(state, { kind: 'tidbit', id: t.id });
}
