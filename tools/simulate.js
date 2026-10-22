// 平衡模擬（DESIGN.md §14.7）：node tools/simulate.js [年數] [種子]
// 卡片一律照預設選項處理（事件選 default、檢討選照舊、出院選繼續、升遷照策略接受或婉拒）
import { createState } from '../src/core/state.js';
import { advanceDay } from '../src/core/advance.js';
import { createRng } from '../src/core/rng.js';
import { calendarOf } from '../src/core/calendar.js';
import { autoResolve } from '../src/systems/auto.js';
import { enrollBlocker, enrollCourse } from '../src/systems/study.js';
import { LADDER } from '../src/data/jobs.js';
import { EVENT_LIST, EVENTS_BY_ID } from '../src/data/events.js';
import { CHAPTERS, chapterOfAge } from '../src/data/chapters.js';
import { TIDBITS } from '../src/data/tidbits.js';
import { TIME } from '../src/data/balance.js';
import { ageOn } from '../src/core/calendar.js';

const YEARS = Number(process.argv[2] ?? 10);
const SEED = Number(process.argv[3] ?? 12345);

// overtime／exercise／social：哪幾格加班、運動、社交（0 = 週一）
// study：管理不夠升下一級時報名課程（能報 PMP 就先報，否則主管培訓班），上課期間把這幾格改成進修
const STRATEGIES = [
  { name: '不加班', overtime: [] },
  { name: '不加班＋上課', overtime: [], study: [1, 3] },
  { name: '加班 2 格', overtime: [1, 3] },
  { name: '加班 2 格＋上課', overtime: [1, 3], study: [0, 2] },
  { name: '加班 2 格＋上課＋運動', overtime: [1, 3], study: [0, 2], exercise: [5] },
  { name: '加班 2 格＋上課、婉拒升遷', overtime: [1, 3], study: [0, 2], promotion: 'decline' },
  { name: '加班 3 格＋上課', overtime: [0, 2, 4], study: [1, 3] },
  { name: '加班 4 格＋上課', overtime: [0, 1, 2, 3], study: [4, 5] },
  { name: '加班 2 格＋週六社交', overtime: [1, 3], social: [5] },
];
const EVENT_SAMPLE = 3; // 列出事件次數的策略

function scheduleFor(state, { overtime, study = [], exercise = [], social = [] }) {
  const s = Array(7).fill('rest');
  overtime.forEach(i => (s[i] = 'overtime'));
  exercise.forEach(i => (s[i] = 'exercise'));
  social.forEach(i => (s[i] = 'social'));
  if (state.study.course) study.forEach(i => (s[i] = 'study'));
  return s;
}

function planStudy(state) {
  if (state.study.course) return;
  const next = LADDER.find(l => l.level === state.job.level + 1);
  if (state.skills.management >= (next?.skills?.management ?? 0)) return;
  enrollCourse(state, enrollBlocker(state, 'pmp') ? 'leadership' : 'pmp');
}

// years：要模擬幾年；cards 記下每張事件卡出現的日子（一生的事件報告用）
function simulate(strategy, years = YEARS) {
  const { promotion = 'accept' } = strategy;
  const state = createState('模擬');
  const rng = createRng(SEED);
  const cards = [];
  state.loveLog = { meet: 0, dating: 0, breakup: 0 }; // 只有模擬用，紀錄只留 30 筆不夠算
  let { partner, stage } = state.love;
  // 檢討卡片選「照舊」，所以由策略每天重新排行程（上課期間才排進修）
  const endYear = calendarOf(0).year + years;
  while (calendarOf(state.day).year < endYear || calendarOf(state.day).month < 2) {
    if (strategy.study) planStudy(state);
    state.schedule = scheduleFor(state, strategy);
    advanceDay(state, rng);
    while (state.pending) {
      const p = state.pending;
      if (p.kind === 'event' && p.step === 'choose' && !p.counted) {
        p.counted = true;
        cards.push({ id: p.id, day: state.day });
      }
      autoResolve(state, rng, { promotion });
    }
    if (state.love.partner && state.love.partner !== partner) state.loveLog.meet++;
    if (state.love.stage === 'dating' && stage !== 'dating') state.loveLog.dating++;
    if (stage === 'dating' && state.love.stage === 'single') state.loveLog.breakup++;
    ({ partner, stage } = state.love);
  }
  const title = LADDER.find(l => l.level === state.job.level).title;
  return {
    state,
    cards,
    row: {
      考核: state.job.reviews.map(r => r.grade).join(''),
      職位: title,
      月薪: state.job.salary.toLocaleString('zh-TW'),
      存款: state.money.toLocaleString('zh-TW'),
      病倒: state.stats.collapses,
      住院: state.stats.hospitalStays,
      管理: Math.floor(state.skills.management),
      體力上限: Math.floor(state.vitals.energyMax),
      上課: Object.values(state.study.done).reduce((a, b) => a + b, 0),
      重症: (state.events.counts.stomach_ulcer ?? 0) + (state.events.counts.palpitation ?? 0),
      約談: state.events.counts.pip_talk ?? 0,
      感情: loveSummary(state),
    },
  };
}

// 感情（§9.4）：認識幾個人、交往過幾個、現在的狀態
function loveSummary(state) {
  const kinds = state.loveLog;
  return `認識${kinds.meet}、交往${kinds.dating}、分手${kinds.breakup}、${{ single: '單身', crush: '曖昧', dating: '交往中', married: '已婚' }[state.love.stage]}`;
}

const results = STRATEGIES.map(s => ({ name: s.name, ...simulate(s) }));
console.log(`模擬 ${YEARS} 年（到 ${calendarOf(0).year + YEARS} 年 1 月底），種子 ${SEED}；卡片照預設選項處理\n`);
console.table(Object.fromEntries(results.map(r => [r.name, r.row])));

// 一生的事件報告（§10.2）：22～65 歲跑一輪，看事件卡張數、間隔、重複、各章節分布
const life = simulate(STRATEGIES[EVENT_SAMPLE], 43);
const counts = {};
for (const c of life.cards) counts[c.id] = (counts[c.id] ?? 0) + 1;
const repeated = Object.entries(counts).filter(([, n]) => n > 1);
const wrong = repeated.filter(([id]) => !EVENTS_BY_ID[id].repeat && !EVENTS_BY_ID[id].followUp); // 後續事件是系統觸發的後果，可以重複
const gaps = life.cards.slice(1).map((c, i) => ((c.day - life.cards[i].day) * TIME.msPerDay) / 1000).sort((a, b) => a - b);
const q = p => Math.round(gaps[Math.floor(gaps.length * p)] ?? 0);
const perChapter = CHAPTERS.map(ch => `第${ch.n}章 ${life.cards.filter(c => chapterOfAge(ageOn(c.day)).n === ch.n).length}`);
console.log(`\n一生的事件（${STRATEGIES[EVENT_SAMPLE].name}，43 年）：共 ${life.cards.length} 張、${Object.keys(counts).length} 種；間隔中位數 ${q(0.5)} 秒、九成 ${q(0.9)} 秒內、最長 ${Math.round(gaps.at(-1) ?? 0)} 秒`);
console.log(`各章節：${perChapter.join('、')}`);
console.log(`重複出現：${repeated.map(([id, n]) => `${EVENTS_BY_ID[id].title} ×${n}`).join('、') || '沒有'}`);
console.log(`不該重複卻重複：${wrong.map(([id]) => EVENTS_BY_ID[id].title).join('、') || '沒有'}`);
console.log(`生活小事：說了 ${Object.keys(life.state.tidbits.seen).length} / ${TIDBITS.length} 句`);
const stories = Object.groupBy(EVENT_LIST.filter(e => e.story && e.story !== 'love'), e => e.story);
console.log(`故事線：${Object.entries(stories).map(([id, list]) => `${id} ${list.filter(e => counts[e.id]).length}/${list.length}`).join('、')}（阿凱的店爆紅、倒了二選一）`);
const missed = list => list.filter(e => !counts[e.id] && !e.followUp);
console.log(`錯過的年紀事件：${missed(EVENT_LIST.filter(e => e.age && !e.story)).map(e => e.title).join('、') || '沒有'}`);
console.log(`從沒出現的其他事件：${missed(EVENT_LIST.filter(e => !e.age)).map(e => e.title).join('、')}`);
