// 等玩家回應的卡片：state.pending 是目前這張，其他排在 state.queue（DESIGN.md §14.3）
// kind：'review'（每年 1/1 的「○○ 年的你」）、'event'（事件）、'notice'（病倒、課程結業等通知）、'away'（你不在的時候）
import { NOTICES } from '../data/notices.js';
import { EVENTS_BY_ID } from '../data/events.js';

export function pushCard(state, card) {
  if (state.pending) state.queue.push(card);
  else state.pending = card;
}

// 插到最前面，例如「你不在的時候」要比停下來等的抉擇先看到
export function pushCardFront(state, card) {
  if (state.pending) state.queue.unshift(state.pending);
  state.pending = card;
}

export function closeCard(state) {
  state.pending = state.queue.shift() ?? null;
}

// 離線時不自動處理、停下來等玩家的卡片（§5.3）：
// 重大抉擇（還沒選的升遷、有選項的通知：出院），以及還沒選的劇情事件（有 on 的事件，§10.3）
// 和標了 major 的事件（被約談）
export function isMajor(card) {
  if (card?.kind === 'review') return Boolean(card.annual?.offer) && !card.promotion; // 升遷抉擇
  if (card?.kind === 'notice') return Boolean(NOTICES[card.id]?.actions?.(card.data ?? {}));
  if (card?.kind === 'event') return card.step === 'choose' && Boolean(EVENTS_BY_ID[card.id]?.on || EVENTS_BY_ID[card.id]?.major);
  return false;
}
