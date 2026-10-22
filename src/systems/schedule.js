import { DAILY, EXERCISE } from '../data/balance.js';
import { STUDY_PRESETS, SCHEDULE_PRESETS } from '../data/schedule.js';
import { COURSES_BY_ID } from '../data/courses.js';
import { slotIndex } from '../core/calendar.js';
import { overtimePay } from './finance.js';
import { forcedOn, leaveOn } from './statuses.js';
import { workEffects } from './work.js';
import { attendStudy } from './study.js';

// 優先順序：住院 > 病假 > 強制時段 > 行程範本（DESIGN.md §14.3）
export function activityFor(state, weekday, day = state.day) {
  if (leaveOn(state, day)) return 'rest';
  const slot = slotIndex(weekday);
  return forcedOn(state, day, slot)?.activity ?? state.schedule[slot];
}

export function applySlot(state, activity, weekend, multiplier) {
  const fx = slotEffects(activity, weekend);
  const k = weekend ? DAILY.weekendMultiplier : 1;
  state.vitals.energy += fx.energy;
  state.vitals.mood += fx.mood;
  state.job.performance += fx.performance * multiplier;
  if (activity === 'study') attendStudy(state, k);
  if (activity === 'exercise') {
    state.vitals.energyMax = Math.min(EXERCISE.capMax, state.vitals.energyMax + EXERCISE.maxPerSlot * k);
    state.money -= fx.cost;
    state.period.expenses += fx.cost;
  }
  if (activity === 'overtime') {
    const pay = overtimePay(state, weekend);
    state.money += pay;
    state.period.income += pay;
    state.period.overtimePay += pay;
    state.period.overtimeSlots += 1;
    state.stats.overtimeSlots += 1;
  }
}

// 體力上限越高，睡覺恢復越多（§6）
export const sleepEffects = state => ({ ...DAILY.sleep, energy: DAILY.sleep.energy + (state.vitals.energyMax - EXERCISE.baseMax) * EXERCISE.sleepPerPoint });

export function applySleep(state) {
  const fx = sleepEffects(state);
  state.vitals.energy += fx.energy;
  state.vitals.mood += fx.mood;
}

// 每天結算：不運動的話，體力上限慢慢回落
export function applyHealthDay(state) {
  state.vitals.energyMax = Math.max(EXERCISE.baseMax, state.vitals.energyMax - EXERCISE.dailyDecay);
}

// 一個時段的效果；週末是一整天，效果和花費加倍
export function slotEffects(activity, weekend) {
  const fx = DAILY[activity];
  const k = weekend ? DAILY.weekendMultiplier : 1;
  const cost = activity === 'exercise' ? EXERCISE.cost : 0;
  return { energy: fx.energy * k, mood: fx.mood * k, performance: fx.performance * k, cost: cost * k };
}

// 一鍵行程的內容；「上課」照目前課程每週要的格數排
export function presetSchedule(state, id) {
  if (id === 'study') {
    const course = state.study.course && COURSES_BY_ID[state.study.course.id];
    return course ? [...STUDY_PRESETS[course.slots]] : null;
  }
  const schedule = SCHEDULE_PRESETS.find(p => p.id === id)?.schedule;
  return schedule ? [...schedule] : null;
}

// 這週排了幾次進修（週末算 2 次），和課程要求比較用
export const studySlots = schedule => schedule.reduce((n, id, i) => n + (id === 'study' ? (i >= 5 ? 2 : 1) : 0), 0);

// 畫面用的每週預估：不含上限與體力、心情門檻的影響
export function weeklyForecast(state) {
  const sum = { energy: 0, mood: 0, performance: 0, overtimePay: 0, cost: 0 };
  const sleep = sleepEffects(state);
  for (let i = 0; i < 7; i++) {
    const weekend = i >= 5;
    const activity = state.schedule[i];
    const parts = weekend
      ? [slotEffects(activity, true), sleep]
      : [workEffects(state), slotEffects(activity, false), sleep];
    for (const fx of parts) {
      sum.energy += fx.energy;
      sum.mood += fx.mood;
      sum.performance += fx.performance;
      sum.cost += fx.cost ?? 0;
    }
    if (activity === 'overtime') sum.overtimePay += overtimePay(state, weekend);
  }
  return sum;
}
