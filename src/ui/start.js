// 開局流程前半（DESIGN.md §13.2）：標題 → 輸入名字（或匯入存檔碼）。之後進遊戲由人資教學接手
import { SURNAMES, GIVEN_NAMES } from '../data/names.js';
import { LOVE_PREFS } from '../data/partners.js';
import { ageOn } from '../core/calendar.js';
import { decodeSaveCode, writeSave } from '../core/save.js';
import { esc } from './format.js';
import { spriteImg } from './sprite.js';

const NAME_MAX = 12;

// 回傳 { action: 'continue', save? }（save 是剛匯入的存檔）或 { action: 'new', name, pref }
export function runStartFlow(root, { save }) {
  return new Promise(resolve => {
    const screens = { title, name, importCode };
    let pref = 'any';

    function title() {
      const cont = save
        ? `<button class="btn btn-block btn-primary" data-go="continue">繼續：${esc(save.state.player.name)}（${ageOn(save.state.day)} 歲）</button>`
        : '';
      return `
        <div class="start">
          <div class="start-logo" aria-hidden="true">${spriteImg('player')}</div>
          <h1>上班模擬器</h1>
          <p class="muted">Office Life Simulator</p>
          <div class="start-actions">
            ${cont}
            <button class="btn btn-block${save ? '' : ' btn-primary'}" data-go="new">開始新人生</button>
            <button class="btn btn-block" data-go="import">匯入存檔碼</button>
          </div>
        </div>`;
    }

    function importCode() {
      return `
        <div class="start">
          <h1>匯入存檔碼</h1>
          <p class="muted">把之前匯出的存檔碼（LS1: 開頭）整段貼上。</p>
          <textarea class="input code" id="import-code" aria-label="貼上存檔碼"></textarea>
          <p class="error" id="import-error"></p>
          <div class="start-actions">
            <button class="btn btn-block btn-primary" data-go="doImport">匯入</button>
            <button class="btn btn-block" data-go="back">返回</button>
          </div>
        </div>`;
    }

    function tryImport() {
      let imported;
      try {
        imported = decodeSaveCode(root.querySelector('#import-code').value);
      } catch (e) {
        root.querySelector('#import-error').textContent = e.message;
        return;
      }
      if (save && !confirm('目前的存檔會被覆蓋，確定要匯入嗎？')) return;
      writeSave(imported);
      finish({ action: 'continue', save: imported });
    }

    function name() {
      return `
        <div class="start">
          <h1>你叫什麼名字？</h1>
          <p class="muted">2026 年 7 月 1 日，22 歲的你第一天上班。</p>
          <div class="name-row">
            <input class="input" id="name" maxlength="${NAME_MAX}" value="${esc(randomName())}" autocomplete="off" aria-label="名字">
            <button class="btn" data-go="reroll" aria-label="換一個名字">🎲</button>
          </div>
          <h2>喜歡的對象</h2>
          <div class="preset-grid" role="group" aria-label="喜歡的對象">
            ${LOVE_PREFS.map(p => `<button class="btn" data-go="pref" data-pref="${p.id}" aria-pressed="${p.id === pref}">${p.label}</button>`).join('')}
          </div>
          <p class="muted">只影響會遇到誰，之後可以在選單改。</p>
          <div class="start-actions">
            <button class="btn btn-block btn-primary" data-go="named">第一天上班</button>
          </div>
        </div>`;
    }

    function show(screen) {
      root.innerHTML = screens[screen]();
      root.querySelector('#name')?.focus();
    }

    function finish(result) {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKey);
      resolve(result);
    }

    function submitName() {
      const input = root.querySelector('#name');
      const value = input.value.trim().slice(0, NAME_MAX);
      if (!value) return input.focus();
      finish({ action: 'new', name: value, pref });
    }

    function onClick(e) {
      const go = e.target.closest('[data-go]')?.dataset.go;
      if (go === 'continue') finish({ action: 'continue' });
      if (go === 'new') {
        if (save && !confirm('目前的存檔會被覆蓋，確定要開始新人生嗎？')) return;
        show('name');
      }
      if (go === 'reroll') root.querySelector('#name').value = randomName();
      if (go === 'pref') {
        pref = e.target.closest('[data-pref]').dataset.pref;
        for (const b of root.querySelectorAll('[data-pref]')) b.setAttribute('aria-pressed', String(b.dataset.pref === pref));
      }
      if (go === 'named') submitName();
      if (go === 'import') show('importCode');
      if (go === 'back') show('title');
      if (go === 'doImport') tryImport();
    }

    function onKey(e) {
      if (e.key === 'Enter' && e.target.id === 'name') submitName();
    }

    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKey);
    show('title');
  });
}

// 預設名字不影響遊戲結果，所以不用遊戲的亂數
const randomName = () =>
  SURNAMES[Math.floor(Math.random() * SURNAMES.length)] + GIVEN_NAMES[Math.floor(Math.random() * GIVEN_NAMES.length)];
