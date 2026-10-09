/* =====================================================
   PITRUX — LABORATÓRIO (janela com 5 abas)
   Peso & Idade · Sobreviver · Comparar · Quiz · Missões
   Os dados estão em extras.js
===================================================== */

import { LAB, BODIES, WEIGHT_ORDER, COMPARE_ORDER, SURVIVAL, QUIZ, MISSIONS } from "./extras.js";


/* ---------- utilitários ---------- */

const nf = (v, max = 1) => new Intl.NumberFormat("pt-PT", { maximumFractionDigits: max, useGrouping: "always" }).format(v);

function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
}

const save = (k, v) => { try { localStorage.setItem(k, String(v)); } catch { /* sem armazenamento */ } };
const load = k => { try { return localStorage.getItem(k); } catch { return null; } };

function shuffle(list) {
    const r = [...list];
    for (let i = r.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
}

const pick = list => list[Math.floor(Math.random() * list.length)];

function num(text, min, max) {
    const v = parseFloat(String(text).replace(",", "."));
    return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : null;
}

function dot(name) {
    const d = h("i", "lab-dot");
    d.style.setProperty("--c", BODIES[name]?.color || "#fff");
    return d;
}

function barEl(percent, color) {
    const bar = h("div", "lab-bar");
    const fill = document.createElement("i");
    fill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    if (color) fill.style.setProperty("--c", color);
    bar.appendChild(fill);
    return bar;
}


/* ---------- arranque ---------- */

export function initLab(api) {

    const btn = document.getElementById("labBtn");
    const disabled = { open() {}, close() {}, isOpen: () => false };

    if (!LAB.enabled || !btn) return disabled;

    btn.hidden = false;
    btn.textContent = LAB.buttonLabel || "LABORATÓRIO";

    let opened = false;
    let currentTab = "peso";
    let quizKeys = null;           // botões de resposta atuais (teclas 1–4)

    /* ----- estrutura da janela ----- */

    const overlay = h("section", "lab-overlay");
    overlay.id = "labOverlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "labTitle");

    const card = h("div", "lab-card hud");

    const header = h("div", "lab-header");
    const headerText = h("div");
    const title = h("h2", null, "Experiências Espaciais");
    title.id = "labTitle";
    headerText.append(h("span", "small-title", "LABORATÓRIO PITRUX"), title);

    const closeBtn = h("button", "close-button", "×");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Fechar");
    header.append(headerText, closeBtn);

    const tabsBar = h("nav", "lab-tabs");
    tabsBar.setAttribute("role", "tablist");
    tabsBar.setAttribute("aria-label", "Experiências");

    const panel = h("div", "lab-panel");
    panel.setAttribute("role", "tabpanel");

    card.append(header, tabsBar, panel);
    overlay.appendChild(card);
    document.getElementById("app").appendChild(overlay);


    /* ===================================================
       ABA 1 — PESO & IDADE
    =================================================== */

    function field(form, id, label, value) {
        const wrap = h("label", "lab-field");
        wrap.setAttribute("for", id);
        wrap.appendChild(h("span", null, label));
        const input = document.createElement("input");
        input.id = id;
        input.type = "text";
        input.inputMode = "decimal";
        input.autocomplete = "off";
        input.maxLength = 6;
        input.value = value;
        wrap.appendChild(input);
        form.appendChild(wrap);
        return input;
    }

    function renderWeight() {
        panel.append(h("p", "lab-intro",
            "A tua massa não muda de um astro para outro. O que muda é a gravidade, e por isso o valor que a balança marcaria. Escreve o teu peso (e a tua idade, se quiseres) e vê."));

        const form = h("div", "lab-form");
        const weightInput = field(form, "labWeight", "O TEU PESO (KG)", load("pitrux.weight") || "70");
        const ageInput = field(form, "labAge", "A TUA IDADE (ANOS)", load("pitrux.age") || "");
        const grid = h("div", "lab-grid");

        panel.append(form, grid, h("p", "lab-note",
            "Nos gigantes, a gravidade é medida à pressão de 1 bar, porque não têm superfície sólida. A idade usa a duração do ano de cada planeta."));

        const update = () => {
            const w = num(weightInput.value, 1, 500);
            const a = num(ageInput.value, 0, 120);
            if (w !== null) save("pitrux.weight", w);
            if (a !== null) save("pitrux.age", a);

            grid.replaceChildren();

            if (w === null) {
                grid.appendChild(h("p", "lab-empty", "Escreve um peso válido (entre 1 e 500 kg)."));
                return;
            }

            for (const name of WEIGHT_ORDER) {
                const b = BODIES[name];
                const item = h("article", "lab-body");

                const top = h("div", "lab-body-top");
                top.append(dot(name), h("strong", null, name));

                item.append(
                    top,
                    h("div", "lab-big", `${nf(w * b.g, 1)} kg`),
                    barEl((b.g / 2.6) * 100, b.color),
                    h("div", "lab-meta", `Gravidade: ${nf(b.g, 2)}× a da Terra${b.g > 2.6 ? " (fora da escala)" : ""}`)
                );

                if (a !== null && b.yearDays) {
                    item.appendChild(h("div", "lab-meta", `Idade: ${nf((a * 365.25) / b.yearDays, 2)} anos`));
                }

                grid.appendChild(item);
            }
        };

        weightInput.addEventListener("input", update);
        ageInput.addEventListener("input", update);
        update();
    }


    /* ===================================================
       ABA 2 — SOBREVIVER
    =================================================== */

    function renderSurvive() {
        panel.append(h("p", "lab-intro",
            "E se aterrasses, sem fato espacial, em cada astro? Quanto tempo aguentarias? São estimativas simplificadas, só para aprender e divertir."));

        const list = h("div", "lab-list");

        for (const name of WEIGHT_ORDER) {
            const s = SURVIVAL[name];
            if (!s) continue;

            const pct = s.seconds === Infinity ? 100 : Math.max(3, (Math.log10(s.seconds + 1) / Math.log10(3601)) * 100);

            const item = h("article", "lab-survive");
            const top = h("div", "lab-survive-top");
            const left = h("div", "lab-body-top");
            left.append(dot(name), h("strong", null, name));
            top.append(left, h("span", "lab-time", s.label));

            item.append(
                top,
                barEl(pct, BODIES[name]?.color),
                h("p", "lab-cause", s.cause),
                h("p", "lab-meta", s.note)
            );
            list.appendChild(item);
        }

        panel.append(list, h("p", "lab-note", "A barra usa uma escala logarítmica: de poucos segundos até uma vida inteira."));
    }


    /* ===================================================
       ABA 3 — COMPARAR
    =================================================== */

    const kelvin = b => b.tempC + 273.15;

    const COMPARE_ROWS = [
        { label: "Tipo",               text: b => b.type },
        { label: "Diâmetro",           fmt: b => `${nf(b.diameterKm, 0)} km`, bar: b => b.diameterKm },
        { label: "Massa",              fmt: b => `${nf(b.massEarth, b.massEarth < 1 ? 3 : 1)}× a da Terra`, bar: b => b.massEarth },
        { label: "Gravidade",          fmt: b => `${nf(b.g, 2)}× a da Terra`, bar: b => b.g },
        { label: "Distância ao Sol",   fmt: b => b.distMkm === 0 ? "—" : `${nf(b.distMkm, 1)} milhões km`, bar: b => b.distMkm },
        { label: "Duração do ano",     fmt: b => b.yearDays == null ? "—" : (b.yearDays >= 730 ? `${nf(b.yearDays / 365.25, 1)} anos` : `${nf(b.yearDays, 0)} dias`), bar: b => b.yearDays },
        { label: "Duração do dia",     fmt: b => b.dayHours >= 48 ? `${nf(b.dayHours / 24, 1)} dias` : `${nf(b.dayHours, 1)} horas`, bar: b => b.dayHours },
        { label: "Temperatura média",  fmt: b => `${nf(b.tempC, 0)} °C`, bar: kelvin },
        { label: "Luas",               fmt: b => b.moonsLabel, bar: b => b.moons }
    ];

    function makeSelect(value) {
        const select = document.createElement("select");
        for (const name of COMPARE_ORDER) {
            const o = document.createElement("option");
            o.value = name;
            o.textContent = name;
            select.appendChild(o);
        }
        select.value = value;
        return select;
    }

    function renderCompare() {
        panel.append(h("p", "lab-intro", "Escolhe dois astros e compara-os lado a lado."));

        const saved = [load("pitrux.cmpA"), load("pitrux.cmpB")];
        const selA = makeSelect(COMPARE_ORDER.includes(saved[0]) ? saved[0] : "Terra");
        const selB = makeSelect(COMPARE_ORDER.includes(saved[1]) ? saved[1] : "Marte");
        selA.setAttribute("aria-label", "Primeiro astro");
        selB.setAttribute("aria-label", "Segundo astro");

        const swap = h("button", "lab-swap", "⇄");
        swap.type = "button";
        swap.setAttribute("aria-label", "Trocar astros");

        const pickBar = h("div", "lab-cmp-pick");
        pickBar.append(selA, swap, selB);

        const out = h("div", "lab-cmp");
        panel.append(pickBar, out);

        const draw = () => {
            const A = selA.value, B = selB.value;
            const a = BODIES[A], b = BODIES[B];
            save("pitrux.cmpA", A);
            save("pitrux.cmpB", B);
            out.replaceChildren();

            const heads = h("div", "lab-cmp-heads");
            for (const [name] of [[A], [B]]) {
                const head = h("div", "lab-cmp-head");
                head.append(dot(name), h("strong", null, name));
                heads.appendChild(head);
            }
            out.appendChild(heads);

            for (const row of COMPARE_ROWS) {
                const r = h("div", "lab-cmp-row");
                r.appendChild(h("span", "lab-cmp-label", row.label));

                const va = row.text ? row.text(a) : row.fmt(a);
                const vb = row.text ? row.text(b) : row.fmt(b);

                const cellA = h("div", "lab-cmp-cell");
                const cellB = h("div", "lab-cmp-cell");
                cellA.appendChild(h("b", null, va));
                cellB.appendChild(h("b", null, vb));

                if (row.bar) {
                    const na = row.bar(a), nb = row.bar(b);
                    const max = Math.max(na ?? 0, nb ?? 0);
                    if (max > 0) {
                        cellA.appendChild(barEl(((na ?? 0) / max) * 100, a.color));
                        cellB.appendChild(barEl(((nb ?? 0) / max) * 100, b.color));
                    }
                }

                r.append(cellA, cellB);
                out.appendChild(r);
            }

            let summary;
            if (A === B) {
                summary = "Escolhe dois astros diferentes para ver as diferenças.";
            } else {
                const bigger = a.diameterKm >= b.diameterKm ? A : B;
                const smaller = bigger === A ? B : A;
                const ratio = BODIES[bigger].diameterKm / BODIES[smaller].diameterKm;
                summary = `${bigger} é ${nf(ratio, 1)}× mais largo do que ${smaller}. Em volume, cabem cerca de ${nf(Math.pow(ratio, 3), 0)} corpos do tamanho de ${smaller} dentro de ${bigger}.`;
            }
            out.appendChild(h("p", "lab-summary", summary));
        };

        selA.addEventListener("change", draw);
        selB.addEventListener("change", draw);
        swap.addEventListener("click", () => {
            const t = selA.value;
            selA.value = selB.value;
            selB.value = t;
            draw();
        });
        draw();
    }


    /* ===================================================
       ABA 4 — QUIZ
    =================================================== */

    const PRAISE = ["Certo! Estás a ir muito bem!", "Boa! Sabes do que falas.", "Isso mesmo! Que cabeça de astrónomo.", "Acertaste em cheio!"];
    const OOPS = ["Quase! Fica a explicação.", "Não foi desta, mas aprende-se.", "Ups! Vê a resposta certa.", "Essa era difícil, tenta a próxima!"];

    function renderQuiz() {
        const total = Math.max(1, Math.min(Number(LAB.quizLength) || 10, QUIZ.length));
        let order = [], index = 0, score = 0;

        const stage = h("div", "lab-quiz");
        panel.appendChild(stage);

        const intro = () => {
            quizKeys = null;
            const best = Number(load("pitrux.quizBest")) || 0;
            stage.replaceChildren(
                h("p", "lab-intro", `${total} perguntas sobre o Sistema Solar, sorteadas ao acaso. Consegues acertar em todas?`),
                h("p", "lab-meta", best ? `O teu melhor resultado: ${best}/${total}` : "Ainda não jogaste. Boa sorte!")
            );
            const start = h("button", "main-button lab-start", "COMEÇAR O QUIZ");
            start.type = "button";
            start.addEventListener("click", begin);
            stage.appendChild(start);
        };

        const begin = () => {
            order = shuffle(QUIZ.map((_, i) => i)).slice(0, total);
            index = 0;
            score = 0;
            ask();
        };

        const ask = () => {
            const q = QUIZ[order[index]];
            const opts = shuffle(q.options.map((text, i) => ({ text, correct: i === q.answer })));
            let locked = false;

            const head = h("div", "lab-quiz-head");
            head.append(h("span", null, `PERGUNTA ${index + 1} / ${order.length}`), h("span", null, `PONTOS ${score}`));

            const progress = barEl((index / order.length) * 100, "#5ee7ff");
            const question = h("h3", "lab-question", q.q);
            const options = h("div", "lab-options");
            const feedback = h("div", "lab-feedback");
            feedback.setAttribute("aria-live", "polite");
            const next = h("button", "main-button lab-next", index + 1 >= order.length ? "VER RESULTADO" : "SEGUINTE →");
            next.type = "button";
            next.hidden = true;

            const buttons = opts.map((o, i) => {
                const b = h("button", "lab-option");
                b.type = "button";
                b.append(h("kbd", null, String(i + 1)), h("span", null, o.text));
                b.addEventListener("click", () => {
                    if (locked) return;
                    locked = true;

                    buttons.forEach((bt, k) => {
                        bt.disabled = true;
                        if (opts[k].correct) bt.classList.add("right");
                    });

                    if (o.correct) {
                        score++;
                        b.classList.add("right");
                        feedback.textContent = `✔ ${q.explain}`;
                        feedback.className = "lab-feedback good";
                        api.react?.("happy", pick(PRAISE), { force: true, ms: 3200 });
                    } else {
                        b.classList.add("wrong");
                        feedback.textContent = `✘ ${q.explain}`;
                        feedback.className = "lab-feedback bad";
                        api.react?.("wow", pick(OOPS), { force: true, ms: 3200 });
                    }

                    head.lastChild.textContent = `PONTOS ${score}`;
                    next.hidden = false;
                    next.focus({ preventScroll: true });
                });
                options.appendChild(b);
                return b;
            });

            quizKeys = buttons;

            next.addEventListener("click", () => {
                index++;
                if (index >= order.length) finish(); else ask();
            });

            stage.replaceChildren(head, progress, question, options, feedback, next);
        };

        const finish = () => {
            quizKeys = null;
            const best = Number(load("pitrux.quizBest")) || 0;
            const record = score > best;
            if (record) save("pitrux.quizBest", score);

            const ratio = score / order.length;
            let message, mood, line;
            if (ratio === 1)      { message = "Perfeito! És um verdadeiro explorador espacial!"; mood = "happy"; line = "Pontuação máxima! Estou impressionada!"; }
            else if (ratio >= .7) { message = "Muito bem! Sabes bastante sobre o Sistema Solar."; mood = "happy"; line = "Grande resultado, explorador!"; }
            else if (ratio >= .4) { message = "Nada mau! Com mais uma volta pelo sistema, chegas lá."; mood = "wave"; line = "Bom esforço! Vamos tentar outra vez?"; }
            else                  { message = "Ainda estás a aquecer motores. Explora os planetas e tenta de novo!"; mood = "wow"; line = "Explora mais e volta cá, eu espero!"; }

            api.react?.(mood, line, { force: true, ms: 4500 });

            const again = h("button", "main-button lab-start", "JOGAR OUTRA VEZ");
            again.type = "button";
            again.addEventListener("click", begin);

            stage.replaceChildren(
                h("div", "lab-score", `${score} / ${order.length}`),
                h("p", "lab-intro", message),
                h("p", "lab-meta", record ? "Novo recorde pessoal! 🏆" : `O teu melhor resultado: ${Math.max(best, score)}/${order.length}`),
                again
            );
            again.focus({ preventScroll: true });
        };

        intro();
    }


    /* ===================================================
       ABA 5 — LINHA DO TEMPO DE MISSÕES
    =================================================== */

    function renderMissions() {
        panel.append(h("p", "lab-intro", "As principais missões que nos mostraram o Sistema Solar, por ordem de data."));

        const list = h("ol", "lab-timeline");
        const sorted = [...MISSIONS].sort((a, b) => a.year - b.year);

        for (const m of sorted) {
            const li = h("li", "lab-mission");
            li.appendChild(h("div", "lab-year", String(m.year)));

            const body = h("div", "lab-mission-body");
            const top = h("div", "lab-mission-top");
            top.append(h("strong", null, m.name), h("span", "lab-chip", m.agency), h("span", "lab-chip alt", m.target));
            body.append(top, h("p", null, m.text));

            if (m.focus && api.goToPlanet) {
                const go = h("button", "lab-go", `VER ${String(m.focus).toUpperCase()} NO SISTEMA →`);
                go.type = "button";
                go.addEventListener("click", () => {
                    close();
                    api.goToPlanet(m.focus);
                });
                body.appendChild(go);
            }

            li.appendChild(body);
            list.appendChild(li);
        }

        panel.appendChild(list);
    }


    /* ===================================================
       ABAS
    =================================================== */

    const TABS = [
        { id: "peso",       label: "PESO & IDADE", render: renderWeight },
        { id: "sobreviver", label: "SOBREVIVER",   render: renderSurvive },
        { id: "comparar",   label: "COMPARAR",     render: renderCompare },
        { id: "quiz",       label: "QUIZ",         render: renderQuiz },
        { id: "missoes",    label: "MISSÕES",      render: renderMissions }
    ];

    const tabButtons = {};

    for (const tab of TABS) {
        const b = h("button", "lab-tab", tab.label);
        b.type = "button";
        b.setAttribute("role", "tab");
        b.addEventListener("click", () => { api.touch?.(); setTab(tab.id); });
        tabsBar.appendChild(b);
        tabButtons[tab.id] = b;
    }

    function setTab(id) {
        const tab = TABS.find(t => t.id === id) || TABS[0];
        currentTab = tab.id;
        quizKeys = null;

        for (const t of TABS) {
            const on = t.id === tab.id;
            tabButtons[t.id].classList.toggle("active", on);
            tabButtons[t.id].setAttribute("aria-selected", String(on));
        }

        panel.replaceChildren();
        panel.scrollTop = 0;
        tab.render();
    }


    /* ===================================================
       ABRIR / FECHAR
    =================================================== */

    function open(tabId) {
        if (opened) { if (tabId) setTab(tabId); return; }
        opened = true;
        overlay.hidden = false;
        setTab(tabId || currentTab);
        api.onOpenChange?.(true);
        closeBtn.focus({ preventScroll: true });
    }

    function close() {
        if (!opened) return;
        opened = false;
        quizKeys = null;
        overlay.hidden = true;
        api.onOpenChange?.(false);
        btn.focus({ preventScroll: true });
    }

    btn.addEventListener("click", () => open());
    closeBtn.addEventListener("click", close);

    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

    overlay.addEventListener("keydown", e => {
        if (!quizKeys || e.ctrlKey || e.metaKey || e.altKey) return;
        const n = Number(e.key);
        if (n >= 1 && n <= quizKeys.length && !quizKeys[n - 1].disabled) {
            e.preventDefault();
            quizKeys[n - 1].click();
        }
    });

    return { open, close, isOpen: () => opened };
}