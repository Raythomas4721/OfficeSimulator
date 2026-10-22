// 「○○ 年的你」卡片（DESIGN.md §5.4）：這一年的回顧＋考核年終＋升遷抉擇＋明年行程，外框由 cards.js 負責
import { BOSS, BOSS_COMMENTS } from '../data/reviews.js';
import { NOTICES } from '../data/notices.js';
import { REVIEW } from '../data/balance.js';
import { workEffects } from '../systems/work.js';
import { schedulePresets } from './text.js';
import { formatDate, formatMoney, formatSigned } from './format.js';

export function reviewCard(p, state) {
  const r = p.report;
  const a = p.annual;
  // 舊存檔裡可能還留著只有回顧、沒有考核的卡片
  const title = a ? `${p.year} 年的你` : `${p.year ?? ''} 年度回顧`;
  const comment = BOSS_COMMENTS.find(c => c.when(r)).text;
  // 1/1 結算時才出卡，期間寫到前一天（12/31）
  const range = `${formatDate(r.startDay, { weekday: false })} ～ ${formatDate(r.endDay - (a ? 1 : 0), { weekday: false })}`;
  const deciding = a?.offer && !p.promotion;
  return `
        <h2 id="card-title">📋 ${title}</h2>
        <p class="muted">${range}</p>
        <dl class="kv">
          <dt>收入</dt><dd>${formatMoney(r.income)}</dd>
          ${r.overtimePay ? `<dt>　其中加班費</dt><dd>${formatMoney(r.overtimePay)}</dd>` : ''}
          <dt>支出</dt><dd>${formatMoney(r.expenses)}</dd>
          <dt>存款</dt><dd>${formatMoney(r.moneyStart)} → ${formatMoney(r.moneyEnd)}</dd>
          <dt>體力</dt><dd>${Math.round(r.energyStart)} → ${Math.round(r.energyEnd)}</dd>
          <dt>心情</dt><dd>${Math.round(r.moodStart)} → ${Math.round(r.moodEnd)}</dd>
          <dt>工作表現</dt><dd>${formatSigned(r.perfGain, 1)}</dd>
          <dt>加班</dt><dd>${r.overtimeSlots} 次</dd>
          ${r.events != null ? `<dt>遇到的事</dt><dd>${r.events} 件</dd>` : ''}
          ${r.collapses ? `<dt>病倒</dt><dd>${r.collapses} 次</dd>` : ''}
          ${r.sickDays ? `<dt>病假</dt><dd>${r.sickDays} 天</dd>` : ''}
        </dl>
        <p class="speech"><b>${BOSS}：</b>「${comment}」</p>
        ${a ? appraisal(p) : ''}
        ${deciding ? promotion(a.offer, state) : schedule(p, state)}`;
}

// 考核、加薪、年終
function appraisal(p) {
  const lines = NOTICES.review.lines(p.annual).filter(Boolean);
  const salary = p.salary && p.salary.to !== p.salary.from ? `<li>月薪 ${formatMoney(p.salary.from)} → ${formatMoney(p.salary.to)}</li>` : '';
  return `
    <h3>年度考核</h3>
    <div class="speech">${lines.map(l => `<p>${l}</p>`).join('')}</div>
    <ul class="changes">${salary}<li>年終 +${formatMoney(p.bonus)}</li></ul>`;
}

// 有升遷時先選，選完才出現明年的行程
function promotion(offer, state) {
  const salary = Math.round((state.job.salary * (1 + REVIEW.promotionRaise)) / REVIEW.salaryRound) * REVIEW.salaryRound;
  const now = workEffects(state).energy;
  const next = workEffects(state, state.job.level + 1).energy;
  return `
    <div class="card-choices">
      <button class="btn btn-block choice-btn btn-primary" data-action="reviewPromotion" data-value="accept">接受升遷<small>月薪 ${formatMoney(state.job.salary)} → ${formatMoney(salary)}，但平日上班體力 ${formatSigned(now)} → ${formatSigned(next)}</small></button>
      <button class="btn btn-block choice-btn" data-action="reviewPromotion" data-value="decline">先不要<small>維持現職，心情 +${REVIEW.declineMood}；明年考核還能再升</small></button>
    </div>`;
}

// 活動有 5 種，逐格調整改到「今天」分頁的時段選單做（§5.4）
function schedule(p, state) {
  const decided = p.promotion === 'accepted' ? `<p class="note">🎉 你升上「${p.annual.offer.title}」了！</p>`
    : p.promotion === 'declined' ? '<p class="muted">你婉拒了升遷，明年再說。</p>' : '';
  return `
    ${decided}
    <h3>明年的每週行程</h3>
    <div class="preset-grid">
      ${schedulePresets(state).map(s => `<button class="btn${s.id === 'keep' ? ' btn-primary' : ''}" data-action="reviewPreset" data-value="${s.id}">${s.label}</button>`).join('')}
    </div>
    <p class="muted">想一天一天調整，關掉後在「今天」分頁點時段就能改。</p>`;
}

export const actions = {
  reviewPromotion: ({ value }, ctl) => ctl.decidePromotion(value === 'accept'),
  reviewPreset: ({ value }, ctl) => ctl.resolveReviewPreset(value),
};
