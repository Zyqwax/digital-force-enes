/* ============================================================
   APP.JS — iOS Notes Style + Force Logic
   ============================================================ */

// ═══════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════
const state = {
  celebs: { items: [], forcedWord: null, forcedIndex: null, chosenNum: null },
  foods:  { items: [], forcedWord: null, forcedIndex: null, chosenNum: null },
  cards:  { items: [], forcedWord: null, forcedIndex: null, chosenNum: null },
};

// ═══════════════════════════════════════════
//  SHUFFLE + INIT
// ═══════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function initLists() {
  state.celebs.items = shuffle(CELEBS_RAW.map(n => ({ name: n })));
  state.foods.items  = shuffle(FOODS_RAW.map(n => ({ name: n })));
  state.cards.items  = shuffle(CARDS_RAW.map(c => ({ name: c.name, suit: c.suit, isRed: c.isRed })));
  ['celebs','foods','cards'].forEach(k => {
    state[k].forcedIndex = null;
    state[k].chosenNum   = null;
    // forcedWord korunur
  });
}

// Force: belirtilen pozisyona istenen kelimeyi koy
function applyForce(listKey, oneBasedIdx, itemName) {
  const s   = state[listKey];
  const idx = oneBasedIdx - 1;
  // Listeden çıkar
  const ei = s.items.findIndex(i => i.name === itemName);
  if (ei !== -1) s.items.splice(ei, 1);
  // Hedefe yerleştir
  const raw = getRawItem(listKey, itemName);
  s.items.splice(idx, 0, { ...raw });
  // Uzunluk sınırı
  const max = listKey === 'cards' ? 52 : 100;
  if (s.items.length > max) s.items = s.items.slice(0, max);
  s.forcedIndex = idx;
  s.chosenNum   = oneBasedIdx;
}

function getRawItem(listKey, name) {
  if (listKey === 'cards') {
    const c = CARDS_RAW.find(c => c.name === name);
    return c ? { name: c.name, suit: c.suit, isRed: c.isRed } : { name };
  }
  return { name };
}

// ═══════════════════════════════════════════
//  PAGE NAVIGATION (iOS Notes Style)
// ═══════════════════════════════════════════
const mainPage = document.getElementById('main-page');
const detailPage = document.getElementById('detail-page');
const detailList = document.getElementById('detail-list');
const detailTitle = document.getElementById('detail-title');
const detailSubtitle = document.getElementById('detail-subtitle');

document.querySelectorAll('.note-entry').forEach(btn => {
  btn.addEventListener('click', () => {
    openDetail(btn.dataset.section);
  });
});

document.getElementById('back-btn').addEventListener('click', closeDetail);

function openDetail(key) {
  const titles = { celebs: 'Ünlüler', foods: 'Yemekler', cards: 'Kartlar' };
  const counts = { celebs: '100 kişi', foods: '100 yemek', cards: '52 kart' };
  
  detailTitle.textContent = titles[key];
  detailSubtitle.textContent = counts[key];
  
  // Render list
  const s = state[key];
  detailList.innerHTML = '';
  detailList.className = `detail-list ${key}-page`; // for dot color
  
  s.items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'list-item' + (i === s.forcedIndex ? ' forced' : '');
    const suf = key === 'cards' && item.suit
      ? `<span class="item-suffix ${item.isRed ? 'red-suit' : ''}">${item.suit}</span>`
      : '';
    row.innerHTML = `<span class="item-num">${i+1}</span><span class="item-dot"></span><span class="item-name">${item.name}</span>${suf}`;
    detailList.appendChild(row);
  });

  // Animasyon
  mainPage.classList.remove('page-center');
  mainPage.classList.add('page-left');
  detailPage.classList.remove('page-right');
  detailPage.classList.add('page-center');
}

function closeDetail() {
  mainPage.classList.remove('page-left');
  mainPage.classList.add('page-center');
  detailPage.classList.remove('page-center');
  detailPage.classList.add('page-right');
}

// Başlangıçta ana sayfa center'da olsun
mainPage.classList.add('page-center');


// ═══════════════════════════════════════════
//  SECRET PANEL — 5 tap on title
// ═══════════════════════════════════════════
let tapCount = 0, tapTimer = null;
const TAP_GOAL = 5, TAP_MS = 1500;
const tapZone      = document.getElementById('secret-tap-zone');
const tapIndicator = document.getElementById('tap-indicator');
const overlay      = document.getElementById('secret-overlay');
const panel        = document.getElementById('secret-panel');

tapZone.addEventListener('click', () => {
  tapCount++;
  clearTimeout(tapTimer);
  if (tapCount >= TAP_GOAL) {
    tapCount = 0;
    tapIndicator.classList.remove('show');
    openPanel();
  } else {
    tapIndicator.textContent = `${tapCount}/${TAP_GOAL}`;
    tapIndicator.classList.add('show');
    tapTimer = setTimeout(() => { tapCount = 0; tapIndicator.classList.remove('show'); }, TAP_MS);
  }
});

function openPanel() {
  overlay.classList.remove('hidden');
  panel.style.animation = 'slide-up 0.3s cubic-bezier(0.32,0.72,0,1) forwards';
  switchTab('numbers');
  syncNumRows();
}
function closePanel() {
  panel.style.animation = 'slide-down 0.28s cubic-bezier(0.32,0.72,0,1) forwards';
  setTimeout(() => { overlay.classList.add('hidden'); panel.style.animation = ''; }, 280);
}

document.getElementById('panel-close').addEventListener('click', closePanel);
document.getElementById('cancel-btn').addEventListener('click', closePanel);
overlay.addEventListener('click', e => { if (e.target === overlay) closePanel(); });

// ── Panel Tabs ──
document.querySelectorAll('.panel-tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

function switchTab(name) {
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-content-${name}`));
  if (name === 'words') syncWordPickers();
}

// ═══════════════════════════════════════════
//  HIZLI SAYI — Phone Numpad
// ═══════════════════════════════════════════

let activeNumList = 'celebs'; // hangi satır seçili
const numStr = { celebs: '', foods: '', cards: '' }; // yazılan rakamlar

// Satır seçimi
document.querySelectorAll('.num-row').forEach(row => {
  row.addEventListener('click', () => {
    document.querySelectorAll('.num-row').forEach(r => r.classList.remove('active-row'));
    row.classList.add('active-row');
    activeNumList = row.dataset.list;
  });
});

// Numpad tuşları
document.querySelectorAll('.np').forEach(btn => {
  btn.addEventListener('click', () => {
    const d   = btn.dataset.d;
    const key = activeNumList;
    const max = key === 'cards' ? 52 : 100;

    if (d === 'clear') {
      numStr[key] = '';
    } else if (d === 'back') {
      numStr[key] = numStr[key].slice(0, -1);
    } else {
      // max 3 hane
      if (numStr[key].length >= 3) return;
      const next = numStr[key] + d;
      if (parseInt(next) > max) return; // limiti aşma
      numStr[key] = next;
    }

    const val = numStr[key] === '' ? null : parseInt(numStr[key]);
    updateNumDisplay(key, val);
  });
});

function updateNumDisplay(key, val) {
  const el = document.getElementById(`nr-display-${key}`);
  el.textContent = val !== null ? val : '—';
}

function syncNumRows() {
  ['celebs', 'foods', 'cards'].forEach(key => {
    const word = state[key].forcedWord;
    document.getElementById(`nr-word-${key}`).textContent = word || '—';
    const val = numStr[key] ? parseInt(numStr[key]) : null;
    updateNumDisplay(key, val);
  });
}

// Apply
document.getElementById('apply-btn').addEventListener('click', () => {
  let applied = false;
  ['celebs','foods','cards'].forEach(key => {
    const num  = numStr[key] ? parseInt(numStr[key]) : null;
    const word = state[key].forcedWord;
    if (num && word) {
      applyForce(key, num, word);
      applied = true;
    }
  });
  if (applied) {
    closePanel();
    showToast('✓ Force uygulandı');
    
    // Uygulama sonrası doğrudan o sayfayı aç! (iOS notes gibi içine gir)
    const firstKey = ['celebs','foods','cards'].find(k => numStr[k] && state[k].forcedWord);
    if (firstKey) {
      openDetail(firstKey);
    }
  } else {
    showToast('Kelime seçilmedi! Önce Kelime Ayarı yapın.');
  }
});


// ═══════════════════════════════════════════
//  KELIME AYARI — Word Setup Tab
// ═══════════════════════════════════════════

function getListData(key) {
  if (key === 'celebs') return CELEBS_RAW;
  if (key === 'foods')  return FOODS_RAW;
  if (key === 'cards')  return CARDS_RAW.map(c => c.name);
  return [];
}

function buildWordChoiceList(key, filter) {
  const el    = document.getElementById(`wchoice-${key}`);
  const items = getListData(key).filter(n =>
    typeof n === 'string' && n.toLowerCase().includes(filter.toLowerCase())
  );
  el.innerHTML = '';
  items.slice(0, 50).forEach(name => {
    const row = document.createElement('div');
    row.className = 'wchoice-item' + (name === state[key].forcedWord ? ' selected' : '');
    row.textContent = name;
    row.addEventListener('click', () => {
      state[key].forcedWord = name;
      document.getElementById(`wpb-current-${key}`).textContent = name;
      buildWordChoiceList(key, document.getElementById(`wsearch-${key}`).value);
    });
    el.appendChild(row);
  });
}

function syncWordPickers() {
  ['celebs','foods','cards'].forEach(key => {
    const w = state[key].forcedWord;
    document.getElementById(`wpb-current-${key}`).textContent = w || 'Seçilmedi';
    document.getElementById(`wsearch-${key}`).value = '';
    buildWordChoiceList(key, '');
  });
}

document.querySelectorAll('.word-search').forEach(inp => {
  inp.addEventListener('input', () => {
    buildWordChoiceList(inp.dataset.list, inp.value);
  });
});

document.getElementById('save-words-btn').addEventListener('click', () => {
  const set = ['celebs','foods','cards'].filter(k => state[k].forcedWord);
  if (set.length === 0) { showToast('Hiç kelime seçilmedi'); return; }
  ['celebs','foods','cards'].forEach(k => {
    document.getElementById(`nr-word-${k}`).textContent = state[k].forcedWord || '—';
  });
  switchTab('numbers');
  showToast(`✓ ${set.length} kelime kaydedildi`);
});

document.getElementById('reset-all-btn').addEventListener('click', () => {
  if (!confirm('Listeler yeniden karıştırılsın mı?')) return;
  ['celebs','foods','cards'].forEach(k => { state[k].forcedWord = null; numStr[k] = ''; });
  initLists(); closePanel();
  // Eğer ana sayfada değilsek ana sayfaya dön
  closeDetail();
  showToast('Listeler yeniden karıştırıldı');
});

// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
let toastT = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2500);
}

// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
initLists();
