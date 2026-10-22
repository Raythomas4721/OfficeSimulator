// 年度回顧（DESIGN.md §5.4）：每年 12/31 結束時回顧這一年，順便調整明年的每週行程
import { calendarOf } from '../core/calendar.js';
import { closeCard, pushCard } from './cards.js';

// 每段期間開始時記下起點，期間內的收支由各系統累加
export function startPeriod(state) {
  state.period = {
    startDay: state.day,
    money: state.money,
    energy: state.vitals.energy,
    mood: state.vitals.mood,
    performance: state.job.performance,
    income: 0,
    overtimePay: 0,
    expenses: 0,
    overtimeSlots: 0,
    workDays: 0,
    events: 0,
  };
}

// 選好明年的行程才關卡片、開始新的一年；有升遷抉擇時要先選
export function resolveReview(state, schedule) {
  const card = state.pending;
  if (card?.annual?.offer && !card.promotion) return;
  if (schedule) state.schedule = [...schedule];
  closeCard(state);
  startPeriod(state);
}

// 這一年的回顧資料，1/1 考核時和考核結果放在同一張卡片（§5.4）
export function buildReport(state) {
  const p = state.period;
  return {
    startDay: p.startDay,
    endDay: state.day,
    income: p.income,
    overtimePay: p.overtimePay,
    expenses: p.expenses,
    moneyStart: p.money,
    moneyEnd: state.money,
    energyStart: p.energy,
    energyEnd: state.vitals.energy,
    moodStart: p.mood,
    moodEnd: state.vitals.mood,
    perfGain: state.job.performance - p.performance,
    perfPerWorkday: p.workDays ? (state.job.performance - p.performance) / p.workDays : 0,
    overtimeSlots: p.overtimeSlots,
    events: p.events ?? 0,
    collapses: state.health.collapses,
    sickDays: state.health.sickDays,
  };
}
