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
