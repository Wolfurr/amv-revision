// AMV — Révision SECUFER — Logique applicative
// Navigation, recherche, rendu des vues, quiz/flashcards/dictée, signaux, gares
// Dépend de : data-fiches.js, data-banks.js, data-signaux.js (doivent être chargés AVANT ce fichier)

// ═══════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════

// Source unique de vérité pour la version + date de MAJ (affichée en haut à droite)
const VERSION_LABEL = 'v8.8 — 11 août 2026';

const THEMES = [
  { id:'epi',         code:'AMV801',        title:'EPI & Déplacements',                 short:'EPI' },
  { id:'zd',          code:'RRA20068',       title:'Zone dangereuse',                    short:'Zone dangereuse' },
  { id:'aiguillage',  code:'AMV200–216',     title:'Aiguillage & Appareils de voie',     short:'Aiguillage' },
  { id:'encl',        code:'AMV210–211',     title:'Enclenchements (méca. & élec.)',     short:'Enclenchements' },
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
  { id:'temd',        code:'DC1792',         title:'TE & MD — Examen dédié ACDV',        short:'TE & MD' },
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
  ['39','Enclenchements électriques : ZI→Anx4 · CIP & ZP→Anx2 · EAP→Anx5','encl','🔥 Par cœur','Enclenchements électriques'],
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
  ['home','fiches','flash','quiz','dictee','gares','acdv'].forEach(x => {
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
  else if (v === 'acdv') { setTopbar('<span style="color:#34d399">ACDV</span> / <span>Accueil Formation</span>'); renderACDV(c); }
  else if (v === 'fiches') { setTopbar('AMV / <span>Fiches de cours</span>'); renderFiches(c); }
  else if (v === 'flash') { setTopbar('AMV / <span>Flashcards</span>'); renderFlash(c); }
  else if (v === 'quiz') { setTopbar('AMV / <span>Quiz QCM</span>'); renderQuiz(c); }
  else if (v === 'dictee') { setTopbar('AMV / <span>Dictée de définitions</span>'); renderDictee(c); }
  else if (v === 'gares') { setTopbar('AMV / <span>🏘️ Saint-Saturnin — Schéma & Tableau des mouvements</span>'); renderGares(c); }
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
<!-- BOUTON ACDV BIEN EN ÉVIDENCE -->
<div style="background:linear-gradient(135deg,rgba(52,211,153,0.12),rgba(52,211,153,0.04));border:2px solid #34d399;border-radius:var(--radius2);padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
  <div style="flex:1">
    <div style="font-weight:700;color:#34d399;font-size:15px;margin-bottom:3px">🎓 Formation ACDV en cours</div>
    <div style="font-size:12px;color:var(--text2)">Agent Circulation Double Voie — procédures, logigrammes, lecture de DC. AMV réussi ✓</div>
  </div>
  <button class="btn" style="background:#34d399;color:#000;font-weight:700;padding:8px 18px;font-size:13px;border:none" onclick="showView('acdv')">Accueil ACDV →</button>
</div>

<div class="section-heading">AMV — Révision</div>
<div class="section-sub">${VERSION_LABEL} · Base complète maintenue pour l'ACDV</div>

<div style="display:flex;gap:16px;justify-content:center;align-items:center;padding:10px 16px;background:var(--bg3);border:1px solid var(--accent);border-radius:var(--radius);margin-bottom:12px;font-family:var(--mono);font-size:13px">
  <span style="color:var(--text3)">📍</span>
  <span><strong style="color:var(--accent)">AMVVille</strong> <span style="color:var(--text2)">PK</span> <strong style="color:var(--text)">100,600</strong></span>
  <span style="color:var(--border2)">│</span>
  <span><strong style="color:var(--accent)">Saint-Saturnin</strong> <span style="color:var(--text2)">PK</span> <strong style="color:var(--text)">139,000</strong></span>
</div>

<!-- 3 CONSIGNES -->
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
  <div style="flex:1;min-width:150px;padding:10px 14px;background:var(--bg3);border:1px solid rgba(240,192,64,0.4);border-radius:var(--radius)">
    <div style="font-family:var(--mono);font-size:10px;color:var(--accent);margin-bottom:4px">CONSIGNE ROSE</div>
    <div style="font-size:12px;color:var(--text2)">Installations de sécurité (ZI, CIP, ZP, EAP, enclenchements, schémas, tableaux des mouvements…)</div>
  </div>
  <div style="flex:1;min-width:150px;padding:10px 14px;background:var(--bg3);border:1px solid rgba(96,165,250,0.4);border-radius:var(--radius)">
    <div style="font-family:var(--mono);font-size:10px;color:var(--blue);margin-bottom:4px">CONSIGNE BLEUE</div>
    <div style="font-size:12px;color:var(--text2)">Installations de traction électrique (caténaire, sectionneurs, zones…)</div>
  </div>
  <div style="flex:1;min-width:150px;padding:10px 14px;background:var(--bg3);border:1px solid rgba(52,211,153,0.4);border-radius:var(--radius)">
    <div style="font-family:var(--mono);font-size:10px;color:#34d399;margin-bottom:4px">CONSIGNE DE PROTECTION</div>
    <div style="font-size:12px;color:var(--text2)">Travaux (ZEP, DFV, assurance chantier…)</div>
  </div>
</div>

<!-- BARRE DE RECHERCHE -->
<div style="margin-bottom:20px;position:relative">
  <input id="search-input" type="text" placeholder="🔍  Rechercher dans toute l'appli : FAMAS, ZD, BAL, CDIS..."
    oninput="doSearch(this.value)"
    style="width:100%;padding:12px 16px;background:var(--bg2);border:1px solid var(--border2);border-radius:var(--radius);color:var(--text);font-family:var(--sans);font-size:14px;outline:none;"
    onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border2)'">
  <div id="search-results" style="display:none;position:absolute;top:100%;left:0;right:0;background:var(--bg2);border:1px solid var(--border2);border-radius:0 0 var(--radius) var(--radius);z-index:200;max-height:320px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,0.4)"></div>
</div>

<!-- AMV RÉUSSI + STRUCTURE EXAMEN (historique) -->
<div class="card" style="border-color:rgba(52,211,153,0.3);background:rgba(52,211,153,0.03);margin-bottom:16px">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap">
    <div class="card-title" style="color:#34d399;margin:0">✅ AMV — RÉUSSI</div>
    <div style="font-size:12px;color:var(--text3)">Structure de l'examen (pour mémoire)</div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <div style="flex:1;min-width:160px;padding:8px 12px;background:var(--bg4);border-radius:5px;font-size:12px;color:var(--text2)">
      <strong style="color:var(--text)">✍️ Écrite — 1h</strong> (ExpertQuizz)<br>
      <span style="font-size:11px;color:var(--text3)">PS9 · Formation · IS · Cantonnement · Plaques</span>
    </div>
    <div style="flex:1;min-width:160px;padding:8px 12px;background:var(--bg4);border-radius:5px;font-size:12px;color:var(--text2)">
      <strong style="color:var(--text)">🗣️ Oral — 2h30</strong><br>
      <span style="font-size:11px;color:var(--text3)">Aiguillage (PRR/ACPP/dérang.) · Circulation (FAMAS) · Travaux (DFV)</span>
    </div>
  </div>
</div>

<!-- MÉMO DC/DOCUMENTS PAR THÈME -->
<div class="card" style="border-color:rgba(167,139,250,0.3);background:rgba(167,139,250,0.03);margin-bottom:16px">
  <div class="card-title" style="color:#a78bfa;margin-bottom:10px">📂 DC / DOCUMENTS À SORTIR PAR THÈME</div>
  <div class="table-wrap"><table style="font-size:11px">
    <thead><tr><th>DC / Réf.</th><th>Sujet</th><th>Usage</th></tr></thead>
    <tbody>
      <tr><td><strong>DC 1503 ✓</strong></td><td>Incidents de Circulation</td><td>FAMAS, bestiaux, PN (fiches 3/4/6/8.1)</td></tr>
      <tr><td><strong>DC 1505 ✓</strong></td><td>Contre-sens, contre-voie, VUT</td><td>Réception voie occupée (fiche 9)</td></tr>
      <tr><td><strong>DC 1556 ✓</strong></td><td>Catégories A, B, C</td><td>Circulations spéciales, déshuntage</td></tr>
      <tr><td><strong>DC 7202</strong></td><td>Guide des communications</td><td>Codes radio, communications</td></tr>
      <tr><td><strong>IN 1582</strong></td><td>Travaux sur IS</td><td>4 catégories, procédure 1ère cat.</td></tr>
      <tr><td><strong>DC 3858</strong></td><td>Poste d'aiguillage à leviers individuels</td><td>RIAT, dérangements IS, CBA · Tome 2 = Modes opératoires Travaux</td></tr>
      <tr><td><strong>DC 3978 ✓</strong></td><td>Modes opératoires des Travaux — Tome 1</td><td>DFV, entente préalable (art. 4, 2.2…)</td></tr>
      <tr><td><strong>DC 3969 ✓</strong></td><td>Franchissement des signaux et arrêt des trains</td><td>CBA, ordre C, arrêt d'urgence</td></tr>
      <tr><td><strong>DC 11490</strong></td><td>Traction Électrique</td><td>Zones TE, consignes élec.</td></tr>
      <tr><td><strong>DC 8043</strong></td><td>Mesures pour circulations spéciales</td><td>Protection C (fiche 30)</td></tr>
      <tr><td><strong>DC 1792</strong></td><td>Transports MD</td><td>Marchandises Dangereuses</td></tr>
      <tr><td><strong>DC 1732</strong></td><td>Fermeture/ouverture d'une ligne</td><td>—</td></tr>
      <tr><td><strong>DC 1509</strong></td><td>Gares temporaires</td><td>ACDV — à compléter</td></tr>
    </tbody>
  </table></div>
  <div style="margin-top:8px;font-size:11px;color:var(--text3)">✓ = utilisé en cours AMV · Tableau complet du formateur (juin 2026)</div>
</div>

<!-- PRIORITÉS DE RÉVISION -->
<div class="card" style="border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.03);margin-bottom:16px">
  <div class="card-title" style="color:var(--red);margin-bottom:10px">🎯 PRIORITÉS AMV — à garder en tête pour l'ACDV</div>
  <div style="display:flex;flex-direction:column;gap:6px">
    ${[
      ['encl','Tableau récap visuel ZI/CIP/ZP/EAP par cœur (mémo Walid)','Enclenchements électriques','EE ZI'],
      ['encl','Consigne Rose — annexes par cœur : Anx2 (CIP/ZP) · Anx4 (ZI) · Anx5 (EAP)','CR annexes','Récap annexes'],
      ['aiguillage','RIAT complet + 3E + CBA/3C2D — réflexes à automatiser','RIAT / CBA','Les 3 E'],
      ['circulation','Réceptions sur voies de service — AVANT et APRÈS (aiguille VS libre + croisements)','Réceptions VS','Réceptions sur voies'],
      ['circulation','Réception sur voie occupée — DC 1505 fiche 9','Voie occupée','Réception sur voie occupée'],
    ].map(([theme,titre,tag,anchor]) => `
    <div style="display:flex;align-items:center;gap:10px;padding:7px 12px;background:var(--bg3);border-radius:var(--radius);flex-wrap:wrap">
      <span style="font-size:13px;color:var(--text);flex:1">${titre}</span>
      <span class="tag red" style="font-size:10px">${tag}</span>
      <button class="btn btn-sm" style="padding:3px 10px;font-size:11px;white-space:nowrap" onclick="gotoFiche('${theme}','${anchor}')">Fiche →</button>
    </div>`).join('')}
  </div>
</div>

<!-- A TOMBER A L'EXAM AMV -->
<div class="card" style="border-color:rgba(240,192,64,0.3);background:rgba(240,192,64,0.03);margin-bottom:16px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">
    <span style="font-size:18px">⚠️</span>
    <div class="card-title" style="color:var(--accent)">SÛRS DE TOMBER À L'EXAMEN AMV — selon les formateurs</div>
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

function renderACDV(c) {
  c = c || document.getElementById('main-content');
  c.innerHTML = `
<div class="section-heading">Formation ACDV <span class="tag green ml6" style="font-size:13px;vertical-align:middle">✓ AMV réussi 🎉</span></div>
<div class="section-sub">Agent Circulation Double Voie — procédures, logigrammes et lecture de DC</div>

<h3 class="fc-h3-accent" style="color:#34d399;border-color:#34d399">🚨 Sujets 100% sûrs à l'ACDV</h3>

<div class="def-block important" style="border-left-color:#34d399">
  <div class="def-term">Réception sur voies de service <span class="tag green ml6">✓ Fiche dispo</span></div>
  <div class="def-text">AVANT/APRÈS — aiguille VS libre, croisements dégagés, groupes D/R, TOV/GOV. <button class="btn btn-sm" style="margin-left:8px" onclick="gotoFiche('circulation','Réceptions sur voies')">Fiche →</button></div>
</div>
<div class="def-block important" style="border-left-color:#34d399">
  <div class="def-term">Réception sur voie occupée <span class="tag green ml6">✓ Fiche dispo</span></div>
  <div class="def-text">DC 1505 fiche 9 — Cas 1 (arrêt normal) / Cas 2 (sans arrêt). <button class="btn btn-sm" style="margin-left:8px" onclick="gotoFiche('circulation','Réception sur voie occupée')">Fiche →</button></div>
</div>
<div class="def-block important" style="border-left-color:#34d399">
  <div class="def-term">DFV avec TTX <span class="tag yellow ml6">Partiel</span></div>
  <div class="def-text">Art. 8.1 · 3 types d'aiguilles (obligée/indifférente/continuité) · 3 types de trains (ouvrant/déclencheur/stationné). CEPIITTAAS à venir. <button class="btn btn-sm" style="margin-left:8px" onclick="gotoFiche('travaux','Art. 8.1')">Fiche →</button></div>
</div>
<div class="def-block important" style="border-left-color:var(--red)">
  <div class="def-term">DFV sans vérification de libération <span class="tag red ml6">📋 À venir</span></div>
</div>
<div class="def-block important" style="border-left-color:var(--red)">
  <div class="def-term">Modification d'itinéraire (EPA / EAP) <span class="tag red ml6">📋 À venir</span></div>
</div>
<div class="def-block important" style="border-left-color:var(--red)">
  <div class="def-term">Zone de transit en dérangement <span class="tag red ml6">📋 À venir</span></div>
</div>
<div class="def-block important" style="border-left-color:var(--red)">
  <div class="def-term">Dérangement de l'aiguille elle-même <span class="tag red ml6">📋 À venir</span></div>
</div>
<div class="def-block important" style="border-left-color:var(--red)">
  <div class="def-term">Enrayage <span class="tag red ml6">📋 À venir</span></div>
</div>
<div class="def-block important" style="border-left-color:#34d399">
  <div class="def-term">Travaux sur IS — 1ère catégorie <span class="tag green ml6">✓ Fiche dispo</span></div>
  <div class="def-text">5 étapes verbales · 4 infos obligatoires · rien à annoter. <button class="btn btn-sm" style="margin-left:8px" onclick="gotoFiche('aiguillage','1ère catégorie')">Fiche →</button></div>
</div>
<div class="def-block important" style="border-left-color:#34d399">
  <div class="def-term">Enclenchements électriques <span class="tag yellow ml6">AMV + Transit/EPA</span></div>
  <div class="def-text">ZI/CIP/ZP/EAP + Transit et EPA nouveaux. <button class="btn btn-sm" style="margin-left:8px" onclick="gotoFiche('encl','Tableau récap visuel')">Fiche →</button></div>
</div>
<div class="def-block important" style="border-left-color:#34d399">
  <div class="def-term">TE & MD <span class="tag yellow ml6">Examen dédié</span></div>
  <div class="def-text">ATE types 4/5/7 · Repérage 5 points · Panneau orange · Encadré jaune. Procédures ACDV à compléter. <button class="btn btn-sm" style="margin-left:8px" onclick="gotoFiche('temd','')">Fiche TE&MD →</button></div>
</div>
<div class="def-block">
  <div class="def-term">Cantonnement téléphonique <span class="tag red ml6">📋 À venir</span></div>
</div>
<div class="def-block">
  <div class="def-term">Gare temporaire <span class="tag red ml6">📋 À venir</span></div>
</div>

<h3 class="fc-h3">Fiches AMV — toujours valides pour l'ACDV</h3>

<div class="def-block">
  <div class="def-text" style="display:flex;flex-wrap:wrap;gap:6px">
    <button class="btn btn-sm" onclick="gotoFiche('aiguillage','')" title="RIAT · 3E · CBA">Aiguillage</button>
    <button class="btn btn-sm" onclick="gotoFiche('encl','')" title="ZI/CIP/ZP/EAP">Enclenchements</button>
    <button class="btn btn-sm" onclick="gotoFiche('circulation','')" title="ACPP · PRR · VS">Circulation</button>
    <button class="btn btn-sm" onclick="gotoFiche('incidents','')" title="FAMAS · bestiaux · PN">Incidents</button>
    <button class="btn btn-sm" onclick="gotoFiche('travaux','')" title="DFV · DC 3978">Travaux</button>
    <button class="btn btn-sm" onclick="gotoFiche('elect','')" title="Protection C">Traction élec.</button>
    <button class="btn btn-sm" onclick="gotoFiche('temd','')" title="TE · MD · ATE · Panneau orange">TE &amp; MD</button>
    <button class="btn btn-sm" onclick="gotoFiche('formation','')" title="PS9 · essais de frein">Formation</button>
    <button class="btn btn-sm" onclick="gotoFiche('graissage','')" title="ASP · DPGR · DAL">Graissage</button>
  </div>
</div>`;
}

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
  const themeMap = { traction:'elect' };

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
  const themeMap = { traction:'elect' };
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
// ── Données gare Saint-Saturnin (inlinées dans app.js — pas de dépendance externe) ──
var STSAT = {
  nom: "Saint-Saturnin",
  pk: "139,000",
  voiePrincipale: "PARIS (−) ↔ LA PRESLE (+)",
  leviers: [
    { id:'11',    type:'aiguille', desc:'Aiguille 11' },
    { id:'12',    type:'aiguille', desc:'Aiguille 12' },
    { id:'13',    type:'aiguille', desc:'Aiguille 13' },
    { id:'14',    type:'aiguille', desc:'Aiguille 14' },
    { id:'15a',   type:'aiguille', desc:'Aiguille 15a' },
    { id:'15b',   type:'aiguille', desc:'Aiguille 15b' },
    { id:'C211',  type:'signal',   desc:'Carré C211' },
    { id:'C213',  type:'signal',   desc:'Carré C213' },
    { id:'C215',  type:'signal',   desc:'Carré C215' },
    { id:'S219',  type:'signal',   desc:'Sémaphore S219' },
    { id:'Cv222', type:'signal',   desc:'Carré violet Cv222' },
    { id:'Cv224', type:'signal',   desc:'Carré violet Cv224' },
  ],
  mouvements: [
    { id:'M1', dep:'PARIS  · V1',      dest:'LA PRESLE · V1',  leviers:['11','13','15a','S219'],      note:'Direct V1 → V1' },
    { id:'M2', dep:'PARIS  · V2',      dest:'LA PRESLE · V2',  leviers:['12','14','15b','C211'],      note:'Direct V2 → V2' },
    { id:'M3', dep:'PARIS  · V1',      dest:'LA PRESLE · V2',  leviers:['11','13','14','15b','S219'], note:'V1 → V2 côté La Presle' },
    { id:'M4', dep:'Voie A (annexe)',   dest:'V1 vers LA PRESLE',leviers:['11','13','15a','C215'],     note:'Sortie voie annexe' },
  ],
};


// ═══════════════════════════════════════════════
// GARE SAINT-SATURNIN — Schéma & Tableau des mouvements
// ═══════════════════════════════════════════════

let garesQuiz = { active:false, current:null, score:0, total:0, answered:false };

function renderGares(c) {
  c = c || document.getElementById('main-content');
  try {

  if (!document.getElementById('gares-style')) {
    var st = document.createElement('style');
    st.id = 'gares-style';
    st.textContent = [
      '.mvt-row{display:grid;grid-template-columns:64px 1fr 1fr 2fr;gap:10px;padding:10px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);align-items:center}',
      '.mvt-row:hover{border-color:var(--border2)}',
      '.mvt-id{font-family:var(--mono);font-size:14px;font-weight:700;color:var(--accent)}',
      '.mvt-dep{font-size:12px;color:var(--text)}',
      '.mvt-leviers{display:flex;gap:4px;flex-wrap:wrap}',
      '.lev-chip{font-family:var(--mono);font-size:11px;padding:3px 8px;border-radius:3px;font-weight:600}',
      '.lev-chip.aiguille{background:#1e3a8a;color:#bfdbfe;border:1px solid #3b82f6}',
      '.lev-chip.signal{background:#7c2d12;color:#fed7aa;border:1px solid #ea580c}',
      '.lev-chip.last{box-shadow:0 0 0 2px var(--accent)}'
    ].join('');
    document.head.appendChild(st);
  }

  var g = STSAT;

  // --- SVG ---
  var svg = '<svg viewBox="0 0 960 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;min-width:500px;display:block"><defs>'
    + '<marker id="arrowR" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#4ade80"/></marker>'
    + '<marker id="arrowL" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto"><path d="M8,0 L8,6 L0,3 z" fill="#60a5fa"/></marker>'
    + '</defs>'
    // Titres
    + '<text x="16" y="18" fill="#8a99b8" font-size="11" font-family="monospace" font-weight="700">PARIS (−)</text>'
    + '<text x="480" y="18" fill="#f0c040" font-size="13" font-family="monospace" font-weight="700" text-anchor="middle">SAINT-SATURNIN · PK 139,000</text>'
    + '<text x="944" y="18" fill="#8a99b8" font-size="11" font-family="monospace" font-weight="700" text-anchor="end">LA PRESLE (+)</text>'
    // V1
    + '<line x1="16" y1="70" x2="240" y2="70" stroke="#4ade80" stroke-width="3"/>'
    + '<line x1="296" y1="70" x2="520" y2="70" stroke="#4ade80" stroke-width="3"/>'
    + '<line x1="560" y1="70" x2="720" y2="70" stroke="#4ade80" stroke-width="3"/>'
    + '<line x1="760" y1="70" x2="940" y2="70" stroke="#4ade80" stroke-width="3" marker-end="url(#arrowR)"/>'
    + '<text x="860" y="60" fill="#4ade80" font-size="11" font-family="monospace">V1 →</text>'
    // V2
    + '<line x1="20" y1="140" x2="240" y2="140" stroke="#60a5fa" stroke-width="3" marker-start="url(#arrowL)"/>'
    + '<line x1="296" y1="140" x2="520" y2="140" stroke="#60a5fa" stroke-width="3"/>'
    + '<line x1="560" y1="140" x2="720" y2="140" stroke="#60a5fa" stroke-width="3"/>'
    + '<line x1="760" y1="140" x2="940" y2="140" stroke="#60a5fa" stroke-width="3"/>'
    + '<text x="70" y="163" fill="#60a5fa" font-size="11" font-family="monospace">← V2</text>'
    // Aiguilles côté Paris (11, 12)
    + '<line x1="240" y1="70" x2="296" y2="140" stroke="#3b82f6" stroke-width="2"/>'
    + '<circle cx="248" cy="80" r="14" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><text x="248" y="84" fill="#bfdbfe" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">11</text>'
    + '<circle cx="286" cy="130" r="14" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><text x="286" y="134" fill="#bfdbfe" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">12</text>'
    // Aiguilles centrales (13, 14)
    + '<line x1="520" y1="70" x2="560" y2="140" stroke="#3b82f6" stroke-width="2"/>'
    + '<circle cx="528" cy="80" r="14" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><text x="528" y="84" fill="#bfdbfe" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">13</text>'
    + '<circle cx="552" cy="130" r="14" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><text x="552" y="134" fill="#bfdbfe" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">14</text>'
    // Aiguilles côté La Presle (15a, 15b)
    + '<line x1="720" y1="70" x2="760" y2="140" stroke="#3b82f6" stroke-width="2"/>'
    + '<circle cx="728" cy="80" r="14" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><text x="728" y="84" fill="#bfdbfe" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">15a</text>'
    + '<circle cx="752" cy="130" r="14" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/><text x="752" y="134" fill="#bfdbfe" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">15b</text>'
    // Voie A (annexe, sous V2)
    + '<line x1="296" y1="140" x2="260" y2="185" stroke="#505e7a" stroke-width="1.5" stroke-dasharray="5,3"/>'
    + '<line x1="260" y1="185" x2="560" y2="185" stroke="#505e7a" stroke-width="2"/>'
    + '<line x1="560" y1="185" x2="560" y2="140" stroke="#505e7a" stroke-width="1.5" stroke-dasharray="5,3"/>'
    + '<text x="410" y="200" fill="#505e7a" font-size="10" font-family="monospace" text-anchor="middle">Voie A (annexe)</text>'
    // Voie L (croisement haut)
    + '<line x1="520" y1="70" x2="520" y2="42" stroke="#505e7a" stroke-width="1.5" stroke-dasharray="5,3"/>'
    + '<line x1="520" y1="42" x2="720" y2="42" stroke="#505e7a" stroke-width="2"/>'
    + '<line x1="720" y1="42" x2="720" y2="70" stroke="#505e7a" stroke-width="1.5" stroke-dasharray="5,3"/>'
    + '<text x="620" y="38" fill="#505e7a" font-size="10" font-family="monospace" text-anchor="middle">Voie L</text>'
    // Signaux V1
    + '<rect x="110" y="56" width="50" height="18" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1.5"/><text x="135" y="69" fill="#fed7aa" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">C 213</text>'
    + '<rect x="390" y="56" width="50" height="18" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1.5"/><text x="415" y="69" fill="#fed7aa" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">C 215</text>'
    + '<rect x="820" y="56" width="50" height="18" rx="3" fill="#4a2c0a" stroke="#f59e0b" stroke-width="1.5"/><text x="845" y="69" fill="#fcd34d" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">S 219</text>'
    // Signaux V2
    + '<rect x="110" y="128" width="50" height="18" rx="3" fill="#7c2d12" stroke="#ea580c" stroke-width="1.5"/><text x="135" y="141" fill="#fed7aa" font-size="9" text-anchor="middle" font-weight="700" font-family="monospace">C 211</text>'
    // Carrés VS voie A
    + '<rect x="195" y="174" width="52" height="15" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/><text x="221" y="185" fill="#d8b4fe" font-size="8" text-anchor="middle" font-weight="700" font-family="monospace">Cv 222</text>'
    + '<rect x="460" y="174" width="52" height="15" rx="3" fill="#3b0764" stroke="#a855f7" stroke-width="1"/><text x="486" y="185" fill="#d8b4fe" font-size="8" text-anchor="middle" font-weight="700" font-family="monospace">Cv 224</text>'
    // Légende
    + '<rect x="16" y="220" width="12" height="9" rx="2" fill="#1e3a8a" stroke="#3b82f6" stroke-width="1"/><text x="34" y="229" fill="#8a99b8" font-size="10" font-family="monospace">Aiguille (PRR)</text>'
    + '<rect x="160" y="220" width="12" height="9" rx="2" fill="#7c2d12" stroke="#ea580c" stroke-width="1"/><text x="178" y="229" fill="#8a99b8" font-size="10" font-family="monospace">Carré (ACPP)</text>'
    + '<rect x="300" y="220" width="12" height="9" rx="2" fill="#4a2c0a" stroke="#f59e0b" stroke-width="1"/><text x="318" y="229" fill="#8a99b8" font-size="10" font-family="monospace">Sémaphore (ACPP)</text>'
    + '<rect x="480" y="220" width="12" height="9" rx="2" fill="#3b0764" stroke="#a855f7" stroke-width="1"/><text x="498" y="229" fill="#8a99b8" font-size="10" font-family="monospace">Carré violet (VS)</text>'
    + '</svg>';

  // --- Tableau des mouvements ---
  var mvtHeader = '<div style="display:grid;grid-template-columns:64px 1fr 1fr 2fr;gap:10px;padding:8px 12px;font-family:var(--mono);font-size:10px;letter-spacing:0.08em;color:var(--text3);text-transform:uppercase">'
    + '<div>Mvt.</div><div>D\u00e9part</div><div>Destination</div><div>Leviers dans l\'ordre</div></div>';
  var mvtRows = g.mouvements.map(function(m) {
    var lastIdx = m.leviers.length - 1;
    var chips = m.leviers.map(function(id, j) {
      var lever = null;
      for (var k = 0; k < g.leviers.length; k++) {
        if (g.leviers[k].id === id || g.leviers[k].id === id.replace(/[ab]$/, '')) { lever = g.leviers[k]; break; }
      }
      var type  = lever ? lever.type : (id.match(/^[A-Z]/) ? 'signal' : 'aiguille');
      var last  = (j === lastIdx) ? ' last' : '';
      var title = lever ? lever.desc : id;
      return '<span class="lev-chip ' + type + last + '" title="' + title + '">' + id + '</span>';
    }).join('');
    return '<div class="mvt-row">'
      + '<div class="mvt-id">' + m.id + '</div>'
      + '<div class="mvt-dep">&#128228; ' + m.dep + '</div>'
      + '<div class="mvt-dep" style="color:var(--text2)">&#128229; ' + m.dest + '</div>'
      + '<div><div class="mvt-leviers" style="margin-bottom:4px">' + chips + '</div>'
      + '<div style="font-size:11px;color:var(--text3)">' + m.note + '</div></div>'
      + '</div>';
  }).join('');

  // --- Rendu ---
  c.innerHTML = ''
    + '<div class="section-heading">\uD83C\uDFD8\uFE0F Gare de Saint-Saturnin — PK 139,000</div>'
    + '<div class="section-sub">Sch\u00e9ma de voie \u00b7 Tableau des mouvements \u00b7 Consigne Rose Annexe 2</div>'
    + '<div class="rule-box" style="margin-bottom:16px">'
    + '\uD83D\uDCA1 <strong>Rappel PRR / ACPP :</strong> pour chaque levier du tableau \u2014 si <strong>aiguille</strong> \u2192 <strong style="color:#60a5fa">PRR</strong> \u00b7 si <strong>signal</strong> \u2192 <strong style="color:#ea580c">ACPP</strong>. Les <strong>derniers chiffres</strong> (en surbrillance dor\u00e9e) sont toujours des signaux.'
    + '</div>'
    + '<div class="card" style="padding:16px;margin-bottom:20px;overflow-x:auto">'
    + '<div class="card-title" style="margin-bottom:12px">Sch\u00e9ma de voie simplifi\u00e9</div>'
    + svg
    + '<div style="margin-top:12px;font-size:11px;color:var(--text3)">\uD83D\uDCCD <strong style="color:var(--text2)">PARIS</strong> c\u00f4t\u00e9 (\u2212) \u00e0 gauche \u00b7 <strong style="color:var(--text2)">LA PRESLE</strong> c\u00f4t\u00e9 (+) \u00e0 droite \u00b7 V1 = sens normal vers La Presle \u00b7 V2 = sens normal vers Paris</div>'
    + '</div>'
    + '<h3 class="fc-h3-accent">Tableau des mouvements</h3>'
    + '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:20px">'
    + mvtHeader + mvtRows
    + '</div>'
    + '<div class="def-block"><div class="def-term">\uD83D\uDCCC Infos gare</div>'
    + '<div class="def-text">Ligne : <strong>' + g.voiePrincipale + '</strong> \u00b7 PK : <strong>139,000</strong><br>'
    + 'Sch\u00e9ma et donn\u00e9es indicatifs \u2014 se r\u00e9f\u00e9rer \u00e0 la <strong>Consigne Rose Annexe 2</strong> de Saint-Saturnin pour les donn\u00e9es exactes.</div></div>';

  } catch(err) {
    c.innerHTML = '<div class="section-heading">Gare de Saint-Saturnin</div>'
      + '<div class="def-block important"><div class="def-term" style="color:var(--red)">\u26a0\ufe0f Erreur JavaScript</div>'
      + '<div class="def-text">' + String(err) + '<br><br>Fais un <strong>Ctrl+Maj+R</strong> (ou Cmd+Maj+R sur Mac) pour vider le cache et r\u00e9essaie.</div></div>';
  }
}



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
