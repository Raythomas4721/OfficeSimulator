// 「下一件大事」：最近的劇情、節日或年度回顧，讓等待的時候有東西可以期待
// 事件之間有最少間隔（§10.2），所以顯示的是扣掉間隔後「預計」最早的日子
import { calendarOf, dayOfDate } from '../core/calendar.js';
import { gapOf, nextScheduled } from '../systems/events.js';

export function upcoming(state) {
  const { year } = calendarOf(state.day);
  let best = { day: dayOfDate(year + 1, 1, 1), title: '年度回顧' };
  const last = state.events.lastDay ?? -Infinity;
  const next = nextScheduled(state, e => Math.max(state.day, last + gapOf(e, state.day)));
  if (next && next.day < best.day) best = { day: next.day, title: next.event.title };
  return best;
}
