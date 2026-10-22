// 感情（DESIGN.md §9.4）：認識 → 曖昧 → 交往 → 分手；好感度每天結算
import { DAILY, LOVE } from '../data/balance.js';
import { PARTNERS_BY_ID, weeklySlots } from '../data/partners.js';
import { addLog } from '../core/state.js';
import { pushCard } from './cards.js';

export const partnerOf = state => PARTNERS_BY_ID[state.love.partner] ?? null;
export const inLove = state => state.love.stage === 'crush' || state.love.stage === 'dating';

const clampAffinity = state => (state.love.affinity = Math.min(100, Math.max(0, state.love.affinity)));

// 晚上的時段：社交要花錢；有對象時，約會加好感
export function applyLoveSlot(state, activity, weekend) {
  const k = weekend ? DAILY.weekendMultiplier : 1;
  if (activity === 'social') {
    state.money -= LOVE.socialCost * k;
    state.period.expenses += LOVE.socialCost * k;
  }
  if (activity !== 'social' || !inLove(state)) return;
  state.love.affinity += LOVE.dateGain * k;
  clampAffinity(state);
}

// 每天：好感自然下降；依這週的行程，對方喜歡、不喜歡的活動和加班太多各算七分之一；交往中心情小幅回升
export function applyLoveDay(state) {
  if (!inLove(state)) return;
  const partner = partnerOf(state);
  const count = id => Math.min(LOVE.likeCap, weeklySlots(state.schedule, id));
  state.love.affinity += (count(partner.likes) * LOVE.likeGain - count(partner.dislikes) * LOVE.dislikeLoss) / 7 - LOVE.dailyDecay;
  if (weeklySlots(state.schedule, 'overtime') >= LOVE.overtimeSlots) state.love.affinity -= LOVE.overtimeWeeklyLoss / 7;
  clampAffinity(state);
  if (state.love.stage === 'dating') state.vitals.mood = Math.min(100, state.vitals.mood + LOVE.datingMood);
}

// 每天換日後檢查關係有沒有轉折；回傳要出現的事件 id（由 advance.js 觸發，避免循環引用）
// 曖昧、個人事件照認識或交往的天數出現；告白、談談、分手看好感
export function checkLove(state) {
  const { love } = state;
  const seen = id => (state.events.counts[id] ?? 0) > 0;
  const days = state.day - love.since;
  if (love.stage === 'crush' && love.affinity < LOVE.fadeBelow) {
    const name = partnerOf(state).name;
    endLove(state);
    addLog(state, { kind: 'loveFade', name });
    pushCard(state, { kind: 'notice', id: 'loveFade', data: { name } });
    return null;
  }
  if (state.day - (state.events.lastDay ?? -Infinity) < LOVE.cardGapDays) return null;
  if (love.stage === 'crush') {
    if (!seen(`crush_${love.partner}`) && days >= LOVE.crushDays) return `crush_${love.partner}`;
    if (love.affinity >= LOVE.confessAt && state.day >= love.nextAsk) {
      love.nextAsk = state.day + LOVE.askAgainDays;
      return 'love_confess';
    }
  }
  if (love.stage === 'dating' && state.day >= love.nextAsk) {
    if (love.affinity < LOVE.dumpBelow) {
      love.nextAsk = state.day + LOVE.talkAgainDays;
      return 'love_dumped';
    }
    if (love.affinity < LOVE.talkBelow) {
      love.nextAsk = state.day + LOVE.talkAgainDays;
      return 'love_talk';
    }
  }
  if (love.stage === 'dating') {
    const timed = [...LOVE.personalDays.map((d, n) => [`date_${love.partner}_${n + 1}`, d]), ['love_anniversary', LOVE.anniversaryDays]];
    const next = timed.sort((a, b) => a[1] - b[1]).find(([id]) => !seen(id));
    if (next && days >= next[1]) return next[0];
  }
  return null;
}

function endLove(state) {
  const { love } = state;
  if (love.partner) love.gone[love.partner] = true; // 這輪不會再遇到
  Object.assign(love, { partner: null, stage: 'single', affinity: 0, since: null, nextAsk: 0 });
}

// 事件選項的 love 欄位（events.js 的 chooseEvent 呼叫）
// { meet: id } 認識、{ stage: 'dating' } 開始交往、{ end: true } 結束（沒聯絡、分手、當朋友）
export function applyLove(state, spec) {
  const { love } = state;
  if (spec.meet) {
    Object.assign(love, { partner: spec.meet, stage: 'crush', affinity: LOVE.meetAffinity, since: state.day, nextAsk: 0 });
    addLog(state, { kind: 'loveMeet', id: spec.meet });
  }
  if (spec.stage === 'dating') {
    Object.assign(love, { stage: 'dating', since: state.day, nextAsk: 0 });
    addLog(state, { kind: 'loveDating', id: love.partner });
  }
  if (spec.end) {
    addLog(state, { kind: 'loveEnd', id: love.partner, stage: love.stage });
    endLove(state);
  }
}
