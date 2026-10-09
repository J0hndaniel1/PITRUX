/* =====================================================
   PITRUX — CONFIGURAÇÃO PRIVADA
   -----------------------------------------------------
   Edita este ficheiro para definires a música e o avatar.
   O site não disponibiliza um seletor de ficheiros aos
   visitantes. Nota: as faixas são carregadas no navegador
   e não são secretas se publicares o site.
===================================================== */


/* =====================================================
   MÚSICA DE FUNDO
   -----------------------------------------------------
   Como usar:
   Põe os ficheiros numa pasta do projeto e adiciona um
   objeto por faixa. O leitor do site permite ao visitante
   pausar, mudar de faixa e ajustar o volume; não existe
   carregamento de ficheiros pelo site.
===================================================== */

export const MUSIC = {

    // true = ativa | false = desliga tudo
    enabled: true,

    // Lista de músicas escolhidas por ti. Caminhos relativos ao index.html.
    // Exemplo: { title: "Viagem pelas estrelas", src: "musica/tema.mp3" }
    tracks: [
        // { title: "Viagem pelas estrelas", src: "musica/tema.mp3" },
        // { title: "Nebulosa azul", src: "musica/espaco.ogg" },
        { title: "Interstellar Official Soundtrack Cornfield Chase – Hans Zimmer WaterTower", src: "Interstellar Official Soundtrack Cornfield Chase – Hans Zimmer WaterTower.mp3" },
        { title: "ADTurnUp - palace [no drums] (slowed + reverb)", src: "ADTurnUp - palace [no drums] (slowed + reverb).mp3" },
        { title: "JVKE - this is what space feels like", src: "JVKE - this is what space feels like [Official Lyric Video].mp3" },
    ],

    // Volume inicial de 0 (mudo) a 1 (máximo); o visitante pode ajustá-lo.
    volume: 0.35,

    // true = repete a(s) música(s) quando terminarem
    loop: true,

    // true = tenta começar depois da primeira interação; false = aguarda Play.
    autoStart: false

};


/* =====================================================
   ASTRONAUTA (AVATAR)
===================================================== */

export const AVATAR = {

    // false = esconde o astronauta
    enabled: true,

    // Nome do astronauta
    name: "NOVA"

};

/* =====================================================
   SOBRE O SISTEMA SOLAR (TEXTO + VÍDEO DE FUNDO)
   -----------------------------------------------------
   Abre-se com o botão "SOBRE" no topo do site (ou a tecla I).
   Aqui defines o texto que quiseres e, se quiseres, um vídeo
   de fundo.

   COMO USAR:
   1. Escreve/cola a tua matéria em "sections". Cada secção tem
      um título ("title") e um ou mais parágrafos ("text").
      Podes juntar, apagar ou reordenar secções à vontade.
   2. Para pôr um vídeo de fundo, mete o ficheiro numa pasta
      (ex.: "video/espaco.mp4") e escreve o caminho em video.src.
      Deixa video.src vazio ("") para não usar vídeo.
   ===================================================== */

export const OVERVIEW = {

    // false = esconde o botão e a janela
    enabled: true,

    // Texto do botão no topo
    buttonLabel: "SOBRE",

    // Cabeçalho da janela
    kicker: "ARQUIVO PITRUX",
    title: "O Sistema Solar",
    subtitle: "Uma estrela, oito planetas e milhares de milhões de corpos menores.",

    /* ---------- VÍDEO DE FUNDO ---------- */
    video: {
        // Caminho relativo ao index.html. Ex.: "video/espaco.mp4". Vazio = sem vídeo.
        // DICA DE DESEMPENHO: usa MP4 (H.264), 720p ou 1080p a 30 fps, sem som e
        // com poucos MB (ideal < 15 MB). Vídeos 4K ou de 60 fps pesam muito.
        src: "",

        // Imagem mostrada enquanto o vídeo carrega (opcional). Ex.: "video/capa.jpg"
        poster: "",

        // Escurece o vídeo para o texto ficar legível: 0 (nada) a 1 (preto total)
        dim: 0.55,

        // Vídeos com som não arrancam sozinhos nos navegadores; mantém true.
        muted: true,

        // true = repete o vídeo em ciclo
        loop: true
    },

    /* ---------- CONTEÚDO ---------- */
    // Texto-base escrito a partir do artigo "Sistema Solar" da Wikipédia.
    // Substitui por ti à vontade.
    sections: [
        {
            title: "O que é o Sistema Solar",
            text: [
                "O Sistema Solar é o conjunto formado pelo Sol e por todos os corpos que estão sob o seu domínio gravitacional. O Sol concentra mais de 99,85% da massa total do sistema e produz energia ao fundir hidrogénio em hélio.",
                "Em volta dele orbitam oito planetas, cinco planetas anões, incontáveis asteroides, cometas e satélites naturais. Todos descrevem órbitas aproximadamente elípticas, mantidas sobretudo pela gravidade."
            ]
        },
        {
            title: "Como se formou",
            text: [
                "A teoria mais aceite é a hipótese nebular: há cerca de 4,6 mil milhões de anos, uma nuvem imensa de gás e poeira entrou em colapso, possivelmente empurrada pela onda de choque de uma supernova próxima. No centro formou-se o Sol; à volta, um disco achatado de matéria.",
                "Nesse disco, grãos de poeira foram-se juntando em corpos cada vez maiores — os planetesimais e, depois, os protoplanetas. Colisões sucessivas deram origem aos planetas. A Lua, por exemplo, terá nascido de um choque entre a Terra e um corpo do tamanho de Marte."
            ]
        },
        {
            title: "Planetas rochosos",
            text: [
                "Mercúrio, Vénus, Terra e Marte são os quatro planetas mais próximos do Sol. Têm crosta sólida, rica em silicatos, e núcleos com muito ferro. Só a Terra (1 lua) e Marte (2 luas) têm satélites naturais, e nenhum tem anéis.",
                "Mercúrio dá uma volta ao Sol em 88 dias e tem enormes variações de temperatura. Vénus tem uma atmosfera espessíssima de dióxido de carbono e um efeito de estufa que ultrapassa os 460 °C. A Terra é o único mundo conhecido com vida e com mais de 70% da superfície coberta de água. Marte, avermelhado pelo óxido de ferro, tem o Monte Olimpo e o Valles Marineris."
            ]
        },
        {
            title: "Gigantes gasosos e de gelo",
            text: [
                "Júpiter, Saturno, Urano e Neptuno são muito maiores que a Terra e não têm uma superfície sólida definida. Júpiter e Saturno são feitos sobretudo de hidrogénio e hélio; Urano e Neptuno, mais ricos em gelos, são por isso chamados gigantes de gelo.",
                "Os quatro têm numerosas luas e sistemas de anéis. Júpiter tem a Grande Mancha Vermelha e as luas galileanas; Saturno tem os anéis mais impressionantes e a lua Titã; Urano roda praticamente de lado; Neptuno tem ventos violentíssimos e foi descoberto por cálculo matemático."
            ]
        },
        {
            title: "Planetas anões e corpos menores",
            text: [
                "Desde 2006, a União Astronómica Internacional distingue planetas de planetas anões. Plutão, Ceres, Haumea, Makemake e Éris são os cinco reconhecidos: esféricos como planetas, mas demasiado pequenos para limpar a sua órbita.",
                "Entre Marte e Júpiter fica o cinturão de asteroides, onde Ceres é o maior corpo. Para lá de Neptuno estão o cinturão de Kuiper, o disco disperso e a nuvem de Oort, regiões de gelo e rocha de onde vêm os cometas."
            ]
        },
        {
            title: "Os limites do sistema",
            text: [
                "O vento solar, uma corrente de partículas que sai do Sol, cria uma bolha chamada heliosfera. O seu limite, a heliopausa, é onde essa influência cede ao meio interestelar. As sondas Voyager 1 e 2 foram os primeiros objetos humanos a chegar a essa fronteira.",
                "A estrela mais próxima do Sol é Proxima Centauri, a cerca de 4,3 anos-luz."
            ]
        }
    ],

    // Créditos mostrados no fim da janela (podes apagar ou mudar)
    source: {
        label: "Fonte: Wikipédia — Sistema Solar (CC BY-SA)",
        url: "https://pt.wikipedia.org/wiki/Sistema_Solar"
    }

};