/* After Hours Compendium — TODO O CONTEÚDO DO SITE ESTÁ AQUI.
   Estrutura: categoria → grupos (secções com página própria) → itens (cada um com página própria).
   - Para criar um grupo novo (ex.: um novo género de música), copia um bloco { id, nome, resumo, seccoes } dentro de "grupos".
   - Para acrescentar uma banda, livro, entrada, projeto, etc., copia um bloco { id, nome, ... pagina } dentro de "itens".
   - "id" só com letras minúsculas, números e hífens; tem de ser único dentro do seu grupo — é o que aparece no endereço.
   - "seccoes" no fim de cada categoria são blocos extra que aparecem na página da categoria, por baixo dos grupos.
   - Textos entre [parênteses retos] são para preencher.
   Tipos de secção: cartoes, lista, texto, ficha, estante (lombadas), livros, missoes, entradas. */

window.AHC = {

  musica: {
    nome: "Música", icone: "note", cena: "deserto",
    intro: "Fuzz, deserto e paciência. Discos ouvidos do princípio ao fim, numa biblioteca offline curada com cuidado.",
    grupos: [
      { id: "stoner-psych", nome: "Stoner, psych & desert rock", resumo: "O coração da coleção: fuzz, deserto e jams longas.",
        seccoes: [
      { titulo: "Pilares do deserto", tipo: "cartoes", itens: [
        { id: "kyuss", nome: "Kyuss", sub: "Palm Desert, Califórnia",
          resumo: "Os pioneiros do desert rock. Riffs pesados e um gerador ligado no meio do deserto.",
          pagina: {
            campos: [["Origem", "Palm Desert, Califórnia, EUA"], ["Anos", "1987–1995"], ["Nomes", "John Garcia, Josh Homme, Brant Bjork, Nick Oliveri, Scott Reeder"]],
            texto: ["A banda que pôs o deserto no mapa do rock pesado. Guitarras afinadas em baixo e ligadas a amplificadores de baixo, e concertos ao ar livre alimentados por geradores."],
            listas: [
              { titulo: "Discografia", itens: ["Wretch (1991)", "Blues for the Red Sun (1992)", "Welcome to Sky Valley (1994)", "…And the Circus Leaves Town (1995)"] },
              { titulo: "As minhas faixas", itens: ["[faixa]", "[faixa]"] }
            ] } },
        { id: "yawning-man", nome: "Yawning Man", sub: "La Quinta, Califórnia",
          resumo: "Instrumental e ondulante. Uma das raízes das generator parties.",
          pagina: {
            campos: [["Origem", "La Quinta, Califórnia, EUA"], ["Desde", "1986"], ["Fundadores", "Gary Arce, Mario Lalli, Larry Lalli, Alfredo Hernández"]],
            texto: ["Uma das bandas das generator parties do deserto nos anos 80. Quase sempre instrumental, com a guitarra cheia de eco de Gary Arce.", "Os Kyuss gravaram uma versão de “Catamaran”, um tema dos Yawning Man."],
            listas: [
              { titulo: "Discografia", itens: ["Rock Formations (2005)", "Nomadic Pursuits (2010)", "Historical Graffiti (2016)", "The Revolt Against Tired Noises (2018)", "Macedonian Lines (2019)", "Long Walk of the Navajo (2023)"] },
              { titulo: "As minhas faixas", itens: ["[faixa]", "[faixa]"] }
            ] } },
        { id: "elder", nome: "Elder", sub: "Massachusetts, EUA",
          resumo: "Heavy psych progressivo: músicas longas que crescem devagar.",
          pagina: {
            campos: [["Origem", "Massachusetts, EUA (hoje em Berlim)"], ["Desde", "2006"], ["Formação", "Nick DiSalvo, Jack Donovan, Mike Risberg, Georg Edert"]],
            texto: ["Começaram no stoner e foram crescendo para o rock progressivo: temas longos, cheios de camadas, que levam o seu tempo a chegar ao pico."],
            listas: [
              { titulo: "Discografia", itens: ["Elder (2008)", "Dead Roots Stirring (2011)", "Lore (2015)", "Reflections of a Floating World (2017)", "Omens (2020)", "Eldovar – A Story of Darkness & Light (2021, com Kadavar)", "Innate Passage (2022)"] },
              { titulo: "As minhas faixas", itens: ["[faixa]", "[faixa]"] }
            ] } },
        { id: "king-buffalo", nome: "King Buffalo", sub: "Rochester, Nova Iorque",
          resumo: "Trio psicadélico, hipnótico e espacial.",
          pagina: {
            campos: [["Origem", "Rochester, Nova Iorque, EUA"], ["Desde", "2013"], ["Formação", "Sean McVay, Dan Reynolds, Scott Donaldson"]],
            texto: ["Um power trio de heavy psych. Em 2021–2022 lançaram três discos seguidos, uma trilogia feita durante a pandemia."],
            listas: [
              { titulo: "Discografia", itens: ["Orion (2016)", "Longing to Be the Mountain (2018)", "The Burden of Restlessness (2021)", "Acheron (2021)", "Regenerator (2022)"] },
              { titulo: "As minhas faixas", itens: ["[faixa]", "[faixa]"] }
            ] } },
        { id: "naxatras", nome: "Naxatras", sub: "Tessalónica, Grécia",
          resumo: "Psych com groove dos anos 70, quente e solarengo.",
          pagina: {
            campos: [["Origem", "Tessalónica, Grécia"], ["Desde", "2012"], ["Formação", "John Delias, John Vagenas, Kostas Charizanis, Pantelis Kargas (teclas, desde IV)"]],
            texto: ["Uma das bandas da nova vaga psicadélica grega. Muito instrumental, com groove e jams longas."],
            listas: [
              { titulo: "Discografia", itens: ["Naxatras (2015)", "II (2016)", "III (2018)", "IV (2022)", "V (2025)"] },
              { titulo: "As minhas faixas", itens: ["[faixa]", "[faixa]"] }
            ] } },
        { id: "mars-red-sky", nome: "Mars Red Sky", sub: "Bordéus, França",
          resumo: "Riffs enormes e vozes etéreas por cima.",
          pagina: {
            campos: [["Origem", "Bordéus, França"], ["Desde", "2007"], ["Formação", "Julien Pras, Jimmy Kinast, Benoit Busser"]],
            texto: ["Trio francês de heavy psych: riffs pesados e lentos com uma voz leve e sonhadora por cima."],
            listas: [
              { titulo: "Discografia", itens: ["Mars Red Sky (2011)", "Stranded in Arcadia (2014)", "Apex III – Praise for the Burning Soul (2016)", "The Task Eternal (2019)", "Dawn of the Dusk (2023)"] },
              { titulo: "As minhas faixas", itens: ["[faixa]", "[faixa]"] }
            ] } }
      ] },
      { titulo: "Em rotação", tipo: "lista", itens: ["[álbum] — [artista]", "[álbum] — [artista]", "[álbum] — [artista]"] }
        ] },
      { id: "hip-hop", nome: "Hip-hop", resumo: "[o meu hip-hop]",
        seccoes: [
{ titulo: "Artistas", tipo: "cartoes", itens: [
        { id: "artista-1", nome: "[artista]", sub: "[origem]", resumo: "[porque gosto]",
          pagina: { campos: [["Origem", "[origem]"], ["Desde", "[ano]"]], texto: ["[O que me atrai neste artista.]"],
            listas: [{ titulo: "Discografia", itens: ["[álbum] ([ano])"] }, { titulo: "As minhas faixas", itens: ["[faixa]"] }] } }
      ] },
      { titulo: "Em rotação", tipo: "lista", itens: ["[álbum] — [artista]"] }
        ] },
      { id: "musica-brasileira", nome: "Música brasileira", resumo: "[a minha música brasileira]",
        seccoes: [
{ titulo: "Artistas", tipo: "cartoes", itens: [
        { id: "artista-1", nome: "[artista]", sub: "[origem]", resumo: "[porque gosto]",
          pagina: { campos: [["Origem", "[origem]"], ["Desde", "[ano]"]], texto: ["[O que me atrai neste artista.]"],
            listas: [{ titulo: "Discografia", itens: ["[álbum] ([ano])"] }, { titulo: "As minhas faixas", itens: ["[faixa]"] }] } }
      ] },
      { titulo: "Em rotação", tipo: "lista", itens: ["[álbum] — [artista]"] }
        ] }
    ],
    seccoes: [
      { titulo: "O equipamento", tipo: "lista", itens: ["Leitor HiBy R1, sem streaming", "Biblioteca 100% offline, com discografias completas dos pilares", "Uma lista curada de álbuns essenciais, sempre a crescer"] }
    ]
  },

  estante: {
    nome: "Estante", icone: "book", cena: "biblioteca",
    intro: "Leio de tudo. O objetivo é simples: ler muito, e lembrar-me do que li.",
    grupos: [
      { id: "terror", nome: "Terror", resumo: "Stephen King e companhia.",
        seccoes: [
      { titulo: "Lidos", tipo: "estante", itens: [
        livro("it", "It", "Stephen King", "1986", "Lido", "#7a2e2e", true, "Em Derry, no Maine, sete miúdos enfrentam uma criatura que se alimenta do medo. Anos depois, já adultos, voltam para cumprir uma promessa."),
        livro("misery", "Misery", "Stephen King", "1987", "Lido", "#2e4a7a", false, "Um escritor sofre um acidente de carro e é salvo pela sua “fã número um”, que o leva para casa dela. A hospitalidade depressa se torna cativeiro."),
        livro("the-shining", "The Shining", "Stephen King", "1977", "Lido", "#7a5a2d", false, "Jack Torrance aceita ser caseiro do Overlook Hotel durante o inverno, isolado nas montanhas com a mulher e o filho Danny, que tem um dom especial.")
      ] },
      { titulo: "Na fila", tipo: "livros", itens: [
        livro("the-cell", "The Cell", "Stephen King", "2006", "Na fila", "#2d6b6b", false, "Um sinal transmitido pelos telemóveis transforma quem atende em criaturas violentas. Um artista tenta atravessar o caos para encontrar o filho.")
      ] }
        ] },
      { id: "lingua-portuguesa", nome: "Literatura em português", resumo: "Saramago, Machado de Assis, Mia Couto, Lídia Jorge.",
        seccoes: [
      { titulo: "Lidos", tipo: "estante", itens: [
        livro("ensaio-sobre-a-cegueira", "Ensaio sobre a Cegueira", "José Saramago", "1995", "Lido", "#3d6b2f", false, "Uma epidemia de “cegueira branca” espalha-se por uma cidade sem nome. Os primeiros cegos são postos em quarentena, e só uma pessoa continua a ver.")
      ] },
      { titulo: "Na fila", tipo: "livros", itens: [
        livro("dom-casmurro", "Dom Casmurro", "Machado de Assis", "1899", "Na fila", "#8a7a5a", false, "Bento Santiago, já velho, conta a sua vida e o amor por Capitu, a amiga de infância com quem casou, e a dúvida que o consome."),
        livro("terra-sonambula", "Terra Sonâmbula", "Mia Couto", "1992", "Na fila", "#a14a2a", false, "Na guerra civil de Moçambique, um velho e um rapaz abrigam-se num autocarro queimado e encontram uns cadernos cujas histórias se cruzam com a viagem deles."),
        livro("a-costa-dos-murmurios", "A Costa dos Murmúrios", "Lídia Jorge", "1988", "Na fila", "#2e4a7a", false, "Em Moçambique, durante a guerra colonial, a história de uma jovem casada com um alferes, contada duas vezes: num conto e na memória dela, anos depois.")
      ] }
        ] },
      { id: "policial", nome: "Policial", resumo: "Mistérios e detetives.",
        seccoes: [
      { titulo: "Lidos", tipo: "estante", itens: [
        livro("lord-edgware-dies", "Lord Edgware Dies", "Agatha Christie", "1933", "Lido", "#5a2d6b", false, "Hercule Poirot investiga a morte de Lord Edgware, pouco depois de a mulher dele, uma atriz famosa, ter dito que queria livrar-se do marido.")
      ] }
        ] },
      { id: "filosofia-e-ensaio", nome: "Filosofia e ensaio", resumo: "Para ler devagar e pensar.",
        seccoes: [
      { titulo: "Na fila", tipo: "livros", itens: [
        livro("o-homem-em-busca-de-um-sentido", "O Homem em Busca de um Sentido", "Viktor Frankl", "1946", "Na fila", "#3d6b2f", false, "O psiquiatra Viktor Frankl conta como sobreviveu aos campos de concentração e apresenta a logoterapia: a ideia de que a procura de sentido é a força principal da vida."),
        livro("meditacoes", "Meditações", "Marco Aurélio", "c. 170–180", "Na fila", "#7a5a2d", false, "Notas pessoais do imperador romano Marco Aurélio, escritas para si próprio, sobre a filosofia estoica e sobre como viver bem."),
        livro("a-vida-nao-e-util", "A Vida Não É Útil", "Ailton Krenak", "2020", "Na fila", "#5a2d6b", false, "Textos e conversas do pensador indígena Ailton Krenak sobre a relação entre a humanidade e a Terra, e a ideia de que a vida não existe para ser útil."),
        livro("sociedade-do-cansaco", "Sociedade do Cansaço", "Byung-Chul Han", "2010", "Na fila", "#2a2a3a", false, "Byung-Chul Han defende que vivemos numa sociedade do desempenho, em que a pressão deixa de vir de fora e passa a ser imposta por nós próprios, até ao esgotamento.")
      ] }
        ] }
    ],
    seccoes: [
      { titulo: "Caderno de leituras", tipo: "texto", itens: ["Um caderno pequeno ao lado de cada livro: palavras novas, citações e referências. Cada livro tem a sua página com espaço para isso."] }
    ]
  },

  skumm: {
    nome: "Diary of Skumm", icone: "dagger", cena: "fogueira", lang: "en",
    intro: "The travels of a troll rogue who walks alone through Azeroth.",
    grupos: [
      { id: "diary", nome: "Diary", resumo: "Skumm's journal, entry by entry.",
        seccoes: [
      { titulo: "Entries", tipo: "entradas", itens: [
        { id: "entry-1", nome: "Entry I — [title]", sub: "[date] · [zone]", resumo: "[First lines of the entry…]",
          pagina: { campos: [["Date", "[date]"], ["Zone", "[zone]"], ["Level", "[level]"]], captura: true, texto: ["[Write the entry here: where Skumm went, what he found, what almost killed him.]"] } },
        { id: "entry-2", nome: "Entry II — [title]", sub: "[date] · [zone]", resumo: "[First lines of the entry…]",
          pagina: { campos: [["Date", "[date]"], ["Zone", "[zone]"], ["Level", "[level]"]], captura: true, texto: ["[...]"] } }
      ] }
        ] },
      { id: "character", nome: "Character", resumo: "Who Skumm is.",
        seccoes: [
      { titulo: "Character sheet", tipo: "ficha", itens: [["Name", "Skumm"], ["Race", "Troll"], ["Class", "Rogue"], ["Professions", "Herbalism · Alchemy"], ["Realm", "World of Warcraft: Forever (Enhanced)"], ["Style", "Lone wolf"], ["Level", "[level]"]] }
        ] },
      { id: "herbalism-alchemy", nome: "Herbalism & Alchemy", resumo: "Herbs, where they grow, and what they become.",
        seccoes: [
      { titulo: "Herbalist's satchel", tipo: "lista", itens: ["[herb] — [where it grows]", "[potion] — [what it does]"] }
        ] }
    ],
    seccoes: []
  },

  treino: {
    nome: "Treino", icone: "bar", cena: "parque",
    intro: "Calistenia acima de tudo. Força, estética e resistência: devagar, mas sempre.",
    grupos: [
      { id: "missoes", nome: "Missões", resumo: "Objetivos com barra de progresso.",
        seccoes: [
      { titulo: "Missões ativas", tipo: "missoes", itens: [
        { id: "10-elevacoes", nome: "10 elevações estritas", valor: "5 / 10", progresso: 50,
          pagina: { campos: [["Estado", "5 / 10"], ["Próximo passo", "[próximo objetivo]"]],
            texto: ["Elevações em pronação, estritas: sem balanço, do braço completamente estendido até o queixo passar a barra."],
            listas: [{ titulo: "Registo", itens: ["[data] — [repetições]"] }] } },
        { id: "pistol-squat", nome: "Pistol squat sem apoio", valor: "fase 3", progresso: 60,
          pagina: { campos: [["Estado", "fase 3"], ["Próximo passo", "[próximo objetivo]"]],
            texto: ["Agachamento numa só perna, sem apoio, até ao fundo e de volta acima, com a outra perna esticada à frente."],
            listas: [{ titulo: "Registo", itens: ["[data] — [repetições por perna]"] }] } },
        { id: "front-lever", nome: "Front lever completo", valor: "tuck", progresso: 25,
          pagina: { campos: [["Estado", "tuck"], ["Próximo passo", "advanced tuck"]],
            texto: ["Corpo na horizontal, de barriga para cima, pendurado na barra com os braços esticados."],
            listas: [{ titulo: "Progressão", itens: ["Tuck", "Advanced tuck", "Uma perna", "Straddle", "Front lever completo"] }, { titulo: "Registo", itens: ["[data] — [segundos]"] }] } }
      ] }
        ] },
      { id: "arenas", nome: "Arenas", resumo: "Onde treino.",
        seccoes: [
      { titulo: "Três arenas", tipo: "cartoes", itens: [
        { id: "casa", nome: "Casa", sub: "", resumo: "Barra de elevações, paralelas, argolas, paralletes e elásticos.",
          pagina: { texto: ["O treino que não depende de nada nem de ninguém."], listas: [{ titulo: "Equipamento", itens: ["Barra de elevações", "Paralelas", "Argolas", "Paralletes", "Elásticos"] }] } },
        { id: "ginasio", nome: "Ginásio", sub: "", resumo: "Calistenia com peso, halteres e máquinas.",
          pagina: { texto: ["Calistenia com peso, completada com halteres e máquinas. Treino sem precisar de ajudante."], listas: [{ titulo: "Básicos", itens: ["Elevações com peso", "Fundos com peso", "[exercício]"] }] } },
        { id: "parque", nome: "Parque", sub: "", resumo: "Barras ao ar livre e espaço para mexer.",
          pagina: { texto: ["Barras ao ar livre e espaço para animal flow e mobilidade."], listas: [{ titulo: "Sessão típica", itens: ["[exercício]", "[exercício]"] }] } }
      ] }
        ] },
      { id: "rituais", nome: "Rituais e mobilidade", resumo: "O que mantém o corpo a funcionar.",
        seccoes: [
      { titulo: "Rituais", tipo: "lista", itens: ["Mobilidade dinâmica de manhã (15 min)", "Yin yoga à noite", "Animal flow", "Caminhadas nos dias de descanso"] },
      { titulo: "A experimentar", tipo: "lista", itens: ["Cardio em zona 2", "Rucking", "Slackline"] }
        ] }
    ],
    seccoes: []
  },

  oficina: {
    nome: "Oficina", icone: "gear", cena: "oficina",
    intro: "Onde desmonto coisas para perceber como funcionam.",
    grupos: [
      { id: "projetos", nome: "Projetos", resumo: "O que está na bancada.",
        seccoes: [
      { titulo: "Projetos", tipo: "cartoes", itens: [
        projeto("este-site", "Este site", "curso", "Construído à mão e alojado no GitHub Pages.", ["HTML", "CSS", "JavaScript", "GitHub Pages"], "Um sítio meu, feito de raiz, com pixel art e um monte para onde voltar."),
        projeto("smartwatch", "Smartwatch “GPS WATCH”", "curso", "Engenharia inversa do protocolo Bluetooth de um relógio sem marca.", ["Bluetooth", "scripts no Windows"], "Perceber como um relógio genérico fala com o telemóvel, para o poder usar sem a aplicação oficial."),
        projeto("redes", "Redes", "curso", "A aprender redes, rumo à Network+ e à CCNA.", ["Obsidian"], "Um curso em lições para perceber como a internet funciona por dentro: modelos de camadas, endereços IP, routing e switching."),
        projeto("android-sem-google", "Android sem Google", "ativo", "crDroid com MicroG.", ["crDroid", "MicroG"], "Um telemóvel Android a funcionar sem os serviços da Google."),
        projeto("debian", "Debian Linux", "feito", "Terminal, apt, permissões e scripts.", ["Debian", "Bash"], "Instalado como projeto de aprendizagem, com um currículo próprio: terminal, gestão de pacotes, permissões e scripts."),
        projeto("desenho", "Desenho", "inicio", "Fundamentos com Drawabox e Proko.", ["Drawabox", "Proko"], "Aprender os fundamentos do desenho com recursos gratuitos.")
      ] }
        ] },
      { id: "consolas", nome: "Consolas e jogos", resumo: "Portáteis, ROM hacks e afins.",
        seccoes: [
      { titulo: "Consolas", tipo: "lista", itens: ["Nintendo DSi e 3DS", "Handhelds modificadas, com ROM hacks de Pokémon"] }
        ] },
      { id: "ferramentas", nome: "Ferramentas", resumo: "O que uso para construir.",
        seccoes: [
      { titulo: "Ferramentas da bancada", tipo: "lista", itens: ["Obsidian, para notas", "Terminal Linux", "Midjourney, para imagens dos projetos"] }
        ] }
    ],
    seccoes: []
  },

  natureza: {
    nome: "Natureza", icone: "leaf", cena: "floresta",
    intro: "Fora do ecrã: árvores, caminhos e ar livre.",
    grupos: [
      { id: "voluntariado", nome: "Voluntariado", resumo: "Ações com uma associação ambiental.",
        seccoes: [
      { titulo: "Voluntariado", tipo: "texto", itens: ["Faço voluntariado numa associação ambiental, aqui no norte de Portugal."] },
      { titulo: "Ações", tipo: "entradas", itens: [
        { id: "acao-1", nome: "[ação]", sub: "[data]", resumo: "[o que fizemos]",
          pagina: { campos: [["Data", "[data]"], ["Local", "[local]"]], captura: true, texto: ["[O que fizemos e o que aprendi.]"] } }
      ] }
        ] },
      { id: "caminhadas", nome: "Caminhadas", resumo: "Trilhos feitos e por fazer.",
        seccoes: [
      { titulo: "Caminhadas", tipo: "cartoes", itens: [
        { id: "trilho-favorito", nome: "Trilho favorito", sub: "", resumo: "[nome do trilho]",
          pagina: { campos: [["Distância", "[km]"], ["Dificuldade", "[fácil / média / difícil]"]], captura: true, texto: ["[Porque é o meu favorito.]"] } },
        { id: "proximo-trilho", nome: "Próximo trilho", sub: "", resumo: "[nome do trilho]",
          pagina: { campos: [["Distância", "[km]"], ["Dificuldade", "[fácil / média / difícil]"]], texto: ["[O que quero ver lá.]"] } }
      ] }
        ] },
      { id: "diario-de-campo", nome: "Diário de campo", resumo: "O que vi lá fora.",
        seccoes: [
      { titulo: "Diário de campo", tipo: "entradas", itens: [
        { id: "campo-1", nome: "[data] — [local]", sub: "", resumo: "[O que vi: aves, árvores, cogumelos, o tempo que fazia…]",
          pagina: { campos: [["Data", "[data]"], ["Local", "[local]"], ["Tempo", "[sol / chuva / nevoeiro]"]], captura: true, texto: ["[O que vi.]"], listas: [{ titulo: "Avistamentos", itens: ["[espécie]"] }] } }
      ] }
        ] },
      { id: "respirar", nome: "Respirar", resumo: "Meditação e respiração ao ar livre.",
        seccoes: [
      { titulo: "Respirar", tipo: "lista", itens: ["Meditação ao ar livre", "Exercícios de respiração", "Diário estoico"] }
        ] }
    ],
    seccoes: []
  }
};

/* ---------- atalhos usados acima ---------- */
function livro(id, titulo, autor, ano, estado, cor, fav, sinopse) {
  return { id: id, nome: titulo, sub: autor, cor: cor, fav: fav,
    pagina: {
      campos: [["Autor", autor], ["Ano", ano], ["Estado", estado + (fav ? " · favorito ★" : "")]],
      texto: [sinopse],
      listas: [
        { titulo: "As minhas notas", itens: ["[o que achei]"] },
        { titulo: "Palavras novas", itens: ["[palavra] — [significado] — (p. [x])"] },
        { titulo: "Citações", itens: ["“[citação]” — (p. [x])"] }
      ] } };
}
function projeto(id, nome, estado, resumo, ferramentas, texto) {
  return { id: id, nome: nome, estado: estado, resumo: resumo,
    pagina: {
      campos: [["Estado", { curso: "Em curso", ativo: "Ativo", feito: "Aprendido", inicio: "A começar" }[estado]], ["Ferramentas", ferramentas.join(", ")]],
      texto: [texto],
      listas: [{ titulo: "Diário do projeto", itens: ["[data] — [o que fiz]"] }] } };
}
