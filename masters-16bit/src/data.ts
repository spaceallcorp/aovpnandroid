/* ------------------------------------------------------------------
   MASTERS OF THE UNIVERSE // 16 BIT
   Base de dados do mapa de relações.
   ------------------------------------------------------------------ */

export type FactionId =
  | 'heroes'
  | 'villains'
  | 'snake'
  | 'horde'
  | 'rebellion'
  | 'ancients'
  | 'new';

export type RelationType =
  | 'family'
  | 'romance'
  | 'mentor'
  | 'ally'
  | 'serves'
  | 'rival'
  | 'enemy'
  | 'legacy';

export interface Faction {
  id: FactionId;
  name: string;
  short: string;
  icon: string;
  color: string;
  bg: string;
  motto: string;
  blurb: string;
  dossier: string;
}

export interface Character {
  id: string;
  name: string;
  alias?: string;
  faction: FactionId;
  role: string;
  icon: string;
  colors: [string, string];
  era: string;
  bio: string;
  powers: string[];
  quote?: string;
}

export interface Relation {
  from: string;
  to: string;
  type: RelationType;
  label: string;
}

export interface RelationMeta {
  label: string;
  color: string;
  dash: string;
  order: number;
}

/* ------------------------------------------------------------------ */

export const FACTIONS: Faction[] = [
  {
    id: 'heroes',
    name: 'Guerreiros Heroicos',
    short: 'HERÓIS',
    icon: '🛡️',
    color: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.12)',
    motto: 'PELA HONRA DE GRAYSKULL',
    blurb: 'A corte de Eternia e os campeões que juraram proteger o Castelo de Grayskull.',
    dossier:
      'Liderados na prática por Man-At-Arms e pela Feiticeira, os Guerreiros Heroicos combinam linhagem real, ciência e magia. O grupo é menor que os exércitos inimigos, mas compensa com alianças antigas, conhecimento de Grayskull e a força de He-Man. A tensão entre dever e afeto atravessa a relação de Adam, Teela e Duncan.',
  },
  {
    id: 'villains',
    name: 'Guerreiros Malignos',
    short: 'VILÕES',
    icon: '💀',
    color: '#ff3b6b',
    bg: 'rgba(255, 59, 107, 0.12)',
    motto: 'O PODER É DE QUEM O TOMA',
    blurb: 'O exército de Skeletor: mercenários, monstros e cérebros que sonham com o trono de Eternia.',
    dossier:
      'Skeletor comanda por medo e interesse, não por lealdade. Evil-Lyn é a única capaz de desafiá-lo intelectualmente; Beast Man e Trap Jaw disputam o posto de braço direito; Mer-Man e Tri-Klops cuidam de domínios próprios. A facção é forte, mas sua maior fraqueza é a rivalidade interna — e o fato de todos quererem o poder de Grayskull para si.',
  },
  {
    id: 'snake',
    name: 'Homens-Serpente',
    short: 'SERPENTES',
    icon: '🐍',
    color: '#7dff4d',
    bg: 'rgba(125, 255, 77, 0.12)',
    motto: 'ETERNIA PERTENCE AOS ANTIGOS',
    blurb: 'O império réptil de King Hiss, adormecido por eras e disposto a retomar Eternia.',
    dossier:
      'Os Homens-Serpente são anteriores à atual era de Eternia. King Hiss quer restaurar o domínio réptil e vê tanto Skeletor quanto os heróis como usurpadores. Kobra Khan transita entre as facções como agente duplo, enquanto Rattlor e Tung Lashor formam a linha de frente. O grupo é cercado por magia antiga e segredos de Grayskull.',
  },
  {
    id: 'horde',
    name: 'Horda do Mal',
    short: 'HORDA',
    icon: '🦇',
    color: '#b06bff',
    bg: 'rgba(176, 107, 255, 0.14)',
    motto: 'A HORDA NÃO PARA',
    blurb: 'A máquina de guerra de Hordak, que transformou Etheria em território ocupado.',
    dossier:
      'A Horda é uma organização militar e tecnológica, não uma família de vilões. Hordak comanda em nome de Horde Prime, Shadow Weaver manipula mentes, Catra lidera as operações de campo e Entrapta fornece as invenções. A lealdade é medida por desempenho, o que torna o grupo eficiente e volátil. Scorpia e Catra são a exceção emocional em um sistema feito para usar pessoas.',
  },
  {
    id: 'rebellion',
    name: 'Grande Rebelião',
    short: 'REBELIÃO',
    icon: '⚔️',
    color: '#ffd400',
    bg: 'rgba(255, 212, 0, 0.12)',
    motto: 'PELA LIBERDADE DE ETHERIA',
    blurb: 'A resistência de Etheria, unida por She-Ra contra a ocupação da Horda.',
    dossier:
      'A Grande Rebelião é uma colcha de retalhos de reinos, princesas e aventureiros. Bright Moon oferece a base política, Mystacor a magia, Salineas o mar e Plumeria a cura. She-Ra é o símbolo e a arma decisiva, mas a força real do grupo está nas amizades entre Glimmer, Bow, Frosta, Mermista e Perfuma — e na capacidade de transformar antigos soldados da Horda em aliados.',
  },
  {
    id: 'ancients',
    name: 'Eternia Ancestral',
    short: 'ANCESTRAIS',
    icon: '🏰',
    color: '#ff9d00',
    bg: 'rgba(255, 157, 0, 0.12)',
    motto: 'O LEGADO NÃO MORRE',
    blurb: 'Heróis, dragões e entidades cósmicas que definiram o destino de Eternia antes de Adam.',
    dossier:
      'A era de Preternia é a raiz de tudo: King Grayskull foi o primeiro campeão, He-Ro o herói que veio antes, Granamyr o dragão que testemunhou impérios caírem. Zodac ocupa outro plano: não é aliado nem inimigo, mas um executor cósmico que intervém quando o equilíbrio do universo é ameaçado. O legado deles é a própria Espada do Poder.',
  },
  {
    id: 'new',
    name: 'Primus / New Adventures',
    short: 'PRIMUS',
    icon: '🚀',
    color: '#00ffb3',
    bg: 'rgba(0, 255, 179, 0.12)',
    motto: 'O AMANHÃ ESTÁ EM JOGO',
    blurb: 'O futuro distante, onde He-Man defende Primus dos Mutantes Espaciais.',
    dossier:
      'Em New Adventures, a guerra sai de Eternia e vira ficção científica. Primus é uma sociedade científica liderada por Sebrian e defendida por Mara, que recruta He-Man do passado. Do outro lado, Flogg comanda os Mutantes Espaciais e, eventualmente, se alia a Skeletor. É a prova de que o conflito entre He-Man e Skeletor é maior que um planeta — ou uma época.',
  },
];

export const RELATION_META: Record<RelationType, RelationMeta> = {
  family: { label: 'Família', color: '#ffd400', dash: '0', order: 0 },
  romance: { label: 'Romance', color: '#ff7bd5', dash: '0', order: 1 },
  mentor: { label: 'Mentoria', color: '#7dff4d', dash: '7 5', order: 2 },
  ally: { label: 'Aliados', color: '#00f0ff', dash: '0', order: 3 },
  serves: { label: 'Servidão', color: '#b06bff', dash: '2 6', order: 4 },
  rival: { label: 'Rivalidade', color: '#ff9d00', dash: '10 5', order: 5 },
  enemy: { label: 'Inimigos', color: '#ff3b6b', dash: '0', order: 6 },
  legacy: { label: 'Legado', color: '#e8e8ff', dash: '1 8', order: 7 },
};

/* ------------------------------------------------------------------ */

export const CHARACTERS: Character[] = [
  /* ----------------------------- HERÓIS ----------------------------- */
  {
    id: 'he-man',
    name: 'He-Man',
    alias: 'Príncipe Adam',
    faction: 'heroes',
    role: 'Campeão de Eternia',
    icon: '💪',
    colors: ['#00f0ff', '#ffd400'],
    era: 'Clássica',
    bio: 'Príncipe Adam se transforma no homem mais forte do universo ao erguer a Espada do Poder. Protetor de Grayskull e símbolo da resistência contra Skeletor, ele carrega o peso de esconder sua identidade até dos aliados mais próximos.',
    powers: ['Força sobre-humana', 'Espada do Poder', 'Vínculo com Grayskull'],
    quote: 'Eu tenho a força!',
  },
  {
    id: 'teela',
    name: 'Teela',
    faction: 'heroes',
    role: 'Capitã da Guarda Real',
    icon: '🛡️',
    colors: ['#00c8ff', '#ff9d00'],
    era: 'Clássica',
    bio: 'Combatente disciplinada e filha adotiva de Duncan. Descobre ser filha biológica da Feiticeira e herdeira do manto de guardiã de Grayskull — um destino que a assusta e a define.',
    powers: ['Combate corpo a corpo', 'Liderança', 'Magia latente'],
  },
  {
    id: 'man-at-arms',
    name: 'Man-At-Arms',
    alias: 'Duncan',
    faction: 'heroes',
    role: 'Mestre de Armas',
    icon: '🔧',
    colors: ['#00f0ff', '#7dff4d'],
    era: 'Clássica',
    bio: 'Inventor e estrategista da corte, criou boa parte do arsenal de Eternia. É conselheiro de Randor e mentor de Adam e Teela, equilibrando ciência, disciplina e afeto paternal.',
    powers: ['Engenharia', 'Armaduras', 'Estratégia'],
  },
  {
    id: 'sorceress',
    name: 'Feiticeira',
    alias: 'Teela Na',
    faction: 'heroes',
    role: 'Guardiã de Grayskull',
    icon: '🦅',
    colors: ['#ff7bd5', '#00f0ff'],
    era: 'Clássica',
    bio: 'Guardiã do Castelo de Grayskull, mantém os segredos da fortaleza e a linhagem do poder. Pode assumir a forma de Zoar, o falcão, e guia He-Man sem revelar tudo o que sabe.',
    powers: ['Magia', 'Metamorfose', 'Telepatia'],
  },
  {
    id: 'orko',
    name: 'Orko',
    faction: 'heroes',
    role: 'Mago Trollano',
    icon: '🎩',
    colors: ['#ff2bd6', '#00f0ff'],
    era: 'Clássica',
    bio: 'Mago vindo de Trolla, com magia imprevisível e coração enorme. Serve como alívio cômico e elo emocional do grupo, lembrando que coragem nem sempre vem em forma de força.',
    powers: ['Magia instável', 'Truques', 'Invisibilidade'],
  },
  {
    id: 'battle-cat',
    name: 'Battle Cat',
    alias: 'Cringer',
    faction: 'heroes',
    role: 'Tigre de Guerra',
    icon: '🐯',
    colors: ['#ffd400', '#ff9d00'],
    era: 'Clássica',
    bio: 'O tigre medroso de Adam vira o blindado Battle Cat quando o príncipe se transforma. É a montaria e o parceiro mais leal de He-Man, com coragem que cresce junto com a transformação.',
    powers: ['Força', 'Armadura', 'Faro'],
  },
  {
    id: 'randor',
    name: 'Rei Randor',
    faction: 'heroes',
    role: 'Rei de Eternia',
    icon: '👑',
    colors: ['#ffd400', '#ff3b6b'],
    era: 'Clássica',
    bio: 'Monarca de Eternia e pai de Adam e Adora. Já foi aventureiro e carrega a culpa de não ter salvo o irmão Keldor, hoje Skeletor — um conflito que nenhuma coroa resolve.',
    powers: ['Autoridade', 'Combate', 'Diplomacia'],
  },
  {
    id: 'marlena',
    name: 'Rainha Marlena',
    faction: 'heroes',
    role: 'Rainha de Eternia',
    icon: '🚀',
    colors: ['#00f0ff', '#ff7bd5'],
    era: 'Clássica',
    bio: 'Astronauta terráquea que caiu em Eternia e se apaixonou por Randor. Traz uma visão humana e científica para a corte, além da saudade de um mundo que deixou para trás.',
    powers: ['Pilotagem', 'Ciência', 'Diplomacia'],
  },
  {
    id: 'stratos',
    name: 'Stratos',
    faction: 'heroes',
    role: 'Líder dos Avionianos',
    icon: '🪽',
    colors: ['#00f0ff', '#e8e8ff'],
    era: 'Clássica',
    bio: 'Senhor dos céus de Avion, com asas e visão aguçada. Comanda a defesa aérea de Eternia ao lado dos heroicos e desconfia de qualquer ameaça que venha do mar.',
    powers: ['Voo', 'Visão', 'Táticas aéreas'],
  },
  {
    id: 'ram-man',
    name: 'Ram Man',
    faction: 'heroes',
    role: 'Aríete Humano',
    icon: '🐏',
    colors: ['#ff9d00', '#7dff4d'],
    era: 'Clássica',
    bio: 'Guerreiro baixinho e teimoso que usa o capacete e a armadura para demolir obstáculos. Força bruta com lealdade absoluta — e uma incapacidade comovente de recuar.',
    powers: ['Investida', 'Durabilidade', 'Força'],
  },
  {
    id: 'man-e-faces',
    name: 'Man-E-Faces',
    faction: 'heroes',
    role: 'Ator de Mil Rostos',
    icon: '🎭',
    colors: ['#b06bff', '#ffd400'],
    era: 'Clássica',
    bio: 'Ator com três faces — humana, monstruosa e robótica — que lhe dão habilidades diferentes. Busca equilíbrio entre seus lados e usa a atuação como forma de estratégia.',
    powers: ['Metamorfose facial', 'Visão robótica', 'Força monstruosa'],
  },
  {
    id: 'fisto',
    name: 'Fisto',
    faction: 'heroes',
    role: 'Punho de Ferro',
    icon: '✊',
    colors: ['#ff9d00', '#00f0ff'],
    era: 'Clássica',
    bio: 'Guerreiro de punho metálico gigantesco, aliado de longa data da família real. Prefere resolver tudo na base da força, mas sua experiência faz dele um conselheiro surpreendente.',
    powers: ['Força', 'Punho de ferro', 'Resistência'],
  },
  {
    id: 'moss-man',
    name: 'Moss Man',
    faction: 'heroes',
    role: 'Guardião das Matas',
    icon: '🌿',
    colors: ['#7dff4d', '#006b2e'],
    era: 'Clássica',
    bio: 'Ser de musgo capaz de se camuflar e sentir a flora de Eternia. Atua como batedor e protetor das florestas, e sua rivalidade com Beast Man é tão natural quanto instintiva.',
    powers: ['Camuflagem', 'Controle vegetal', 'Rastreamento'],
  },
  {
    id: 'mekaneck',
    name: 'Mekaneck',
    faction: 'heroes',
    role: 'Batedor Telescópico',
    icon: '🦒',
    colors: ['#00f0ff', '#ff7bd5'],
    era: 'Clássica',
    bio: 'Guarda real com pescoço retrátil que usa para observar longe e resgatar aliados. Sensível e determinado, transforma uma característica estranha em vantagem tática.',
    powers: ['Pescoço telescópico', 'Reconhecimento', 'Resgate'],
  },
  {
    id: 'buzz-off',
    name: 'Buzz-Off',
    faction: 'heroes',
    role: 'Guerreiro Andreenídeo',
    icon: '🐝',
    colors: ['#ffd400', '#ff9d00'],
    era: 'Clássica',
    bio: 'Homem-abelha de Andreenia, com asas, ferrão e visão composta. Divide-se entre a colmeia e a defesa de Eternia, trazendo uma perspectiva de quem não nasceu na corte.',
    powers: ['Voo', 'Ferrão', 'Visão composta'],
  },
  {
    id: 'roboto',
    name: 'Roboto',
    faction: 'heroes',
    role: 'Androide de Combate',
    icon: '🤖',
    colors: ['#00f0ff', '#b06bff'],
    era: 'Clássica',
    bio: 'Máquina de combate com ferramentas intercambiáveis e lealdade programada. Aprende, aos poucos, o que significa ser humano — e o que vale a pena proteger.',
    powers: ['Ferramentas', 'Força mecânica', 'Análise'],
  },

  /* ----------------------------- VILÕES ----------------------------- */
  {
    id: 'skeletor',
    name: 'Skeletor',
    alias: 'Keldor',
    faction: 'villains',
    role: 'Senhor da Destruição',
    icon: '💀',
    colors: ['#b06bff', '#ff3b6b'],
    era: 'Clássica',
    bio: 'Irmão de Randor transformado em senhor da caveira. Quer os segredos de Grayskull para dominar Eternia e destruir He-Man, mas seu maior inimigo às vezes é a própria corte de vilões.',
    powers: ['Magia', 'Intelecto', 'Exército maligno'],
    quote: 'Eu sou Skeletor, senhor da destruição!',
  },
  {
    id: 'evil-lyn',
    name: 'Evil-Lyn',
    faction: 'villains',
    role: 'Feiticeira do Caos',
    icon: '🔮',
    colors: ['#ff2bd6', '#b06bff'],
    era: 'Clássica',
    bio: 'A mais poderosa aliada de Skeletor e sua rival interna. Ambição e magia fazem dela uma ameaça independente — alguém que serve enquanto for conveniente.',
    powers: ['Magia', 'Teletransporte', 'Manipulação'],
  },
  {
    id: 'beast-man',
    name: 'Beast Man',
    faction: 'villains',
    role: 'Senhor das Feras',
    icon: '🐺',
    colors: ['#ff9d00', '#ff3b6b'],
    era: 'Clássica',
    bio: 'Bruto peludo que controla animais e serve Skeletor com devoção canina. Força bruta e instinto selvagem, com uma lealdade que beira a obsessão.',
    powers: ['Controle animal', 'Força', 'Faro'],
  },
  {
    id: 'trap-jaw',
    name: 'Trap Jaw',
    faction: 'villains',
    role: 'Ciborgue Arsenal',
    icon: '⚙️',
    colors: ['#00f0ff', '#ff3b6b'],
    era: 'Clássica',
    bio: 'Ciborgue com mandíbula de metal e braço que troca de arma. Rival técnico de Man-At-Arms, compensa a falta de magia com engenharia e brutalidade.',
    powers: ['Armas intercambiáveis', 'Mordida', 'Blindagem'],
  },
  {
    id: 'mer-man',
    name: 'Mer-Man',
    faction: 'villains',
    role: 'Senhor dos Mares',
    icon: '🌊',
    colors: ['#00f0ff', '#006b2e'],
    era: 'Clássica',
    bio: 'Comandante dos exércitos aquáticos e aliado de Skeletor. Controla criaturas marinhas e ataca pelas costas — literalmente — sempre que o mar é o campo de batalha.',
    powers: ['Anfíbio', 'Controle marinho', 'Tridente'],
  },
  {
    id: 'tri-klops',
    name: 'Tri-Klops',
    faction: 'villains',
    role: 'Olho Trino',
    icon: '👁️',
    colors: ['#7dff4d', '#b06bff'],
    era: 'Clássica',
    bio: 'Guerreiro de três olhos com visões distintas: noturna, infravermelha e de raios. Espião e estrategista, enxerga o que os outros vilões preferem ignorar.',
    powers: ['Visão múltipla', 'Raios', 'Combate'],
  },
  {
    id: 'whiplash',
    name: 'Whiplash',
    faction: 'villains',
    role: 'Cauda de Aço',
    icon: '🦎',
    colors: ['#7dff4d', '#ff9d00'],
    era: 'Clássica',
    bio: 'Réptil de força descomunal que usa a cauda como arma. Leal a Skeletor e brutal em combate, raramente pensa duas vezes antes de atacar.',
    powers: ['Cauda', 'Força', 'Natação'],
  },
  {
    id: 'clawful',
    name: 'Clawful',
    faction: 'villains',
    role: 'Pinça Esmagadora',
    icon: '🦀',
    colors: ['#ff3b6b', '#ff9d00'],
    era: 'Clássica',
    bio: 'Homem-caranguejo com uma pinça capaz de esmagar pedra. Pouco inteligente, mas perigosamente forte, é a definição de força de choque.',
    powers: ['Pinça', 'Armadura', 'Força'],
  },
  {
    id: 'webstor',
    name: 'Webstor',
    faction: 'villains',
    role: 'Aranha das Sombras',
    icon: '🕷️',
    colors: ['#b06bff', '#ff3b6b'],
    era: 'Clássica',
    bio: 'Aracnídeo que escala paredes e prende vítimas em teias. Especialista em infiltração e emboscadas, prefere o teto ao campo de batalha.',
    powers: ['Escalada', 'Teias', 'Visão'],
  },
  {
    id: 'two-bad',
    name: 'Two-Bad',
    faction: 'villains',
    role: 'Dois em Um',
    icon: '🐲',
    colors: ['#7dff4d', '#b06bff'],
    era: 'Clássica',
    bio: 'Dois guerreiros fundidos em um corpo, com cabeças que discutem o tempo todo. Confusão e força em partes iguais — e uma incapacidade crônica de concordar.',
    powers: ['Duas cabeças', 'Força', 'Resistência'],
  },
  {
    id: 'faker',
    name: 'Faker',
    faction: 'villains',
    role: 'Cópia Maligna',
    icon: '🟦',
    colors: ['#00f0ff', '#006b2e'],
    era: 'Clássica',
    bio: 'Androide criado por Skeletor à imagem de He-Man para enganar aliados. Cópia quase perfeita, mas sem a centelha que faz o original escolher proteger.',
    powers: ['Força', 'Disfarce', 'Armadura'],
  },
  {
    id: 'panthor',
    name: 'Panthor',
    faction: 'villains',
    role: 'Pantera de Skeletor',
    icon: '🐆',
    colors: ['#b06bff', '#ff3b6b'],
    era: 'Clássica',
    bio: 'Pantera blindada e feroz, montaria de Skeletor. Espelha Battle Cat no lado maligno: instinto, poder e uma fidelidade que não precisa de palavras.',
    powers: ['Força', 'Armadura', 'Faro'],
  },

  /* -------------------------- HOMENS-SERPENTE ------------------------ */
  {
    id: 'king-hiss',
    name: 'Rei Hiss',
    faction: 'snake',
    role: 'Rei Serpente',
    icon: '🐍',
    colors: ['#7dff4d', '#006b2e'],
    era: 'Preternia',
    bio: 'Líder ancestral dos Homens-Serpente, capaz de assumir uma forma serpentina monstruosa. Quer restaurar o império réptil e trata Skeletor como um usurpador qualquer.',
    powers: ['Metamorfose', 'Hipnose', 'Magia antiga'],
  },
  {
    id: 'kobra-khan',
    name: 'Kobra Khan',
    faction: 'snake',
    role: 'Espião Venenoso',
    icon: '🐍',
    colors: ['#7dff4d', '#ffd400'],
    era: 'Clássica',
    bio: 'Réptil que cospe veneno e se infiltra entre os dois lados. Serve a Skeletor e aos Homens-Serpente conforme convém — um agente duplo que só é leal à própria sobrevivência.',
    powers: ['Veneno', 'Disfarce', 'Escalada'],
  },
  {
    id: 'rattlor',
    name: 'Rattlor',
    faction: 'snake',
    role: 'Cascavel',
    icon: '🐍',
    colors: ['#ff9d00', '#7dff4d'],
    era: 'Preternia',
    bio: 'Guerreiro cascavel com cauda e reflexos rápidos. Um dos generais mais leais de King Hiss, especializado em ataques relâmpago.',
    powers: ['Cauda', 'Velocidade', 'Mordida'],
  },
  {
    id: 'tung-lashor',
    name: 'Tung Lashor',
    faction: 'snake',
    role: 'Língua de Aço',
    icon: '👅',
    colors: ['#7dff4d', '#ff2bd6'],
    era: 'Preternia',
    bio: 'Homem-serpente com língua elástica e pegajosa, usada para desarmar e capturar. Brutal e sarcástico, adora provar que os heróis não são tão rápidos quanto pensam.',
    powers: ['Língua elástica', 'Força', 'Captura'],
  },

  /* ------------------------------ HORDA ------------------------------ */
  {
    id: 'hordak',
    name: 'Hordak',
    faction: 'horde',
    role: 'Senhor da Horda',
    icon: '🦇',
    colors: ['#b06bff', '#00f0ff'],
    era: 'She-Ra',
    bio: 'Líder da Horda do Mal e antigo mentor de Skeletor. Conquistou Etheria e transformou Adora em sua arma, sem imaginar que ela se voltaria contra ele.',
    powers: ['Tecnologia', 'Magia', 'Transformação'],
  },
  {
    id: 'shadow-weaver',
    name: 'Shadow Weaver',
    faction: 'horde',
    role: 'Tecelã das Sombras',
    icon: '🕸️',
    colors: ['#7a2cff', '#ff2bd6'],
    era: 'She-Ra',
    bio: 'Feiticeira da Horda que manipula memórias e sombras. Mentora tóxica de Catra e Adora, usa afeto como ferramenta de controle.',
    powers: ['Sombras', 'Memória', 'Manipulação'],
  },
  {
    id: 'catra',
    name: 'Catra',
    faction: 'horde',
    role: 'Garra da Horda',
    icon: '🐈',
    colors: ['#ff9d00', '#b06bff'],
    era: 'She-Ra',
    bio: 'Capitã felina da Horda, obcecada por derrotar She-Ra e provar seu valor. Inteligente, vingativa e cheia de camadas, é a antagonista mais pessoal de Adora.',
    powers: ['Agilidade', 'Garras', 'Estratégia'],
  },
  {
    id: 'scorpia',
    name: 'Scorpia',
    faction: 'horde',
    role: 'Braço Forte',
    icon: '🦂',
    colors: ['#ff3b6b', '#ff9d00'],
    era: 'She-Ra',
    bio: 'Mulher-escorpião de força enorme e coração mole. Serve à Horda, mas seu senso de lealdade é volátil — e sua amizade com Catra é o fio que a prende ao lado errado.',
    powers: ['Pinças', 'Ferrão', 'Força'],
  },
  {
    id: 'entrapta',
    name: 'Entrapta',
    faction: 'horde',
    role: 'Gênio da Horda',
    icon: '💇',
    colors: ['#b06bff', '#7dff4d'],
    era: 'She-Ra',
    bio: 'Cientista brilhante obcecada por tecnologia, com cabelos preênseis. Suas invenções mudam o equilíbrio da guerra, e sua curiosidade não reconhece fronteiras morais.',
    powers: ['Cabelo', 'Engenharia', 'Hacking'],
  },
  {
    id: 'leech',
    name: 'Leech',
    faction: 'horde',
    role: 'Parasita',
    icon: '🩸',
    colors: ['#ff3b6b', '#7dff4d'],
    era: 'She-Ra',
    bio: 'Criatura que drena energia e força com as ventosas. Deixa os inimigos fracos e dependentes, o que o torna mais útil vivo do que morto.',
    powers: ['Drenagem', 'Ventosas', 'Escalada'],
  },
  {
    id: 'grizzlor',
    name: 'Grizzlor',
    faction: 'horde',
    role: 'Fera Peluda',
    icon: '🐻',
    colors: ['#ff9d00', '#7dff4d'],
    era: 'She-Ra',
    bio: 'Bruto coberto de pelos e garras, usado como força de choque da Horda. Pouco cérebro, muita fúria — e uma resistência que surpreende os heróis.',
    powers: ['Força', 'Garras', 'Durabilidade'],
  },
  {
    id: 'horde-prime',
    name: 'Horde Prime',
    faction: 'horde',
    role: 'Imperador Galáctico',
    icon: '🌌',
    colors: ['#e8e8ff', '#7a2cff'],
    era: 'She-Ra',
    bio: 'Tirano cósmico que comanda Hordak e milhares de mundos. Sua sombra paira sobre toda a Horda e transforma a guerra de Etheria em um detalhe de um império muito maior.',
    powers: ['Frota', 'Controle mental', 'Tecnologia'],
  },

  /* --------------------------- GRANDE REBELIÃO ----------------------- */
  {
    id: 'she-ra',
    name: 'She-Ra',
    alias: 'Princesa Adora',
    faction: 'rebellion',
    role: 'Princesa do Poder',
    icon: '⚔️',
    colors: ['#ffd400', '#ff7bd5'],
    era: 'She-Ra',
    bio: 'Irmã gêmea de Adam, criada por Hordak e libertada por Light Hope. Lidera a Grande Rebelião com a Espada da Proteção, unindo força sobre-humana e compaixão.',
    powers: ['Força', 'Cura', 'Espada da Proteção'],
    quote: 'Pela honra de Grayskull!',
  },
  {
    id: 'glimmer',
    name: 'Glimmer',
    faction: 'rebellion',
    role: 'Princesa de Bright Moon',
    icon: '✨',
    colors: ['#ff7bd5', '#ffd400'],
    era: 'She-Ra',
    bio: 'Princesa da luz, teleporta e dispara rajadas. Amiga de infância de Bow e comandante da Rebelião, aprende a liderar sem repetir os erros da mãe.',
    powers: ['Luz', 'Teletransporte', 'Liderança'],
  },
  {
    id: 'bow',
    name: 'Bow',
    faction: 'rebellion',
    role: 'Arqueiro da Rebelião',
    icon: '🏹',
    colors: ['#ffd400', '#00f0ff'],
    era: 'She-Ra',
    bio: 'Arqueiro tecnológico e coração da Rebelião. Mantém o grupo unido com otimismo e invenções, mesmo quando todos ao redor insistem em complicar.',
    powers: ['Arco', 'Tecnologia', 'Estratégia'],
  },
  {
    id: 'castaspella',
    name: 'Castaspella',
    faction: 'rebellion',
    role: 'Rainha de Mystacor',
    icon: '🪄',
    colors: ['#b06bff', '#ff7bd5'],
    era: 'She-Ra',
    bio: 'Feiticeira poderosa e tia de Glimmer. Governa Mystacor e treina jovens magos, equilibrando política, magia e uma rivalidade antiga com a irmã.',
    powers: ['Magia', 'Ilusão', 'Ensino'],
  },
  {
    id: 'frost',
    name: 'Frosta',
    faction: 'rebellion',
    role: 'Princesa do Gelo',
    icon: '❄️',
    colors: ['#00f0ff', '#e8e8ff'],
    era: 'She-Ra',
    bio: 'Jovem princesa do Reino do Gelo, temperamental e leal. Congela inimigos e terrenos inteiros, mas ainda está aprendendo a controlar o próprio poder.',
    powers: ['Gelo', 'Combate', 'Resistência'],
  },
  {
    id: 'mermista',
    name: 'Mermista',
    faction: 'rebellion',
    role: 'Princesa dos Mares',
    icon: '🧜',
    colors: ['#00f0ff', '#7dff4d'],
    era: 'She-Ra',
    bio: 'Governante de Salineas, controla água e tem personalidade ácida. Aliada estratégica da Rebelião, prefere resolver tudo com um suspiro e uma onda gigante.',
    powers: ['Hidrocinese', 'Natação', 'Liderança'],
  },
  {
    id: 'perfuma',
    name: 'Perfuma',
    faction: 'rebellion',
    role: 'Princesa de Plumeria',
    icon: '🌸',
    colors: ['#ff7bd5', '#7dff4d'],
    era: 'She-Ra',
    bio: 'Princesa das plantas, pacifista e curandeira. Usa a flora para proteger e restaurar Etheria, acreditando que a guerra também se vence com empatia.',
    powers: ['Plantas', 'Cura', 'Empatia'],
  },
  {
    id: 'angella',
    name: 'Rainha Angella',
    faction: 'rebellion',
    role: 'Rainha Imortal',
    icon: '👼',
    colors: ['#ff7bd5', '#ffd400'],
    era: 'She-Ra',
    bio: 'Rainha de Bright Moon e mãe de Glimmer. Imortal, estratégica e disposta a sacrificar tudo pela filha — inclusive a própria eternidade.',
    powers: ['Voo', 'Imortalidade', 'Liderança'],
  },
  {
    id: 'swift-wind',
    name: 'Swift Wind',
    faction: 'rebellion',
    role: 'Cavalo Alado',
    icon: '🦄',
    colors: ['#e8e8ff', '#ff7bd5'],
    era: 'She-Ra',
    bio: 'Cavalo alado falante e parceiro de She-Ra. Vaidoso, engraçado e essencial nos céus, é a prova de que um bom companheiro também pode roubar a cena.',
    powers: ['Voo', 'Fala', 'Velocidade'],
  },
  {
    id: 'madame-razz',
    name: 'Madame Razz',
    faction: 'rebellion',
    role: 'Feiticeira do Tempo',
    icon: '🧹',
    colors: ['#7dff4d', '#ffd400'],
    era: 'She-Ra',
    bio: 'Feiticeira excêntrica que viaja no tempo com sua vassoura Broom. Conselheira improvável de She-Ra, enxerga padrões que ninguém mais percebe.',
    powers: ['Tempo', 'Magia', 'Vassoura voadora'],
  },

  /* --------------------------- ETERNIA ANTIGA ------------------------ */
  {
    id: 'king-grayskull',
    name: 'Rei Grayskull',
    faction: 'ancients',
    role: 'Primeiro Campeão',
    icon: '🏰',
    colors: ['#ffd400', '#ff9d00'],
    era: 'Preternia',
    bio: 'Ancestral de Adam e primeiro a empunhar o poder de Grayskull. Sua linhagem define o destino de Eternia, e seu legado é a fortaleza que leva seu nome.',
    powers: ['Força', 'Magia', 'Liderança'],
  },
  {
    id: 'he-ro',
    name: 'He-Ro',
    faction: 'ancients',
    role: 'Herói Ancestral',
    icon: '🌟',
    colors: ['#ffd400', '#00f0ff'],
    era: 'Preternia',
    bio: 'Herói de Preternia, precursor de He-Man. Portava magia capaz de enfrentar o mal primordial, abrindo o caminho que Adam um dia percorreria.',
    powers: ['Magia', 'Força', 'Legado'],
  },
  {
    id: 'zodac',
    name: 'Zodac',
    faction: 'ancients',
    role: 'Executor Cósmico',
    icon: '⚖️',
    colors: ['#e8e8ff', '#00f0ff'],
    era: 'Cósmica',
    bio: 'Entidade neutra que observa o equilíbrio do universo. Intervém apenas quando o caos ameaça todas as realidades — e nunca do lado que os mortais esperam.',
    powers: ['Cosmos', 'Julgamento', 'Teleporte'],
  },
  {
    id: 'granamyr',
    name: 'Granamyr',
    faction: 'ancients',
    role: 'Dragão Ancestral',
    icon: '🐉',
    colors: ['#ff3b6b', '#ff9d00'],
    era: 'Preternia',
    bio: 'O mais antigo dragão de Eternia, sábio e arrogante. Ajuda os heróis quando o respeito é conquistado, mas não deve lealdade a nenhum rei.',
    powers: ['Fogo', 'Voo', 'Magia'],
  },

  /* ------------------------ NEW ADVENTURES --------------------------- */
  {
    id: 'mara',
    name: 'Mara',
    faction: 'new',
    role: 'Cientista de Primus',
    icon: '🔭',
    colors: ['#00ffb3', '#00f0ff'],
    era: 'New Adventures',
    bio: 'Cientista e líder da resistência de Primus no futuro. Recruta He-Man para deter os Mutantes Espaciais, apostando todas as fichas em um herói de outra época.',
    powers: ['Ciência', 'Liderança', 'Tecnologia'],
  },
  {
    id: 'flogg',
    name: 'Flogg',
    faction: 'new',
    role: 'Líder Mutante',
    icon: '👽',
    colors: ['#ff3b6b', '#7dff4d'],
    era: 'New Adventures',
    bio: 'Comandante dos Mutantes Espaciais, inimigo de Primus. Cruel, vaidoso e obcecado por conquistar o futuro, não hesita em se aliar a Skeletor.',
    powers: ['Comando', 'Força', 'Armas'],
  },
  {
    id: 'sebrian',
    name: 'Sebrian',
    faction: 'new',
    role: 'Governante de Primus',
    icon: '🧠',
    colors: ['#00ffb3', '#ffd400'],
    era: 'New Adventures',
    bio: 'Líder político de Primus que aposta na diplomacia e na ciência para salvar seu povo. Sabe que uma guerra no futuro exige mais do que espadas.',
    powers: ['Diplomacia', 'Estratégia', 'Ciência'],
  },
];

/* ------------------------------------------------------------------
   LAÇOS
   ------------------------------------------------------------------ */

export const RELATIONS: Relation[] = [
  /* família e romance */
  { from: 'randor', to: 'he-man', type: 'family', label: 'pai e filho' },
  { from: 'marlena', to: 'he-man', type: 'family', label: 'mãe e filho' },
  { from: 'randor', to: 'she-ra', type: 'family', label: 'pai e filha' },
  { from: 'marlena', to: 'she-ra', type: 'family', label: 'mãe e filha' },
  { from: 'he-man', to: 'she-ra', type: 'family', label: 'irmãos gêmeos' },
  { from: 'randor', to: 'skeletor', type: 'family', label: 'irmãos (Keldor)' },
  { from: 'sorceress', to: 'teela', type: 'family', label: 'mãe e filha' },
  { from: 'man-at-arms', to: 'teela', type: 'family', label: 'pai adotivo' },
  { from: 'glimmer', to: 'angella', type: 'family', label: 'mãe e filha' },
  { from: 'castaspella', to: 'glimmer', type: 'family', label: 'tia e sobrinha' },
  { from: 'king-grayskull', to: 'he-man', type: 'family', label: 'ancestral' },
  { from: 'hordak', to: 'she-ra', type: 'family', label: 'pai adotivo' },
  { from: 'randor', to: 'marlena', type: 'romance', label: 'casal real' },
  { from: 'he-man', to: 'teela', type: 'romance', label: 'tensão romântica' },
  { from: 'bow', to: 'glimmer', type: 'romance', label: 'parceiros' },

  /* mentoria */
  { from: 'sorceress', to: 'he-man', type: 'mentor', label: 'guia e guardiã' },
  { from: 'man-at-arms', to: 'he-man', type: 'mentor', label: 'mentor e conselheiro' },
  { from: 'man-at-arms', to: 'teela', type: 'mentor', label: 'treina a capitã' },
  { from: 'hordak', to: 'skeletor', type: 'mentor', label: 'mentor anterior' },
  { from: 'shadow-weaver', to: 'catra', type: 'mentor', label: 'mentora tóxica' },
  { from: 'shadow-weaver', to: 'she-ra', type: 'mentor', label: 'mentora e criadora' },
  { from: 'madame-razz', to: 'she-ra', type: 'mentor', label: 'conselheira' },

  /* alianças */
  { from: 'he-man', to: 'teela', type: 'ally', label: 'parceria de campo' },
  { from: 'he-man', to: 'man-at-arms', type: 'ally', label: 'braço direito' },
  { from: 'he-man', to: 'orko', type: 'ally', label: 'amigos' },
  { from: 'he-man', to: 'battle-cat', type: 'ally', label: 'montaria e parceiro' },
  { from: 'he-man', to: 'stratos', type: 'ally', label: 'defesa aérea' },
  { from: 'he-man', to: 'ram-man', type: 'ally', label: 'força de choque' },
  { from: 'he-man', to: 'man-e-faces', type: 'ally', label: 'aliados' },
  { from: 'he-man', to: 'fisto', type: 'ally', label: 'aliados' },
  { from: 'he-man', to: 'moss-man', type: 'ally', label: 'batedor' },
  { from: 'he-man', to: 'mekaneck', type: 'ally', label: 'batedor' },
  { from: 'he-man', to: 'buzz-off', type: 'ally', label: 'aliados' },
  { from: 'he-man', to: 'roboto', type: 'ally', label: 'aliados' },
  { from: 'teela', to: 'orko', type: 'ally', label: 'amigos' },
  { from: 'orko', to: 'battle-cat', type: 'ally', label: 'dupla improvável' },
  { from: 'stratos', to: 'buzz-off', type: 'ally', label: 'patrulha aérea' },
  { from: 'randor', to: 'man-at-arms', type: 'ally', label: 'conselheiro real' },
  { from: 'fisto', to: 'man-at-arms', type: 'ally', label: 'velhos aliados' },
  { from: 'sorceress', to: 'king-grayskull', type: 'ally', label: 'guardiã do legado' },
  { from: 'she-ra', to: 'glimmer', type: 'ally', label: 'comandantes' },
  { from: 'she-ra', to: 'bow', type: 'ally', label: 'aliados' },
  { from: 'she-ra', to: 'castaspella', type: 'ally', label: 'aliados' },
  { from: 'she-ra', to: 'frost', type: 'ally', label: 'aliados' },
  { from: 'she-ra', to: 'mermista', type: 'ally', label: 'aliados' },
  { from: 'she-ra', to: 'perfuma', type: 'ally', label: 'aliados' },
  { from: 'she-ra', to: 'angella', type: 'ally', label: 'aliados' },
  { from: 'she-ra', to: 'swift-wind', type: 'ally', label: 'montaria' },
  { from: 'glimmer', to: 'bow', type: 'ally', label: 'melhores amigos' },
  { from: 'scorpia', to: 'catra', type: 'ally', label: 'amizade leal' },
  { from: 'scorpia', to: 'entrapta', type: 'ally', label: 'amizade' },
  { from: 'entrapta', to: 'hordak', type: 'ally', label: 'aliança científica' },
  { from: 'leech', to: 'grizzlor', type: 'ally', label: 'dupla da Horda' },
  { from: 'skeletor', to: 'panthor', type: 'ally', label: 'montaria' },
  { from: 'skeletor', to: 'faker', type: 'ally', label: 'criador' },
  { from: 'zodac', to: 'he-man', type: 'ally', label: 'observa e intervém' },
  { from: 'granamyr', to: 'he-man', type: 'ally', label: 'aliado relutante' },
  { from: 'mara', to: 'sebrian', type: 'ally', label: 'liderança de Primus' },
  { from: 'mara', to: 'he-man', type: 'ally', label: 'recruta o herói' },
  { from: 'sebrian', to: 'he-man', type: 'ally', label: 'aliados' },
  { from: 'flogg', to: 'skeletor', type: 'ally', label: 'aliança no futuro' },

  /* servidão */
  { from: 'evil-lyn', to: 'skeletor', type: 'serves', label: 'aliaça tensa' },
  { from: 'beast-man', to: 'skeletor', type: 'serves', label: 'lealdade canina' },
  { from: 'trap-jaw', to: 'skeletor', type: 'serves', label: 'capanga' },
  { from: 'mer-man', to: 'skeletor', type: 'serves', label: 'aliado aquático' },
  { from: 'tri-klops', to: 'skeletor', type: 'serves', label: 'espião' },
  { from: 'whiplash', to: 'skeletor', type: 'serves', label: 'força de choque' },
  { from: 'clawful', to: 'skeletor', type: 'serves', label: 'capanga' },
  { from: 'webstor', to: 'skeletor', type: 'serves', label: 'infiltrador' },
  { from: 'two-bad', to: 'skeletor', type: 'serves', label: 'dupla confusa' },
  { from: 'kobra-khan', to: 'skeletor', type: 'serves', label: 'agente duplo' },
  { from: 'kobra-khan', to: 'king-hiss', type: 'serves', label: 'agente duplo' },
  { from: 'rattlor', to: 'king-hiss', type: 'serves', label: 'general leal' },
  { from: 'tung-lashor', to: 'king-hiss', type: 'serves', label: 'general leal' },
  { from: 'shadow-weaver', to: 'hordak', type: 'serves', label: 'mão direita' },
  { from: 'catra', to: 'hordak', type: 'serves', label: 'capitã de campo' },
  { from: 'scorpia', to: 'hordak', type: 'serves', label: 'força de choque' },
  { from: 'leech', to: 'hordak', type: 'serves', label: 'parasita' },
  { from: 'grizzlor', to: 'hordak', type: 'serves', label: 'bruto' },
  { from: 'hordak', to: 'horde-prime', type: 'serves', label: 'vassalo cósmico' },

  /* inimizades e rivalidades */
  { from: 'he-man', to: 'skeletor', type: 'enemy', label: 'rivalidade central' },
  { from: 'he-man', to: 'evil-lyn', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'beast-man', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'trap-jaw', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'mer-man', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'tri-klops', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'whiplash', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'clawful', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'webstor', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'two-bad', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'faker', type: 'enemy', label: 'cópia maligna' },
  { from: 'he-man', to: 'king-hiss', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'hordak', type: 'enemy', label: 'inimigos' },
  { from: 'he-man', to: 'flogg', type: 'enemy', label: 'inimigos' },
  { from: 'teela', to: 'evil-lyn', type: 'rival', label: 'rivalidade' },
  { from: 'man-at-arms', to: 'trap-jaw', type: 'rival', label: 'rivalidade técnica' },
  { from: 'battle-cat', to: 'panthor', type: 'rival', label: 'rivalidade felina' },
  { from: 'moss-man', to: 'beast-man', type: 'rival', label: 'natureza contra fera' },
  { from: 'stratos', to: 'mer-man', type: 'rival', label: 'céu contra mar' },
  { from: 'sorceress', to: 'skeletor', type: 'enemy', label: 'inimigos' },
  { from: 'she-ra', to: 'hordak', type: 'enemy', label: 'inimigos' },
  { from: 'she-ra', to: 'catra', type: 'rival', label: 'rivalidade pessoal' },
  { from: 'she-ra', to: 'shadow-weaver', type: 'enemy', label: 'inimigos' },
  { from: 'glimmer', to: 'catra', type: 'enemy', label: 'inimigos' },
  { from: 'bow', to: 'catra', type: 'enemy', label: 'inimigos' },
  { from: 'angella', to: 'hordak', type: 'enemy', label: 'inimigos' },
  { from: 'king-hiss', to: 'skeletor', type: 'rival', label: 'rivais' },
  { from: 'skeletor', to: 'hordak', type: 'rival', label: 'rivalidade' },
  { from: 'mara', to: 'flogg', type: 'enemy', label: 'inimigos' },
  { from: 'evil-lyn', to: 'sorceress', type: 'rival', label: 'rivalidade mágica' },
  { from: 'teela', to: 'catra', type: 'rival', label: 'rivalidade' },

  /* legado */
  { from: 'he-ro', to: 'he-man', type: 'legacy', label: 'legado ancestral' },
];

/* ------------------------------------------------------------------ */

export const CHARACTER_MAP: Map<string, Character> = new Map(
  CHARACTERS.map((character) => [character.id, character]),
);

export const FACTION_MAP: Map<FactionId, Faction> = new Map(
  FACTIONS.map((faction) => [faction.id, faction]),
);

export const RELATION_ORDER: RelationType[] = (
  Object.keys(RELATION_META) as RelationType[]
).sort((a, b) => RELATION_META[a].order - RELATION_META[b].order);

export function relationsOf(id: string): Array<{ relation: Relation; other: Character }> {
  const result: Array<{ relation: Relation; other: Character }> = [];
  for (const relation of RELATIONS) {
    if (relation.from === id) {
      const other = CHARACTER_MAP.get(relation.to);
      if (other) result.push({ relation, other });
    } else if (relation.to === id) {
      const other = CHARACTER_MAP.get(relation.from);
      if (other) result.push({ relation, other });
    }
  }
  return result.sort((a, b) => {
    const byType = RELATION_META[a.relation.type].order - RELATION_META[b.relation.type].order;
    return byType !== 0 ? byType : a.other.name.localeCompare(b.other.name);
  });
}
