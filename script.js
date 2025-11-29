// -----------------------------------------------------------------------
// Terminal JS avançado – suporte a histórico, autocomplete e mobile
// Funciona 100% com o HTML e CSS que você enviou.
// -----------------------------------------------------------------------

const input = document.getElementById("cmdline");
const historyBox = document.getElementById("history");

// -----------------------------------------------------------------------
// 1. CONFIGURAÇÕES GERAIS
// -----------------------------------------------------------------------

// Comandos disponíveis para autocomplete
const COMMANDS = ["help", "clear", "time", "sum", "sub", "mult", "div"];

// Histórico em memória (e persistente no navegador)
let history = JSON.parse(localStorage.getItem("terminal_history") || "[]");
let historyIndex = history.length;

// Foco sempre no input
function focusInput() {
    input.focus();
}

// Focar automaticamente ao abrir e ao tocar na tela (mobile-friendly)
window.onload = focusInput;
document.addEventListener("click", focusInput);

// -----------------------------------------------------------------------
// 2. FUNÇÕES UTILITÁRIAS
// -----------------------------------------------------------------------

function print(text, cls = "") {
    const div = document.createElement("div");
    div.className = "line " + cls;
    div.textContent = text;
    historyBox.appendChild(div);
    historyBox.scrollTop = historyBox.scrollHeight;
}

function saveHistory() {
    localStorage.setItem("terminal_history", JSON.stringify(history));
}

// -----------------------------------------------------------------------
// 3. IMPLEMENTAÇÃO DOS COMANDOS
// -----------------------------------------------------------------------

function cmd_help() {
    print("Comandos disponíveis:");
    print("  help       → lista comandos");
    print("  clear      → limpa terminal");
    print("  time       → mostra horário atual");
    print("  sum a b    → soma dois números");
    print("  sub a b    → subtrai dois números");
    print("  mult a b   → multiplica dois números");
    print("  div a b   → divide dois números");
}

function cmd_clear() {
    historyBox.innerHTML = "";
}

function cmd_time() {
    const now = new Date();
    const data = now.toLocaleDateString();
    const hora = now.toLocaleTimeString();

    print(`Data: ${data}\nHora atual: ${hora}`);
}

function cmd_sum(args) {
    if (args.length < 2) return print("Uso: soma 5 3", "error");
    const a = Number(args[0]);
    const b = Number(args[1]);
    if (isNaN(a) || isNaN(b)) return print("Use números válidos.", "error");
    print(`${a} + ${b} = ${a + b}`);
}

function cmd_sub(args) {
    if (args.length < 2) return print("Uso: sub 10 2", "error");
    const a = Number(args[0]);
    const b = Number(args[1]);
    if (isNaN(a) || isNaN(b)) return print("Use números válidos.", "error");
    print(`${a} - ${b} = ${a - b}`);
}

function cmd_mult(args) {
    if (args.length < 2) return print("Uso: mult 10 2", "error");
    const a = Number(args[0]);
    const b = Number(args[1]);
    if (isNaN(a) || isNaN(b)) return print("Use números válidos.", "error");
    print(`${a} * ${b} = ${a * b}`);
}

function cmd_div(args) {
    if (args.length < 2) return print("Uso: div 10 2", "error");
    const a = Number(args[0]);
    const b = Number(args[1]);
    if (isNaN(a) || isNaN(b)) return print("Use números válidos.", "error");
    print(`${a} / ${b} = ${a / b}`);
}
// -----------------------------------------------------------------------
// 4. INTERPRETADOR
// -----------------------------------------------------------------------

function execute(raw) {
    const parts = raw.trim().split(" ");
    const cmd = parts.shift().toLowerCase();
    const args = parts;

    if (!cmd) return;

    print("Paicheco: " + raw, "meta");

    switch (cmd) {
        case "help": cmd_help(); break;
        case "clear": cmd_clear(); break;
        case "time": cmd_time(); break;
        case "sum": cmd_sum(args); break;
        case "sub":  cmd_sub(args); break;
        case "mult":  cmd_mult(args); break;
        case "div":  cmd_div(args); break;
        default:
            print("Comando não encontrado. Digite 'help'.", "error");
    }
}

// -----------------------------------------------------------------------
// 5. AUTOCOMPLETE COM TAB
// -----------------------------------------------------------------------

function autocomplete() {
    const value = input.value.trim();

    if (!value) return;

    const matches = COMMANDS.filter(c => c.startsWith(value));

    if (matches.length === 1) {
        input.value = matches[0];
    } 
    else if (matches.length > 1) {
        print("Possíveis comandos:");
        matches.forEach(m => print("  " + m));
    }
}

// -----------------------------------------------------------------------
// 6. HISTÓRICO COM SETAS ↑ ↓
// -----------------------------------------------------------------------

function handleHistoryNavigation(key) {
    if (key === "ArrowUp") {
        if (historyIndex > 0) {
            historyIndex--;
            input.value = history[historyIndex] || "";
        }
    }

    if (key === "ArrowDown") {
        if (historyIndex < history.length) {
            historyIndex++;
            input.value = history[historyIndex] || "";
        }
    }
}

// -----------------------------------------------------------------------
// 7. CAPTURA DE TECLAS
// -----------------------------------------------------------------------

input.addEventListener("keydown", (e) => {

    // TAB → autocomplete
    if (e.key === "Tab") {
        e.preventDefault();
        autocomplete();
        return;
    }

    // Navegação no histórico
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        handleHistoryNavigation(e.key);
        return;
    }

    // ENTER → executar comando
    if (e.key === "Enter") {
        const text = input.value.trim();
        if (text !== "") {
            history.push(text);
            saveHistory();
            historyIndex = history.length;
            execute(text);
        }
        input.value = "";
        return;
    }
});

// Botão de enviar (mobile friendly)
document.getElementById("sendbtn").addEventListener("click", () => {
    const text = input.value.trim();
    if (text !== "") {
        history.push(text);
        saveHistory();
        historyIndex = history.length;
        execute(text);
    }
    input.value = "";
    focusInput();
});
