/* =====================================================
   PITRUX — NOVA ARRASTÁVEL
   -----------------------------------------------------
   A NOVA pode ser arrastada com o rato ou com o dedo, ou movida
   com as setas do teclado (com ela em foco). A posição fica
   guardada neste navegador. Duplo clique (ou a tecla Home) repõe
   o sítio original.

   O balão de fala muda sozinho para o lado onde há mais espaço,
   por isso nunca fica cortado nas bordas do ecrã.
===================================================== */

const STORE = "pitrux.astroPos";
const EDGE = 6;          // distância mínima às bordas do ecrã (px)
const THRESHOLD = 6;     // movimento mínimo para contar como arrastar e não como clique (px)

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function read() {
    try {
        const v = JSON.parse(localStorage.getItem(STORE));
        if (v && Number.isFinite(v.fx) && Number.isFinite(v.fy)) return { fx: clamp(v.fx, 0, 1), fy: clamp(v.fy, 0, 1) };
    } catch { /* sem armazenamento ou valor inválido */ }
    return null;
}

function write(value) {
    try {
        if (value) localStorage.setItem(STORE, JSON.stringify(value));
        else localStorage.removeItem(STORE);
    } catch { /* sem armazenamento */ }
}

export function initAstroDrag({ wrap, figure, onDragStart, onDrop, onReset }) {

    // Posição guardada como fração do espaço livre (0 a 1), para sobreviver a rotações e mudanças de tamanho.
    let pos = read();
    let drag = null;
    let swallowClick = false;
    let swallowTimer = 0;

    /* ----- medidas ----- */

    function limits() {
        const w = wrap.offsetWidth;
        const h = figure.offsetHeight || wrap.offsetHeight;
        return {
            w, h,
            minX: EDGE,
            minY: EDGE,
            maxX: Math.max(EDGE, innerWidth - w - EDGE),
            maxY: Math.max(EDGE, innerHeight - h - EDGE)
        };
    }

    /* ----- colocar ----- */

    function setPixels(x, y) {
        wrap.style.left = `${Math.round(x)}px`;
        wrap.style.top = `${Math.round(y)}px`;
        wrap.style.right = "auto";
        wrap.style.bottom = "auto";
        wrap.classList.add("moved");
    }

    function clearPixels() {
        wrap.style.left = wrap.style.top = wrap.style.right = wrap.style.bottom = "";
        wrap.classList.remove("moved");
    }

    /* Coloca em (x, y), dentro do ecrã, e guarda a fração correspondente. */
    function place(x, y) {
        const L = limits();
        const cx = clamp(x, L.minX, L.maxX);
        const cy = clamp(y, L.minY, L.maxY);
        setPixels(cx, cy);
        pos = {
            fx: L.maxX > L.minX ? (cx - L.minX) / (L.maxX - L.minX) : 0,
            fy: L.maxY > L.minY ? (cy - L.minY) / (L.maxY - L.minY) : 0
        };
    }

    /* Volta a aplicar a posição guardada (depois de mudar o tamanho do ecrã). */
    function restore() {
        if (!pos) { clearPixels(); return; }
        const L = limits();
        setPixels(L.minX + pos.fx * (L.maxX - L.minX), L.minY + pos.fy * (L.maxY - L.minY));
    }

    /* ----- balão de fala: vai para o lado com mais espaço ----- */

    function updateBubble() {
        const r = wrap.getBoundingClientRect();
        const left = r.left - 12 - EDGE;
        const right = innerWidth - r.right - 12 - EDGE;
        const side = right > left ? "r" : "l";
        const room = Math.max(side === "r" ? right : left, 0);

        wrap.dataset.bx = side;
        wrap.dataset.by = r.top + r.height / 2 < innerHeight * .45 ? "d" : "u";
        wrap.style.setProperty("--bubble-max", `${Math.round(clamp(room, 120, 250))}px`);
    }

    function save() { write(pos); }

    function reset() {
        pos = null;
        write(null);
        clearPixels();
        updateBubble();
        onReset?.();
    }

    function refresh() {
        restore();
        updateBubble();
    }

    /* ----- rato e dedo ----- */

    figure.addEventListener("pointerdown", e => {
        if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
        const r = wrap.getBoundingClientRect();
        drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, moved: false };
        try { figure.setPointerCapture(e.pointerId); } catch { /* ignora */ }
    });

    figure.addEventListener("pointermove", e => {
        if (!drag || e.pointerId !== drag.id) return;

        if (!drag.moved) {
            if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < THRESHOLD) return;
            drag.moved = true;
            wrap.classList.add("dragging");
            onDragStart?.();
        }

        place(e.clientX - drag.ox, e.clientY - drag.oy);
        updateBubble();
        e.preventDefault();
    });

    function finish(e, cancelled) {
        if (!drag || e.pointerId !== drag.id) return;
        const moved = drag.moved;
        drag = null;
        wrap.classList.remove("dragging");
        try { figure.releasePointerCapture(e.pointerId); } catch { /* ignora */ }

        if (!moved) return;

        save();
        updateBubble();

        // Depois de arrastar o navegador ainda dispara um "clique": engole-o para a NOVA não reagir como se a tivessem tocado.
        if (!cancelled) {
            swallowClick = true;
            clearTimeout(swallowTimer);
            swallowTimer = setTimeout(() => { swallowClick = false; }, 400);
        }

        onDrop?.();
    }

    figure.addEventListener("pointerup", e => finish(e, false));
    figure.addEventListener("pointercancel", e => finish(e, true));

    wrap.addEventListener("click", e => {
        if (!swallowClick) return;
        swallowClick = false;
        e.stopPropagation();
        e.preventDefault();
    }, true);

    /* ----- teclado ----- */

    figure.addEventListener("keydown", e => {
        const step = e.shiftKey ? 56 : 18;
        const move = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];

        if (move) {
            e.preventDefault();
            const r = wrap.getBoundingClientRect();
            place(r.left + move[0], r.top + move[1]);
            save();
            updateBubble();
        } else if (e.key === "Home") {
            e.preventDefault();
            reset();
        }
    });

    /* ----- repor o sítio original ----- */

    figure.addEventListener("dblclick", reset);

    /* ----- ecrã a mudar de tamanho / rodar ----- */

    addEventListener("resize", refresh);
    addEventListener("orientationchange", () => setTimeout(refresh, 200));
    addEventListener("load", refresh);

    refresh();

    return { reset, refresh, isMoved: () => Boolean(pos) };
}
