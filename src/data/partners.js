// 戀愛對象的角色池（DESIGN.md §9.4）：一輪人生通常只會遇到其中 1～3 位
import { LOVE } from './balance.js';

// likes / dislikes 是時段活動：你排對方喜歡的活動好感會加，不喜歡的會扣
export const PARTNERS = [
  { id: 'azhe', name: '阿哲', gender: 'm', emoji: '💪', job: '健身教練', desc: '上進派，三句不離蛋白質。', likes: 'exercise', dislikes: 'slack' },
  { id: 'boyu', name: '柏宇', gender: 'm', emoji: '💻', job: '工程師', desc: 'i 人，講話很少、訊息很長。', likes: 'slack', dislikes: 'exercise' },
  { id: 'chengen', name: '承恩', gender: 'm', emoji: '☕', job: '咖啡店老闆', desc: '顧家，記得你喝過的每一杯。', likes: 'rest', dislikes: 'overtime' },
  { id: 'shihan', name: '詩涵', gender: 'f', emoji: '📸', job: '行銷', desc: 'e 人，行程永遠排滿。', likes: 'social', dislikes: 'rest' },
  { id: 'yating', name: '雅婷', gender: 'f', emoji: '🩺', job: '護理師', desc: '直率，看你一眼就知道你幾天沒睡。', likes: 'rest', dislikes: 'overtime' },
  { id: 'yizhen', name: '宜蓁', gender: 'f', emoji: '📚', job: '國中老師', desc: '上進，寒暑假比你還忙。', likes: 'study', dislikes: 'slack' },
];

export const PARTNERS_BY_ID = Object.fromEntries(PARTNERS.map(p => [p.id, p]));

// 戀愛偏好（開局選、選單可改）；主角不設定性別，偏好只決定會遇到誰
export const LOVE_PREFS = [
  { id: 'men', label: '喜歡男生', genders: ['m'] },
  { id: 'women', label: '喜歡女生', genders: ['f'] },
  { id: 'any', label: '都可以', genders: ['m', 'f'] },
  { id: 'none', label: '先不談戀愛', genders: [] },
];

export const LOVE_PREFS_BY_ID = Object.fromEntries(LOVE_PREFS.map(p => [p.id, p]));

export const LOVE_STAGES = { single: '單身', crush: '曖昧中', dating: '交往中', married: '已婚' };

// 這週排了幾格某個活動（週末算 2 格）
export const weeklySlots = (schedule, activity) => schedule.reduce((n, id, i) => n + (id === activity ? (i >= 5 ? 2 : 1) : 0), 0);

// 單身、偏好符合、這輪還沒錯過的人，才會遇到
export function canMeet(state, id) {
  const pref = LOVE_PREFS_BY_ID[state.love.pref];
  return state.love.stage === 'single' && !state.love.gone[id] && pref.genders.includes(PARTNERS_BY_ID[id].gender);
}

// 這週社交越多，越容易認識人
export const meetWeight = state => LOVE.meetWeightBase + weeklySlots(state.schedule, 'social') * LOVE.meetWeightPerSocial;

// 事件文字裡的 {伴侶} 換成名字
export const fillNames = (text, partnerId) => text.replaceAll('{伴侶}', PARTNERS_BY_ID[partnerId]?.name ?? '對方');
