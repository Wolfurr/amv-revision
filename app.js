// AMV — Révision SECUFER — Logique applicative
// Navigation, recherche, rendu des vues, quiz/flashcards/dictée, signaux, gares
// Dépend de : data-fiches.js, data-banks.js, data-signaux.js (doivent être chargés AVANT ce fichier)

// ═══════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════

// Source unique de vérité pour la version + date de MAJ (affichée en haut à droite)
const VERSION_LABEL = 'v6.1 — 18 juin 2026';

const THEMES = [
  { id:'epi',         code:'AMV801',        title:'EPI & Déplacements',                 short:'EPI' },
  { id:'zd',          code:'RRA20068',       title:'Zone dangereuse',                    short:'Zone dangereuse' },
  { id:'aiguillage',  code:'AMV200–216',     title:'Aiguillage & Appareils de voie',     short:'Aiguillage' },
  { id:'risques',     code:'AMV005/009',     title:'Risques ferroviaires & Communication',short:'Risques & Comm.' },
  { id:'install-sec', code:'AMV200/AMV250/AMV310', title:'Installations de Sécurité (IS)', short:'Install. Sécurité (IS)' },
  { id:'signaux',     code:'AMV207',         title:'Signaux ferroviaires',               short:'Signaux' },
  { id:'circulation', code:'AMV101–160',     title:'Circulation des trains',             short:'Circulation' },
  { id:'cantonnement',code:'AMV160',         title:'Cantonnement',                       short:'Cantonnement' },
  { id:'incidents',   code:'AMV109–113',     title:'Incidents de circulation / FAMAS',   short:'Incidents / FAMAS' },
  { id:'formation',   code:'AMV901–910',     title:'Formation des trains',               short:'Formation' },
  { id:'manœuvre',    code:'AMV905',         title:'Manœuvres',                          short:'Manœuvres' },
  { id:'elect',       code:'AMV600–803',     title:'Traction & Risques électriques',     short:'Traction & Risques élec.' },
  { id:'travaux',     code:'AMV300–310',     title:'Travaux sur les voies & IS',         short:'Travaux' },
  { id:'graissage',   code:'AMV804',         title:'Graissage des aiguilles',            short:'Graissage' },
];

// Liste « sûrs de tomber à l'examen » — affichée sur la page d'accueil, liens vers les fiches
const EXAM_PRIORITY = [
  ['1','Définition Zone dangereuse (ZD)','zd','Par cœur','Zone dangereuse'],
  ['2','Définition Emplacement de Garage (EG)','epi','Par cœur','Emplacement de garage'],
  ['3','FAMAS — 4 étapes + autocontrôle','incidents','Par cœur','FAMAS'],
  ['4','Obstacle · Danger · Présomption de danger','incidents','Par cœur','Obstacle'],
  ['5','Sillon · Ordre normal (ONJ) / Ordre réel (EC)','circulation','Par cœur','Sillon'],
  ['6','5 § du Document A (renseignements techniques)','circulation','Par cœur','Document A'],
  ['7','Les 3 marches : manœuvre / à vue / prudente','circulation','Par cœur','Marche à vue'],
  ['8','Article 1 DC3858 — 15 familles IS','install-sec','Par cœur','15 familles'],
  ['9','Cantonnement + identifier BAL/BAPR/BM sur terrain','cantonnement','Par cœur','BAL / BAPR / BM'],
  ['10','Consigne Rose — 5 chapitres + 6 premières annexes','aiguillage','À savoir','Consigne Rose'],
  ['11','5 familles de signaux (A/B/C/D/E)','signaux','À savoir','5 familles de signaux'],
  ['12','3 types de communication + 4 étapes (OP0542)','risques','À savoir','communication'],
  ['13','Les 9 codes radios','risques','À savoir','codes radios'],
  ['14','VP / VS — définitions exactes','circulation','Par cœur','Voie principale'],
  ['15','RAT — définition et utilité','formation','Par cœur','RAT'],
  ['16','4 essais de frein — bien différencier','formation','Bien différencier','essais de frein'],
  ['17','Définition Cantonnement','cantonnement','Par cœur','Cantonnement'],
  ['18','PRR — P·R·R : 3 vérifications avant manœuvre d\'un appareil de voie (aiguille)','aiguillage','Par cœur','PRR & ACPP'],
  ['19','ACPP — A·C·P·P : 4 conditions avant ouverture d\'un signal','aiguillage','Par cœur','PRR & ACPP'],
  ['20','Bande jaune : 2,50 m si V ≥ 150 km/h (exception 1,80 m si quai < 1 m)','circulation','Par cœur — 100% exam','Bande jaune'],
  ['21','5 signaux à main du CdM : ARRÊTEZ · APPUYEZ · RALENTISSEZ · TIREZ · REFOULEZ','manœuvre','Par cœur','5 signaux à main'],
  ['22','Art. 202 — Montée/descente UNIQUEMENT À L ARRÊT + 3 points d appui','manœuvre','Par cœur','Article 202'],
  ['23','3 plaques d un signal : identification (Nf/F) · cantonnement (BM/PR) · repérage (c.77)','cantonnement','Bien différencier','3 plaques'],
  ['24','Œilleton : allumé = sémaphore / éteint = carré avarié','signaux','Par cœur','œilleton'],
  ['25','4 zones traction élec : Zone 0 (>3m) · Zone 1 (2-3m) · Zone 2 (1-2m) · Zone 3 (0-1m)','elect','Par cœur','ZONES'],
  ['26','Gares & PK : AMVVille 100,600 · St-Saturnin 139,000','aiguillage','Par cœur','Consigne Rose'],
  ['27','Art. 101 — 5 conditions avant départ : PPE · ST · Circulation · AuM · Heure','circulation','Par cœur','Article 101'],
  ['28','STEM — Surveillance des Trains en Marche (se fait à l\'extérieur)','circulation','Par cœur','STEM'],
  ['29','COGC · CRC · Régulateur — définitions et missions','circulation','Par cœur','COGC'],
  ['30','3 zones gare : ZEF (interdit) · ZAFS (quais) · ZC (commerciale)','circulation','Par cœur','ZEF'],
  ['31','VP doivent TOUJOURS être libres ou protégées','aiguillage','Par cœur','Temps moral'],
  ['32','Déroulé FAMAS complet : F·A·M·A·S + autocontrôle 2.2 + DR + fiche 3 ou 4 + CED + OCAR','incidents','Par cœur','Déroulé complet du FAMAS'],
  ['33','TE — Transport Exceptionnel : définition par cœur (+ rôle du BTE)','formation','🔥 Par cœur','Transport Exceptionnel'],
  ['34','MD — Marchandises Dangereuses : définition par cœur (personnes · biens · environnement)','formation','🔥 Par cœur','Marchandises Dangereuses'],
  ['35','ATE — 3 types : 4 et 5 (étiquette spéciale) · 7 (aucune restriction), créé par le BTE','formation','🔥 Par cœur','Avis de Transport'],
  ['36','Encadré jaune — Constater une anomalie sur un convoi de MD','formation','🔥 100% éval','anomalie sur un convoi'],
  ['37','Repérage — Identification des envois : 5 points','formation','🔥 Par cœur','Identification des envois'],
  ['38','Citer 4 types de wagon','formation','À savoir','types de wagons'],
  ['39','Enclenchements électriques : ZI→Anx4 · CIP & ZP→Anx2 · EAP→Anx5','aiguillage','🔥 Par cœur','Enclenchements électriques'],
  ['40','FC — Commutateur de fermeture : urgence uniquement (modif itinéraire, coupons)','aiguillage','⚠ Urgence','Commutateur de Fermeture'],
];

// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
let currentView = 'home';
let currentTheme = null;
let flashCards = [];
let flashIdx = 0;
let flashFlipped = false;
let quizItems = [];
let quizIdx = 0;
let quizScore = 0;

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
function init() {
  // v3.5 — reset theme order to match new chronological learning order
  try {
    const saved = localStorage.getItem('themeOrder');
    if (saved) {
      const validIds = [...THEMES.map(t => t.id), '__sep__'];
      const order = JSON.parse(saved).filter(id => validIds.includes(id));
      if (THEMES.some(t => !order.includes(t.id)) || order[0] !== THEMES[0].id) {
        localStorage.removeItem('themeOrder');
      }
    }
  } catch(e) { localStorage.removeItem('themeOrder'); }

  buildThemeNav();
  buildSearchIndex();
  showView('home');
}

function buildThemeNav() {
  const nav = document.getElementById('theme-nav');
  let order;
  try {
    const saved = localStorage.getItem('themeOrder');
    order = saved ? JSON.parse(saved) : THEMES.map(t => t.id);
  } catch(e) { order = THEMES.map(t => t.id); }
  THEMES.forEach(t => { if (!order.includes(t.id)) order.push(t.id); });
  // Ensure separator exists in order
  if (!order.includes('__sep__')) order.push('__sep__');
  order = order.filter(id => id === '__sep__' || THEMES.find(t => t.id === id));

  nav.innerHTML = '<div class="theme-nav-hint">⠿ Maintenir pour réordonner · Trait jaune = niveau actuel</div>' +
    order.map(id => {
      if (id === '__sep__') {
        return `<div class="theme-separator" id="tnav-__sep__" data-id="__sep__"
          draggable="true"
          ondragstart="dragStart(event,'__sep__')"
          ondragover="dragOver(event)"
          ondrop="dragDrop(event,'__sep__')"
          ondragend="dragEnd(event)">
          <span class="theme-separator-label">⠿ Vu jusqu'ici</span>
          <div class="theme-separator-line"></div>
        </div>`;
      }
      const t = THEMES.find(x => x.id === id);
      if (!t) return '';
      return `<div class="theme-item" id="tnav-${t.id}" data-id="${t.id}"
        draggable="true"
        ondragstart="dragStart(event,'${t.id}')"
        ondragover="dragOver(event)"
        ondrop="dragDrop(event,'${t.id}')"
        ondragend="dragEnd(event)"
        onclick="selectTheme('${t.id}')">
        <span class="theme-handle">⠿</span>
        <div class="theme-dot"></div>
        <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.short}</span>
      </div>`;
    }).join('');

  // Touch drag support
  setupTouchDrag();

  if (currentTheme) {
    const el = document.getElementById('tnav-' + currentTheme);
    if (el) el.classList.add('active');
  }
}

// ── DESKTOP DRAG ──
let dragSrc = null;
function dragStart(e, id) {
  dragSrc = id;
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => e.currentTarget.classList.add('dragging'), 0);
}
function dragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
function dragEnd(e) { e.currentTarget.classList.remove('dragging'); document.querySelectorAll('.theme-item, .theme-separator').forEach(el=>el.classList.remove('drag-over')); }
function dragDrop(e, targetId) {
  e.stopPropagation(); e.preventDefault();
  document.querySelectorAll('.theme-item').forEach(el=>el.classList.remove('drag-over'));
  if (!dragSrc || dragSrc === targetId) return;
  saveNewOrder(dragSrc, targetId);
}

// ── TOUCH DRAG (mobile) ──
let touchDragId = null, touchClone = null, lastTouchTarget = null;

function setupTouchDrag() {
  const items = document.querySelectorAll('.theme-item, .theme-separator');
  items.forEach(item => {
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
  });

  document.querySelectorAll('.theme-item, .theme-separator').forEach(item => {
    const isSep = item.classList.contains('theme-separator');

    item.addEventListener('touchstart', e => {
      // For theme-item: only drag from handle. For separator: drag from anywhere
      if (!isSep && !e.target.closest('.theme-handle')) return;
      e.preventDefault();
      touchDragId = item.dataset.id;
      item.classList.add('dragging');
      touchClone = item.cloneNode(true);
      touchClone.style.cssText = `position:fixed;opacity:0.8;pointer-events:none;z-index:999;width:${item.offsetWidth}px;padding:${isSep?'5px 12px':'8px 12px'};background:var(--bg4);border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,0.6);font-size:12px;color:var(--text);display:flex;align-items:center;gap:8px;`;
      document.body.appendChild(touchClone);
    }, {passive: false});

    item.addEventListener('touchmove', e => {
      if (!touchDragId) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (touchClone) {
        touchClone.style.left = (touch.clientX - 20) + 'px';
        touchClone.style.top = (touch.clientY - 20) + 'px';
      }
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetItem = el?.closest('.theme-item[data-id], .theme-separator[data-id]');
      document.querySelectorAll('.theme-item, .theme-separator').forEach(i => i.classList.remove('drag-over'));
      if (targetItem && targetItem.dataset.id && targetItem.dataset.id !== touchDragId) {
        targetItem.classList.add('drag-over');
        lastTouchTarget = targetItem.dataset.id;
      }
    }, {passive: false});

    item.addEventListener('touchend', () => {
      if (!touchDragId) return;
      if (touchClone) { touchClone.remove(); touchClone = null; }
      document.querySelectorAll('.theme-item, .theme-separator').forEach(i => { i.classList.remove('dragging'); i.classList.remove('drag-over'); });
      if (lastTouchTarget && lastTouchTarget !== touchDragId) saveNewOrder(touchDragId, lastTouchTarget);
      touchDragId = null; lastTouchTarget = null;
    });
  });
}

function saveNewOrder(fromId, toId) {
  let order;
  try {
    const saved = localStorage.getItem('themeOrder');
    order = saved ? JSON.parse(saved) : THEMES.map(t => t.id);
  } catch(e) { order = THEMES.map(t => t.id); }
  if (!order.includes('__sep__')) order.push('__sep__');
  const fromIdx = order.indexOf(fromId);
  const toIdx = order.indexOf(toId);
  if (fromIdx < 0 || toIdx < 0) return;
  order.splice(fromIdx, 1);
  order.splice(toIdx, 0, fromId);
  try { localStorage.setItem('themeOrder', JSON.stringify(order)); } catch(e) {}
  buildThemeNav();
}

function selectTheme(id) {
  currentTheme = (currentTheme === id) ? null : id;
  document.querySelectorAll('.theme-item').forEach(el => el.classList.remove('active'));
  if (currentTheme) {
    const el = document.getElementById('tnav-' + currentTheme);
    if (el) el.classList.add('active');
  }
  if (currentView === 'flash') renderFlash();
  else if (currentView === 'quiz') renderQuiz();
  else if (currentView === 'fiches') renderFiches();
  else if (currentView === 'dictee') renderDictee();
}

function setNavActive(v) {
  ['home','fiches','flash','quiz','dictee','signaux-learn','gares'].forEach(x => {
    const el = document.getElementById('nav-'+x);
    if (el) el.classList.toggle('active', x === v);
  });
}

function setTopbar(txt) {
  document.getElementById('topbar-txt').innerHTML = txt;
}

function showView(v) {
  currentView = v;
  setNavActive(v);
  closeSidebar();
  const c = document.getElementById('main-content');
  c.scrollTop = 0;
  window.scrollTo(0,0);
  document.getElementById('topbar-right').innerHTML = '<span style="font-family:var(--mono);font-size:11px;color:var(--text3)">' + VERSION_LABEL + '</span>';
  if (v === 'home') { setTopbar('AMV / <span>Accueil</span>'); renderHome(c); }
  else if (v === 'fiches') { setTopbar('AMV / <span>Fiches de cours</span>'); renderFiches(c); }
  else if (v === 'flash') { setTopbar('AMV / <span>Flashcards</span>'); renderFlash(c); }
  else if (v === 'quiz') { setTopbar('AMV / <span>Quiz QCM</span>'); renderQuiz(c); }
  else if (v === 'dictee') { setTopbar('AMV / <span>Dictée de définitions</span>'); renderDictee(c); }
  else if (v === 'signaux-learn') { setTopbar('AMV / <span>🚦 Signaux & panneaux</span>'); renderSignauxLearn(c); }
  else if (v === 'gares') { setTopbar('AMV / <span>🏘️ Gares & Tableaux des mouvements</span>'); renderGares(c); }
}

// Navigation vers une fiche + scroll précis vers une ancre textuelle
function gotoFiche(theme, anchorText) {
  currentTheme = theme;
  document.querySelectorAll('.theme-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('tnav-' + theme);
  if (navEl) navEl.classList.add('active');
  showView('fiches');
  if (!anchorText) return;
  setTimeout(() => {
    const content = document.querySelector('.fiche-content');
    if (!content) return;
    const q = anchorText.toLowerCase().trim();
    const candidates = content.querySelectorAll('h2, h3, .def-term');
    let target = null;
    for (const el of candidates) {
      if (el.textContent.toLowerCase().includes(q)) { target = el; break; }
    }
    if (!target) return;
    target.scrollIntoView({behavior:'smooth', block:'start'});
    // Surlignage temporaire du bloc parent
    const block = target.closest('.def-block') || target.parentElement || target;
    const prevTransition = block.style.transition;
    const prevBoxShadow = block.style.boxShadow;
    block.style.transition = 'box-shadow 0.35s ease';
    block.style.boxShadow = '0 0 0 2px var(--accent), 0 0 18px rgba(240,192,64,0.35)';
    setTimeout(() => {
      block.style.boxShadow = prevBoxShadow;
      setTimeout(() => { block.style.transition = prevTransition; }, 400);
    }, 2200);
  }, 180);
}

// ═══════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════
function renderHome(c) {
  c = c || document.getElementById('main-content');
  c.innerHTML = `
<div class="section-heading">Bienvenue 👋</div>
<div class="section-sub">Application de révision AMV — SECUFER · ${VERSION_LABEL}</div>

<div style="display:flex;gap:16px;justify-content:center;align-items:center;padding:10px 16px;background:var(--bg3);border:1px solid var(--accent);border-radius:var(--radius);margin-bottom:16px;font-family:var(--mono);font-size:13px">
  <span style="color:var(--text3)">📍</span>
  <span><strong style="color:var(--accent)">AMVVille</strong> <span style="color:var(--text2)">PK</span> <strong style="color:var(--text)">100,600</strong></span>
  <span style="color:var(--border2)">│</span>
  <span><strong style="color:var(--accent)">Saint-Saturnin</strong> <span style="color:var(--text2)">PK</span> <strong style="color:var(--text)">139,000</strong></span>
</div>

<!-- BARRE DE RECHERCHE -->
<div style="margin-bottom:20px;position:relative">
  <input id="search-input" type="text" placeholder="🔍  Rechercher dans toute l'appli : FAMAS, ZD, BAL, CDIS..."
    oninput="doSearch(this.value)"
    style="width:100%;padding:12px 16px;background:var(--bg2);border:1px solid var(--border2);border-radius:var(--radius);color:var(--text);font-family:var(--sans);font-size:14px;outline:none;"
    onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border2)'">
  <div id="search-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:var(--bg2);border:1px solid var(--border2);border-radius:0 0 var(--radius) var(--radius);z-index:200;max-height:320px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.4)"></div>
</div>

<!-- SCHEMA EXAMEN AMV -->
<div class="card" style="border-color:rgba(96,165,250,0.3);background:rgba(96,165,250,0.04);margin-bottom:16px">
  <div class="card-title" style="color:var(--blue);margin-bottom:12px">🎓 STRUCTURE DE L'EXAMEN AMV</div>
  <div style="display:flex;justify-content:center;gap:32px;flex-wrap:wrap">
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="padding:6px 18px;background:var(--blue-bg);border:2px solid var(--blue);border-radius:6px;font-weight:700;color:var(--blue);font-size:13px">✍️ Écrite — 1h (ExpertQuizz)</div>
      <div style="display:flex;gap:8px">
        <div style="padding:5px 10px;background:var(--bg4);border-radius:5px;font-size:11px;color:var(--text3);text-align:center">PS9</div>
        <div style="padding:5px 10px;background:var(--bg4);border-radius:5px;font-size:11px;color:var(--text3);text-align:center">Formation trains</div>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
      <div style="padding:6px 18px;background:var(--bg3);border:2px solid var(--border2);border-radius:6px;font-weight:700;color:var(--text);font-size:13px">🗣️ Orale — 2h30</div>
      <div style="display:flex;gap:8px;align-items:flex-start">
        <div style="padding:5px 10px;background:var(--bg4);border-radius:5px;font-size:11px;color:var(--text3)">Aiguillage<br>(tracé PRR / ACPP)</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
          <div style="padding:5px 10px;background:var(--bg4);border-radius:5px;font-size:11px;color:var(--text3)">Circulation</div>
          <div style="font-size:10px;color:var(--text3)">↓</div>
          <div style="padding:5px 10px;background:var(--bg4);border-radius:5px;font-size:11px;color:var(--text3)">Mise en situation</div>
          <div style="font-size:10px;color:var(--text3)">↓</div>
          <div style="padding:5px 10px;background:var(--red-bg);border:1px solid var(--red);border-radius:5px;font-size:11px;color:var(--red);font-weight:600">Incident de circulation</div>
        </div>
        <div style="padding:5px 10px;background:var(--bg4);border-radius:5px;font-size:11px;color:var(--text3);text-align:center">Travaux / S11<br>→ DFV</div>
      </div>
    </div>
  </div>
  <div style="font-size:11px;color:var(--text3);margin-top:10px;text-align:center">ExpertQuizz : IS · Cantonnement (BM/BAPR) · Plaques de signalisation</div>
</div>

<!-- A TOMBER A L'EXAM -->
<div class="card" style="border-color:rgba(240,192,64,0.3);background:rgba(240,192,64,0.03);margin-bottom:16px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
    <span style="font-size:18px">⚠️</span>
    <div class="card-title" style="color:var(--accent)">SÛRS DE TOMBER À L'EXAMEN — selon les formateurs</div>
  </div>
  <div style="display:flex;flex-direction:column;gap:6px">
    ${EXAM_PRIORITY.map(([n,titre,theme,tag,anchor]) => `
    <div style="display:flex;align-items:center;gap:10px;padding:7px 12px;background:var(--bg3);border-radius:var(--radius);flex-wrap:wrap">
      <span style="font-family:var(--mono);font-size:11px;color:var(--accent);min-width:24px">${n}.</span>
      <span style="font-size:13px;color:var(--text);flex:1">${titre}</span>
      <span class="tag" style="font-size:10px">${tag}</span>
      <button class="btn btn-sm" style="padding:3px 10px;font-size:11px;white-space:nowrap" onclick="gotoFiche('${theme}','${anchor}')">Fiche →</button>
    </div>`).join('')}
  </div>
</div>`;
}

// ── SEARCH ENGINE ──
const SEARCH_INDEX = [];

// ── Recherche : normalisation, tokenisation, alias ──
const _searchNorm = s => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/œ/g,'oe').replace(/æ/g,'ae');
// "flat" : minuscules, sans accents, ponctuation/espaces réduits à un espace simple
const _searchFlat = s => _searchNorm(s).replace(/[^a-z0-9]+/g,' ').trim();
const _searchTokens = s => _searchFlat(s).split(' ').filter(Boolean);

// Table d'alias acronyme → forme(s) développée(s) (en "flat" : sans accents ni apostrophes).
// Permet de retrouver une fiche en tapant l'abréviation OU les mots-clés.
// Pour en ajouter une : copier une ligne sur le même modèle.
const SEARCH_ALIASES = {
  ac:['agent de circulation'],
  adv:['appareil de voie','appareils de voie'],
  bal:['block automatique lumineux'],
  bapr:['block automatique a permissivite restreinte'],
  bm:['block manuel','cantonnement telephonique'],
  ced:['carnet d enregistrement des depeches'],
  cdis:['carnet de derangements des is'],
  cdm:['chef de la manoeuvre'],
  cip:['controle imperatif permanent'],
  cle:['consigne locale d exploitation'],
  cogc:['centre operationnel de gestion des circulations'],
  crc:['coordonnateur reseau circulation'],
  daelzd:['dispositif d autorisation d engagement longitudinal de la zone dangereuse'],
  datzd:['dispositif d autorisation de traverser la zone dangereuse'],
  dfv:['demande de fermeture de voie'],
  dmvc:['distance minimale de visibilite compatible'],
  eap:['enclenchement d approche'],
  eg:['emplacement de garage'],
  epi:['equipements de protection individuels','equipement de protection individuel'],
  fa:['fermeture automatique'],
  ipcs:['installation permanente de contre sens'],
  is:['installations de securite','installation de securite'],
  ocar:['ordre de circulation a restrictions'],
  pfr:['point facilement reperable'],
  ptx:['planche travaux'],
  rss:['regulateur sous stations'],
  sam:['signal d arret a main'],
  sel:['section elementaire'],
  sld:['signal lumineux de depart'],
  stem:['surveillance des trains en marche'],
  tvp:['traversee des voies a niveau par le public'],
  vm:['marche a vue'],
  vp:['voie principale','voies principales'],
  vs:['voie de service','voies de service'],
  zap:['zone d approche'],
  zd:['zone dangereuse'],
  zep:['zone elementaire de protection'],
  zi:['zone isolee'],
  zp:['zone de protection'],
};

// Distance d'édition bornée (≤ max) — tolère les petites fautes de frappe
function _editWithin(a, b, max) {
  if (a === b) return true;
  const la = a.length, lb = b.length;
  if (Math.abs(la - lb) > max) return false;
  let prev = Array.from({length: lb + 1}, (_, i) => i);
  for (let i = 1; i <= la; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i-1] === b[j-1] ? 0 : 1;
      const v = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + cost);
      cur[j] = v;
      if (v < best) best = v;
    }
    if (best > max) return false;
    prev = cur;
  }
  return prev[lb] <= max;
}

// Score d'un document pour une requête. Retourne 0 si un mot ne correspond pas (logique ET).
// Hiérarchie : mot exact dans le titre > mot exact > phrase-alias dans le titre > phrase-alias
//              > préfixe > faute de frappe > sous-chaîne (repli).
function _scoreDoc(doc, qWords, qPhrase) {
  let total = 0;
  for (const w of qWords) {
    const variants = [w];
    if (SEARCH_ALIASES[w]) variants.push(...SEARCH_ALIASES[w]);
    let ws = 0;
    for (const v of variants) {
      if (v.indexOf(' ') >= 0) { // variante multi-mots (forme développée d'un acronyme)
        if (doc.labelFlat.includes(v)) ws = Math.max(ws, 115);
        else if (doc.text.includes(v)) ws = Math.max(ws, 70);
        continue;
      }
      if (doc.tokenSet.has(v)) { ws = Math.max(ws, doc.labelTokens.has(v) ? 120 : 90); continue; }
      let lvl = 0;
      for (const tok of doc.tokens) {
        if (v.length >= 2 && tok.startsWith(v)) { lvl = 55; break; }
        if (v.length >= 4 && tok.length >= 4 && _editWithin(tok, v, 1)) lvl = Math.max(lvl, 45);
      }
      if (lvl) { ws = Math.max(ws, doc.labelFlat.includes(v) ? lvl + 25 : lvl); continue; }
      if (v.length >= 3 && doc.text.includes(v)) ws = Math.max(ws, 20);
    }
    if (ws === 0) return 0;
    total += ws;
  }
  if (qPhrase.length >= 3 && doc.text.includes(qPhrase)) total += 60; // bonus phrase exacte
  return total;
}

function _mkDoc(raw, label) {
  const toks = [...new Set(_searchTokens(raw))];
  const labelToks = [...new Set(_searchTokens(label || ''))];
  return {
    text: _searchFlat(raw),
    tokens: toks,
    tokenSet: new Set(toks),
    labelFlat: _searchFlat(label || ''),
    labelTokens: new Set(labelToks),
  };
}

function buildSearchIndex() {
  SEARCH_INDEX.length = 0;
  const themeMap = { encl:'aiguillage', traction:'elect' };

  FLASHCARDS.forEach(f => {
    const raw = f.q + ' ' + f.a;
    SEARCH_INDEX.push({ type:'flash', theme:f.theme, label:f.q.slice(0,80), raw, ..._mkDoc(raw, f.q) });
  });
  Object.entries(FICHES).forEach(([tid, html]) => {
    const mappedTid = themeMap[tid] || tid;
    const sections = html.split(/<h[23][^>]*>/);
    sections.forEach(sec => {
      const plain = sec.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
      if (plain.length < 20) return;
      const titleMatch = sec.match(/>(.*?)<\//);
      const label = titleMatch ? titleMatch[1].replace(/<[^>]+>/g,'').trim().slice(0,80) : plain.slice(0,80);
      SEARCH_INDEX.push({ type:'fiche', theme:mappedTid, label, anchor:label.slice(0,40), ..._mkDoc(plain, label) });
    });
  });
  DICTEES.forEach(d => {
    const raw = d.titre + ' ' + d.texte + ' ' + d.mots_cles.join(' ');
    SEARCH_INDEX.push({ type:'dictée', theme:d.theme, label:d.titre, ..._mkDoc(raw, d.titre) });
  });
  QUIZ.forEach(q => {
    const raw = q.q + ' ' + q.opts.join(' ') + ' ' + q.exp;
    SEARCH_INDEX.push({ type:'quiz', theme:q.theme, label:q.q.slice(0,80), ..._mkDoc(raw, q.q) });
  });
}

function doSearch(val) {
  const box = document.getElementById('search-results');
  if (!box) return;
  const qFlat = _searchFlat(val);
  if (qFlat.length < 2) { box.style.display = 'none'; return; }
  const words = qFlat.split(' ').filter(w => w.length >= 2);
  if (!words.length) { box.style.display = 'none'; return; }

  const results = [];
  SEARCH_INDEX.forEach(item => {
    const score = _scoreDoc(item, words, qFlat);
    if (score > 0) results.push({ ...item, score });
  });

  const typePrio = { fiche:0, flash:1, quiz:2, 'dictée':3 };
  results.sort((a, b) => b.score - a.score || (typePrio[a.type]||9) - (typePrio[b.type]||9));
  const shown = results.slice(0, 12);

  if (!shown.length) {
    box.style.display = '';
    box.innerHTML = '<div style="padding:12px 16px;font-size:13px;color:var(--text3)">Aucun résultat pour "' + val + '"</div>';
    return;
  }
  const tl = { flash:'Flashcard', fiche:'Fiche', dictée:'Dictée', quiz:'Quiz' };
  const icons = { flash:'⟳', fiche:'◧', dictée:'✎', quiz:'✦' };
  box.style.display = '';
  box.innerHTML = shown.map(h => {
    const t = THEMES.find(x => x.id === h.theme);
    const themeName = t?.short || h.theme;
    const anchor = h.anchor || '';
    const onclick = h.type === 'fiche' && anchor
      ? `gotoFiche('${h.theme}','${anchor.replace(/'/g,'')}')`
      : `searchGo('${h.theme}')`;
    let displayLabel = h.label;
    words.forEach(w => {
      const re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
      displayLabel = displayLabel.replace(re, '<mark style="background:rgba(240,192,64,0.3);color:var(--text);padding:0 1px;border-radius:2px">$1</mark>');
    });
    return `<div onclick="${onclick}" style="padding:8px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start"
      onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
      <span style="font-size:14px;min-width:18px;text-align:center;color:var(--text3)">${icons[h.type]||'•'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;color:var(--text);line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${displayLabel}</div>
        <div style="font-size:10px;color:var(--text3);margin-top:2px;display:flex;gap:6px;align-items:center">
          <span class="tag" style="font-size:9px;padding:1px 5px">${tl[h.type]||h.type}</span>
          <span>${themeName}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function searchGo(themeId) {
  const box=document.getElementById('search-results');
  if(box)box.style.display='none';
  const inp=document.getElementById('search-input');
  if(inp)inp.value='';
  currentTheme=themeId;
  document.querySelectorAll('.theme-item').forEach(el=>el.classList.remove('active'));
  const el=document.getElementById('tnav-'+themeId);
  if(el)el.classList.add('active');
  showView('fiches');
}

document.addEventListener('click', e => {
  const box=document.getElementById('search-results');
  if(box && !box.contains(e.target) && e.target.id!=='search-input') box.style.display='none';
});

// ═══════════════════════════════════════════════
// FICHES
// ═══════════════════════════════════════════════
function renderFiches(c) {
  c = c || document.getElementById('main-content');
  if (currentTheme) {
    const t = THEMES.find(x => x.id === currentTheme);
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap">
        <button class="btn btn-sm" onclick="currentTheme=null; document.querySelectorAll('.theme-item').forEach(el=>el.classList.remove('active')); renderFiches()">← Tous les thèmes</button>
        <span class="tag yellow">${t.code}</span>
        <span style="font-size:14px;color:var(--text2)">${t.title}</span>
      </div>
      <div class="fiche-content">${FICHES[currentTheme] || '<p style="color:var(--text3)">Fiche en cours de rédaction.</p>'}</div>`;
    c.scrollTop = 0;
    document.querySelector('.main').scrollTop = 0;
  } else {
    c.innerHTML = `
      <div class="section-heading">Fiches de cours</div>
      <div class="section-sub">Recherche un mot-clé ou sélectionne un thème</div>
      <div style="position:relative;margin-bottom:20px">
        <input id="fiche-search" type="text" placeholder="🔍  Rechercher dans les fiches : cantonnement, ZI, carré, DATZD..."
          oninput="searchFiches(this.value)"
          style="width:100%;padding:10px 14px;background:var(--bg2);border:1px solid var(--border2);border-radius:var(--radius);color:var(--text);font-family:var(--sans);font-size:14px;outline:none;"
          onfocus="this.style.borderColor='var(--accent2)'" onblur="this.style.borderColor='var(--border2)'">
        <div id="fiche-search-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:var(--bg2);border:1px solid var(--border2);border-radius:0 0 var(--radius) var(--radius);z-index:200;max-height:280px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.4)"></div>
      </div>
      <div class="fiche-grid">
        ${THEMES.map(t => `
          <div class="fiche-card" onclick="currentTheme='${t.id}'; document.querySelectorAll('.theme-item').forEach(el=>el.classList.remove('active')); document.getElementById('tnav-${t.id}')?.classList.add('active'); renderFiches()">
            <div class="fiche-code">${t.code}</div>
            <div class="fiche-title">${t.title}</div>
            <div class="fiche-count">${FLASHCARDS.filter(f=>f.theme===t.id).length} flashcards · ${QUIZ.filter(q=>q.theme===t.id).length} quiz · ${DICTEES.filter(d=>d.theme===t.id).length} dictées</div>
          </div>`).join('')}
      </div>`;
  }
}

function searchFiches(val) {
  const res = document.getElementById('fiche-search-results');
  if (!res) return;
  const qFlat = _searchFlat(val);
  if (qFlat.length < 2) { res.style.display = 'none'; return; }
  const words = qFlat.split(' ').filter(w => w.length >= 2);
  if (!words.length) { res.style.display = 'none'; return; }
  const themeMap = { encl:'aiguillage', traction:'elect' };
  const matches = [];

  Object.entries(FICHES).forEach(([tid, html]) => {
    const mappedTid = themeMap[tid] || tid;
    const t = THEMES.find(x => x.id === mappedTid) || THEMES.find(x => x.id === tid);
    if (!t) return;
    const content = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g,' ');
    const doc = _mkDoc(content, t.title);
    const score = _scoreDoc(doc, words, qFlat);
    if (score <= 0) return;

    // Extrait : autour de la première occurrence d'un mot (ou de sa forme développée)
    const contentNorm = _searchNorm(content);
    let idx = -1;
    words.forEach(w => {
      const variants = [w].concat(SEARCH_ALIASES[w] || []);
      variants.forEach(v => {
        const i = contentNorm.indexOf(v);
        if (i >= 0 && (idx < 0 || i < idx)) idx = i;
      });
    });
    if (idx < 0) idx = 0;
    const start = Math.max(0, idx - 40);
    const end = Math.min(content.length, idx + 100);
    let snippet = content.slice(start, end).replace(/\s+/g,' ').trim();
    words.forEach(w => {
      const variants = [w].concat(SEARCH_ALIASES[w] || []);
      variants.forEach(v => {
        const re = new RegExp('(' + v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ')', 'gi');
        snippet = snippet.replace(re, '<strong style="color:var(--accent)">$1</strong>');
      });
    });
    const beforeMatch = html.slice(0, html.toLowerCase().indexOf(content.slice(idx, idx+20).toLowerCase()));
    const headingMatch = beforeMatch.match(/<h[23][^>]*>([^<]*)</g);
    const anchor = headingMatch ? headingMatch[headingMatch.length-1].replace(/<[^>]+>/g,'').trim().slice(0,40) : '';
    matches.push({ t, mappedTid, snippet: '...' + snippet + '...', anchor, score });
  });

  matches.sort((a, b) => b.score - a.score);

  if (!matches.length) {
    res.style.display = '';
    res.innerHTML = '<div style="padding:12px 16px;font-size:13px;color:var(--text3)">Aucun résultat trouvé</div>';
    return;
  }
  res.style.display = '';
  res.innerHTML = matches.slice(0, 12).map(m => `
    <div onclick="gotoFiche('${m.mappedTid}','${m.anchor.replace(/'/g,'')}')"
      style="padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:background 0.1s"
      onmouseover="this.style.background='var(--bg3)'" onmouseout="this.style.background=''">
      <div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:2px">${m.t.title} <span class="tag" style="font-size:10px">${m.t.code}</span></div>
      <div style="font-size:12px;color:var(--text3);line-height:1.5">${m.snippet}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════
function renderFlash(c) {
  c = c || document.getElementById('main-content');
  flashCards = currentTheme ? FLASHCARDS.filter(f => f.theme === currentTheme) : FLASHCARDS;
  if (flashIdx >= flashCards.length) flashIdx = 0;
  flashFlipped = false;
  if (!flashCards.length) {
    c.innerHTML = '<p style="color:var(--text3);padding:2rem">Aucune flashcard pour ce thème.</p>';
    return;
  }
  buildFlashCard(c);
}

function buildFlashCard(c) {
  c = c || document.getElementById('main-content');
  const fc = flashCards[flashIdx];
  const pct = Math.round(((flashIdx + 1) / flashCards.length) * 100);
  const thName = currentTheme ? THEMES.find(t=>t.id===currentTheme)?.short : 'Tous les thèmes';
  c.innerHTML = `
<div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap">
  <span style="font-size:13px;color:var(--text3)">${thName}</span>
  <span class="tag">${flashCards.length} cartes</span>
</div>

<div class="fc-progress" style="margin-bottom:14px">
  <span style="min-width:60px;text-align:right">${flashIdx+1} / ${flashCards.length}</span>
  <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
  <span>${pct}%</span>
</div>

<div class="flashcard-container">
  <div class="flashcard-inner ${flashFlipped?'flipped':''}" id="fc-inner" onclick="flipCard()">
    <div class="flashcard-face front">
      <div class="fc-label">Question · <span>${fc.tag}</span></div>
      <div class="fc-text">${fc.q}</div>
      <div class="fc-hint">cliquer pour révéler →</div>
    </div>
    <div class="flashcard-face back">
      <div class="fc-label">Réponse · <span>${fc.tag}</span></div>
      <div class="fc-answer">${fc.a}</div>
    </div>
  </div>
</div>

<div class="fc-nav">
  <button class="btn" onclick="fcPrev()">← Précédente</button>
  <div style="display:flex;gap:8px">
    <button class="btn" onclick="fcShuffle()">⇄ Mélanger</button>
    <button class="btn btn-accent" onclick="fcNext()">Suivante →</button>
  </div>
</div>`;
}

function flipCard() {
  flashFlipped = !flashFlipped;
  const el = document.getElementById('fc-inner');
  if (el) el.classList.toggle('flipped', flashFlipped);
}
function fcNext() { flashIdx = (flashIdx + 1) % flashCards.length; flashFlipped = false; buildFlashCard(); }
function fcPrev() { flashIdx = (flashIdx - 1 + flashCards.length) % flashCards.length; flashFlipped = false; buildFlashCard(); }
function fcShuffle() {
  flashCards = flashCards.sort(() => Math.random() - 0.5);
  flashIdx = 0; flashFlipped = false; buildFlashCard();
}

// ═══════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════
function renderQuiz(c) {
  c = c || document.getElementById('main-content');
  quizItems = (currentTheme ? QUIZ.filter(q => q.theme === currentTheme) : QUIZ).sort(() => Math.random() - 0.5);
  quizIdx = 0; quizScore = 0;
  if (!quizItems.length) {
    c.innerHTML = '<p style="color:var(--text3);padding:2rem">Aucune question pour ce thème.</p>';
    return;
  }
  buildQuestion();
}

function buildQuestion() {
  const c = document.getElementById('main-content');
  if (quizIdx >= quizItems.length) { showResult(); return; }
  const q = quizItems[quizIdx];
  const pct = Math.round((quizIdx / quizItems.length) * 100);
  const letters = ['A','B','C','D'];
  const thName = currentTheme ? THEMES.find(t=>t.id===currentTheme)?.short : 'Tous les thèmes';
  const indices = [0,1,2,3].slice(0, q.opts.length);
  const shuffled = [...indices].sort(() => Math.random() - 0.5);
  const displayOpts = shuffled.map(i => q.opts[i]);
  const correctDisplayIdx = shuffled.indexOf(q.ans);
  const isMulti = q.multi || false;

  const optsHtml = isMulti
    ? displayOpts.map((o,i) => `
      <label class="quiz-opt" id="opt-${i}" style="cursor:pointer;gap:12px" for="chk-${i}">
        <input type="checkbox" id="chk-${i}" data-idx="${i}" style="width:18px;height:18px;flex-shrink:0;accent-color:var(--accent);cursor:pointer">
        <span style="font-size:13px;line-height:1.5">${o}</span>
      </label>`).join('')
    : displayOpts.map((o,i) => `
      <div class="quiz-opt" id="opt-${i}" onclick="answerSingle(${i}, ${correctDisplayIdx})">
        <span class="opt-letter">${letters[i]}</span>
        <span>${o}</span>
      </div>`).join('');

  c.innerHTML = `
<div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap">
  <span style="font-size:13px;color:var(--text3)">${thName}</span>
  <div class="quiz-score-bar" style="flex:1;margin:0">
    <div><div class="score-num">${quizScore}</div><div class="score-label">bonne${quizScore>1?'s':''}</div></div>
    <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div style="font-family:var(--mono);font-size:12px;color:var(--text3)">${quizIdx+1}/${quizItems.length}</div>
  </div>
</div>

<div class="card" id="quiz-card">
  <div class="quiz-q-label">Question ${quizIdx+1} sur ${quizItems.length}${isMulti?' · <span style="color:var(--accent);font-weight:500">☑ Plusieurs réponses possibles — cochez toutes les bonnes</span>':''}</div>
  <div class="quiz-question">${q.q}</div>
  <div class="quiz-opts" id="quiz-opts" style="${isMulti?'gap:10px':''}">
    ${optsHtml}
  </div>
  ${isMulti ? `<button class="btn btn-accent" style="margin-top:14px" onclick="answerMulti(${correctDisplayIdx})">Valider mes réponses</button>` : ''}
  <div class="quiz-expl" id="quiz-expl">${q.exp}</div>
  <div id="quiz-next-wrap" style="display:none;margin-top:16px">
    <button class="btn btn-accent" onclick="quizNext()" style="width:100%;justify-content:center;padding:12px">
      Question suivante →
    </button>
  </div>
</div>`;
}

function answerSingle(i, correctIdx) {
  if (document.getElementById('opt-0')?.classList.contains('disabled')) return;
  document.querySelectorAll('.quiz-opt').forEach(el => { el.classList.add('disabled'); el.onclick = null; });
  document.getElementById('opt-' + correctIdx)?.classList.add('correct');
  if (i !== correctIdx) document.getElementById('opt-' + i)?.classList.add('wrong');
  else quizScore++;
  document.getElementById('quiz-expl')?.classList.add('shown');
  document.getElementById('quiz-next-wrap').style.display = '';
  setTimeout(() => document.getElementById('quiz-expl')?.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}

function answerMulti(correctIdx) {
  const checked = [...document.querySelectorAll('#quiz-opts input[type=checkbox]:checked')].map(el => parseInt(el.dataset.idx));
  document.querySelectorAll('.quiz-opt').forEach(el => { el.style.cursor='default'; });
  document.querySelectorAll('#quiz-opts input').forEach(el => { el.disabled = true; });
  document.querySelectorAll('#quiz-opts label').forEach(el => { el.onclick = null; });
  document.getElementById('opt-' + correctIdx)?.classList.add('correct');
  const isCorrect = checked.length === 1 && checked[0] === correctIdx;
  if (!isCorrect) {
    checked.forEach(idx => { if (idx !== correctIdx) document.getElementById('opt-' + idx)?.classList.add('wrong'); });
  } else {
    quizScore++;
  }
  document.querySelector('[onclick^="answerMulti"]')?.remove();
  document.getElementById('quiz-expl')?.classList.add('shown');
  document.getElementById('quiz-next-wrap').style.display = '';
  setTimeout(() => document.getElementById('quiz-expl')?.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
}

function answerQuiz(i, correctIdx, isMulti) {
  answerSingle(i, correctIdx);
}

function quizNext() {
  quizIdx++;
  buildQuestion();
  document.getElementById('main-content')?.scrollTo({top:0});
  window.scrollTo({top:0, behavior:'smooth'});
}

function showResult() {
  const c = document.getElementById('main-content');
  const pct = Math.round((quizScore / quizItems.length) * 100);
  const msg = pct >= 80 ? 'Excellent ! 🎉' : pct >= 60 ? 'Bien joué 👍' : 'À retravailler 💪';
  const col = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--accent)' : 'var(--red)';
  c.innerHTML = `
<div class="quiz-result">
  <div class="result-big" style="color:${col}">${quizScore}/${quizItems.length}</div>
  <div style="font-size:18px;color:${col};margin-bottom:6px;font-weight:500">${pct}%</div>
  <div class="result-sub">${msg}</div>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <button class="btn btn-accent" onclick="renderQuiz()">⟳ Recommencer</button>
    <button class="btn" onclick="showView('flash')">← Retour flashcards</button>
  </div>
</div>`;
}

// ═══════════════════════════════════════════════
// DICTÉE
// ═══════════════════════════════════════════════
let dicteeItems = [];
let dicteeIdx = 0;
let dicteeScore = 0;
let dicteeAnswered = false;

function renderDictee(c) {
  c = c || document.getElementById('main-content');
  dicteeItems = (currentTheme ? DICTEES.filter(d => d.theme === currentTheme) : [...DICTEES]).sort(() => Math.random()-0.5);
  dicteeIdx = 0; dicteeScore = 0; dicteeAnswered = false;
  if (!dicteeItems.length) {
    c.innerHTML = '<p style="color:var(--text3);padding:2rem">Aucune définition pour ce thème.</p>';
    return;
  }
  buildDictee();
}

function buildDictee() {
  const c = document.getElementById('main-content');
  if (dicteeIdx >= dicteeItems.length) { showDicteeResult(); return; }
  const d = dicteeItems[dicteeIdx];
  const pct = Math.round((dicteeIdx / dicteeItems.length) * 100);
  const thName = currentTheme ? THEMES.find(t=>t.id===currentTheme)?.short : 'Toutes';
  c.innerHTML = `
<div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap">
  <span style="font-size:13px;color:var(--text3)">${thName}</span>
  <div class="quiz-score-bar" style="flex:1;margin:0">
    <div><div class="score-num">${dicteeScore}</div><div class="score-label">réussie${dicteeScore>1?'s':''}</div></div>
    <div class="progress-bar" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div style="font-family:var(--mono);font-size:12px;color:var(--text3)">${dicteeIdx+1}/${dicteeItems.length}</div>
  </div>
</div>

<div class="card">
  <div style="margin-bottom:18px">
    <div style="font-family:var(--mono);font-size:10px;color:var(--text3);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px">Définition à restituer mot pour mot</div>
    <div style="font-size:22px;font-weight:700;color:var(--accent);letter-spacing:-0.01em;line-height:1.2;margin-bottom:6px">${d.titre}</div>
    <span class="tag yellow">${d.ref}</span>
  </div>

  <div id="dictee-mots-cles" style="margin-bottom:14px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <div style="font-size:11px;font-family:var(--mono);color:var(--text3);letter-spacing:0.08em;text-transform:uppercase">Mots-clés</div>
      <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--text3);user-select:none">
        <input type="checkbox" id="kw-toggle" onchange="toggleKeywords()" style="accent-color:var(--accent);cursor:pointer">
        Révéler si tu bloques
      </label>
    </div>
    <div id="kw-container" style="display:none">
      ${d.mots_cles.map(m=>`<span class="kw-tag" id="kw-${slugify(m)}">${m}</span>`).join('')}
    </div>
    <div id="kw-hidden" style="font-size:12px;color:var(--text3);font-style:italic">
      ☐ Coche pour révéler les mots-clés
    </div>
  </div>

  <textarea class="dictee-textarea" id="dictee-input" placeholder="Écris la définition complète ici..." oninput="checkKeywords()" spellcheck="false"></textarea>

  <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
    <button class="btn btn-accent" onclick="corrigerDictee()">Corriger</button>
    <button class="btn btn-sm" onclick="voirReponse()" style="color:var(--text3)">Voir la réponse</button>
  </div>

  <div id="dictee-correction" style="display:none;margin-top:16px">
    <div style="font-size:11px;font-family:var(--mono);color:var(--text3);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px">Définition officielle</div>
    <div class="ref-text" id="ref-display"></div>
    <div id="score-display" style="margin-top:12px"></div>
    <div id="missing-display" style="margin-top:10px"></div>
    <button class="btn btn-accent" style="margin-top:16px" onclick="nextDictee()">Suivante →</button>
  </div>
</div>`;
  document.getElementById('dictee-input').focus();
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g,'_').slice(0,20);
}

function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/['']/g,"'")
    .replace(/[^a-z0-9'\- ]/g,' ')
    .replace(/\s+/g,' ').trim();
}

function toggleKeywords() {
  const show = document.getElementById('kw-toggle')?.checked;
  document.getElementById('kw-container').style.display = show ? '' : 'none';
  document.getElementById('kw-hidden').style.display = show ? 'none' : '';
}

function checkKeywords() {
  const input = normalize(document.getElementById('dictee-input')?.value || '');
  const d = dicteeItems[dicteeIdx];
  d.mots_cles.forEach(m => {
    const el = document.getElementById('kw-' + slugify(m));
    if (!el) return;
    const found = input.includes(normalize(m));
    el.className = 'kw-tag ' + (found ? 'found' : '');
  });
}

function corrigerDictee() {
  if (dicteeAnswered) return;
  dicteeAnswered = true;
  const d = dicteeItems[dicteeIdx];
  const userText = (document.getElementById('dictee-input')?.value || '').trim();
  const inputEl = document.getElementById('dictee-input');
  if (inputEl) inputEl.disabled = true;

  const normInput = normalize(userText);
  let found = 0;
  let almostFound = 0; // mots-clés quasi présents
  const missing = [];
  const almost = [];

  d.mots_cles.forEach(m => {
    const normM = normalize(m);
    if (normInput.includes(normM)) {
      found++;
      const el = document.getElementById('kw-' + slugify(m));
      if (el) el.className = 'kw-tag found';
    } else {
      // Check if "almost" — at least 60% of significant words from the keyword are present
      const kwWords = normM.split(' ').filter(w => w.length > 2);
      const presentCount = kwWords.filter(w => normInput.includes(w)).length;
      const ratio = kwWords.length ? presentCount / kwWords.length : 0;
      if (ratio >= 0.6 && kwWords.length >= 2) {
        almostFound++;
        almost.push(m);
        const el = document.getElementById('kw-' + slugify(m));
        if (el) el.className = 'kw-tag almost';
      } else {
        missing.push(m);
        const el = document.getElementById('kw-' + slugify(m));
        if (el) el.className = 'kw-tag missing';
      }
    }
  });

  const total = d.mots_cles.length;
  const pct = Math.round(((found + almostFound * 0.5) / total) * 100);
  if (pct >= 80) dicteeScore++;

  const corrDiv = document.getElementById('dictee-correction');
  if (corrDiv) corrDiv.style.display = '';

  const refEl = document.getElementById('ref-display');
  if (refEl) refEl.textContent = d.texte;

  let cls, label;
  if (found === total) { cls = 'good'; label = '✓ Parfait !'; }
  else if (pct >= 80) { cls = 'good'; label = 'Très bien'; }
  else if (pct >= 50 || almostFound > 0) { cls = 'ok'; label = 'Presque — quelques mots manquent'; }
  else { cls = 'bad'; label = 'À retravailler'; }

  const scoreEl = document.getElementById('score-display');
  if (scoreEl) scoreEl.innerHTML = `<span class="score-pill ${cls}">${found}/${total} mots-clés exacts · ${pct}% — ${label}</span>`;

  const missEl = document.getElementById('missing-display');
  if (missEl) {
    let html = '';
    if (almost.length) html += `<div style="font-size:12px;color:#e8a020;margin-bottom:4px;margin-top:8px">🟠 Presque juste (vérifier le mot exact) :</div>` +
      almost.map(m=>`<span class="kw-tag almost">${m}</span>`).join('');
    if (missing.length) html += `<div style="font-size:12px;color:var(--text3);margin-bottom:4px;margin-top:8px">🔴 Manquants :</div>` +
      missing.map(m=>`<span class="kw-tag missing">${m}</span>`).join('');
    missEl.innerHTML = html;
  }
}

function voirReponse() {
  const d = dicteeItems[dicteeIdx];
  const inp = document.getElementById('dictee-input');
  if (inp) inp.value = d.texte;
  checkKeywords();
  corrigerDictee();
}

function nextDictee() {
  dicteeIdx++;
  dicteeAnswered = false;
  buildDictee();
}

function showDicteeResult() {
  const c = document.getElementById('main-content');
  const pct = Math.round((dicteeScore / dicteeItems.length) * 100);
  const msg = pct >= 80 ? 'Excellent ! 🎉' : pct >= 60 ? 'Bien joué 👍' : 'Continue à t\'entraîner 💪';
  const col = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--accent)' : 'var(--red)';
  c.innerHTML = `
<div class="quiz-result">
  <div class="result-big" style="color:${col}">${dicteeScore}/${dicteeItems.length}</div>
  <div style="font-size:18px;color:${col};margin-bottom:6px;font-weight:500">${pct}%</div>
  <div class="result-sub">${msg}</div>
  <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    <button class="btn btn-accent" onclick="renderDictee()">⟳ Recommencer</button>
    <button class="btn" onclick="showView('quiz')">← Retour quiz</button>
  </div>
</div>`;
}

// ═══════════════════════════════════════════════
// SIGNAUX & PANNEAUX — Page d'apprentissage
// ═══════════════════════════════════════════════

// Helper SVG : panneau oblong avec cible noire
function svgPanel(content, w=80, h=160) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <rect x="${w*0.12}" y="${h*0.05}" width="${w*0.76}" height="${h*0.90}" rx="${w*0.35}" fill="#1a1a1a" stroke="#666" stroke-width="1.5"/>
    ${content}
  </svg>`;
}
function svgRound(content, sz=120) {
  return `<svg viewBox="0 0 ${sz} ${sz}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
    <circle cx="${sz/2}" cy="${sz/2}" r="${sz*0.42}" fill="#1a1a1a" stroke="#666" stroke-width="1.5"/>
    ${content}
  </svg>`;
}


// ── SIGNAUX & PANNEAUX (rendu) ──
function renderSignauxLearn(c) {
  c = c || document.getElementById('main-content');
  c.innerHTML = `
    <div class="section-heading" style="display:flex;align-items:center;gap:10px"><span style="font-size:26px">🚦</span> Signaux & panneaux ferroviaires</div>
    <div class="section-sub">Apprends à reconnaître les principaux signaux SNCF — d'après AMV207 (PDF de révision) et letraindemanu.fr</div>

    <!-- Switch de mode -->
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
      <button class="signaux-mode-btn ${signauxMode==='decouverte'?'active':''}" onclick="setSignauxMode('decouverte')">🔍 Découverte</button>
      <button class="signaux-mode-btn ${signauxMode==='quiz'?'active':''}" onclick="setSignauxMode('quiz')">❓ Quiz d'identification</button>
      <button class="signaux-mode-btn ${signauxMode==='plaques'?'active':''}" onclick="setSignauxMode('plaques')">📋 Plaques & œilleton</button>
    </div>

    <div id="signaux-content"></div>
  `;
  // Injecter le style des boutons s'il n'existe pas
  if (!document.getElementById('signaux-style')) {
    const st = document.createElement('style');
    st.id = 'signaux-style';
    st.textContent = `
      .signaux-mode-btn { padding:8px 14px; background:var(--bg3); border:1px solid var(--border2); color:var(--text2); border-radius:var(--radius); font-family:var(--sans); font-size:13px; cursor:pointer; transition:all 0.15s; }
      .signaux-mode-btn:hover { color:var(--text); border-color:var(--accent2); }
      .signaux-mode-btn.active { background:var(--accent); color:#1a1a1a; border-color:var(--accent); font-weight:600; }
      .fam-tab { padding:6px 12px; background:var(--bg3); border:1px solid var(--border); color:var(--text2); border-radius:var(--radius); font-family:var(--mono); font-size:11px; cursor:pointer; transition:all 0.15s; letter-spacing:0.05em; }
      .fam-tab:hover { color:var(--text); }
      .fam-tab.active { background:var(--bg4); border-color:var(--accent); color:var(--accent); }
      .signal-card { background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius2); padding:14px; transition:all 0.15s; cursor:pointer; display:flex; flex-direction:column; gap:10px; }
      .signal-card:hover { border-color:var(--accent2); transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,0.25); }
      .signal-svg-wrap { background:var(--bg4); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; padding:14px; min-height:120px; max-height:160px; }
      .signal-svg-wrap svg { max-height:130px; width:auto; }
      .signal-name { font-size:13px; font-weight:600; color:var(--text); line-height:1.3; }
      .signal-meta { display:flex; gap:6px; flex-wrap:wrap; }
      .signal-tag { font-family:var(--mono); font-size:10px; padding:2px 7px; background:var(--bg4); border-radius:3px; color:var(--text3); letter-spacing:0.05em; }
      .signal-tag.fam-A { color:#f87171; background:#2a0a0a; }
      .signal-tag.fam-B { color:#fbbf24; background:#2a1f04; }
      .signal-tag.fam-C { color:#a78bfa; background:#1c0a2e; }
      .signal-tag.fam-D { color:#4ade80; background:#052016; }
      .signal-tag.fam-E { color:#7db3f5; background:#071229; }
      .signal-tag.fam-M { color:#fb923c; background:#2a1106; }
      .signal-role { font-size:12px; color:var(--text2); line-height:1.5; }
    `;
    document.head.appendChild(st);
  }
  renderSignauxContent();
}

function setSignauxMode(m) {
  signauxMode = m;
  if (m === 'quiz') signauxQuiz = { current:null, score:0, total:0, answered:false };
  // Re-render tout pour mettre à jour les boutons mode
  renderSignauxLearn();
}

function setSignauxFamily(f) {
  signauxFamily = f;
  renderSignauxContent();
}

function renderSignauxContent() {
  const wrap = document.getElementById('signaux-content');
  if (!wrap) return;
  if (signauxMode === 'decouverte') wrap.innerHTML = renderSignauxDecouverte();
  else if (signauxMode === 'quiz') wrap.innerHTML = renderSignauxQuiz();
  else if (signauxMode === 'plaques') wrap.innerHTML = renderSignauxPlaques();
}

function renderSignauxDecouverte() {
  const tabsHtml = FAMILLES_SIGNAUX.map(f =>
    `<button class="fam-tab ${signauxFamily===f.id?'active':''}" onclick="setSignauxFamily('${f.id}')" title="${f.desc}">${f.label}</button>`
  ).join('');

  const filtered = signauxFamily === '*' ? SIGNAUX : SIGNAUX.filter(s => s.fam === signauxFamily);

  const cards = filtered.map(s => `
    <div class="signal-card" onclick="showSignalDetail('${s.id}')">
      <div class="signal-svg-wrap">${s.svg}</div>
      <div class="signal-name">${s.nom}</div>
      <div class="signal-meta">
        <span class="signal-tag fam-${s.fam}">Famille ${s.fam}</span>
        ${s.plaque !== '—' ? `<span class="signal-tag">Plaque : ${s.plaque}</span>` : ''}
        <span class="signal-tag">${s.voie}</span>
      </div>
      <div class="signal-role">${s.role}</div>
    </div>
  `).join('');

  return `
    <!-- Tabs familles -->
    <div style="display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap;align-items:center">
      <span style="font-family:var(--mono);font-size:10px;color:var(--text3);letter-spacing:0.1em;margin-right:6px">FAMILLES :</span>
      ${tabsHtml}
    </div>

    <div style="background:var(--bg3);border:1px solid var(--accent);border-radius:var(--radius2);padding:12px 14px;margin-bottom:18px;font-size:12px;line-height:1.6">
      💡 <strong style="color:var(--accent)">Astuce mémo</strong> — Les 5 familles : <strong>A</strong>rrêt · <strong>B</strong>annonce d'arrêt · <strong>C</strong> limitation de vitesse · <strong>D</strong> ouverture · <strong>E</strong> divers.<br>
      Clique sur une carte pour voir le détail complet du signal.
    </div>

    <div id="signal-detail-modal" style="display:none"></div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
      ${cards}
    </div>

    <div style="margin-top:24px;padding:14px;background:var(--bg3);border:1px dashed var(--border2);border-radius:var(--radius2);font-size:12px;color:var(--text2)">
      📚 <strong style="color:var(--text)">Sources :</strong> PDF de révision AMV (AMV207, p.23-26) · letraindemanu.fr/2023/10/20/signalisation-ferroviaire-les-principaux-signaux
    </div>
  `;
}

function showSignalDetail(id) {
  const s = SIGNAUX.find(x => x.id === id);
  if (!s) return;
  const m = document.getElementById('signal-detail-modal');
  if (!m) return;
  m.style.display = 'block';
  m.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px" onclick="hideSignalDetail(event)">
      <div style="background:var(--bg2);border:1px solid var(--accent);border-radius:var(--radius2);padding:20px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto" onclick="event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:14px">
          <div>
            <div style="font-size:18px;font-weight:600;color:var(--text);line-height:1.3">${s.nom}</div>
            <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
              <span class="signal-tag fam-${s.fam}">Famille ${s.fam}</span>
              ${s.plaque !== '—' ? `<span class="signal-tag">Plaque : ${s.plaque}</span>` : ''}
              <span class="signal-tag">${s.voie}</span>
            </div>
          </div>
          <button onclick="hideSignalDetail()" style="background:none;border:none;color:var(--text2);font-size:22px;cursor:pointer;padding:0;line-height:1">✕</button>
        </div>
        <div style="background:var(--bg4);border-radius:var(--radius);padding:20px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;min-height:180px">
          <div style="max-width:200px;max-height:200px">${s.svg}</div>
        </div>
        <div style="margin-bottom:10px"><strong style="color:var(--accent);font-size:13px">Rôle :</strong><div style="font-size:13px;color:var(--text);margin-top:3px;line-height:1.5">${s.role}</div></div>
        <div style="margin-bottom:10px"><strong style="color:var(--accent);font-size:13px">Détail :</strong><div style="font-size:13px;color:var(--text2);margin-top:3px;line-height:1.6">${s.detail}</div></div>
        ${s.œilleton !== '—' ? `<div><strong style="color:var(--accent);font-size:13px">Œilleton :</strong> <span style="font-size:13px;color:var(--text2)">${s.œilleton}</span></div>` : ''}
      </div>
    </div>
  `;
}
function hideSignalDetail(e) {
  if (e && e.target !== e.currentTarget && !e.target.matches('[onclick*="hideSignalDetail"]')) return;
  const m = document.getElementById('signal-detail-modal');
  if (m) { m.style.display='none'; m.innerHTML=''; }
}

function renderSignauxQuiz() {
  if (!signauxQuiz.current) {
    pickSignauxQuiz();
  }
  const q = signauxQuiz.current;
  if (!q) return '<div style="color:var(--text3)">Aucun signal disponible.</div>';
  const optsHtml = q.options.map((opt, i) => {
    let cls = 'quiz-opt';
    let extra = '';
    if (signauxQuiz.answered) {
      if (i === q.correct) { cls += ' correct'; extra = '✓'; }
      else if (i === q.picked) { cls += ' wrong'; extra = '✕'; }
    }
    return `<button class="${cls}" onclick="answerSignauxQuiz(${i})" ${signauxQuiz.answered?'disabled':''} style="text-align:left;padding:10px 14px;background:var(--bg3);border:1px solid var(--border2);color:var(--text);border-radius:var(--radius);font-family:var(--sans);font-size:13px;cursor:${signauxQuiz.answered?'default':'pointer'};display:flex;justify-content:space-between;align-items:center;gap:10px;transition:all 0.15s">
      <span>${opt}</span><span style="color:${i===q.correct?'#4ade80':i===q.picked?'#f87171':'transparent'};font-size:16px;font-weight:700">${extra}</span>
    </button>`;
  }).join('');

  return `
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius2);padding:18px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-family:var(--mono);font-size:11px;color:var(--text3);letter-spacing:0.1em">QUIZ D'IDENTIFICATION</div>
        <div style="font-size:13px;color:var(--text2)">Score : <strong style="color:var(--accent)">${signauxQuiz.score}</strong> / ${signauxQuiz.total}</div>
      </div>

      <div style="background:var(--bg4);border-radius:var(--radius);padding:24px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;min-height:200px">
        <div style="max-width:200px;max-height:200px">${q.signal.svg}</div>
      </div>

      <div style="font-size:14px;color:var(--text);margin-bottom:12px;text-align:center"><strong>Quel est ce signal ?</strong></div>

      <div style="display:flex;flex-direction:column;gap:8px">${optsHtml}</div>

      ${signauxQuiz.answered ? `
        <div style="margin-top:14px;padding:12px;background:${q.picked===q.correct?'rgba(74,222,128,0.1)':'rgba(248,113,113,0.1)'};border-left:3px solid ${q.picked===q.correct?'#4ade80':'#f87171'};border-radius:var(--radius);font-size:12px;color:var(--text2);line-height:1.6">
          <strong style="color:${q.picked===q.correct?'#4ade80':'#f87171'}">${q.picked===q.correct?'✓ Correct !':'✕ Faux'}</strong> — ${q.signal.role}<br>
          <span style="color:var(--text3)">${q.signal.detail.substring(0, 220)}${q.signal.detail.length>220?'…':''}</span>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
          <button class="btn btn-accent" onclick="nextSignauxQuiz()">Signal suivant →</button>
          <button class="btn" onclick="setSignauxMode('decouverte')">← Découverte</button>
        </div>
      ` : `
        <div style="margin-top:14px;font-size:11px;color:var(--text3);text-align:center">Choisis une réponse pour voir l'explication</div>
      `}
    </div>
  `;
}

function pickSignauxQuiz() {
  const pool = SIGNAUX.slice();
  // Tirer un signal au hasard
  const idx = Math.floor(Math.random() * pool.length);
  const signal = pool[idx];
  // Tirer 3 autres signaux comme leurres (différents)
  const others = pool.filter(s => s.id !== signal.id).sort(() => Math.random() - 0.5).slice(0, 3);
  const all = [signal, ...others].sort(() => Math.random() - 0.5);
  const correct = all.indexOf(signal);
  signauxQuiz.current = {
    signal, options: all.map(s => s.nom), correct, picked: null
  };
  signauxQuiz.answered = false;
}

function answerSignauxQuiz(i) {
  if (signauxQuiz.answered) return;
  signauxQuiz.answered = true;
  signauxQuiz.current.picked = i;
  signauxQuiz.total++;
  if (i === signauxQuiz.current.correct) signauxQuiz.score++;
  renderSignauxContent();
}

function nextSignauxQuiz() {
  pickSignauxQuiz();
  renderSignauxContent();
}

function renderSignauxPlaques() {
  const rows = PLAQUES.map(p => `
    <tr>
      <td style="font-family:var(--mono);font-size:14px;font-weight:700;color:var(--accent);width:60px">${p.code}</td>
      <td style="font-weight:600;color:var(--text)">${p.label}</td>
      <td style="color:var(--text2);font-size:13px;line-height:1.6">${p.detail}</td>
    </tr>
  `).join('');

  return `
    <h3 style="font-size:15px;font-weight:500;margin-bottom:12px;color:var(--text2)">Plaques d'identification des signaux</h3>
    <div style="background:var(--bg3);border:1px solid var(--accent);border-radius:var(--radius2);padding:14px;margin-bottom:18px;font-size:12px;line-height:1.6">
      💡 <strong style="color:var(--accent)">À retenir</strong> — La plaque indique l'<strong>état le plus restrictif</strong> que le signal peut présenter. C'est elle qui te dit comment réagir en cas d'avarie (panneau éteint).
    </div>

    <div class="table-wrap"><table>
      <thead><tr><th>Code</th><th>Signification</th><th>Détail</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>

    <h3 style="font-size:15px;font-weight:500;margin:24px 0 12px;color:var(--text2)">👁️ L'œilleton — clé de lecture</h3>
    <div style="background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius2);padding:18px;line-height:1.7;font-size:13px">
      <p style="margin-bottom:14px">L'<strong style="color:var(--accent)">œilleton</strong> est une petite lampe blanche située latéralement à la cible principale (généralement côté extérieur). C'est un <strong>signal de permissivité</strong> en cantonnement.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px">
        <div style="background:var(--bg4);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
          <div style="font-weight:600;color:var(--accent);margin-bottom:8px;font-size:13px">Œilleton ALLUMÉ ●</div>
          <div style="font-size:12px;color:var(--text2);line-height:1.6">Cible présente uniquement un signal de cantonnement BAL :
            <ul style="margin:6px 0 0 18px;padding:0">
              <li>Sémaphore (de BAL)</li>
              <li>Avertissement</li>
              <li>Voie libre</li>
            </ul>
            → <strong style="color:var(--text)">Sémaphore franchissable sous conditions</strong>
          </div>
        </div>
        <div style="background:var(--bg4);border:1px solid var(--border);border-radius:var(--radius);padding:14px">
          <div style="font-weight:600;color:var(--text3);margin-bottom:8px;font-size:13px">Œilleton ÉTEINT ○ ou absent</div>
          <div style="font-size:12px;color:var(--text2);line-height:1.6">Cible présente :
            <ul style="margin:6px 0 0 18px;padding:0">
              <li>Carré</li>
              <li>Carré violet</li>
              <li>Feu blanc de manœuvre</li>
            </ul>
            → <strong style="color:var(--text)">Arrêt absolu — non franchissable</strong>
          </div>
        </div>
      </div>

      <div style="margin-top:14px;padding:10px;background:var(--bg4);border-left:3px solid var(--accent);border-radius:var(--radius);font-size:12px;color:var(--text2)">
        <strong style="color:var(--accent)">Cas particulier :</strong> Sur les cibles ne pouvant présenter que le sémaphore de BAL, l'œilleton est généralement absent (puisqu'il serait en permanence allumé). Sur les sémaphores de BAPR et BM, pas d'œilleton non plus.
      </div>
    </div>

    <h3 style="font-size:15px;font-weight:500;margin:24px 0 12px;color:var(--text2)">📏 Distances de visibilité des signaux</h3>
    <div class="table-wrap"><table>
      <thead><tr><th>Vitesse</th><th>Distance minimale</th></tr></thead>
      <tbody>
        <tr><td>V ≤ 60 km/h</td><td><strong style="color:var(--accent)">100 m</strong></td></tr>
        <tr><td>60 &lt; V ≤ 120 km/h</td><td><strong style="color:var(--accent)">200 m</strong></td></tr>
        <tr><td>V &gt; 120 km/h</td><td><strong style="color:var(--accent)">300 m</strong></td></tr>
      </tbody>
    </table></div>
    <div style="font-size:12px;color:var(--text3);margin-top:8px;font-style:italic">
      Pour les signaux à visibilité réduite : on installe des <strong>mirlitons</strong> à 300 m (3 traits), 200 m (2 traits) puis 100 m (1 trait) avant le signal annoncé.
    </div>
  `;
}

// ═══════════════════════════════════════════════
// GARES — Schémas + Tableaux des mouvements
// ═══════════════════════════════════════════════


// ── GARES (état + rendu) ──
let garesCurrent = 'amvville';
let garesQuiz = { active:false, current:null, score:0, total:0, answered:false };

function renderGares(c) {
  c = c || document.getElementById('main-content');

  // Style local pour Gares
  if (!document.getElementById('gares-style')) {
    const st = document.createElement('style');
    st.id = 'gares-style';
    st.textContent = `
      .gare-tab { padding:10px 20px; background:var(--bg3); border:1px solid var(--border2); color:var(--text2); border-radius:var(--radius); font-family:var(--sans); font-size:14px; font-weight:600; cursor:pointer; transition:all 0.15s; }
      .gare-tab:hover { color:var(--text); border-color:var(--accent2); }
      .gare-tab.active { background:var(--accent); color:#1a1a1a; border-color:var(--accent); }
      .gare-schema { background:var(--bg4); border:1px solid var(--border); border-radius:var(--radius2); padding:18px; overflow-x:auto; margin-bottom:16px; }
      .gare-schema-rail { font-family:var(--mono); font-size:13px; color:var(--text2); white-space:pre; line-height:1.7; }
      .mvt-row { display:grid; grid-template-columns:60px 1fr 1fr 2fr; gap:10px; padding:10px 12px; background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); align-items:center; transition:all 0.15s; }
      .mvt-row:hover { border-color:var(--accent2); }
      .mvt-id { font-family:var(--mono); font-size:14px; font-weight:700; color:var(--accent); }
      .mvt-dep-dest { font-size:12px; color:var(--text); }
      .mvt-leviers { display:flex; gap:4px; flex-wrap:wrap; }
      .lev-chip { font-family:var(--mono); font-size:11px; padding:3px 7px; border-radius:3px; font-weight:600; cursor:help; transition:all 0.15s; }
      .lev-chip.aiguille { background:#1e3a8a; color:#bfdbfe; border:1px solid #3b82f6; }
      .lev-chip.signal { background:#7c2d12; color:#fed7aa; border:1px solid #ea580c; }
      .lev-chip.last { box-shadow:0 0 0 2px var(--accent); }
    `;
    document.head.appendChild(st);
  }

  const g = GARES[garesCurrent];

  c.innerHTML = `
    <div class="section-heading" style="display:flex;align-items:center;gap:10px"><span style="font-size:26px">🏘️</span> Gares & Tableaux des mouvements</div>
    <div class="section-sub">Schémas et tableaux des mouvements de St-Saturnin et AMVVille — d'après le PDF de révision (p.44)</div>

    <div style="background:rgba(248,113,113,0.05);border:1px solid var(--red);border-radius:var(--radius2);padding:12px 14px;margin-bottom:16px;font-size:13px;line-height:1.6">
      🔥 <strong style="color:var(--red)">SPÉCIAL EXAM JUILLET</strong> — Bien connaître les <strong>2 gares</strong>, leur <strong>PK (point kilométrique)</strong> et savoir lire/exécuter le <strong>tableau des mouvements</strong> de chacune.<br>
      💡 <strong>Rappel PRR/ACPP :</strong> pour chaque levier du tableau → si <strong>aiguille</strong>, on fait un <strong style="color:#3b82f6">PRR</strong> · si <strong>signal</strong>, on fait un <strong style="color:#ea580c">ACPP</strong>. Les <strong>derniers chiffres en gras</strong> sont forcément des signaux !
    </div>

    <!-- Onglets gares -->
    <div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">
      <button class="gare-tab ${garesCurrent==='amvville'?'active':''}" onclick="garesCurrent='amvville'; renderGares()">AMVVille — PK 100,600</button>
      <button class="gare-tab ${garesCurrent==='stsaturnin'?'active':''}" onclick="garesCurrent='stsaturnin'; renderGares()">Saint-Saturnin — PK 139,000</button>
    </div>

    <!-- En-tête gare -->
    <div style="background:var(--bg3);border:1px solid var(--accent);border-radius:var(--radius2);padding:14px 16px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-size:18px;font-weight:700;color:var(--accent)">${g.nom}</div>
        <div style="font-size:13px;color:var(--text2)">Ligne : <strong style="color:var(--text)">${g.voiePrincipale}</strong></div>
      </div>
      <div style="text-align:right">
        <div style="font-size:11px;color:var(--text3);font-family:var(--mono);letter-spacing:0.05em">POINT KILOMÉTRIQUE</div>
        <div style="font-size:22px;font-weight:700;color:var(--accent);font-family:var(--mono)">PK ${g.pk}</div>
      </div>
    </div>

    <!-- Schéma simplifié -->
    <h3 style="font-size:15px;font-weight:500;margin:18px 0 10px;color:var(--text2)">Schéma de voie simplifié</h3>
    <div class="gare-schema">
      <div class="gare-schema-rail">${garesSchemaSVG(garesCurrent)}</div>
      <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);font-size:12px;color:var(--text3)">
        ${garesCurrent === 'amvville'
          ? '📍 <strong>AVILLE</strong> côté (–) à gauche, <strong>ZEDVILLE</strong> côté (+) à droite. V1 = sens normal vers Zedville · V2 = sens normal vers Aville.'
          : '📍 <strong>PARIS</strong> côté (–) à gauche, <strong>LA PRESLE</strong> côté (+) à droite. V1 = sens normal vers La Presle · V2 = sens normal vers Paris.'}
      </div>
    </div>

    <!-- Tableau des mouvements -->
    <h3 style="font-size:15px;font-weight:500;margin:20px 0 10px;color:var(--text2)">Tableau des mouvements ${g.nom}</h3>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
      ${g.mouvements.map((m, i) => {
        const lastIdx = m.leviers.length - 1;
        const chips = m.leviers.map((id, j) => {
          // Trouver le levier dans la liste (gérer les variantes type 4a/4b)
          const baseId = id.replace(/[ab]$/, '');
          const lever = g.leviers.find(l => l.id === id || l.id === baseId);
          const type = lever ? lever.type : (id.match(/^[A-Z]/) ? 'signal' : 'aiguille');
          const isLast = (j === lastIdx);
          return `<span class="lev-chip ${type} ${isLast?'last':''}" title="${lever ? lever.desc : id}">${id}</span>`;
        }).join('');
        return `
          <div class="mvt-row">
            <div class="mvt-id">${m.id}</div>
            <div class="mvt-dep-dest">📤 <strong>${m.dep}</strong></div>
            <div class="mvt-dep-dest">📥 ${m.dest}</div>
            <div>
              <div class="mvt-leviers" style="margin-bottom:4px">${chips}</div>
              <div style="font-size:11px;color:var(--text3)">${m.note}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div style="padding:12px;background:rgba(240,192,64,0.05);border:1px solid var(--accent);border-radius:var(--radius2);font-size:12px;color:var(--text2);line-height:1.6">
      💡 <strong style="color:var(--accent)">Méthode d'entraînement :</strong> Prends un mouvement, lis les leviers de gauche à droite. À chaque levier :<br>
      • <strong style="color:#3b82f6">Aiguille</strong> → applique le <strong>PRR</strong> (Protection AdV, Rien entre le signal et l'AdV, Rien sur l'AdV)<br>
      • <strong style="color:#ea580c">Signal</strong> (toujours en dernier, en gras) → applique l'<strong>ACPP</strong> (Aiguilles, Croisements, Protection, Partie de voie)
    </div>

    <div style="margin-top:14px;padding:12px;background:var(--bg3);border:1px dashed var(--border2);border-radius:var(--radius2);font-size:11px;color:var(--text3);font-style:italic">
      ℹ️ Les mouvements indiqués ici sont des <strong>exemples types</strong> reconstitués d'après le schéma général du PDF de révision (p.44). Pour les mouvements exacts de l'examen, se référer à la Consigne Rose Annexe 2 de la gare concernée.
    </div>
  `;
}

function garesSchemaSVG(id) {
  if (id === 'amvville') {
    return `<svg viewBox="0 0 900 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:var(--bg4);border-radius:8px;font-family:monospace">
      <!-- Labels extérieurs -->
      <text x="30" y="20" fill="#999" font-size="11" font-weight="700">AVILLE (−)</text>
      <text x="400" y="20" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">AMVVILLE — PK 100,600</text>
      <text x="830" y="20" fill="#999" font-size="11" font-weight="700" text-anchor="end">ZEDVILLE (+)</text>

      <!-- V1 (haut, sens →) -->
      <line x1="20" y1="70" x2="350" y2="70" stroke="#4ade80" stroke-width="3"/>
      <line x1="400" y1="70" x2="880" y2="70" stroke="#4ade80" stroke-width="3"/>
      <text x="450" y="60" fill="#4ade80" font-size="11" font-weight="700">V1 →</text>
      <polygon points="875,66 885,70 875,74" fill="#4ade80"/>

      <!-- V2 (bas, sens ←) -->
      <line x1="20" y1="140" x2="350" y2="140" stroke="#60a5fa" stroke-width="3"/>
      <line x1="400" y1="140" x2="880" y2="140" stroke="#60a5fa" stroke-width="3"/>
      <text x="450" y="162" fill="#60a5fa" font-size="11" font-weight="700">← V2</text>
      <polygon points="25,136 15,140 25,144" fill="#60a5fa"/>

      <!-- Communication V1↔V2 côté Aville (aiguilles 3a, 3b, 5) -->
      <line x1="250" y1="70" x2="300" y2="140" stroke="#888" stroke-width="2" stroke-dasharray="6,3"/>
      <line x1="350" y1="70" x2="400" y2="140" stroke="#888" stroke-width="2" stroke-dasharray="6,3"/>
      <circle cx="275" cy="105" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="275" y="109" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">5</text>
      <circle cx="300" cy="80" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="300" y="84" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">3a</text>
      <circle cx="375" cy="105" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="375" y="109" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">3b</text>

      <!-- Communication côté Zedville (aiguilles 2a, 2b, 1, 4) -->
      <line x1="600" y1="70" x2="650" y2="140" stroke="#888" stroke-width="2" stroke-dasharray="6,3"/>
      <circle cx="600" cy="80" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="600" y="84" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">2a</text>
      <circle cx="650" cy="130" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="650" y="134" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">2b</text>
      <circle cx="550" cy="60" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="550" y="64" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">1</text>
      <circle cx="550" cy="150" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="550" y="154" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">4</text>

      <!-- Voies de service (bas) -->
      <line x1="300" y1="140" x2="250" y2="200" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="250" y1="200" x2="500" y2="200" stroke="#666" stroke-width="1.5"/>
      <line x1="250" y1="200" x2="250" y2="240" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="250" y1="240" x2="500" y2="240" stroke="#666" stroke-width="1.5"/>
      <text x="370" y="196" fill="#666" font-size="9">VS — voies de service</text>
      <circle cx="300" cy="155" r="7" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1"/>
      <text x="300" y="159" fill="#bfdbfe" font-size="7" text-anchor="middle">4b</text>

      <!-- Signaux (carrés rouges, carrés violets) -->
      <rect x="90" y="58" width="36" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="108" y="70" fill="#fed7aa" font-size="9" text-anchor="middle" font-weight="700">C1</text>
      <rect x="90" y="145" width="36" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="108" y="157" fill="#fed7aa" font-size="9" text-anchor="middle" font-weight="700">Cv101</text>

      <rect x="700" y="58" width="36" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="718" y="70" fill="#fed7aa" font-size="9" text-anchor="middle" font-weight="700">C5</text>
      <rect x="700" y="145" width="36" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="718" y="157" fill="#fed7aa" font-size="9" text-anchor="middle" font-weight="700">C3</text>

      <rect x="180" y="205" width="36" height="13" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="198" y="215" fill="#d8b4fe" font-size="8" text-anchor="middle" font-weight="700">Cv6</text>
      <rect x="180" y="245" width="36" height="13" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="198" y="255" fill="#d8b4fe" font-size="8" text-anchor="middle" font-weight="700">Cv8</text>

      <rect x="780" y="58" width="40" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="800" y="70" fill="#fed7aa" font-size="8" text-anchor="middle" font-weight="700">Cv11</text>
      <rect x="780" y="145" width="40" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="800" y="157" fill="#fed7aa" font-size="8" text-anchor="middle" font-weight="700">Cv10</text>

      <!-- Légende -->
      <rect x="20" y="265" width="12" height="8" rx="2" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1"/>
      <text x="38" y="273" fill="#999" font-size="9">= Aiguille (PRR)</text>
      <rect x="150" y="265" width="12" height="8" rx="2" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="168" y="273" fill="#999" font-size="9">= Signal/Carré (ACPP)</text>
      <rect x="310" y="265" width="12" height="8" rx="2" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="328" y="273" fill="#999" font-size="9">= Carré violet (VS)</text>
    </svg>`;
  } else {
    return `<svg viewBox="0 0 900 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:var(--bg4);border-radius:8px;font-family:monospace">
      <!-- Labels extérieurs -->
      <text x="30" y="20" fill="#999" font-size="11" font-weight="700">PARIS (−)</text>
      <text x="420" y="20" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">SAINT-SATURNIN — PK 139,000</text>
      <text x="860" y="20" fill="#999" font-size="11" font-weight="700" text-anchor="end">LA PRESLE (+)</text>

      <!-- V1 (haut, sens →) -->
      <line x1="20" y1="70" x2="880" y2="70" stroke="#4ade80" stroke-width="3"/>
      <text x="450" y="60" fill="#4ade80" font-size="11" font-weight="700">V1 →</text>
      <polygon points="875,66 885,70 875,74" fill="#4ade80"/>

      <!-- V2 (bas, sens ←) -->
      <line x1="20" y1="140" x2="880" y2="140" stroke="#60a5fa" stroke-width="3"/>
      <text x="450" y="162" fill="#60a5fa" font-size="11" font-weight="700">← V2</text>
      <polygon points="25,136 15,140 25,144" fill="#60a5fa"/>

      <!-- Aiguilles côté Paris -->
      <line x1="250" y1="70" x2="300" y2="140" stroke="#888" stroke-width="2" stroke-dasharray="6,3"/>
      <circle cx="270" cy="80" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="270" y="84" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">11</text>
      <circle cx="280" cy="130" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="280" y="134" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">12</text>

      <!-- Communication centrale (aiguilles 13, 14) -->
      <line x1="450" y1="70" x2="500" y2="140" stroke="#888" stroke-width="2" stroke-dasharray="6,3"/>
      <circle cx="460" cy="80" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="460" y="84" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">13</text>
      <circle cx="490" cy="130" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="490" y="134" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">14</text>

      <!-- Aiguilles côté La Presle (15a, 15b) -->
      <line x1="650" y1="70" x2="700" y2="140" stroke="#888" stroke-width="2" stroke-dasharray="6,3"/>
      <circle cx="660" cy="80" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="660" y="84" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">15a</text>
      <circle cx="690" cy="130" r="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="690" y="134" fill="#bfdbfe" font-size="8" text-anchor="middle" font-weight="700">15b</text>

      <!-- Voie A (annexe, bas) -->
      <line x1="280" y1="140" x2="240" y2="200" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="240" y1="200" x2="550" y2="200" stroke="#666" stroke-width="1.5"/>
      <text x="380" y="196" fill="#666" font-size="9">Voie A — annexe</text>

      <!-- Voie L -->
      <line x1="460" y1="70" x2="440" y2="45" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3"/>
      <line x1="440" y1="45" x2="560" y2="45" stroke="#666" stroke-width="1.5"/>
      <text x="500" y="42" fill="#666" font-size="9">Voie L</text>

      <!-- Signaux -->
      <rect x="100" y="58" width="40" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="120" y="70" fill="#fed7aa" font-size="8" text-anchor="middle" font-weight="700">C213</text>
      <rect x="100" y="145" width="40" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="120" y="157" fill="#fed7aa" font-size="8" text-anchor="middle" font-weight="700">C211</text>

      <rect x="350" y="58" width="40" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="370" y="70" fill="#fed7aa" font-size="8" text-anchor="middle" font-weight="700">C215</text>

      <rect x="770" y="58" width="40" height="16" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="790" y="70" fill="#fed7aa" font-size="8" text-anchor="middle" font-weight="700">S219</text>

      <!-- Carrés violets VS -->
      <rect x="170" y="205" width="40" height="13" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="190" y="215" fill="#d8b4fe" font-size="7" text-anchor="middle" font-weight="700">Cv222</text>
      <rect x="220" y="205" width="40" height="13" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="240" y="215" fill="#d8b4fe" font-size="7" text-anchor="middle" font-weight="700">Cv224</text>

      <rect x="140" y="105" width="40" height="13" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="160" y="115" fill="#d8b4fe" font-size="7" text-anchor="middle" font-weight="700">Cv212</text>
      <rect x="190" y="105" width="40" height="13" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="210" y="115" fill="#d8b4fe" font-size="7" text-anchor="middle" font-weight="700">Cv214</text>

      <!-- Légende -->
      <rect x="20" y="265" width="12" height="8" rx="2" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1"/>
      <text x="38" y="273" fill="#999" font-size="9">= Aiguille (PRR)</text>
      <rect x="150" y="265" width="12" height="8" rx="2" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/>
      <text x="168" y="273" fill="#999" font-size="9">= Signal/Carré (ACPP)</text>
      <rect x="310" y="265" width="12" height="8" rx="2" fill="#3b0764" stroke="#a855f7" stroke-width="1"/>
      <text x="328" y="273" fill="#999" font-size="9">= Carré violet (VS)</text>
    </svg>`;
  }
}

// ═══════════════════════════════════════════════
// MOBILE
// ═══════════════════════════════════════════════
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

init();
