// AMV — Révision SECUFER — Signaux, panneaux et gares
// SIGNAUX (définitions + SVG), PLAQUES, FAMILLES_SIGNAUX, GARES (schémas + tableaux de mouvements)
// Référencé par : app.js → renderSignauxLearn(), renderSignauxQuiz(), renderGares()

const SIGNAUX = [
  // ═══ FAMILLE A — SIGNAUX D'ARRÊT ═══
  {
    id:'carre', nom:'Carré (C)', fam:'A', plaque:'Nf', voie:'Voie principale',
    role:'Arrêt absolu — protège les aiguilles et zones de danger',
    detail:'Rôles : protéger les aiguilles (rôle principal), protéger le stationnement d\'un train en gare, assurer le cantonnement, protéger un obstacle, arrêter les trains. Doit être annoncé par un avertissement.',
    œilleton:'éteint',
    svg: svgPanel(`<circle cx="40" cy="55" r="13" fill="#ef4444"/><circle cx="40" cy="100" r="13" fill="#ef4444"/>`)
  },
  {
    id:'carre-violet', nom:'Carré violet (Cv)', fam:'A', plaque:'Nf', voie:'Voie de service',
    role:'Arrêt absolu sur voies de service / utilisé pour les manœuvres',
    detail:'Utilisé sur les voies principales pour les manœuvres et sur voies de service. Commande l\'arrêt avant le signal. N\'est pas annoncé. L\'œilleton est éteint quand le Cv est fermé.',
    œilleton:'éteint',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#a855f7"/>`)
  },
  {
    id:'semaphore', nom:'Sémaphore (S)', fam:'A', plaque:'F · PR · BM · Nf', voie:'Voie principale',
    role:'Assure le cantonnement (espacement des trains)',
    detail:'Implanté à l\'origine du canton qu\'il protège. Œilleton allumé = franchissable sous conditions (BAL). Œilleton éteint ou absent (BAPR, BM) = non franchissable sauf ordre. En BAL : peut être franchi de lui-même après temps d\'arrêt en marche à vue. En BAPR : accord verbal de l\'aiguilleur ou 15 min d\'attente. En BM : formulaire S ou MV.',
    œilleton:'allumé (BAL) / éteint ou absent (BAPR, BM)',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#ef4444"/><circle cx="68" cy="78" r="6" fill="#fafafa" stroke="#888" stroke-width="0.8"/>`)
  },
  {
    id:'rouge-cli', nom:'Sémaphore clignotant (Rcli)', fam:'A', plaque:'F · Nf', voie:'Voie principale',
    role:'Marche à vue à 15 km/h max jusqu\'au signal suivant',
    detail:'Utilisé sur les cantons courts de BAL (zone urbaine dense) ou pour éviter un arrêt non désiré (gare sans arrêt, arrêt en rampe). N\'existe pas en signalisation mécanique. Œilleton allumé.',
    œilleton:'allumé',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#ef4444" opacity="0.95"><animate attributeName="opacity" values="0.95;0.15;0.95" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="68" cy="78" r="6" fill="#fafafa" stroke="#888" stroke-width="0.8"/>`)
  },
  {
    id:'guidon', nom:'Guidon d\'arrêt (GA)', fam:'A', plaque:'GA', voie:'VP ou VS',
    role:'Arrêt — protège un point particulier (PN, manœuvres)',
    detail:'Ne peut être abordé que par des convois en marche à vue ou en marche de manœuvre. Présente une barre lumineuse rouge horizontale (lumineux) ou une demi-aile rouge horizontale + feu rouge (mécanique).',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block"><rect x="15" y="30" width="70" height="40" rx="6" fill="#1a1a1a" stroke="#666" stroke-width="1.5"/><rect x="22" y="44" width="56" height="12" rx="2" fill="#ef4444"/></svg>`
  },
  {
    id:'sam', nom:'Signal d\'arrêt à main (SAM)', fam:'A', plaque:'—', voie:'VP',
    role:'Arrêt immédiat — signal portatif au sol',
    detail:'Jour : drapeau rouge déployé ou jalon d\'arrêt à damier rouge/blanc. Nuit : feu rouge d\'une lanterne à main ou d\'un jalon. Sert au repérage d\'un point à ne pas dépasser ou à la protection d\'un chantier/obstacle inopiné.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="35" y="10" width="30" height="30" fill="#ef4444"/>
      <rect x="35" y="10" width="15" height="15" fill="#fff"/>
      <rect x="50" y="25" width="15" height="15" fill="#fff"/>
      <circle cx="50" cy="55" r="9" fill="#ef4444"/>
      <rect x="48" y="60" width="4" height="55" fill="#444"/>
    </svg>`
  },
  {
    id:'disque', nom:'Disque (D)', fam:'A', plaque:'D', voie:'Voie principale',
    role:'Annonce un arrêt différé — marche à vue + arrêt avant 1er ADV ou avant le poste',
    detail:'Signal particulier qui annonce un arrêt différé. Utilisé sur les lignes équipées de Block Manuel pour protéger les petites gares ou les établissements de pleine ligne. Cible RONDE en lumineux, cocarde circulaire rouge en mécanique. Présente 1 feu rouge + 1 feu jaune.',
    œilleton:'—',
    svg: svgRound(`<circle cx="44" cy="60" r="11" fill="#ef4444"/><circle cx="76" cy="60" r="11" fill="#fbbf24"/>`)
  },
  {
    id:'heurtoir', nom:'Feu de heurtoir', fam:'A', plaque:'—', voie:'Fin de ligne',
    role:'Arrêt absolu — fin de ligne, fixé au-dessus d\'un heurtoir',
    detail:'Présente un feu rouge (sur voie principale) ou violet (sur voie de service) allumé en permanence. N\'est abordé que par des convois en marche à vue.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="10" y="65" width="80" height="6" fill="#666"/>
      <rect x="30" y="40" width="40" height="25" rx="3" fill="#1a1a1a" stroke="#666" stroke-width="1.2"/>
      <circle cx="50" cy="52" r="8" fill="#ef4444"/>
      <line x1="20" y1="71" x2="20" y2="85" stroke="#666" stroke-width="3"/>
      <line x1="80" y1="71" x2="80" y2="85" stroke="#666" stroke-width="3"/>
    </svg>`
  },

  // ═══ FAMILLE B — ANNONCE D'ARRÊT ═══
  {
    id:'avertissement', nom:'Avertissement (A)', fam:'B', plaque:'A · F · Nf', voie:'Voie principale',
    role:'Annonce la fermeture du signal suivant — distance d\'arrêt suffisante',
    detail:'Implanté à une distance ≥ à la distance d\'arrêt du signal annoncé. Annonce : un carré, un sémaphore ou sémaphore cli fermés ; en VU peut aussi annoncer un SAM ou un GA fermé. Cible oblongue (BAL) ou ronde (BAPR). Peut annoncer un panneau éteint.',
    œilleton:'allumé si présent',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#fbbf24"/>`)
  },
  {
    id:'jaune-cli', nom:'Jaune clignotant (Jcli)', fam:'B', plaque:'F · Nf', voie:'Voie principale',
    role:'Annonce un signal d\'arrêt à distance réduite (cantons courts)',
    detail:'Avant le signal jaune (avertissement). Peut annoncer un ralentissement 30. Œilleton allumé si la cible peut présenter un carré.',
    œilleton:'allumé',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#fbbf24"><animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite"/></circle>`)
  },
  {
    id:'vert-cli', nom:'Vert clignotant (Vcli)', fam:'B', plaque:'—', voie:'Lignes V ≥ 160 km/h',
    role:'Préannonce signaux d\'arrêt / ralentissement / limitation vitesse',
    detail:'Concerne les trains roulant à plus de 160 km/h. Leur commande de ralentir.',
    œilleton:'—',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#22c55e"><animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite"/></circle>`)
  },
  {
    id:'bande-jaune', nom:'Bande lumineuse jaune horizontale', fam:'B', plaque:'—', voie:'Gares',
    role:'Voie à quai courte ou raccourcie',
    detail:'Indique au conducteur qu\'il va entrer sur une voie à quai courte ou raccourcie. Présentée en complément de l\'avertissement sur le panneau portant le carré d\'entrée.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="15" y="15" width="70" height="30" rx="4" fill="#1a1a1a" stroke="#666" stroke-width="1.5"/>
      <rect x="22" y="25" width="56" height="10" rx="1" fill="#fbbf24"/>
    </svg>`
  },

  // ═══ FAMILLE C — LIMITATION DE VITESSE ═══
  {
    id:'tiv-30', nom:'TIV 30 fixe — Limitation à 30 km/h', fam:'C', plaque:'—', voie:'VP',
    role:'Limitation à 30 km/h (prise d\'aiguille)',
    detail:'Tableau Indicateur de Vitesse — losange jaune avec chiffre noir. À cet endroit le train devra être à 30 km/h pour prendre l\'aiguille.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <polygon points="50,15 85,50 50,85 15,50" fill="#fbbf24" stroke="#1a1a1a" stroke-width="2"/>
      <text x="50" y="60" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1a1a1a">30</text>
    </svg>`
  },
  {
    id:'tiv-60', nom:'TIV 60 — Limitation à 60 km/h', fam:'C', plaque:'—', voie:'VP',
    role:'Limitation à 60 km/h',
    detail:'TIV à distance ordinaire. Format losange ou pancarte selon limitation.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <polygon points="50,15 85,50 50,85 15,50" fill="#fbbf24" stroke="#1a1a1a" stroke-width="2"/>
      <text x="50" y="60" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="#1a1a1a">60</text>
    </svg>`
  },
  {
    id:'tiv-plus60', nom:'TIV +60 km/h (pancarte chiffre)', fam:'C', plaque:'—', voie:'VP',
    role:'Limitation à plus de 60 km/h',
    detail:'Pour les limitations supérieures à 60 km/h, la pancarte affiche directement le chiffre dans un cadre.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="15" y="30" width="70" height="40" rx="2" fill="#fbbf24" stroke="#1a1a1a" stroke-width="2"/>
      <text x="50" y="62" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#1a1a1a">90</text>
    </svg>`
  },
  {
    id:'tiv-mobile', nom:'TIV mobile (Z / R)', fam:'C', plaque:'—', voie:'VP',
    role:'Zone (Z = début) / Reprise (R = fin) d\'une limitation temporaire',
    detail:'Pour les limitations temporaires supérieures à 60 km/h. Z marque le début de la zone, R marque la reprise de la vitesse normale.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="10" y="15" width="50" height="50" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <text x="35" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#1a1a1a">Z</text>
      <rect x="100" y="15" width="50" height="50" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <text x="125" y="50" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#1a1a1a">R</text>
    </svg>`
  },

  // ═══ FAMILLE D — OUVERTURE / VOIE LIBRE ═══
  {
    id:'feu-vert', nom:'Feu vert (voie libre)', fam:'D', plaque:'F · Nf', voie:'VP ou VS',
    role:'Marche normale autorisée',
    detail:'Le feu vert de voie libre autorise le conducteur à reprendre sa marche normale si rien ne s\'y oppose. Un train peut s\'arrêter ou rester immobile au feu vert pour un autre motif que la sécurité (arrêt commercial). Œilleton allumé si la cible peut présenter un carré.',
    œilleton:'allumé si présent',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#22c55e"/>`)
  },
  {
    id:'feu-blanc', nom:'Feu blanc (manœuvre)', fam:'D', plaque:'Nf', voie:'Voie de service',
    role:'Marche en manœuvre autorisée',
    detail:'En voies de service pour l\'exécution des manœuvres. Si donne accès à une voie principale : marche à vue (30 km/h max) jusqu\'au prochain carré/sémaphore. Œilleton blanc éteint sur les cibles qui peuvent aussi présenter un sémaphore.',
    œilleton:'éteint',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#fafafa"/>`)
  },
  {
    id:'feu-blanc-cli', nom:'Feu blanc clignotant', fam:'D', plaque:'Nf', voie:'VS',
    role:'Manœuvre courte distance — départ interdit en ligne',
    detail:'Autorise une marche en manœuvre sur une courte distance. S\'il donne accès à une voie principale, il interdit le départ en ligne. N\'existe pas en signalisation mécanique.',
    œilleton:'éteint',
    svg: svgPanel(`<circle cx="40" cy="78" r="13" fill="#fafafa"><animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite"/></circle>`)
  },

  // ═══ FAMILLE E — SIGNAUX DIVERS ═══
  {
    id:'chevron', nom:'Chevron pointe en haut', fam:'E', plaque:'—', voie:'—',
    role:'Repère le point imposé pour l\'arrêt des mouvements de manœuvre',
    detail:'Permet au conducteur d\'identifier le point précis où il doit marquer l\'arrêt.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <polygon points="50,15 85,75 60,75 50,55 40,75 15,75" fill="#fff" stroke="#1a1a1a" stroke-width="2.5"/>
    </svg>`
  },
  {
    id:'arret', nom:'Pancarte ARRÊT', fam:'E', plaque:'—', voie:'—',
    role:'Repère le point où les circulations doivent marquer un arrêt',
    detail:'Commande de s\'arrêter avant la pancarte. Si la franchir est nécessaire, le conducteur doit en recevoir l\'ordre verbalement. Peut être complétée par "Arrêt...m" pour indiquer la distance.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="10" y="10" width="100" height="40" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <text x="60" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#1a1a1a">ARRÊT</text>
    </svg>`
  },
  {
    id:'stop', nom:'Pancarte STOP', fam:'E', plaque:'—', voie:'—',
    role:'Marquer un arrêt — le conducteur peut franchir de lui-même si rien ne s\'oppose',
    detail:'À la différence d\'ARRÊT, le conducteur peut franchir la pancarte STOP de lui-même après l\'arrêt si rien ne s\'y oppose.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="10" y="10" width="100" height="40" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <text x="60" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1a1a1a">STOP</text>
    </svg>`
  },
  {
    id:'lm', nom:'Pancarte LM (Limite Manœuvre)', fam:'E', plaque:'—', voie:'VS',
    role:'Repère un point que les mouvements de manœuvre ne doivent pas dépasser',
    detail:'Peut être franchie sur l\'ordre verbal du chef de la manœuvre.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="20" y="10" width="60" height="40" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <text x="50" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="#1a1a1a">LM</text>
    </svg>`
  },
  {
    id:'lgr', nom:'Pancarte LGR (Limite Garage Refoulement)', fam:'E', plaque:'—', voie:'VS',
    role:'Repère le point que les mouvements à garer par refoulement doivent atteindre sans dépasser',
    detail:'Peut être franchie sur l\'ordre verbal du chef de la manœuvre.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="15" y="10" width="70" height="40" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <text x="50" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#1a1a1a">LGR</text>
    </svg>`
  },
  {
    id:'losange-noir', nom:'Losange noir', fam:'E', plaque:'—', voie:'—',
    role:'Repère la limite de certains établissements',
    detail:'Disposé parallèlement à la voie, partie noire vers la pleine voie, à distance de protection du disque. S\'adresse aux agents de manœuvre et de maintenance.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <polygon points="40,12 68,40 40,68 12,40" fill="#1a1a1a" stroke="#444" stroke-width="2"/>
    </svg>`
  },
  {
    id:'tab-garage', nom:'Tableau Garage (G ou D)', fam:'E', plaque:'—', voie:'VS',
    role:'Indique une voie de garage ou de dépôt',
    detail:'G = Garage, D = Dépôt. Pour les voies de service.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="20" y="20" width="60" height="60" fill="#fff" stroke="#1a1a1a" stroke-width="2.5"/>
      <text x="50" y="68" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="#1a1a1a">G</text>
    </svg>`
  },
  {
    id:'indic-dir', nom:'Indicateur de direction', fam:'E', plaque:'—', voie:'VP',
    role:'Nombre de feux = direction géographique',
    detail:'1 feu = à gauche · 2 feux = à droite · 3 feux = le plus à droite. Permet de prévenir le conducteur de l\'itinéraire qui lui est tracé.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 140 60" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="10" y="10" width="120" height="40" rx="4" fill="#1a1a1a" stroke="#666" stroke-width="1.5"/>
      <circle cx="40" cy="30" r="8" fill="#fafafa"/>
      <circle cx="70" cy="30" r="8" fill="#fafafa"/>
      <circle cx="100" cy="30" r="8" fill="#fafafa"/>
    </svg>`
  },
  {
    id:'baisser-panto', nom:'Baisser pantographe', fam:'E', plaque:'—', voie:'Traction élec.',
    role:'Ordre au conducteur de baisser le pantographe',
    detail:'Concerne la traction électrique. Annoncé à distance par une pancarte spécifique.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="15" y="15" width="50" height="50" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M 25 35 L 40 25 L 55 35 L 55 50 L 25 50 Z" fill="none" stroke="#1a1a1a" stroke-width="2.5"/>
      <line x1="20" y1="55" x2="60" y2="55" stroke="#1a1a1a" stroke-width="2.5"/>
      <path d="M 30 28 L 40 38 M 50 28 L 40 38" stroke="#ef4444" stroke-width="2.5"/>
    </svg>`
  },
  {
    id:'remonter-panto', nom:'Remonter pantographe', fam:'E', plaque:'—', voie:'Traction élec.',
    role:'Ordre au conducteur de remonter le pantographe',
    detail:'Marque la fin d\'une zone sans caténaire ou d\'une section neutre.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="15" y="15" width="50" height="50" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <path d="M 25 50 L 40 40 L 55 50" fill="none" stroke="#1a1a1a" stroke-width="2.5"/>
      <line x1="40" y1="40" x2="40" y2="22" stroke="#1a1a1a" stroke-width="2.5"/>
      <line x1="30" y1="22" x2="50" y2="22" stroke="#1a1a1a" stroke-width="2.5"/>
      <line x1="20" y1="55" x2="60" y2="55" stroke="#1a1a1a" stroke-width="2.5"/>
    </svg>`
  },
  {
    id:'couper-courant', nom:'Couper courant', fam:'E', plaque:'—', voie:'Traction élec.',
    role:'Ordre de couper la traction (sectionnement à franchir à vide)',
    detail:'Pancarte annonçant un sectionnement à franchir circuit à vide. Évite le pontage et l\'amorçage.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="10" y="15" width="100" height="50" fill="#1a1a1a" stroke="#666" stroke-width="2"/>
      <text x="60" y="48" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="#fbbf24">SECT</text>
    </svg>`
  },

  // ═══ FAMILLE F — DIVERS (mirliton, croix de St-André) ═══
  {
    id:'mirliton', nom:'Mirliton', fam:'E', plaque:'—', voie:'VP',
    role:'Annonce d\'un signal à visibilité réduite (3 lignes / 2 lignes / 1 ligne)',
    detail:'Pour les signaux à visibilité réduite : repère à 300 m (3 lignes obliques), puis 200 m (2 lignes), puis 100 m (1 ligne) avant le signal annoncé.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="20" y="15" width="60" height="50" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>
      <line x1="32" y1="22" x2="42" y2="58" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="48" y1="22" x2="58" y2="58" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="64" y1="22" x2="74" y2="58" stroke="#1a1a1a" stroke-width="3"/>
    </svg>`
  },
  {
    id:'st-andre', nom:'Croix de Saint-André', fam:'E', plaque:'—', voie:'—',
    role:'Annulation des signaux',
    detail:'Indique que le signal qui la porte est hors service / annulé.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <rect x="10" y="10" width="60" height="60" fill="#fff" stroke="#1a1a1a" stroke-width="1.5"/>
      <line x1="15" y1="15" x2="65" y2="65" stroke="#1a1a1a" stroke-width="5"/>
      <line x1="65" y1="15" x2="15" y2="65" stroke="#1a1a1a" stroke-width="5"/>
    </svg>`
  },

  // ═══ FAMILLE M — SIGNAUX À MAIN DU CHEF DE MANŒUVRE ═══
  {
    id:'sig-arretez', nom:'ARRÊTEZ', fam:'M', plaque:'—', voie:'Manœuvre',
    role:'Ordre au conducteur de s\'ARRÊTER',
    detail:'Le chef de la manœuvre présente un drapeau rouge tendu horizontalement à bout de bras, ou émet l\'ordre par radio « ARRÊTEZ ». La nuit : feu rouge d\'une lanterne. C\'est l\'ordre absolu d\'arrêt pour le conducteur.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <!-- Personnage -->
      <circle cx="50" cy="22" r="9" fill="#fde68a" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="40" y="32" width="20" height="35" fill="#f97316" stroke="#1a1a1a" stroke-width="1.5"/>
      <!-- Bras tendu avec drapeau rouge -->
      <line x1="40" y1="40" x2="15" y2="45" stroke="#1a1a1a" stroke-width="3"/>
      <rect x="0" y="35" width="18" height="22" fill="#dc2626" stroke="#1a1a1a" stroke-width="1.5"/>
      <line x1="60" y1="42" x2="72" y2="50" stroke="#1a1a1a" stroke-width="3"/>
      <!-- Jambes -->
      <line x1="44" y1="67" x2="40" y2="100" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="56" y1="67" x2="60" y2="100" stroke="#1a1a1a" stroke-width="3"/>
    </svg>`
  },
  {
    id:'sig-appuyez', nom:'APPUYEZ', fam:'M', plaque:'—', voie:'Manœuvre',
    role:'Ordre au conducteur de se coller aux tampons d\'un autre EM ou wagon',
    detail:'Le CdM présente les deux poings face à face devant le corps, pouces dressés (ou un drapeau dans chaque main). Geste de rapprochement contrôlé.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <circle cx="50" cy="22" r="9" fill="#fde68a" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="40" y="32" width="20" height="35" fill="#f97316" stroke="#1a1a1a" stroke-width="1.5"/>
      <!-- Bras horizontaux pliés -->
      <line x1="40" y1="40" x2="22" y2="40" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="22" y1="40" x2="22" y2="28" stroke="#1a1a1a" stroke-width="3"/>
      <circle cx="22" cy="24" r="5" fill="#1a1a1a"/>
      <line x1="60" y1="40" x2="78" y2="40" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="78" y1="40" x2="78" y2="28" stroke="#1a1a1a" stroke-width="3"/>
      <circle cx="78" cy="24" r="5" fill="#1a1a1a"/>
      <!-- Pouces dressés (petits arcs) -->
      <line x1="22" y1="19" x2="22" y2="14" stroke="#1a1a1a" stroke-width="2.5"/>
      <line x1="78" y1="19" x2="78" y2="14" stroke="#1a1a1a" stroke-width="2.5"/>
      <!-- Jambes -->
      <line x1="44" y1="67" x2="40" y2="100" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="56" y1="67" x2="60" y2="100" stroke="#1a1a1a" stroke-width="3"/>
    </svg>`
  },
  {
    id:'sig-ralentissez', nom:'RALENTISSEZ', fam:'M', plaque:'—', voie:'Manœuvre',
    role:'Ordre au conducteur de RALENTIR',
    detail:'Le CdM agite le drapeau rouge horizontalement d\'un côté à l\'autre. La nuit : balancement d\'une lanterne. Demande de réduction progressive de la vitesse.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <circle cx="50" cy="22" r="9" fill="#fde68a" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="40" y="32" width="20" height="35" fill="#f97316" stroke="#1a1a1a" stroke-width="1.5"/>
      <!-- Bras qui balance avec drapeau -->
      <line x1="40" y1="40" x2="18" y2="38" stroke="#1a1a1a" stroke-width="3"/>
      <path d="M 5 30 Q 12 35 18 38 Q 12 41 5 46 Z" fill="#dc2626" stroke="#1a1a1a" stroke-width="1.5"/>
      <!-- Flèches d'oscillation -->
      <path d="M 22 18 Q 5 25 22 32" stroke="#1a1a1a" stroke-width="1.5" fill="none" stroke-dasharray="2,2"/>
      <polygon points="20,16 23,19 25,15" fill="#1a1a1a"/>
      <polygon points="20,34 23,31 25,35" fill="#1a1a1a"/>
      <line x1="60" y1="42" x2="72" y2="50" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="44" y1="67" x2="40" y2="100" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="56" y1="67" x2="60" y2="100" stroke="#1a1a1a" stroke-width="3"/>
    </svg>`
  },
  {
    id:'sig-tirez', nom:'TIREZ', fam:'M', plaque:'—', voie:'Manœuvre',
    role:'EM à l\'extrémité : tirer les wagons. EM dans/seul : s\'éloigner du CdM',
    detail:'Le CdM tient le drapeau rouge VERTICAL en l\'air. EM à l\'extrémité du convoi → ordre de tirer les wagons sans tenir compte de la position du CdM. EM dans le convoi ou seul → ordre de s\'éloigner du CdM.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <circle cx="50" cy="32" r="9" fill="#fde68a" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="40" y="42" width="20" height="35" fill="#f97316" stroke="#1a1a1a" stroke-width="1.5"/>
      <!-- Bras en l'air avec drapeau vertical -->
      <line x1="40" y1="48" x2="32" y2="20" stroke="#1a1a1a" stroke-width="3"/>
      <rect x="22" y="5" width="14" height="22" fill="#dc2626" stroke="#1a1a1a" stroke-width="1.5"/>
      <line x1="32" y1="5" x2="32" y2="35" stroke="#1a1a1a" stroke-width="2"/>
      <line x1="60" y1="52" x2="72" y2="60" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="44" y1="77" x2="40" y2="110" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="56" y1="77" x2="60" y2="110" stroke="#1a1a1a" stroke-width="3"/>
    </svg>`
  },
  {
    id:'sig-refoulez', nom:'REFOULEZ', fam:'M', plaque:'—', voie:'Manœuvre',
    role:'EM à l\'extrémité : pousser les wagons. EM dans/seul : s\'approcher du CdM',
    detail:'Le CdM agite le drapeau verticalement de haut en bas, pointe vers le sol. EM à l\'extrémité du convoi → ordre de pousser les wagons sans tenir compte de la position du CdM. EM dans le convoi ou seul → ordre de s\'approcher du CdM.',
    œilleton:'—',
    svg: `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <circle cx="50" cy="22" r="9" fill="#fde68a" stroke="#1a1a1a" stroke-width="1.5"/>
      <rect x="40" y="32" width="20" height="35" fill="#f97316" stroke="#1a1a1a" stroke-width="1.5"/>
      <!-- Bras vers le bas avec drapeau pointe vers sol -->
      <line x1="40" y1="42" x2="22" y2="75" stroke="#1a1a1a" stroke-width="3"/>
      <polygon points="10,68 28,68 19,95" fill="#dc2626" stroke="#1a1a1a" stroke-width="1.5"/>
      <!-- Flèches d'oscillation verticale -->
      <line x1="6" y1="60" x2="6" y2="100" stroke="#1a1a1a" stroke-width="1.5" stroke-dasharray="2,2"/>
      <polygon points="4,62 8,62 6,58" fill="#1a1a1a"/>
      <polygon points="4,98 8,98 6,102" fill="#1a1a1a"/>
      <line x1="60" y1="42" x2="72" y2="50" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="44" y1="67" x2="40" y2="105" stroke="#1a1a1a" stroke-width="3"/>
      <line x1="56" y1="67" x2="60" y2="105" stroke="#1a1a1a" stroke-width="3"/>
    </svg>`
  },
];


// ── PLAQUES (lettres de franchissement) ──
const PLAQUES = [
  { code:'Nf', label:'Non franchissable', detail:'Le signal peut présenter un carré ou un carré violet. Lorsqu\'il est rouge/violet, il est NON FRANCHISSABLE sans ordre.' },
  { code:'F',  label:'Franchissable',     detail:'Le signal ne peut présenter QUE le sémaphore de BAL. Donc franchissable de lui-même après temps d\'arrêt en marche à vue.' },
  { code:'PR', label:'Permissivité Restreinte', detail:'Sémaphore de BAPR. NON franchissable sauf accord verbal de l\'aiguilleur ou après 15 min d\'attente (puis VM sur tout le canton).' },
  { code:'BM', label:'Bloc Manuel',       detail:'Sémaphore de BM. NON franchissable sauf sur ordre (formulaire S si garde a l\'assurance, MV sinon, ou ordre écrit).' },
  { code:'D',  label:'Disque',            detail:'L\'état le plus restrictif que le signal peut présenter est le disque (arrêt différé en marche à vue).' },
  { code:'A',  label:'Avertissement',     detail:'L\'état le plus restrictif est l\'avertissement (annonce simple, pas de carré). Cible souvent ronde.' },
  { code:'GA', label:'Guidon d\'arrêt',   detail:'L\'état le plus restrictif est le guidon d\'arrêt (point particulier à protéger).' },
];


// ── FAMILLES DE SIGNAUX (filtres) ──
const FAMILLES_SIGNAUX = [
  { id:'*', label:'Tous',          color:'var(--text)',    desc:'Tous les signaux' },
  { id:'A', label:'A · Arrêt',     color:'#f87171',         desc:'Signaux d\'arrêt (carré, sémaphore, disque…)' },
  { id:'B', label:'B · Annonce',   color:'#fbbf24',         desc:'Annonce d\'arrêt (avertissement…)' },
  { id:'C', label:'C · Vitesse',   color:'#a78bfa',         desc:'Limitations de vitesse (TIV)' },
  { id:'D', label:'D · Ouverture', color:'#4ade80',         desc:'Voie libre / manœuvre (vert, blanc)' },
  { id:'E', label:'E · Divers',    color:'#7db3f5',         desc:'Pancartes et autres (ARRÊT, STOP, panto…)' },
  { id:'M', label:'M · Manœuvre 🤚', color:'#fb923c',       desc:'5 signaux à main du CdM (Arrêtez, Appuyez, Ralentissez, Tirez, Refoulez)' },
];

let signauxFamily = '*';
let signauxMode = 'decouverte'; // 'decouverte' | 'quiz' | 'plaques'
let signauxQuiz = { current:null, score:0, total:0, answered:false };


// ── GARES (schémas + tableaux des mouvements) ──
const GARES = {
  amvville: {
    nom: "AMVVille",
    pk: "100,600",
    voiePrincipale: "AVILLE (-) ↔ ZEDVILLE (+)",
    leviers: [
      { id:'1', type:'aiguille', desc:'Aiguille 1 — accès voie V1 / V2' },
      { id:'2', type:'aiguille', desc:'Aiguille 2' },
      { id:'3', type:'aiguille', desc:'Aiguille 3' },
      { id:'4', type:'aiguille', desc:'Aiguille 4' },
      { id:'5', type:'aiguille', desc:'Aiguille 5' },
      { id:'6', type:'aiguille', desc:'Aiguille 6' },
      { id:'C1', type:'signal', desc:'Carré C1 — accès' },
      { id:'C2', type:'signal', desc:'Carré C2' },
      { id:'C3', type:'signal', desc:'Carré C3' },
      { id:'C4', type:'signal', desc:'Carré C4' },
      { id:'C5', type:'signal', desc:'Carré C5' },
      { id:'Cv6', type:'signal', desc:'Carré violet Cv6 (manœuvre)' },
      { id:'Cv8', type:'signal', desc:'Carré violet Cv8 (manœuvre)' },
      { id:'Cv101', type:'signal', desc:'Carré violet Cv101' },
    ],
    // Tableau des mouvements — quelques mouvements types
    mouvements: [
      { id:'M1', dep:'AVILLE V1', dest:'ZEDVILLE V1', leviers:['6','4a','3a','2a','1','C1'], note:'Mouvement direct V1 → V1' },
      { id:'M2', dep:'AVILLE V2', dest:'ZEDVILLE V2', leviers:['6','4b','3a','2a','1','C3'], note:'Mouvement direct V2 → V2' },
      { id:'M3', dep:'AVILLE V1', dest:'ZEDVILLE V2', leviers:['6','4a','3b','2b','1','C1'], note:'Avec changement de voie (croisement)' },
      { id:'M4', dep:'Voie 101', dest:'V1 vers ZEDVILLE', leviers:['101','3a','2a','1','Cv101'], note:'Sortie voie de service 101' },
    ],
  },
  stsaturnin: {
    nom: "Saint-Saturnin",
    pk: "139,000",
    voiePrincipale: "PARIS (-) ↔ LA PRESLE (+)",
    leviers: [
      { id:'11', type:'aiguille', desc:'Aiguille 11' },
      { id:'12', type:'aiguille', desc:'Aiguille 12' },
      { id:'13', type:'aiguille', desc:'Aiguille 13' },
      { id:'14', type:'aiguille', desc:'Aiguille 14' },
      { id:'15a', type:'aiguille', desc:'Aiguille 15a' },
      { id:'15b', type:'aiguille', desc:'Aiguille 15b' },
      { id:'C211', type:'signal', desc:'Carré C211' },
      { id:'C213', type:'signal', desc:'Carré C213' },
      { id:'S219', type:'signal', desc:'Sémaphore S219' },
      { id:'Cv212', type:'signal', desc:'Carré violet Cv212' },
      { id:'Cv214', type:'signal', desc:'Carré violet Cv214' },
      { id:'Cv215', type:'signal', desc:'Carré violet Cv215' },
      { id:'Cv222', type:'signal', desc:'Carré violet Cv222' },
      { id:'Cv224', type:'signal', desc:'Carré violet Cv224' },
      { id:'Cv226', type:'signal', desc:'Carré violet Cv226' },
    ],
    mouvements: [
      { id:'M1', dep:'PARIS V1', dest:'LA PRESLE V1', leviers:['11','13','14','15a','S219'], note:'Direct V1 → V1' },
      { id:'M2', dep:'PARIS V2', dest:'LA PRESLE V2', leviers:['11','13','14','15b','C211'], note:'Direct V2 → V2' },
      { id:'M3', dep:'V1', dest:'V2 LA PRESLE', leviers:['11','13','14','15b','S219'], note:'Avec changement V1 → V2' },
      { id:'M4', dep:'Voie A (annexe)', dest:'V1 vers LA PRESLE', leviers:['11','13','14','15a','Cv215'], note:'Sortie voie annexe' },
    ],
  },
};
