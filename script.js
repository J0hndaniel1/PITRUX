import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import { MUSIC, AVATAR, OVERVIEW } from "./config.js";
import { initLab } from "./lab.js";
import { initAstroDrag } from "./astro-drag.js";


/* =====================================================
   DADOS DOS PLANETAS
===================================================== */

const planets = {

    Sol: {
        type: "Estrela", tag: "STAR-00", color: 0xffc857, radius: 4.7, distance: 0, orbitSpeed: 0,
        description: "O Sol é uma estrela anã amarela no centro do Sistema Solar. A sua gravidade mantém os planetas, planetas anões, asteroides e cometas nas respetivas órbitas. No núcleo, a fusão nuclear transforma hidrogénio em hélio e liberta a energia que ilumina e aquece os mundos à sua volta.",
        facts: { "Temperatura à superfície": "≈ 5.500 °C", "Diâmetro": "≈ 1,39 milhões km", "Idade": "≈ 4,6 mil milhões anos", "Composição": "Hidrogénio + hélio" },
        curiosity: "A luz do Sol demora cerca de 8 minutos e 20 segundos para chegar à Terra.",
        mission: "PITRUX CLASSIFICAÇÃO: estrela central do sistema e principal fonte de luz e energia."
    },

    Mercúrio: {
        type: "Planeta rochoso", tag: "MERC-01", color: 0x8c8b87, radius: .75, distance: 9, orbitSpeed: .040,
        description: "Mercúrio é o planeta mais pequeno e mais próximo do Sol. A superfície antiga e rochosa está marcada por crateras de impacto, escarpas e grandes bacias. Quase não tem atmosfera para reter calor, por isso as temperaturas variam drasticamente entre o dia e a noite.",
        facts: { "Distância": "57,9 milhões km", "Ano": "88 dias", "Dia solar": "176 dias", "Temperatura": "−180 a 430 °C", "Luas": "0" },
        curiosity: "Mercúrio não é o planeta mais quente. Esse recorde pertence a Vénus.",
        mission: "PITRUX MISSÃO M-01: estudar a superfície rochosa e o ambiente extremo próximo do Sol."
    },

    Vénus: {
        type: "Planeta rochoso", tag: "VENU-02", color: 0xd9a85b, radius: 1.15, distance: 13, orbitSpeed: .030,
        description: "Vénus é um mundo rochoso envolto por nuvens densas de ácido sulfúrico. A sua atmosfera, composta sobretudo por dióxido de carbono, cria um efeito de estufa intenso e uma pressão à superfície esmagadora. Roda lentamente no sentido retrógrado, ao contrário da maioria dos planetas.",
        facts: { "Distância": "108,2 milhões km", "Ano": "224,7 dias", "Temperatura": "≈ 465 °C", "Pressão": "≈ 92 vezes a da Terra", "Luas": "0" },
        curiosity: "Vénus roda no sentido contrário ao da maioria dos planetas.",
        mission: "PITRUX MISSÃO V-02: analisar a atmosfera densa e as condições extremas do planeta."
    },

    Terra: {
        type: "Planeta rochoso", tag: "TERR-03", color: 0x3975c7, radius: 1.25, distance: 17, orbitSpeed: .024,
        description: "A Terra é o terceiro planeta a partir do Sol e o único mundo conhecido que alberga vida. A água líquida cobre cerca de 71% da superfície; uma atmosfera rica em azoto e oxigénio e um campo magnético ajudam a proteger os ecossistemas. Continentes, oceanos e nuvens estão em constante transformação.",
        facts: { "Distância": "149,6 milhões km", "Ano": "365,25 dias", "Diâmetro": "12.742 km", "Atmosfera": "Azoto + oxigénio", "Luas": "1" },
        curiosity: "Cerca de 71% da superfície terrestre é coberta por água.",
        mission: "PITRUX BASE T-03: planeta de referência para comparação das condições dos restantes mundos."
    },

    Marte: {
        type: "Planeta rochoso", tag: "MARS-04", color: 0xc65d42, radius: .95, distance: 22, orbitSpeed: .020,
        description: "Marte é conhecido como o Planeta Vermelho devido aos óxidos de ferro no seu solo. Tem vulcões gigantes, vales profundos, calotes polares e tempestades de poeira que podem cobrir o planeta. A atmosfera é fina e fria; sondas procuram vestígios da água líquida que existiu no passado.",
        facts: { "Distância": "227,9 milhões km", "Ano": "687 dias", "Dia": "24h 37min", "Atmosfera": "Dióxido de carbono", "Luas": "2" },
        curiosity: "Marte possui o Olympus Mons, o maior vulcão conhecido do Sistema Solar.",
        mission: "PITRUX MISSÃO M-04: estudar a história geológica e a possibilidade de ambientes habitáveis."
    },

    Júpiter: {
        type: "Gigante gasoso", tag: "JUPI-05", color: 0xc49a70, radius: 3.15, distance: 31, orbitSpeed: .011,
        description: "Júpiter é o maior planeta do Sistema Solar: um gigante gasoso sem uma superfície sólida definida, composto principalmente por hidrogénio e hélio. Bandas de nuvens coloridas circundam o planeta e a Grande Mancha Vermelha é uma tempestade persistente. O seu intenso campo magnético envolve dezenas de luas conhecidas.",
        facts: { "Distância": "778,5 milhões km", "Ano": "11,86 anos", "Diâmetro": "≈ 139.820 km", "Rotação": "≈ 9h 56min", "Luas": "95+ conhecidas" },
        curiosity: "A Grande Mancha Vermelha é uma enorme tempestade que existe há séculos.",
        mission: "PITRUX MISSÃO J-05: observar tempestades, campo magnético e sistema de luas."
    },

    Saturno: {
        type: "Gigante gasoso", tag: "SATU-06", color: 0xd1b77d, radius: 2.65, distance: 41, orbitSpeed: .008,
        description: "Saturno é um gigante gasoso reconhecido pelo vasto sistema de anéis, composto por incontáveis fragmentos de gelo e rocha. Os anéis são muito largos, mas surpreendentemente finos. A atmosfera apresenta faixas de nuvens e ventos velozes; a lua Titã tem lagos e rios de hidrocarbonetos líquidos.",
        facts: { "Distância": "1,43 mil milhões km", "Ano": "29,45 anos", "Diâmetro": "≈ 116.460 km", "Anéis": "Gelo e rocha", "Luas": "140+ conhecidas" },
        curiosity: "Saturno tem uma densidade média inferior à da água.",
        mission: "PITRUX MISSÃO S-06: estudar os anéis e as numerosas luas do gigante gasoso."
    },

    Urano: {
        type: "Gigante de gelo", tag: "URAN-07", color: 0x73c6cf, radius: 1.95, distance: 51, orbitSpeed: .006,
        description: "Urano é um gigante de gelo cuja atmosfera de hidrogénio, hélio e metano lhe dá a cor azul-esverdeada. O eixo de rotação está inclinado cerca de 98 graus, pelo que o planeta parece rolar de lado ao longo da órbita. No interior, materiais como água, amónia e metano encontram-se sob pressão extrema.",
        facts: { "Distância": "2,87 mil milhões km", "Ano": "84 anos", "Temperatura": "≈ −224 °C", "Inclinação": "≈ 98°", "Luas": "27 conhecidas" },
        curiosity: "O eixo de Urano está inclinado cerca de 98°, fazendo o planeta parecer rolar pela órbita.",
        mission: "PITRUX MISSÃO U-07: estudar a atmosfera e a rotação extremamente inclinada."
    },

    Neptuno: {
        type: "Gigante de gelo", tag: "NEPT-08", color: 0x4569d2, radius: 1.9, distance: 61, orbitSpeed: .005,
        description: "Neptuno é o planeta mais distante do Sol e um gigante de gelo de cor azul intensa. A atmosfera contém hidrogénio, hélio e metano e é agitada por ventos que estão entre os mais rápidos do Sistema Solar. A luz solar é cerca de mil vezes mais fraca do que na Terra.",
        facts: { "Distância": "4,50 mil milhões km", "Ano": "164,8 anos", "Ventos": "Até ~2.000 km/h", "Rotação": "≈ 16 horas", "Luas": "14 conhecidas" },
        curiosity: "Neptuno possui alguns dos ventos mais rápidos conhecidos no Sistema Solar.",
        mission: "PITRUX MISSÃO N-08: investigar a atmosfera e a dinâmica dos ventos do planeta mais distante."
    }

};

const planetNames = Object.keys(planets);


/* Aspeto visual extra de cada astro: inclinação do eixo, rotação, atmosfera */
const look = {
    Mercúrio: { tilt: .03, spin: .05 },
    Vénus:    { tilt: 3.09, spin: .03, atmo: { color: [1.0, .78, .4], power: 2.2, intensity: 1.3 } },
    Terra:    { tilt: .41, spin: .35, atmo: { color: [.3, .6, 1.0], power: 2.0, intensity: 1.8, rim: true } },
    Marte:    { tilt: .44, spin: .33, atmo: { color: [1.0, .5, .3], power: 3.0, intensity: .8 } },
    Júpiter:  { tilt: .05, spin: .8,  atmo: { color: [.9, .7, .5], power: 2.6, intensity: .8 } },
    Saturno:  { tilt: .47, spin: .75, atmo: { color: [.9, .8, .55], power: 2.6, intensity: .7 } },
    Urano:    { tilt: 1.71, spin: -.5, atmo: { color: [.45, .9, .95], power: 2.0, intensity: 1.2 } },
    Neptuno:  { tilt: .5, spin: .55, atmo: { color: [.3, .5, 1.0], power: 2.0, intensity: 1.4 } }
};

/* Luas: r = raio, d = distância ao planeta, s = velocidade */
const moonSets = {
    Terra:   [{ r: .32, d: 2.3, s: .7, c: 0xaaaaaa }],
    Marte:   [{ r: .12, d: 1.7, s: 1.8, c: 0x998877 }, { r: .09, d: 2.2, s: 1.2, c: 0x887766 }],
    Júpiter: [{ r: .28, d: 4.4, s: 1.6, c: 0xd8c08a }, { r: .24, d: 5.3, s: 1.1, c: 0xcfd0d6 },
              { r: .38, d: 6.4, s: .75, c: 0x9a9a9a }, { r: .34, d: 7.6, s: .5, c: 0x7f7468 }],
    Saturno: [{ r: .34, d: 7.0, s: .5, c: 0xe0b46a }],
    Neptuno: [{ r: .26, d: 3.4, s: -.7, c: 0xcfd8e6 }]
};


/* =====================================================
   ESTADO
===================================================== */

let selectedPlanet = "Terra";
let paused = false;
let speed = 1;
let followName = null;
let flight = null;
let atHome = true;   // a câmara ainda está na posição inicial (visão geral)
const followLast = new THREE.Vector3();


/* =====================================================
   CENA, CÂMARA E RENDERER
===================================================== */

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x01020a);

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 6000);
const HOME_BASE = new THREE.Vector3(0, 48, 72);
const HOME_CAM = new THREE.Vector3();

/* Em ecrãs estreitos (telemóvel em pé) a câmara da visão geral afasta-se,
   para o Sistema Solar inteiro caber na largura. Em PC fica como estava. */
function updateHomeCam() {
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(camera.aspect, 2.4);
    const scale = Math.min(3.4, Math.max(1, (70 / halfWidth) / HOME_BASE.length()));
    HOME_CAM.copy(HOME_BASE).multiplyScalar(scale);
}

updateHomeCam();
camera.position.copy(HOME_CAM);

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });

/* Telemóveis e tablets pequenos: menos pixéis e menos suavização, para não aquecer nem ficar lento */
const LOW_POWER = matchMedia("(pointer: coarse)").matches && Math.min(screen.width, screen.height) <= 820;
const pixelRatio = Math.min(devicePixelRatio, LOW_POWER ? 1.5 : 2);
renderer.setPixelRatio(pixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.getElementById("space").appendChild(renderer.domElement);

const maxAniso = renderer.capabilities.getMaxAnisotropy();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2.5;
controls.maxDistance = 520;
controls.rotateSpeed = 0.7;


/* =====================================================
   PÓS-PROCESSAMENTO (brilho / bloom)
===================================================== */

const renderTarget = new THREE.WebGLRenderTarget(innerWidth * pixelRatio, innerHeight * pixelRatio, {
    type: THREE.HalfFloatType,
    samples: LOW_POWER ? 2 : 4
});

const composer = new EffectComposer(renderer, renderTarget);
composer.setPixelRatio(pixelRatio);
composer.setSize(innerWidth, innerHeight);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.85, 0.6, 1.0);
composer.addPass(bloom);
composer.addPass(new OutputPass());


/* =====================================================
   LUZES
===================================================== */

scene.add(new THREE.AmbientLight(0x6070a0, 0.38));
scene.add(new THREE.PointLight(0xfff0dd, 3.4, 0, 0)); // luz do Sol, sem queda com a distância


/* =====================================================
   FUNÇÕES AUXILIARES (cor, ruído)
===================================================== */

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = t => Math.min(1, Math.max(0, t));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];

function ramp(stops, t) {
    t = clamp01(t);
    for (let i = 1; i < stops.length; i++) {
        if (t <= stops[i][0]) {
            const [p0, c0] = stops[i - 1];
            const [p1, c1] = stops[i];
            return mix(c0, c1, (t - p0) / ((p1 - p0) || 1));
        }
    }
    return stops[stops.length - 1][1];
}

function hash3(x, y, z, seed) {
    let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177) ^ Math.imul(seed, 2246822519);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
}

function noise3(x, y, z, seed) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    const h = (a, b, c) => hash3(xi + a, yi + b, zi + c, seed);
    const x00 = lerp(h(0, 0, 0), h(1, 0, 0), u), x10 = lerp(h(0, 1, 0), h(1, 1, 0), u);
    const x01 = lerp(h(0, 0, 1), h(1, 0, 1), u), x11 = lerp(h(0, 1, 1), h(1, 1, 1), u);
    return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

function fbm(x, y, z, seed, oct = 5) {
    let a = .5, f = 1, sum = 0, norm = 0;
    for (let i = 0; i < oct; i++) {
        sum += a * noise3(x * f, y * f, z * f, seed + i * 17);
        norm += a; f *= 2; a *= .5;
    }
    return sum / norm;
}


/* =====================================================
   TEXTURAS PROCEDURAIS (geradas no navegador)
===================================================== */

function paintTexture(w, h, fn) {
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(w, h);
    const d = img.data;

    for (let y = 0; y < h; y++) {
        const lat = (0.5 - (y + 0.5) / h) * Math.PI;
        const py = Math.sin(lat), cl = Math.cos(lat);

        for (let x = 0; x < w; x++) {
            const lon = (x / w) * Math.PI * 2;
            const c = fn(cl * Math.cos(lon), py, cl * Math.sin(lon), lon, lat);
            const i = (y * w + x) * 4;
            d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = c.length > 3 ? c[3] : 255;
        }
    }

    ctx.putImageData(img, 0, 0);
    return canvas;
}

const painters = {

    sun: s => (x, y, z) => {
        const n = fbm(x * 3, y * 3, z * 3, s, 5);
        const g = fbm(x * 9, y * 9, z * 9, s + 5, 3);
        const spots = smooth(.66, .76, fbm(x * 2.2, y * 2.2, z * 2.2, s + 9, 3));
        const c = ramp([[0, [255, 90, 10]], [.5, [255, 165, 35]], [1, [255, 240, 150]]], n * .75 + g * .45);
        return mix(c, [130, 35, 0], spots * .75);
    },

    rocky: (s, tint) => (x, y, z) => {
        const n = fbm(x * 2.4, y * 2.4, z * 2.4, s, 6);
        const r = Math.abs(fbm(x * 7, y * 7, z * 7, s + 3, 4) - .5) * 2;
        const grain = fbm(x * 22, y * 22, z * 22, s + 13, 3);
        const v = (.52 + n * .72) * (.68 + smooth(0, .35, r) * .42) * (.88 + grain * .24);
        return [tint[0] * v, tint[1] * v, tint[2] * v];
    },

    venus: s => (x, y, z) => {
        const w = fbm(x * 1.3, y * 1.3, z * 1.3, s, 3);
        const n = fbm(x * 2 + w * 2.5, y * 5 + w * 1.5, z * 2 + w * 2.5, s + 1, 5);
        const detail = fbm(x * 13 + w, y * 17, z * 13 + w, s + 12, 3);
        const bands = Math.sin(y * 23 + w * 8 + detail * 2) * .045;
        return ramp([[0, [160, 94, 48]], [.5, [225, 169, 93]], [1, [255, 231, 166]]], n * 1.25 + bands + detail * .16 - .1);
    },

    earth: s => (x, y, z) => {
        const n = fbm(x * 2.2, y * 2.2, z * 2.2, s, 6);
        const detail = fbm(x * 12, y * 12, z * 12, s + 24, 4);
        const sea = .53 + (detail - .5) * .025;
        const ay = Math.abs(y);
        let c;

        if (n < sea) {
            c = ramp([[0, [4, 18, 68]], [.45, [9, 48, 119]], [.8, [20, 93, 169]], [1, [75, 157, 207]]], n / sea);
        } else {
            const e = (n - sea) / (1 - sea);
            const m = fbm(x * 3.1, y * 3.1, z * 3.1, s + 40, 4);
            c = ramp([[0, [40, 125, 55]], [.35, [75, 120, 55]], [.65, [125, 105, 70]], [1, [235, 235, 240]]], e * 1.5);
            c = mix(c, [168, 146, 103], smooth(.38, .72, detail) * .2);
            if (m < .46 && ay < .62) c = mix(c, [205, 170, 105], smooth(.46, .36, m));
        }

        const ice = smooth(.82, .9, ay + (fbm(x * 6, y * 6, z * 6, s + 9, 3) - .5) * .12);
        return mix(c, [245, 250, 255], ice);
    },

    clouds: s => (x, y, z) => {
        const n = fbm(x * 3.2, y * 4.2, z * 3.2, s, 6);
        const a = smooth(.5, .72, n);
        return [255, 255, 255, a * 215];
    },

    mars: s => (x, y, z) => {
        const n = fbm(x * 2.5, y * 2.5, z * 2.5, s, 6);
        const dark = smooth(.5, .62, fbm(x * 1.4, y * 1.4, z * 1.4, s + 7, 3));
        const grain = fbm(x * 18, y * 18, z * 18, s + 17, 3);
        let c = ramp([[0, [82, 39, 28]], [.5, [175, 82, 52]], [1, [225, 145, 89]]], n * 1.2 + (grain - .5) * .2);
        c = mix(c, [70, 38, 30], dark * .5);
        return mix(c, [245, 245, 250], smooth(.88, .94, Math.abs(y)));
    },

    gas: (s, pal, freq, storm) => (x, y, z, lon, lat) => {
        const warp = fbm(x * 2, y * 6, z * 2, s, 4);
        const band = Math.sin(y * freq + warp * 3.4) * .5 + .5;
        const fine = fbm(x * 4, y * 24, z * 4, s + 2, 4);
        const turbulence = fbm(x * 9, y * 15, z * 9, s + 27, 3);
        let c = ramp(pal, band * .68 + fine * .34 + turbulence * .12);

        if (storm) {
            const dl = Math.atan2(Math.sin(lon - storm.lon), Math.cos(lon - storm.lon));
            const e = Math.pow(dl * Math.cos(lat) / .24, 2) + Math.pow((lat - storm.lat) / .085, 2);
            if (e < 1) {
                const eye = Math.sqrt(e);
                const rings = .5 + .5 * Math.sin(eye * 45 + turbulence * 5);
                c = mix(c, storm.color, Math.pow(1 - e, .55) * (.68 + rings * .24));
                if (e < .13) c = mix(c, [235, 190, 140], (1 - e / .13) * .35);
            }
        }
        return c;
    },

    ice: (s, pal) => (x, y, z) => {
        const n = fbm(x * 1.5, y * 5, z * 1.5, s, 5);
        const streaks = fbm(x * 7, y * 18, z * 7, s + 6, 4);
        const b = Math.sin(y * 9 + n * 2.2 + streaks) * .5 + .5;
        return ramp(pal, .27 + b * .28 + n * .28 + streaks * .16);
    }

};

const planetPalettes = {
    Júpiter: [[0, [120, 80, 55]], [.25, [190, 150, 110]], [.5, [235, 215, 185]], [.75, [175, 120, 85]], [1, [225, 195, 160]]],
    Saturno: [[0, [160, 135, 90]], [.4, [215, 190, 135]], [.7, [240, 222, 175]], [1, [200, 175, 125]]],
    Urano:   [[0, [105, 190, 200]], [.5, [140, 220, 228]], [1, [175, 238, 240]]],
    Neptuno: [[0, [30, 60, 170]], [.5, [55, 100, 215]], [1, [100, 150, 240]]]
};

function createPlanetCanvas(name) {
    switch (name) {
        case "Sol":      return paintTexture(1024, 512, painters.sun(3));
        case "Mercúrio": return paintTexture(512, 256, painters.rocky(11, [150, 146, 140]));
        case "Vénus":    return paintTexture(512, 256, painters.venus(21));
        case "Terra":    return paintTexture(1024, 512, painters.earth(31));
        case "Marte":    return paintTexture(512, 256, painters.mars(41));
        case "Júpiter":  return paintTexture(1024, 512, painters.gas(51, planetPalettes.Júpiter, 16, { lon: 2.2, lat: -.3, color: [185, 78, 50] }));
        case "Saturno":  return paintTexture(512, 256, painters.gas(61, planetPalettes.Saturno, 13, null));
        case "Urano":    return paintTexture(512, 256, painters.ice(71, planetPalettes.Urano));
        case "Neptuno":  return paintTexture(512, 256, painters.ice(81, planetPalettes.Neptuno));
    }
}

function toTexture(canvas) {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    return t;
}

function toBumpTexture(canvas) {
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = canvas.width;
    bumpCanvas.height = canvas.height;
    const ctx = bumpCanvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(canvas, 0, 0);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = image.data;

    for (let i = 0; i < pixels.length; i += 4) {
        const luminance = pixels[i] * .299 + pixels[i + 1] * .587 + pixels[i + 2] * .114;
        pixels[i] = luminance;
        pixels[i + 1] = luminance;
        pixels[i + 2] = luminance;
        pixels[i + 3] = 255;
    }

    ctx.putImageData(image, 0, 0);
    const texture = new THREE.CanvasTexture(bumpCanvas);
    texture.anisotropy = maxAniso;
    return texture;
}

function radialTexture(stops) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([p, col]) => g.addColorStop(p, col));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
}

function ringTexture() {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 4;
    const ctx = c.getContext("2d");

    for (let x = 0; x < 1024; x++) {
        const t = x / 1024;
        const base = .55 + .25 * Math.sin(t * 90) + .15 * Math.sin(t * 210 + 1) + .1 * Math.sin(t * 430);
        const cassini = smooth(.5, .52, t) * (1 - smooth(.58, .6, t));
        const a = clamp01(base) * (1 - cassini * .92) * smooth(0, .06, t) * (1 - smooth(.94, 1, t));
        const col = mix([190, 165, 120], [238, 222, 188], t);
        ctx.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${a * .92})`;
        ctx.fillRect(x, 0, 1, 4);
    }

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}


/* =====================================================
   FUNDO: ESTRELAS E NEBULOSAS
===================================================== */

const sky = new THREE.Group();
scene.add(sky);

const starSprite = radialTexture([[0, "rgba(255,255,255,1)"], [.25, "rgba(255,255,255,.85)"], [1, "rgba(255,255,255,0)"]]);

function makeStars(count, size, minR, maxR, tintMode) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
        const r = minR + Math.random() * (maxR - minR);
        const a = Math.random() * Math.PI * 2;
        const z = Math.random() * 2 - 1;
        const h = Math.sqrt(1 - z * z);
        pos[i * 3] = r * h * Math.cos(a);
        pos[i * 3 + 1] = r * z;
        pos[i * 3 + 2] = r * h * Math.sin(a);

        const k = Math.random();
        if (tintMode && k < .3) color.setHSL(.08 + Math.random() * .05, .9, .75);     // laranja
        else if (tintMode && k < .6) color.setHSL(.58 + Math.random() * .06, .9, .78); // azul
        else color.setHSL(.6, .25, .85 + Math.random() * .15);
        col.set([color.r, color.g, color.b], i * 3);
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

    return new THREE.Points(geo, new THREE.PointsMaterial({
        size, sizeAttenuation: false, vertexColors: true, map: starSprite,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .95
    }));
}

sky.add(makeStars(5500, 1.8, 1800, 3200, false));
sky.add(makeStars(900, 3.6, 1800, 3200, true));

const nebulaSprite = radialTexture([[0, "rgba(255,255,255,.9)"], [.4, "rgba(255,255,255,.35)"], [1, "rgba(255,255,255,0)"]]);
const nebulaColors = [0x6a4cff, 0x00b7ff, 0xff4fd8, 0x3b5bff, 0x00e0c6, 0x9b3dff, 0xff7a4f];

nebulaColors.forEach((hex, i) => {
    const a = (i / nebulaColors.length) * Math.PI * 2 + Math.random();
    const mat = new THREE.SpriteMaterial({
        map: nebulaSprite, color: hex, transparent: true, opacity: .13 + Math.random() * .08,
        blending: THREE.AdditiveBlending, depthWrite: false, fog: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(Math.cos(a) * 2300, (Math.random() - .5) * 1100, Math.sin(a) * 2300);
    const s = 1400 + Math.random() * 1200;
    sprite.scale.set(s, s * .75, 1);
    sky.add(sprite);
});


/* =====================================================
   SISTEMA SOLAR
===================================================== */

const system = new THREE.Group();
scene.add(system);

const clickable = [];
const planetObjects = [];
const orbitMeshes = {};
const textureCanvases = {};

/* ---------- ATMOSFERA (brilho à volta do planeta) ---------- */

function atmosphereMaterial(color, power, intensity, front) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color[0], color[1], color[2]) },
            uPower: { value: power },
            uIntensity: { value: intensity }
        },
        vertexShader: `
            varying vec3 vN; varying vec3 vV;
            void main() {
                vN = normalize(normalMatrix * normal);
                vec4 mv = modelViewMatrix * vec4(position, 1.0);
                vV = normalize(-mv.xyz);
                gl_Position = projectionMatrix * mv;
            }`,
        fragmentShader: `
            uniform vec3 uColor; uniform float uPower; uniform float uIntensity;
            varying vec3 vN; varying vec3 vV;
            void main() {
                float d = dot(normalize(vN), normalize(vV));
                float f = ${front
                    ? "pow(clamp(1.0 - d, 0.0, 1.0), uPower + 1.0)"
                    : "pow(clamp(-d * 2.2, 0.0, 1.0), uPower)"};
                gl_FragColor = vec4(uColor * f * uIntensity, f);
            }`,
        side: front ? THREE.FrontSide : THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
}

function makeAtmosphere(radius, cfg) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 1.16, 48, 48),
        atmosphereMaterial(cfg.color, cfg.power, cfg.intensity, false)));
    if (cfg.rim) {
        g.add(new THREE.Mesh(new THREE.SphereGeometry(radius * 1.012, 48, 48),
            atmosphereMaterial(cfg.color, 2.2, 1.1, true)));
    }
    return g;
}

/* ---------- ÓRBITA (anel fino) ---------- */

function createOrbit(distance) {
    const w = .05 + distance * .0016;
    const mesh = new THREE.Mesh(
        new THREE.RingGeometry(distance - w, distance + w, 256),
        new THREE.MeshBasicMaterial({
            color: 0x6f8fd0, transparent: true, opacity: .2,
            side: THREE.DoubleSide, depthWrite: false
        })
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
}

/* ---------- SOL ---------- */

textureCanvases.Sol = createPlanetCanvas("Sol");

const sunMaterial = new THREE.MeshBasicMaterial({ map: toTexture(textureCanvases.Sol) });
sunMaterial.color.setRGB(2.1, 1.75, 1.35); // >1 faz o bloom brilhar mais

const sun = new THREE.Mesh(new THREE.SphereGeometry(planets.Sol.radius, 64, 64), sunMaterial);
sun.userData.name = "Sol";
system.add(sun);
clickable.push(sun);

const glowTexture = radialTexture([[0, "rgba(255,200,110,1)"], [.2, "rgba(255,150,50,.55)"], [.55, "rgba(255,90,20,.14)"], [1, "rgba(255,60,0,0)"]]);

const sunGlowA = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .95
}));
sunGlowA.scale.set(26, 26, 1);
system.add(sunGlowA);

const sunGlowB = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture, color: 0xff8a3d, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: .45
}));
sunGlowB.scale.set(60, 60, 1);
system.add(sunGlowB);

/* ---------- PLANETAS ---------- */

for (const name of planetNames) {

    if (name === "Sol") continue;

    const data = planets[name];
    const lk = look[name];

    const orbit = createOrbit(data.distance);
    system.add(orbit);
    orbitMeshes[name] = orbit;

    const pivot = new THREE.Object3D();
    pivot.rotation.y = Math.random() * Math.PI * 2;
    system.add(pivot);

    const holder = new THREE.Object3D();
    holder.position.x = data.distance;
    pivot.add(holder);

    const tilt = new THREE.Object3D();
    tilt.rotation.z = lk.tilt;
    holder.add(tilt);

    /* textura */
    const canvas = createPlanetCanvas(name);
    textureCanvases[name] = canvas;
    const map = toTexture(canvas);

    const rocky = ["Mercúrio", "Marte"].includes(name);
    const bumpMap = toBumpTexture(canvas);
    const material = new THREE.MeshStandardMaterial({
        map,
        bumpMap,
        bumpScale: rocky ? .16 : ["Júpiter", "Saturno", "Urano", "Neptuno"].includes(name) ? .045 : .08,
        roughness: name === "Terra" ? .68 : .9,
        metalness: 0
    });

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 64, 64), material);
    mesh.userData.name = name;
    tilt.add(mesh);
    clickable.push(mesh);

    /* atmosfera */
    if (lk.atmo) tilt.add(makeAtmosphere(data.radius, lk.atmo));

    /* nuvens da Terra */
    let clouds = null;
    if (name === "Terra") {
        clouds = new THREE.Mesh(
            new THREE.SphereGeometry(data.radius * 1.018, 64, 64),
            new THREE.MeshStandardMaterial({
                map: toTexture(paintTexture(1024, 512, painters.clouds(91))),
                transparent: true, depthWrite: false, roughness: 1
            })
        );
        tilt.add(clouds);
    }

    /* anéis de Saturno */
    if (name === "Saturno") {
        const inner = 3.4, outer = 5.6;
        const rg = new THREE.RingGeometry(inner, outer, 160, 1);
        const pos = rg.attributes.position, uv = rg.attributes.uv, v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            uv.setXY(i, (v.length() - inner) / (outer - inner), .5);
        }
        const ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({
            map: ringTexture(), side: THREE.DoubleSide, transparent: true, depthWrite: false
        }));
        ring.rotation.x = -Math.PI / 2;
        tilt.add(ring);
    }

    /* luas */
    const moons = [];
    for (const m of moonSets[name] || []) {
        const mp = new THREE.Object3D();
        mp.rotation.y = Math.random() * Math.PI * 2;
        holder.add(mp);

        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(m.r, 24, 24),
            new THREE.MeshStandardMaterial({ color: m.c, roughness: 1 })
        );
        moon.position.x = m.d;
        mp.add(moon);
        moons.push({ pivot: mp, speed: m.s });
    }

    planetObjects.push({ name, pivot, holder, mesh, clouds, moons, spin: lk.spin });
}

/* ---------- CINTURÃO DE ASTEROIDES ---------- */

const beltCount = 2400;
const belt = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true }),
    beltCount
);

{
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < beltCount; i++) {
        const r = 24.6 + (Math.random() + Math.random() + Math.random()) / 3 * 4.2;
        const a = Math.random() * Math.PI * 2;
        dummy.position.set(Math.cos(a) * r, (Math.random() - .5) * .9, Math.sin(a) * r);
        const s = .05 + Math.random() * Math.random() * .22;
        dummy.scale.set(s, s * (.6 + Math.random() * .6), s * (.7 + Math.random() * .5));
        dummy.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        dummy.updateMatrix();
        belt.setMatrixAt(i, dummy.matrix);
        color.setHSL(.07 + Math.random() * .04, .12 + Math.random() * .12, .3 + Math.random() * .3);
        belt.setColorAt(i, color);
    }
}
system.add(belt);


/* =====================================================
   ANEL DE SELEÇÃO + RÓTULOS
===================================================== */

const selector = new THREE.Mesh(
    new THREE.RingGeometry(.97, 1, 80),
    new THREE.MeshBasicMaterial({
        color: 0x5ee7ff, transparent: true, opacity: .9, side: THREE.DoubleSide,
        depthTest: false, toneMapped: false
    })
);
selector.renderOrder = 20;
scene.add(selector);

const selectorOuter = new THREE.Mesh(
    new THREE.RingGeometry(1.14, 1.155, 80, 1, 0, Math.PI * 1.5),
    new THREE.MeshBasicMaterial({
        color: 0xa78bfa, transparent: true, opacity: .8, side: THREE.DoubleSide,
        depthTest: false, toneMapped: false
    })
);
selectorOuter.renderOrder = 20;
selector.add(selectorOuter);

const labelsBox = document.getElementById("labels");
const labelEls = {};

for (const name of planetNames) {
    const el = document.createElement("div");
    el.className = "planet-label";
    el.textContent = name.toUpperCase();
    el.addEventListener("click", () => { touch(); selectPlanet(name, true); });
    labelsBox.appendChild(el);
    labelEls[name] = el;
}


/* =====================================================
   ELEMENTOS DA INTERFACE
===================================================== */

const $ = id => document.getElementById(id);

const infoPanel = document.querySelector(".info-panel");
const planetNameEl = $("planetName");
const planetTypeEl = $("planetType");
const planetTagEl = $("planetTag");
const planetDescriptionEl = $("planetDescription");
const factsEl = $("facts");
const curiosityEl = $("curiosity");

const hex = n => "#" + n.toString(16).padStart(6, "0");

function buildPlanetList() {
    const list = $("planetList");
    list.innerHTML = "";

    for (const name of planetNames) {
        const button = document.createElement("button");
        button.className = "planet-button";
        button.dataset.name = name;
        button.style.setProperty("--c", hex(planets[name].color));
        button.innerHTML = `<i class="dot"></i><span class="name">${name}</span><span class="arrow">${name === "Sol" ? "★" : "›"}</span>`;
        button.addEventListener("click", () => { touch(); selectPlanet(name, true); });
        list.appendChild(button);
    }
}

function updatePlanetList() {
    document.querySelectorAll(".planet-button").forEach(b =>
        b.classList.toggle("selected", b.dataset.name === selectedPlanet));
    for (const name of planetNames) labelEls[name].classList.toggle("selected", name === selectedPlanet);
    for (const name in orbitMeshes) {
        const m = orbitMeshes[name].material;
        const on = name === selectedPlanet;
        m.color.setHex(on ? 0x5ee7ff : 0x6f8fd0);
        m.opacity = on ? .6 : .2;
    }
}


/* =====================================================
   SELECIONAR PLANETA
===================================================== */

function selectPlanet(name, focus = true, announce = true) {

    selectedPlanet = name;
    const data = planets[name];

    planetNameEl.textContent = name;
    planetTypeEl.textContent = data.type;
    planetTagEl.textContent = data.tag;
    planetDescriptionEl.textContent = data.description;
    curiosityEl.textContent = data.curiosity;

    document.documentElement.style.setProperty("--glow", hex(data.color === 0x3975c7 ? 0x5ec8ff : data.color));

    factsEl.innerHTML = "";
    for (const [key, value] of Object.entries(data.facts)) {
        const el = document.createElement("div");
        el.className = "fact";
        el.innerHTML = `<small>${key}</small><b>${value}</b>`;
        factsEl.appendChild(el);
    }

    infoPanel.style.display = "";
    infoPanel.classList.remove("swap");
    void infoPanel.offsetWidth;
    infoPanel.classList.add("swap");

    updatePlanetList();

    if (focus) focusPlanet(name);
    if (announce) reactToPlanet(name);
}


/* =====================================================
   CÂMARA: VOO SUAVE E SEGUIR O ASTRO
===================================================== */

function getPlanetHolder(name) {
    return name === "Sol" ? sun : planetObjects.find(o => o.name === name).holder;
}

function worldPos(name) {
    return getPlanetHolder(name).getWorldPosition(new THREE.Vector3());
}

function startFlight(endTarget, endCam, follow = null, duration = 1.7) {
    atHome = false;
    flight = {
        t: 0, dur: duration, follow,
        sc: camera.position.clone(), st: controls.target.clone(),
        endTarget, endCam
    };
    followName = null;
}

/* Em ecrãs em pé o astro focado fica mais longe, para caber (os anéis de Saturno, por exemplo) */
function focusBoost() {
    const aspect = innerWidth / innerHeight;
    return aspect >= 1 ? 1 : Math.min(2, 1 / aspect);
}

function focusPlanet(name) {
    const data = planets[name];
    const dir = camera.position.clone().sub(controls.target).normalize();
    if (dir.y < .18) { dir.y = .18; dir.normalize(); }

    const dist = (name === "Sol" ? 24 : Math.max(data.radius * 6.5, 9) + (name === "Saturno" ? 6 : 0)) * focusBoost();

    startFlight(
        () => worldPos(name),
        () => worldPos(name).add(dir.clone().multiplyScalar(dist)),
        name
    );
}

function goHome() {
    startFlight(() => new THREE.Vector3(0, 0, 0), () => HOME_CAM.clone(), null, 1.9);
    atHome = true;
}

controls.addEventListener("start", () => {
    atHome = false;
    if (flight) {
        if (flight.follow) { followName = flight.follow; followLast.copy(worldPos(followName)); }
        flight = null;
    }
});

function updateCamera(delta) {

    if (flight) {
        flight.t += delta;
        const k = Math.min(flight.t / flight.dur, 1);
        const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

        controls.target.lerpVectors(flight.st, flight.endTarget(), e);
        camera.position.lerpVectors(flight.sc, flight.endCam(), e);

        if (k >= 1) {
            if (flight.follow) { followName = flight.follow; followLast.copy(worldPos(followName)); }
            flight = null;
        }

    } else if (followName) {
        const p = worldPos(followName);
        const off = p.clone().sub(followLast);
        camera.position.add(off);
        controls.target.add(off);
        followLast.copy(p);
    }
}


/* =====================================================
   MODO EXPLORAÇÃO
===================================================== */

const exploreOverlay = $("exploreOverlay");
const symbolURLs = {};

function openExplore() {
    touch();
    const data = planets[selectedPlanet];

    exploreOverlay.classList.remove("hidden");
    $("exploreName").textContent = selectedPlanet;
    $("exploreText").textContent = data.description;
    $("exploreDistance").textContent = data.facts["Distância"] || "Centro do sistema";
    $("exploreYear").textContent = data.facts["Ano"] || "—";
    $("exploreMoons").textContent = data.facts["Luas"] || "—";
    $("exploreType").textContent = data.type;
    $("missionText").textContent = data.mission;

    if (!symbolURLs[selectedPlanet]) symbolURLs[selectedPlanet] = textureCanvases[selectedPlanet].toDataURL("image/jpeg", .9);
    $("planetSymbol").style.backgroundImage = `url(${symbolURLs[selectedPlanet]})`;

    focusPlanet(selectedPlanet);
    react("happy", `A entrar no modo exploração: ${selectedPlanet}!`, { force: true });
}

function closeExplore(silent = false) {
    if (exploreOverlay.classList.contains("hidden")) return;
    exploreOverlay.classList.add("hidden");
    if (!silent) react("wave", "De volta ao espaço aberto!", { force: true });
}


/* =====================================================
   SOBRE O SISTEMA SOLAR (texto e vídeo definidos em config.js)
===================================================== */

const aboutOverlay = $("aboutOverlay");
const aboutBtn = $("aboutBtn");
const aboutVideo = $("aboutVideo");
const aboutBody = $("aboutBody");
const aboutSections = Array.isArray(OVERVIEW?.sections) ? OVERVIEW.sections : [];
const aboutAvailable = Boolean(OVERVIEW?.enabled) && aboutSections.length > 0;
const aboutVideoCfg = OVERVIEW?.video || {};
const aboutVideoSrc = typeof aboutVideoCfg.src === "string" ? aboutVideoCfg.src.trim() : "";
let aboutOpen = false;

if (aboutAvailable) {

    aboutBtn.hidden = false;
    aboutBtn.textContent = OVERVIEW.buttonLabel || "SOBRE";

    $("aboutKicker").textContent = OVERVIEW.kicker || "";
    $("aboutTitle").textContent = OVERVIEW.title || "";
    $("aboutSubtitle").textContent = OVERVIEW.subtitle || "";

    const nav = $("aboutNav");

    aboutSections.forEach((section, i) => {
        const wrap = document.createElement("section");
        wrap.className = "about-section";
        wrap.id = `aboutSec${i}`;

        const h = document.createElement("h3");
        h.textContent = section.title || "";
        wrap.appendChild(h);

        const paragraphs = Array.isArray(section.text) ? section.text : [section.text];
        for (const t of paragraphs) {
            if (!t) continue;
            const p = document.createElement("p");
            p.textContent = String(t);
            wrap.appendChild(p);
        }
        aboutBody.appendChild(wrap);

        if (section.title) {
            const b = document.createElement("button");
            b.type = "button";
            b.textContent = section.title.toUpperCase();
            b.addEventListener("click", () => wrap.scrollIntoView({ block: "start" }));
            nav.appendChild(b);
        }
    });

    const src = OVERVIEW.source;
    const srcLink = $("aboutSource");
    if (src && src.label) {
        srcLink.textContent = src.label;
        if (src.url && /^https?:\/\//i.test(src.url)) srcLink.href = src.url;
        else srcLink.removeAttribute("href");
    }

    const dim = Number(aboutVideoCfg.dim);
    $("aboutDim").style.setProperty("--dim", String(Number.isFinite(dim) ? Math.min(1, Math.max(0, dim)) : .55));

    if (aboutVideoSrc) {
        aboutVideo.muted = aboutVideoCfg.muted !== false;
        aboutVideo.loop = aboutVideoCfg.loop !== false;
        if (aboutVideoCfg.poster) aboutVideo.poster = aboutVideoCfg.poster;
        aboutVideo.addEventListener("error", () => {
            console.warn("PITRUX: não consegui abrir o vídeo de fundo:", aboutVideoSrc);
            aboutVideo.hidden = true;
        });
    }
}

function openAbout() {
    if (!aboutAvailable || aboutOpen) return;
    touch();
    closeExplore(true);
    lab.close();
    aboutOpen = true;
    document.body.classList.add("about-open");
    aboutOverlay.hidden = false;
    aboutOverlay.classList.remove("hidden");
    aboutBody.scrollTop = 0;

    if (aboutVideoSrc) {
        if (!aboutVideo.getAttribute("src")) aboutVideo.src = aboutVideoSrc;
        aboutVideo.hidden = false;
        aboutVideo.play().catch(() => {});
    }

    $("closeAbout").focus({ preventScroll: true });
}

function closeAbout() {
    if (!aboutOpen) return;
    aboutOpen = false;
    document.body.classList.remove("about-open");
    clock.getDelta(); // evita um salto de tempo ao retomar o 3D
    aboutOverlay.hidden = true;
    aboutOverlay.classList.add("hidden");
    aboutVideo.pause();
    aboutBtn.focus({ preventScroll: true });
}

/* ---------- LABORATÓRIO (peso, sobrevivência, comparar, quiz, missões) ---------- */

let labOpen = false;

const lab = initLab({
    onOpenChange(open) {
        labOpen = open;
        document.body.classList.toggle("lab-open", open);
        if (open) { touch(); closeExplore(true); closeAbout(); }
        else clock.getDelta(); // evita um salto de tempo ao retomar o 3D
    },
    goToPlanet(name) { if (planets[name]) selectPlanet(name, true); },
    react,
    touch
});

aboutBtn.addEventListener("click", openAbout);
$("closeAbout").addEventListener("click", closeAbout);
aboutOverlay.addEventListener("click", e => {
    if (e.target === aboutOverlay || e.target.id === "aboutDim") closeAbout();
});


/* =====================================================
   BOTÕES
===================================================== */

$("focusBtn").addEventListener("click", openExplore);
$("exploreBtn").addEventListener("click", openExplore);
$("exitExplore").addEventListener("click", () => closeExplore());

function overview() {
    touch();
    closeExplore(true);
    followName = null;
    infoPanel.style.display = "";
    goHome();
    react("wow", "Visão geral! Daqui vê-se o sistema inteiro.", { force: true });
}

$("overviewBtn").addEventListener("click", overview);

$("resetBtn").addEventListener("click", () => {
    touch();
    closeExplore(true);
    selectPlanet("Terra", false, false);
    goHome();
    react("happy", "Sistema reposto! Vamos recomeçar a viagem.", { force: true });
});

$("closeInfo").addEventListener("click", () => {
    touch();
    infoPanel.style.display = "none";
    react("wave", "Painel fechado. Continuo aqui se precisares!", { force: true });
});

/* Painel recolhível (telemóvel e tablet em pé): só o título, ou tudo */
const infoToggle = $("infoToggle");
const compactLayout = matchMedia("(max-width: 900px), (max-height: 520px) and (orientation: landscape)");

function setInfoCollapsed(collapsed, remember = true) {
    infoPanel.classList.toggle("collapsed", collapsed);
    infoToggle.setAttribute("aria-expanded", String(!collapsed));
    infoToggle.setAttribute("aria-label", collapsed ? "Expandir painel" : "Recolher painel");
    infoToggle.textContent = collapsed ? "⌃" : "⌄";
    if (remember) { try { localStorage.setItem("pitrux.infoCollapsed", collapsed ? "1" : "0"); } catch { /* sem armazenamento */ } }
}

{
    let stored = null;
    try { stored = localStorage.getItem("pitrux.infoCollapsed"); } catch { /* sem armazenamento */ }
    setInfoCollapsed(stored === null ? innerWidth <= 600 || innerHeight <= 520 : stored === "1", false);
}

infoToggle.addEventListener("click", () => { touch(); setInfoCollapsed(!infoPanel.classList.contains("collapsed")); });

/* Tocar no título também recolhe/expande (mais fácil com o polegar) */
infoPanel.querySelector(".info-top > div").addEventListener("click", () => {
    if (!compactLayout.matches) return;
    touch();
    setInfoCollapsed(!infoPanel.classList.contains("collapsed"));
});

/* pausar */
function togglePause() {
    touch();
    paused = !paused;
    $("pauseBtn").textContent = paused ? "▶ CONTINUAR" : "Ⅱ PAUSAR";
    $("pauseBtn").setAttribute("aria-pressed", String(paused));
    if (paused) react("wow", "Tempo parado! Está tudo congelado ❄", { force: true });
    else react("happy", "O tempo voltou a correr!", { force: true });
}
$("pauseBtn").addEventListener("click", togglePause);

/* velocidade */
const speedInput = $("speed");

speedInput.addEventListener("input", e => {
    speed = Number(e.target.value);
    $("speedValue").textContent = speed.toFixed(1) + "×";
    touch();
});

speedInput.addEventListener("change", () => {
    if (speed === 0) react("sleepy", "Tudo parado… que sossego.", { force: true });
    else if (speed >= 2.4) react("fast", "Uau, assim fico tonto! 😵", { force: true });
    else if (speed <= .5) react("idle", "Câmara lenta… assim aprecio melhor a vista.", { force: true });
    else react("happy", "Velocidade normal. Perfeito!", { force: true });
});

/* órbitas e nomes */
$("orbitsBtn").addEventListener("click", e => {
    touch();
    const on = e.currentTarget.classList.toggle("active");
    e.currentTarget.setAttribute("aria-pressed", String(on));
    Object.values(orbitMeshes).forEach(m => (m.visible = on));
    react(on ? "happy" : "wow", on ? "Órbitas visíveis outra vez!" : "Sem linhas de órbita… os planetas voam à solta!");
});

$("labelsBtn").addEventListener("click", e => {
    touch();
    const on = e.currentTarget.classList.toggle("active");
    e.currentTarget.setAttribute("aria-pressed", String(on));
    labelsBox.classList.toggle("off", !on);
    react("idle", on ? "Nomes ligados." : "Nomes desligados. Vês se os reconheces?");
});


/* =====================================================
   MÚSICA (definida em config.js)
===================================================== */

const musicBtn = $("musicBtn");
const musicPlayer = $("musicPlayer");
const volumeInput = $("musicVolume");
const volumeValue = $("musicVolumeValue");
const trackName = $("trackName");
const configuredTracks = Array.isArray(MUSIC.tracks) ? MUSIC.tracks : [];
const tracks = configuredTracks.map((track, index) => {
    if (typeof track === "string") {
        const filename = track.split(/[\\/]/).pop() || `Faixa ${index + 1}`;
        return { src: track.trim(), title: filename.replace(/\.[^.]+$/, "") };
    }
    if (track && typeof track.src === "string" && track.src.trim()) {
        return { src: track.src.trim(), title: typeof track.title === "string" && track.title.trim() ? track.title.trim() : `Faixa ${index + 1}` };
    }
    return null;
}).filter(Boolean);
const musicAvailable = MUSIC.enabled && tracks.length > 0;

const audio = new Audio();
let trackIndex = 0;
let musicOn = false;
let userPausedMusic = false;

if (musicAvailable) {

    audio.volume = Math.min(1, Math.max(0, Number(MUSIC.volume) || 0));
    audio.preload = "auto";
    audio.loop = tracks.length === 1 && MUSIC.loop;
    audio.src = tracks[trackIndex].src;

    musicPlayer.hidden = false;
    volumeInput.value = String(Math.round(audio.volume * 100));
    volumeValue.value = `${volumeInput.value}%`;
    volumeValue.textContent = volumeValue.value;
    trackName.textContent = tracks[trackIndex].title;
    $("trackPrev").hidden = tracks.length < 2;
    $("trackNext").hidden = tracks.length < 2;

    audio.addEventListener("ended", () => {
        if (trackIndex + 1 >= tracks.length && !MUSIC.loop) {
            setMusicState(false);
            return;
        }
        changeTrack((trackIndex + 1) % tracks.length, true);
    });

    audio.addEventListener("error", () => {
        console.warn("PITRUX: não consegui abrir a música:", tracks[trackIndex]);
        trackName.textContent = "ERRO AO CARREGAR";
        setMusicState(false);
    });
}

function setMusicState(on) {
    musicOn = on;
    musicBtn.classList.toggle("active", on);
    musicBtn.textContent = on ? "Ⅱ" : "▶";
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "Pausar música" : "Reproduzir música");
    refreshBaseMood();
}

async function playMusic() {
    if (!musicAvailable) return false;
    try {
        await audio.play();
        setMusicState(true);
        return true;
    } catch (error) {
        setMusicState(false);
        if (error.name === "NotAllowedError") {
            console.info("PITRUX: o navegador exige uma interação para iniciar a música.");
        } else {
            console.warn("PITRUX: não consegui iniciar a música:", error);
        }
        return false;
    }
}

function pauseMusic() { audio.pause(); setMusicState(false); }

function changeTrack(index, autoplay = musicOn) {
    if (!musicAvailable) return;
    trackIndex = index;
    audio.pause();
    audio.src = tracks[trackIndex].src;
    audio.loop = tracks.length === 1 && MUSIC.loop;
    trackName.textContent = tracks[trackIndex].title;
    if (autoplay) playMusic();
}

if (musicAvailable) {

    musicBtn.addEventListener("click", async () => {
        touch();
        if (musicOn) {
            userPausedMusic = true;
            pauseMusic();
            react("idle", "Música em pausa.", { force: true });
        } else {
            userPausedMusic = false;
            if (await playMusic()) react("dance", "Música! Vamos dançar pelo espaço! 🎵", { force: true });
        }
    });

    $("trackPrev").addEventListener("click", () => {
        touch();
        const nextIndex = trackIndex === 0 ? tracks.length - 1 : trackIndex - 1;
        changeTrack(nextIndex);
        react("dance", `A tocar: ${tracks[nextIndex].title}.`, { force: true, ms: 2400 });
    });

    $("trackNext").addEventListener("click", () => {
        touch();
        const nextIndex = (trackIndex + 1) % tracks.length;
        changeTrack(nextIndex);
        react("dance", `A tocar: ${tracks[nextIndex].title}.`, { force: true, ms: 2400 });
    });

    volumeInput.addEventListener("input", () => {
        audio.volume = Number(volumeInput.value) / 100;
        volumeValue.value = `${volumeInput.value}%`;
        volumeValue.textContent = volumeValue.value;
        touch();
    });

    volumeInput.addEventListener("change", () => {
        react("idle", `Volume ajustado para ${volumeInput.value}%.`, { force: true, ms: 2200 });
    });

    /* Os navegadores só deixam tocar depois de uma interação */
    if (MUSIC.autoStart) {
        const tryStart = async () => {
            if (userPausedMusic || musicOn) return;
            if (await playMusic()) react("dance", "Música a tocar! Hora de explorar ao som do cosmos 🎵", { force: true });
        };
        playMusic().then(ok => {
            if (!ok) {
                const once = () => { tryStart(); };
                addEventListener("pointerdown", once, { once: true });
                addEventListener("keydown", once, { once: true });
            }
        });
    }
}


/* =====================================================
   ASTRONAUTA — REAÇÕES
===================================================== */

const astro = $("astro");
const astroBubble = $("astroBubble");
const astroText = $("astroText");
const astroFigure = $("astroFigure");
const eyeTrack = $("eyeTrack");

let moodTimer = null;
let bubbleTimer = null;
let lastReact = 0;
let lastInteraction = performance.now();
let asleep = false;
let tipShown = false;
let nearFlag = false;
let farFlag = false;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

if (!AVATAR.enabled) astro.hidden = true;
$("astroName").textContent = AVATAR.name || "NOVA";
astroFigure.setAttribute("aria-label", `Interagir com ${AVATAR.name || "NOVA"}. Arrasta, ou usa as setas do teclado, para a mover.`);

function baseMood() {
    if (asleep) return "sleepy";
    if (musicOn) return "dance";
    return "idle";
}

function refreshBaseMood() {
    if (!moodTimer) astro.dataset.mood = baseMood();
}

function react(mood, message, opts = {}) {
    const { ms = 4200, force = false } = opts;
    const now = performance.now();

    if (!force && now - lastReact < 1500) return;
    lastReact = now;

    astro.dataset.mood = mood;

    if (message) {
        astroText.textContent = message;
        astroBubble.classList.add("show");
    }

    clearTimeout(moodTimer);
    clearTimeout(bubbleTimer);

    bubbleTimer = setTimeout(() => astroBubble.classList.remove("show"), ms);
    moodTimer = setTimeout(() => {
        moodTimer = null;
        astro.dataset.mood = baseMood();
    }, ms + 300);
}

/* Qualquer ação do utilizador passa por aqui */
function touch() {
    lastInteraction = performance.now();
    tipShown = false;

    if (asleep) {
        asleep = false;
        react("wow", "Ah! Voltaste! Continuemos a explorar.", { force: true });
    }
}

const planetReactions = {
    Sol:      ["hot",  ["Caramba, que calor! Mantém uma distância segura do Sol! 🔥", "O Sol não é amarelo ou laranja, mas sim branco. Pois, se observado do espaço ou de outro corpo celeste sem atmosfera, o Sol aparece como uma esfera de luz intensa e branca. Isso ocorre porque a luz emitida pelo Sol é uma mistura de todas as cores do espectro visível, e quando combinadas, formam a luz branca que permite enxergarmos as cores naturais dos objetos na Terra!"]],
    Mercúrio: ["hot",  ["Mercúrio! Sem atmosfera, de dia é um forno e à noite é um congelador.", "Tão perto do Sol… e ainda assim Vénus é mais quente!"]],
    Vénus:    ["hot",  ["Vénus é um forno: ≈ 465 °C! Eu fico só a observar daqui.", "Vénus roda ao contrário. Que planeta rebelde!"]],
    Terra:    ["happy", ["Lar, doce Lar! É aqui que tudo começou 💙", "A Terra: o único mundo conhecido com vida. Que orgulho!"]],
    Marte:    ["happy", ["Marte! O nosso caríssimo Elon Musk diz que um dia a humanidade com ajuda da tecnologia poderá viver aqui 🚀", "O Olympus Mons de Marte faz o Evereste parecer pequeno!"]],
    Júpiter:  ["wow",  ["Enorme! Cabiam mais de 1.300 Terras dentro de Júpiter.", "Aquela Grande Mancha Vermelha é uma tempestade com séculos!"]],
    Saturno:  ["wow",  ["Que anéis lindos! São feitos de gelo e rocha.", "Saturno é tão leve que boiaria na água… se houvesse um oceano gigante!"]],
    Urano:    ["cold", ["Tá gelar yh! Urano é gelado e gira de lado!", "Urano chega a ≈ −224 °C. Preciso de um casaco!"]],
    Neptuno:  ["cold", ["Brrr! O limite do Sistema Solar, com ventos de ~2.000 km/h!", "Neptuno é o mais distante… e o mais ventoso."]]
};

function reactToPlanet(name) {
    const [mood, lines] = planetReactions[name];
    react(mood, pick(lines), { force: true, ms: 5200 });
}

/* Tocar no astronauta */
const pokeLines = [
    ["happy", "Hihi! Isso faz cócegas no fato espacial!"],
    ["wave",  "É como cota! Precisas de ajuda a navegar?"],
    ["wow",   "Ei! Cuidado com o capacete!"],
    ["happy", "Estou a gostar desta viagem. E tu?"]
];

astroFigure.addEventListener("click", () => {
    touch();
    const [mood, line] = pick(pokeLines);
    react(mood, line, { force: true });
});

/* Arrastar a NOVA para onde ela não tape o que estás a ler */
const dragLines = ["Uiii, estou a voar!", "Pode ser aqui? Daqui vejo bem.", "Mudança de poiso! Boa escolha."];
const dropLines = ["Boa! Daqui já não tapo nada.", "Fico aqui então. Chama-me se precisares!", "Perfeito, vista desimpedida!"];

if (AVATAR.enabled) {
    initAstroDrag({
        wrap: astro,
        figure: astroFigure,
        onDragStart() { touch(); react("wow", pick(dragLines), { ms: 1800 }); },
        onDrop() { react("happy", pick(dropLines), { force: true, ms: 2600 }); },
        onReset() { touch(); react("wave", "De volta ao meu cantinho!", { force: true, ms: 2600 }); }
    });
}

/* Os olhos seguem o rato */
addEventListener("pointermove", e => {
    lastInteraction = performance.now();

    if (asleep || !AVATAR.enabled) return;

    const r = astroFigure.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height * .3);
    const len = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, len / 300);

    eyeTrack.style.transform = `translate(${(dx / len) * 3.5 * k}px, ${(dy / len) * 3 * k}px)`;
});

/* Arrastar e aproximar a câmara */
controls.addEventListener("start", () => {
    touch();
    react("wave", "Estou a acompanhar as tuas manobras!", { ms: 2200 });
});

controls.addEventListener("change", () => {
    const dist = camera.position.distanceTo(controls.target);

    if (dist < 11 && !nearFlag) {
        nearFlag = true;
        react("wow", "Tão perto! Consigo ver os detalhes todos.", { ms: 3600 });
    } else if (dist > 14) nearFlag = false;

    if (dist > 230 && !farFlag) {
        farFlag = true;
        react("wow", "Lá ao fundo… o Sistema Solar parece pequenino!", { ms: 3600 });
    } else if (dist < 180) farFlag = false;
});

addEventListener("wheel", () => touch(), { passive: true });

/* Dica quando o utilizador está parado + adormecer */
setInterval(() => {
    const idleFor = (performance.now() - lastInteraction) / 1000;

    if (idleFor > 16 && !tipShown && !asleep && exploreOverlay.classList.contains("hidden")) {
        tipShown = true;
        react("wave", "Sabias que… " + planets[selectedPlanet].curiosity, { force: true, ms: 7500 });
    }

    if (idleFor > 55 && !asleep && !musicOn) {
        asleep = true;
        react("sleepy", "Zzz… acorda-me quando quiseres explorar mais.", { force: true, ms: 4000 });
        moodTimer = null;
        astro.dataset.mood = "sleepy";
    }
}, 1000);


/* =====================================================
   TECLADO
===================================================== */

addEventListener("keydown", e => {
    touch();

    if (e.key === "Escape") { closeExplore(); closeAbout(); lab.close(); }

    const typing = ["INPUT", "BUTTON", "TEXTAREA", "SELECT"].includes(e.target.tagName);
    const plain = !e.ctrlKey && !e.metaKey && !e.altKey;

    if ((e.key === "i" || e.key === "I") && !typing && plain) {
        aboutOpen ? closeAbout() : openAbout();
    }

    if ((e.key === "l" || e.key === "L") && !typing && plain) {
        lab.isOpen() ? lab.close() : lab.open();
    }

    if (e.code === "Space" && !typing && !aboutOpen && !labOpen) { e.preventDefault(); togglePause(); }
    if ((e.key === "m" || e.key === "M") && musicAvailable) musicBtn.click();
});


/* =====================================================
   CLIQUE E HOVER NOS ASTROS
===================================================== */

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downX = 0, downY = 0;

function pick3D(event) {
    pointer.x = (event.clientX / innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickable, false);
    return hits.length ? hits[0].object.userData.name : null;
}

renderer.domElement.addEventListener("pointerdown", e => { downX = e.clientX; downY = e.clientY; });

renderer.domElement.addEventListener("pointerup", e => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return; // foi um arrastar
    const name = pick3D(e);
    if (name) selectPlanet(name, true);
});

let hoverBusy = false;
renderer.domElement.addEventListener("pointermove", e => {
    if (hoverBusy || e.buttons) return;
    hoverBusy = true;
    requestAnimationFrame(() => {
        renderer.domElement.style.cursor = pick3D(e) ? "pointer" : "default";
        hoverBusy = false;
    });
});


/* =====================================================
   VISTA: ZONA LIVRE DO ECRÃ
   Em telemóvel em pé / tablet vertical o painel e os controlos ficam
   empilhados em baixo. Em vez de o astro ficar escondido por detrás
   deles, a vista desloca-se para o centro da zona que sobra.
===================================================== */

const dock = document.querySelector(".dock");
const planetMenu = document.querySelector(".planet-menu");
let viewShift = 0;
let viewShiftTarget = 0;

function measureViewShift() {
    const stacked = dock && getComputedStyle(dock).display !== "contents" && dock.getBoundingClientRect().width > innerWidth * .8;
    if (!stacked) { viewShiftTarget = 0; return; }

    const freeTop = planetMenu.getBoundingClientRect().bottom + 6;
    const freeBottom = dock.getBoundingClientRect().top - 6;
    const shift = innerHeight / 2 - (freeTop + freeBottom) / 2;
    viewShiftTarget = Math.max(0, Math.min(innerHeight * .32, shift));
}

function applyViewShift() {
    if (viewShift < .5) {
        if (camera.view?.enabled) camera.clearViewOffset();
    } else {
        camera.setViewOffset(innerWidth, innerHeight, 0, viewShift, innerWidth, innerHeight);
    }
}

if (dock && typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(measureViewShift);
    observer.observe(dock);
    observer.observe(planetMenu);
}


/* =====================================================
   ANIMAÇÃO
===================================================== */

const clock = new THREE.Clock();
const tmpV = new THREE.Vector3();
const camUp = new THREE.Vector3();
let elapsed = 0;

function updateLabels() {
    camUp.set(0, 1, 0).applyQuaternion(camera.quaternion);

    for (const name of planetNames) {
        const el = labelEls[name];
        const data = planets[name];

        getPlanetHolder(name).getWorldPosition(tmpV);
        const dist = camera.position.distanceTo(tmpV);
        tmpV.addScaledVector(camUp, data.radius * (name === "Saturno" ? 2.1 : 1.35));
        tmpV.project(camera);

        const hidden = tmpV.z > 1 || Math.abs(tmpV.x) > 1.1 || Math.abs(tmpV.y) > 1.1;
        el.style.display = hidden ? "none" : "";
        if (hidden) continue;

        el.style.transform = `translate(${(tmpV.x * .5 + .5) * innerWidth}px, ${(-tmpV.y * .5 + .5) * innerHeight}px) translate(-50%, -100%)`;
        el.style.opacity = dist < data.radius * 3.2 ? 0 : 1;
    }
}

function animate() {

    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), .1);

    /* Com a janela "Sobre" aberta o 3D fica em pausa: poupa a GPU para o vídeo */
    if (aboutOpen || labOpen) return;

    elapsed += delta;

    sky.rotation.y += delta * .002;

    if (!paused) {

        sun.rotation.y += delta * .04 * speed;
        belt.rotation.y += delta * .012 * speed;

        for (const o of planetObjects) {
            o.pivot.rotation.y += planets[o.name].orbitSpeed * delta * 6 * speed;
            o.mesh.rotation.y += delta * o.spin * speed;
            if (o.clouds) o.clouds.rotation.y += delta * (o.spin + .06) * speed;
            for (const m of o.moons) m.pivot.rotation.y += delta * m.speed * speed;
        }
    }

    const pulse = 1 + Math.sin(elapsed * 1.6) * .025;
    sunGlowA.scale.setScalar(26 * pulse);
    sunGlowB.scale.setScalar(60 * (2 - pulse));

    if (Math.abs(viewShiftTarget - viewShift) > .2) {
        viewShift += (viewShiftTarget - viewShift) * .18;
        applyViewShift();
    }

    updateCamera(delta);
    controls.update();

    /* anel de seleção */
    const sp = worldPos(selectedPlanet);
    const sr = planets[selectedPlanet].radius * (selectedPlanet === "Saturno" ? 2.2 : 1.55);
    selector.position.copy(sp);
    selector.quaternion.copy(camera.quaternion);
    selector.scale.setScalar(sr * (1 + Math.sin(elapsed * 3) * .015));
    selectorOuter.rotation.z = elapsed * .8;

    updateLabels();

    composer.render();
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

buildPlanetList();
selectPlanet("Terra", false, false);
setMusicState(false);
measureViewShift();
viewShift = viewShiftTarget;
applyViewShift();
animate();

requestAnimationFrame(() => requestAnimationFrame(() => {
    setTimeout(() => {
        $("loading").classList.add("hidden");

        setTimeout(() => {
            react("wave", `Olá, explorador! Eu sou ${AVATAR.name || "NOVA"}, o teu astronauta guia. Clica num astro!`, { force: true, ms: 6500 });
        }, 700);

        /* Só da primeira vez: avisa que a NOVA se pode mover */
        let seenHint = true;
        try { seenHint = localStorage.getItem("pitrux.astroHint") === "1"; } catch { /* sem armazenamento */ }
        if (AVATAR.enabled && !seenHint) {
            setTimeout(() => {
                react("wave", "Dica: arrasta-me para onde preferires, assim não te tapo nada!", { force: true, ms: 6500 });
                try { localStorage.setItem("pitrux.astroHint", "1"); } catch { /* sem armazenamento */ }
            }, 7600);
        }
    }, 500);
}));


/* =====================================================
   RESPONSIVO
===================================================== */

addEventListener("resize", () => {
    if (camera.view?.enabled) camera.clearViewOffset();

    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);

    /* a visão geral reajusta-se ao novo formato (ex.: telemóvel a rodar) */
    updateHomeCam();
    if (atHome && !flight) camera.position.copy(HOME_CAM);

    measureViewShift();
    viewShift = viewShiftTarget;
    applyViewShift();
});

addEventListener("error", e => console.error("Erro no PITRUX:", e.error));

/* Se a GPU perder o contexto WebGL, deixa o navegador restaurá-lo (em vez de ficar tudo preto) */
renderer.domElement.addEventListener("webglcontextlost", e => {
    e.preventDefault();
    console.warn("PITRUX: contexto WebGL perdido, a aguardar restauro…");
});
renderer.domElement.addEventListener("webglcontextrestored", () => {
    console.info("PITRUX: contexto WebGL restaurado.");
    composer.setSize(innerWidth, innerHeight);
});
