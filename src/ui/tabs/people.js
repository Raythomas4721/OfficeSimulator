// 「人際」分頁（DESIGN.md §9.4）：感情、家人、身邊的人的現況
import { CAST, CAST_BY_ID, castStatus } from '../../data/cast.js';
import { LOVE_PREFS_BY_ID, LOVE_STAGES, PARTNERS_BY_ID, weeklySlots } from '../../data/partners.js';
import { SLOT_ACTIVITIES } from '../../data/schedule.js';
import { monthsBetween } from '../../core/calendar.js';
import { formatMonths } from '../format.js';

const activityLabel = id => SLOT_ACTIVITIES.find(a => a.id === id).label;

const castRow = (c, text) =>
  `<li><span class="cast-emoji" aria-hidden="true">${c.emoji}</span><span><b>${c.name}</b><small>${c.role}</small><br>${text}</span></li>`;

export function render() {
  return `
    <section class="card">
      <h2>感情</h2>
      <div data-block="love"></div>
    </section>
    <section class="card">
      <h2>家人</h2>
      <ul class="cast-list" data-block="family"></ul>
    </section>
    <section class="card">
      <h2>身邊的人</h2>
      <ul class="cast-list" data-block="cast"></ul>
    </section>`;
}

export const binds = {
  affinity: ({ state }) => Math.floor(state.love.affinity),
  affinityPct: ({ state }) => state.love.affinity,
};

export const blocks = {
  love: ({ state }) => {
    const { love } = state;
    const partner = PARTNERS_BY_ID[love.partner];
    if (!partner) {
      const social = weeklySlots(state.schedule, 'social');
      const hint =
        love.pref === 'none' ? '目前選了先不談戀愛，可以到「選單」改。'
        : social ? `這週排了 ${social} 格社交，比較容易遇到新對象。`
        : '這週沒有排社交，不太會遇到新對象。在行程排「社交」就比較容易。';
      return `<p>${LOVE_STAGES.single}。喜歡的對象：${LOVE_PREFS_BY_ID[love.pref].label}。</p><p class="muted">${hint}</p>`;
    }
    const time = formatMonths(monthsBetween(love.since, state.day));
    return `
      <ul class="cast-list">${castRow({ ...partner, role: partner.job }, partner.desc)}</ul>
      <dl class="kv">
        <dt>關係</dt><dd>${LOVE_STAGES[love.stage]}（${time}）</dd>
        <dt>喜歡你排</dt><dd>${activityLabel('social')}、${activityLabel(partner.likes)}</dd>
        <dt>不喜歡你排</dt><dd>${activityLabel(partner.dislikes)}、加班太多</dd>
      </dl>
      <div class="meter"><span class="meter-label">好感</span><div class="bar bar-mood"><i data-bar="affinityPct"></i></div><b class="meter-value" data-bind="affinity"></b></div>
      <p class="muted">${love.stage === 'crush' ? '好感到 50 就有機會告白；掉到 15 以下就會漸漸沒聯絡。' : '好感每週會慢慢下降，要記得排約會。掉到 25 以下對方會想談談。'}</p>`;
  },
  family: ({ state }) => castRow(CAST_BY_ID.mom, castStatus(state, CAST_BY_ID.mom)),
  cast: ({ state }) =>
    CAST.filter(c => c.id !== 'mom')
      .map(c => castRow(c, castStatus(state, c)))
      .join(''),
};
