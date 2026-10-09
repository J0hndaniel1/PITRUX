/* =====================================================
   PITRUX — DADOS DO LABORATÓRIO
   -----------------------------------------------------
   Tudo o que aparece no Laboratório (peso, sobrevivência,
   comparação, quiz e missões) vem deste ficheiro.
   Podes editar textos, números, perguntas e missões.
===================================================== */

export const LAB = {

    // false = esconde o botão e a janela do Laboratório
    enabled: true,

    // Texto do botão no topo
    buttonLabel: "LABORATÓRIO",

    // Quantas perguntas tem cada ronda do quiz (sorteadas da lista abaixo)
    quizLength: 10
};


/* =====================================================
   DADOS FÍSICOS
   g = gravidade à superfície, em múltiplos da gravidade da Terra.
   Nos gigantes gasosos/de gelo é medida à pressão de 1 bar
   (não têm superfície sólida).
===================================================== */

export const BODIES = {
    Sol:      { color: "#ffc857", type: "Estrela",          g: 27.9,  diameterKm: 1391000, massEarth: 333000, distMkm: 0,    yearDays: null,   dayHours: 609,    tempC: 5500, moons: 0,   moonsLabel: "0" },
    Mercúrio: { color: "#8c8b87", type: "Planeta rochoso", g: 0.38,  diameterKm: 4879,    massEarth: 0.055,  distMkm: 57.9,  yearDays: 88,     dayHours: 1407.6, tempC: 167,  moons: 0,   moonsLabel: "0" },
    Vénus:    { color: "#d9a85b", type: "Planeta rochoso", g: 0.90,  diameterKm: 12104,   massEarth: 0.815,  distMkm: 108.2, yearDays: 224.7,  dayHours: 5832.5, tempC: 464,  moons: 0,   moonsLabel: "0" },
    Terra:    { color: "#3975c7", type: "Planeta rochoso", g: 1,     diameterKm: 12742,   massEarth: 1,      distMkm: 149.6, yearDays: 365.25, dayHours: 23.9,   tempC: 15,   moons: 1,   moonsLabel: "1" },
    Lua:      { color: "#aaaaaa", type: "Satélite natural", g: 0.166, diameterKm: 3474,   massEarth: 0.0123, distMkm: 149.6, yearDays: null,   dayHours: 708,    tempC: -20,  moons: 0,   moonsLabel: "0" },
    Marte:    { color: "#c65d42", type: "Planeta rochoso", g: 0.38,  diameterKm: 6779,    massEarth: 0.107,  distMkm: 227.9, yearDays: 687,    dayHours: 24.6,   tempC: -65,  moons: 2,   moonsLabel: "2" },
    Júpiter:  { color: "#c49a70", type: "Gigante gasoso",  g: 2.53,  diameterKm: 139820,  massEarth: 317.8,  distMkm: 778.5, yearDays: 4333,   dayHours: 9.9,    tempC: -110, moons: 95,  moonsLabel: "95+" },
    Saturno:  { color: "#d1b77d", type: "Gigante gasoso",  g: 1.07,  diameterKm: 116460,  massEarth: 95.2,   distMkm: 1430,  yearDays: 10759,  dayHours: 10.7,   tempC: -140, moons: 140, moonsLabel: "140+" },
    Urano:    { color: "#73c6cf", type: "Gigante de gelo", g: 0.89,  diameterKm: 50724,   massEarth: 14.5,   distMkm: 2870,  yearDays: 30687,  dayHours: 17.2,   tempC: -195, moons: 27,  moonsLabel: "27" },
    Neptuno:  { color: "#4569d2", type: "Gigante de gelo", g: 1.14,  diameterKm: 49244,   massEarth: 17.1,   distMkm: 4500,  yearDays: 60190,  dayHours: 16.1,   tempC: -200, moons: 14,  moonsLabel: "14" }
};

// Ordem em que aparecem as abas "Peso & Idade" e "Sobreviver"
export const WEIGHT_ORDER = ["Sol", "Mercúrio", "Vénus", "Terra", "Lua", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"];

// Astros disponíveis na aba "Comparar"
export const COMPARE_ORDER = ["Sol", "Mercúrio", "Vénus", "Terra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"];


/* =====================================================
   QUANTO TEMPO DURARIAS (sem fato espacial)
   seconds: ordem de grandeza, usado só para a barra
            (Infinity = vida normal; escala logarítmica)
   label:   o que aparece em letras grandes
   Estimativas simplificadas, só para aprender e divertir.
===================================================== */

export const SURVIVAL = {
    Sol: {
        label: "Instantâneo", seconds: 0.1,
        cause: "Calor e radiação brutais.",
        note: "A superfície está a cerca de 5.500 °C e nem sequer há chão sólido. Muito antes de lá chegares, já terias deixado de existir."
    },
    Mercúrio: {
        label: "Poucos segundos", seconds: 5,
        cause: "Calor extremo no lado do Sol e quase nenhum ar.",
        note: "No lado diurno a superfície passa dos 400 °C, e a atmosfera é tão fraca que não há ar para respirar. No lado da noite o frio chega a −180 °C."
    },
    Vénus: {
        label: "Segundos", seconds: 3,
        cause: "Pressão que esmagaria o corpo e calor que derrete materiais.",
        note: "A atmosfera de Vénus é tão pesada que a pressão à superfície é cerca de 92 vezes a da Terra, e faz ≈ 465 °C. As sondas soviéticas Venera, feitas para isto, resistiram pouco mais de duas horas."
    },
    Terra: {
        label: "Uma vida inteira", seconds: Infinity,
        cause: "Ar respirável, água e temperaturas suaves.",
        note: "O único sítio onde os humanos vivem naturalmente: tem atmosfera adequada, temperatura estável e água."
    },
    Lua: {
        label: "10 segundos a 2 minutos", seconds: 60,
        cause: "Vácuo: não há ar para respirar.",
        note: "Sem traje espacial, um ser humano aguentaria entre 10 segundos e 2 minutos na Lua. Sem ar, ficarias inconsciente muito depressa, e as temperaturas passam de 120 °C de dia a −170 °C de noite."
    },
    Marte: {
        label: "≈ 1 minuto", seconds: 60,
        cause: "Pressão muito baixa e falta de oxigénio.",
        note: "A atmosfera de Marte é finíssima e quase só de dióxido de carbono. Em cerca de 1 minuto perderias a consciência. O frio, com média perto de −65 °C, faria o resto."
    },
    Júpiter: {
        label: "Impossível", seconds: 0,
        cause: "Não há superfície sólida onde aterrar.",
        note: "É um gigante gasoso: só vais cair numa atmosfera onde a pressão e os ventos extremos aumentam sem parar."
    },
    Saturno: {
        label: "Impossível", seconds: 0,
        cause: "Não há superfície sólida onde aterrar.",
        note: "Tal como Júpiter, é um gigante gasoso. Tem ventos que passam dos 1.800 km/h e atmosfera sem chão."
    },
    Urano: {
        label: "Impossível", seconds: 0,
        cause: "Não há superfície sólida e o frio é extremo.",
        note: "É um gigante de gelo, com cerca de −195 °C no topo das nuvens e sem chão onde aterrar."
    },
    Neptuno: {
        label: "Impossível", seconds: 0,
        cause: "Não há superfície sólida e os ventos são violentíssimos.",
        note: "Tem alguns dos ventos mais rápidos do Sistema Solar e cerca de −200 °C no topo das nuvens. Não há chão onde aterrar."
    }
};


/* =====================================================
   QUIZ
   options: lista de respostas | answer: posição da certa (começa em 0)
   As respostas são baralhadas automaticamente a cada pergunta.
===================================================== */

export const QUIZ = [
    {
        q: "Qual é o maior planeta do Sistema Solar?",
        options: ["Saturno", "Júpiter", "Neptuno", "Terra"], answer: 1,
        explain: "Júpiter é o maior de todos. Cabiam mais de 1.300 Terras lá dentro."
    },
    {
        q: "Qual é o planeta mais próximo do Sol?",
        options: ["Vénus", "Terra", "Mercúrio", "Marte"], answer: 2,
        explain: "Mercúrio está a cerca de 58 milhões de quilómetros do Sol."
    },
    {
        q: "Qual é o planeta mais quente do Sistema Solar?",
        options: ["Mercúrio", "Vénus", "Marte", "Júpiter"], answer: 1,
        explain: "Vénus tem um forte efeito de estufa e cerca de 465 °C, mais quente que Mercúrio."
    },
    {
        q: "Quantos planetas existem no Sistema Solar?",
        options: ["7", "8", "9", "10"], answer: 1,
        explain: "São 8: Mercúrio, Vénus, Terra, Marte, Júpiter, Saturno, Urano e Neptuno."
    },
    {
        q: "Qual é o planeta famoso pelos seus grandes anéis?",
        options: ["Marte", "Júpiter", "Saturno", "Vénus"], answer: 2,
        explain: "Saturno tem o sistema de anéis mais impressionante, feito de gelo e rocha."
    },
    {
        q: "Em que galáxia fica o nosso Sistema Solar?",
        options: ["Andrómeda", "Via Láctea", "Triângulo", "Sombreiro"], answer: 1,
        explain: "O Sistema Solar fica na Via Láctea."
    },
    {
        q: "Qual é a estrela no centro do nosso sistema?",
        options: ["A Lua", "Sirius", "O Sol", "Marte"], answer: 2,
        explain: "O Sol é a estrela central e a nossa principal fonte de luz e energia."
    },
    {
        q: "Que astro deixou de ser considerado planeta em 2006?",
        options: ["Plutão", "Mercúrio", "Neptuno", "A Lua"], answer: 0,
        explain: "Plutão passou a ser um planeta anão, por decisão da União Astronómica Internacional."
    },
    {
        q: "Qual é o planeta conhecido como o Planeta Vermelho?",
        options: ["Vénus", "Júpiter", "Marte", "Mercúrio"], answer: 2,
        explain: "Marte é vermelho por causa dos óxidos de ferro no solo."
    },
    {
        q: "Qual é o único planeta conhecido onde existe vida?",
        options: ["Marte", "Terra", "Vénus", "Júpiter"], answer: 1,
        explain: "A Terra tem água líquida e uma atmosfera com oxigénio, essenciais à vida."
    },
    {
        q: "Como se chama o satélite natural da Terra?",
        options: ["Fobos", "Titã", "Lua", "Europa"], answer: 2,
        explain: "A Lua é o nosso único satélite natural."
    },
    {
        q: "Qual é o planeta mais pequeno do Sistema Solar?",
        options: ["Marte", "Mercúrio", "Vénus", "Terra"], answer: 1,
        explain: "Mercúrio tem cerca de 4.879 km de diâmetro."
    },
    {
        q: "Qual é o planeta mais afastado do Sol?",
        options: ["Urano", "Saturno", "Neptuno", "Júpiter"], answer: 2,
        explain: "Neptuno é o oitavo e último planeta, e muito frio."
    },
    {
        q: "Em que ano pisou o ser humano a Lua pela primeira vez?",
        options: ["1959", "1969", "1979", "1989"], answer: 1,
        explain: "Foi em 1969, na missão Apollo 11."
    },
    {
        q: "Que percentagem aproximada da superfície da Terra é coberta por água?",
        options: ["31%", "51%", "71%", "91%"], answer: 2,
        explain: "Mais de 70% da superfície da Terra é coberta de água."
    }
];


/* =====================================================
   LINHA DO TEMPO DE MISSÕES
   focus: nome do astro que se seleciona no sistema 3D (ou null)
===================================================== */

export const MISSIONS = [
    { year: 1957, name: "Sputnik 1", agency: "URSS", target: "Terra", focus: "Terra",
      text: "O primeiro satélite artificial a orbitar a Terra. Abriu a Era Espacial." },
    { year: 1959, name: "Luna 2", agency: "URSS", target: "Lua", focus: "Terra",
      text: "Foi o primeiro objeto feito pelo ser humano a chegar à superfície de outro corpo celeste, a Lua." },
    { year: 1959, name: "Luna 3", agency: "URSS", target: "Lua", focus: "Terra",
      text: "Tirou as primeiras fotografias do lado oculto da Lua." },
    { year: 1962, name: "Mariner 2", agency: "NASA", target: "Vénus", focus: "Vénus",
      text: "A primeira sonda a passar com sucesso junto de outro planeta. Revelou as temperaturas altíssimas de Vénus." },
    { year: 1965, name: "Mariner 4", agency: "NASA", target: "Marte", focus: "Marte",
      text: "Fez a primeira aproximação a Marte e enviou as primeiras fotografias de perto do Planeta Vermelho." },
    { year: 1966, name: "Venera 3", agency: "URSS", target: "Vénus", focus: "Vénus",
      text: "A primeira sonda a atingir a superfície de outro planeta, embora o contacto se tenha perdido antes." },
    { year: 1969, name: "Apollo 11", agency: "NASA", target: "Lua", focus: "Terra",
      text: "Neil Armstrong e Buzz Aldrin foram os primeiros seres humanos a pisar a Lua." },
    { year: 1972, name: "Pioneer 10", agency: "NASA", target: "Júpiter", focus: "Júpiter",
      text: "Lançada em 1972, foi a primeira a atravessar o cinturão de asteroides e a visitar Júpiter, em 1973." },
    { year: 1977, name: "Voyager 1 e 2", agency: "NASA", target: "Planetas exteriores", focus: "Saturno",
      text: "São naves espaciais da NASA lançadas em 1977 com o objectivo de explorar os limites do sistema solar. Ambas já saíram para o espaço interestelar e levam um disco de ouro com saudações, músicas, sons e imagens da Terra." },
    { year: 1997, name: "Cassini–Huygens", agency: "NASA/ESA", target: "Saturno", focus: "Saturno",
      text: "Lançada em 1997, entrou em órbita de Saturno em 2004. A sonda Huygens pousou em Titã. Estudou anéis, luas e atmosfera durante anos." },
    { year: 2011, name: "MESSENGER", agency: "NASA", target: "Mercúrio", focus: "Mercúrio",
      text: "A primeira sonda a ser colocada em órbita de Mercúrio." },
    { year: 2012, name: "Curiosity", agency: "NASA", target: "Marte", focus: "Marte",
      text: "Um rover do tamanho de um carro que explora a cratera Gale em Marte à procura de sinais de ambientes habitáveis." },
    { year: 2014, name: "Rosetta e Philae", agency: "ESA", target: "Cometa 67P", focus: null,
      text: "A primeira missão a colocar uma sonda a aterrar num cometa." },
    { year: 2015, name: "Dawn", agency: "NASA", target: "Ceres", focus: null,
      text: "Depois de passar por Vesta, chegou a Ceres e fez dele o primeiro planeta anão visitado por uma nave." },
    { year: 2015, name: "New Horizons", agency: "NASA", target: "Plutão", focus: null,
      text: "A 14 de julho sobrevoou Plutão e as suas luas, e mudou o que sabíamos sobre as fronteiras do Sistema Solar." },
    { year: 2016, name: "Juno", agency: "NASA", target: "Júpiter", focus: "Júpiter",
      text: "Entrou em órbita de Júpiter para estudar o campo magnético, a atmosfera e a estrutura interior do maior planeta." },
    { year: 2018, name: "Parker Solar Probe", agency: "NASA", target: "Sol", focus: "Sol",
      text: "Lançada em 2018, aproxima-se do Sol mais do que qualquer outra nave. Em 2021 tornou-se a primeira a atravessar a coroa solar." },
    { year: 2021, name: "Perseverance e Ingenuity", agency: "NASA", target: "Marte", focus: "Marte",
      text: "O rover Perseverance procura vestígios de vida antiga. O pequeno helicóptero Ingenuity fez o primeiro voo motorizado noutro planeta." }
];