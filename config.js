/* =====================================================
   PITRUX — CONFIGURAÇÃO PRIVADA
   -----------------------------------------------------
   Este ficheiro é só para ti (dono do código).
   Os visitantes NÃO veem nenhuma opção para escolher
   música: eles apenas ouvem o que definires aqui.
===================================================== */


/* =====================================================
   MÚSICA DE FUNDO
   -----------------------------------------------------
   Como usar:
   1. Põe o teu ficheiro de áudio (mp3, ogg, wav) numa
      pasta, por exemplo:  musica/tema.mp3
   2. Escreve o caminho dentro de "tracks" (abaixo).
   3. Pronto! Se "tracks" estiver vazio, não aparece
      nenhum botão de música no site.

   Podes pôr várias músicas — tocam uma a seguir à outra.
===================================================== */

export const MUSIC = {

    // true = ativa | false = desliga tudo
    enabled: true,

    // Lista de músicas. Exemplos:
    //   "musica/tema.mp3"
    //   "musica/espaco.ogg"
    //   "https://exemplo.com/minha-musica.mp3"
    tracks: [

        // "musica/tema.mp3",

    ],

    // Volume de 0 (mudo) a 1 (máximo)
    volume: 0.35,

    // true = repete a(s) música(s) quando terminarem
    loop: true,

    // true = tenta começar sozinha (os navegadores só deixam
    // depois do primeiro clique/toque do visitante)
    autoStart: true

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