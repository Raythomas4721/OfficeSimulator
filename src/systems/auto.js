// 不等玩家、直接處理目前的卡片：模擬腳本使用，M3 的離線推進也會用到
// promotion：升遷抉擇要接受（'accept'）還是婉拒（'decline'）
import { closeCard } from './cards.js';
import { chooseEvent, defaultChoice } from './events.js';
import { resolveReview } from './review.js';
import { acceptPromotion, declinePromotion } from './annual.js';

export function autoResolve(state, rng, { promotion = 'accept' } = {}) {
  const card = state.pending;
  if (!card) return;
  if (card.kind === 'review') {
    if (card.annual?.offer && promotion === 'accept') acceptPromotion(state);
    else if (card.annual?.offer) declinePromotion(state);
    return resolveReview(state, null); // 行程照舊
  }
  if (card.kind === 'event' && card.step === 'choose') chooseEvent(state, rng, defaultChoice(card.id));
  closeCard(state); // 事件結果、通知（出院時選「繼續」）
}
