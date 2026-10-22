// 事件系統（DESIGN.md §10）：每天開始時擲骰，跳出事件卡片；玩家選擇後顯示結果
import { EVENTS } from '../data/balance.js';
import { EVENT_LIST, EVENTS_BY_ID } from '../data/events.js';
import { ageOn, calendarOf, dayOfDate, isWeekend } from '../core/calendar.js';
import { addLog } from '../core/state.js';
import { pushCard } from './cards.js';
import { applyEffects, diff, snapshot } from './effects.js';
import { addStatus } from './statuses.js';
import { collapse, hospitalize, startSickLeave } from './health.js';

export function eventCalendar(day) {
  const c = calendarOf(day);
  return { ...c, weekend: isWeekend(c.weekday) };
}

// 一生一次（§10.2）：只有 repeat 的日常事件會再出現，而且要等冷卻
const seen = (state, e) => (state.events.counts[e.id] ?? 0) > 0;
const cooledDown = (state, e) => {
  const last = state.events.last[e.id];
  return last == null || state.day - last >= (e.cooldownDays ?? EVENTS.repeatCooldownDays);
};
const available = (state, e) => (e.repeat ? cooledDown(state, e) : !seen(state, e));

// age: [最小, 最大)，只在那段年紀出現（§5.5）
export const ageFits = (e, day) => !e.age || (ageOn(day) >= e.age[0] && ageOn(day) < e.age[1]);

// 新人劇情之間比較密；其他事件和上一個事件至少隔 minGapDays
export const gapOf = e => (e.on?.day != null ? EVENTS.storyGapDays : EVENTS.minGapDays);

const weightOf = (e, state, c) => {
  const w = typeof e.weight === 'function' ? e.weight(state, c) : e.weight ?? EVENTS.weight;
  return e.age ? w * EVENTS.ageWeight : w;
};

// 同一個日子的節日是同一個節日的不同版本（例如過年 22 歲版、28 歲版），共用冷卻
const holidayKey = e => `${e.on.month}/${e.on.date}`;
const HOLIDAY_GROUPS = {};
for (const e of EVENT_LIST.filter(x => x.on?.month)) (HOLIDAY_GROUPS[holidayKey(e)] ??= []).push(e.id);
const holidayLast = (state, e) => Math.max(-Infinity, ...HOLIDAY_GROUPS[holidayKey(e)].map(id => state.events.last[id] ?? -Infinity));

// 劇情與節日（有 on 的事件）最早可以出現的日子，不考慮間隔；沒有就回傳 null（§10.2）
// - on.day：開局後第幾天的劇情，只出現一次；被間隔擋住就往後延，一定會出現
// - on.month + on.date：節日，可以延後 holidayWindowDays 天，再排不進去就跳過那一年；年紀要符合
// due 是原本該出現的日子；from 是最早能出現的日子（預告用：扣掉事件間隔後才可能出現）
export function scheduledDay(e, state, from = state.day) {
  if (!available(state, e)) return null;
  if (e.on.day != null) return { day: Math.max(e.on.day, from), due: e.on.day };
  const { year } = calendarOf(state.day);
  const last = holidayLast(state, e);
  for (const y of [year, year + 1, year + 2]) {
    const start = dayOfDate(y, e.on.month, e.on.date);
    if (start < 0) continue; // 開局前的節日不算
    if (from > start + EVENTS.holidayWindowDays || last >= start) continue;
    if (start - last < EVENTS.holidayCooldownDays) continue;
    const day = Math.max(start, from);
    if (!ageFits(e, day)) continue;
    if (e.condition && !e.condition({ ...state, day }, eventCalendar(day))) continue;
    return { day, due: start, holiday: true };
  }
  return null;
}

// 依可以出現的日子排序；同一天有好幾件時，新人劇情優先，節日其次
// 同一個節日有好幾個版本符合時，只留 EVENT_LIST 裡排前面的那個
// fromFor(e)：這件事最早可以出現的日子
function scheduledList(state, fromFor) {
  const list = EVENT_LIST.filter(e => e.on)
    .map(e => ({ event: e, ...scheduledDay(e, state, fromFor(e)) }))
    .filter(x => x.day != null)
    .sort((a, b) => a.day - b.day || Number(Boolean(a.holiday)) - Number(Boolean(b.holiday)) || a.due - b.due);
  const groups = new Set();
  return list.filter(x => {
    if (!x.holiday) return true;
    const key = holidayKey(x.event);
    if (groups.has(key)) return false;
    groups.add(key);
    return true;
  });
}

export const nextScheduled = (state, fromFor = () => state.day) => scheduledList(state, fromFor)[0] ?? null;

// 在新的一天開始時呼叫。劇情與節日優先；隨機事件只拿來填長空檔，快到劇情或節日時會讓位
export function rollEvent(state, rng) {
  const since = state.day - (state.events.lastDay ?? -Infinity);
  if (since < EVENTS.storyGapDays) return;
  const list = scheduledList(state, () => state.day);
  const due = list.find(x => x.day <= state.day && since >= gapOf(x.event));
  if (due) return triggerEvent(state, due.event.id);
  if (state.pending || since < EVENTS.minGapDays) return;
  if (list.some(x => x.day - state.day < EVENTS.minGapDays)) return;
  if (rng.next() >= EVENTS.dailyChance) return;
  const c = eventCalendar(state.day);
  const pool = EVENT_LIST.filter(
    e => !e.followUp && !e.on && available(state, e) && ageFits(e, state.day) && (!e.condition || e.condition(state, c)),
  );
  if (!pool.length) return;
  const weights = pool.map(e => weightOf(e, state, c));
  let r = rng.next() * weights.reduce((a, b) => a + b, 0);
  const picked = pool.find((e, i) => (r -= weights[i]) < 0) ?? pool[pool.length - 1];
  triggerEvent(state, picked.id);
}

export function triggerEvent(state, id) {
  state.events.lastDay = state.day;
  state.events.last[id] = state.day;
  state.events.counts[id] = (state.events.counts[id] ?? 0) + 1;
  if (state.period) state.period.events = (state.period.events ?? 0) + 1;
  // v：第幾次出現，日常事件依此換一個版本的文字（§10.2）
  pushCard(state, { kind: 'event', id, step: 'choose', v: state.events.counts[id] - 1 });
}

export const defaultChoice = id => Math.max(0, EVENTS_BY_ID[id].choices.findIndex(c => c.default));

// chance.p 可以是函式，例如外語越好越容易成功
export const chanceOf = (choice, state) => (typeof choice.chance.p === 'function' ? choice.chance.p(state) : choice.chance.p);

// 套用選項的效果，卡片換成「結果」畫面；後續事件與病倒通知排進佇列
export function chooseEvent(state, rng, index) {
  const card = state.pending;
  if (card?.kind !== 'event' || card.step !== 'choose') return;
  const event = EVENTS_BY_ID[card.id];
  const choice = event.choices[index];
  if (!choice) return;

  const before = snapshot(state);
  let text = choice.result ?? '';
  let followUp = null;
  let illness = null;
  // effects 可以是函式，依目前狀態決定數值（例如學費補助是學費的一半）
  const apply = fx => {
    const effects = typeof fx === 'function' ? fx(state) : fx;
    if (!effects) return;
    applyEffects(state, effects);
    if (effects.illness) illness = effects.illness;
  };

  apply(choice.effects);
  if (choice.chance) {
    if (rng.next() < chanceOf(choice, state)) {
      apply(choice.chance.effects);
      text = choice.chance.result ?? text;
      followUp = choice.chance.then ?? null;
    } else {
      apply(choice.chance.otherwise);
      text = choice.chance.otherwiseResult ?? text;
    }
  }

  // 事件卡片在一天開始時出現，所以「明天」是 day + 1、強制時段從今天晚上算起
  const notes = [];
  if (choice.delayed) {
    addStatus(state, { type: 'delayed', day: state.day + choice.delayed.days, effects: choice.delayed.effects });
    notes.push({ kind: 'delayed', ...choice.delayed });
  }
  if (choice.forceSlots) {
    const f = choice.forceSlots;
    const endDay = state.day + (f.days ?? f.weeks * 7);
    addStatus(state, { type: 'forceSlot', startDay: state.day, endDay, activity: f.activity, slots: f.slots, source: event.id });
    notes.push({ kind: 'forceSlot', endDay, ...f });
  }
  if (choice.crisis) Object.assign(state.crisis, choice.crisis); // 例如被約談後進入績效改善計畫
  if (choice.sickLeave) {
    startSickLeave(state, state.day, choice.sickLeave);
    notes.push({ kind: 'sickLeave', days: choice.sickLeave });
  }

  Object.assign(card, { step: 'result', choice: index, text, deltas: diff(before, snapshot(state)), notes });
  addLog(state, { kind: 'event', id: event.id, choice: index });
  if (illness === 'collapse') collapse(state, state.day);
  if (illness === 'hospital') hospitalize(state, state.day);
  if (followUp) triggerEvent(state, followUp);
}
