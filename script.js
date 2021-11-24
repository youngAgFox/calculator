// inject buttons
const OP_PADDING = 1;
const DELETE = 'del';
const SIGN = '+/-';
const CLEAR = 'clr';
const DIVISION = '/';
const MULTIPLICATION = 'x';
const SUBTRACTION = '-';
const ADDITION = '+';
const EQUALS = '=';
const DECIMAL = '.';
const buttonTypes = [CLEAR, DELETE, SIGN, DIVISION, 7, 8, 9, MULTIPLICATION, 4, 5, 6, SUBTRACTION, 1, 2, 3, ADDITION, 0, DECIMAL, EQUALS];
const buttonContainer = document.querySelector("#buttons");
const display = document.querySelector("#display");
let clearOnNextClick = false;
let decimalButton;
display.innerText = "";
buttonTypes.forEach(sym => {
    const button = document.createElement('button');
    button.textContent = sym;
    button.classList.add("button");
    if (isNaN(sym) && sym != DECIMAL) button.classList.add("function-button")
    if (sym == 0) button.id = "zero";
    if (sym == DECIMAL) decimalButton = button;
    button.addEventListener("click", buttonClick);
    buttonContainer.appendChild(button);
});

function buttonClick() {
    if (clearOnNextClick) {
        display.textContent = '';
        clearOnNextClick = false;
    }
    const sym = this.textContent;
    const pad = ' '.repeat(OP_PADDING);
    let text = isNaN(sym) && sym != DECIMAL ? pad + sym + pad : sym;
    const inner = display.innerText;
    switch (sym) {
        case CLEAR:
            display.innerText = "";
            break;
        case DELETE:
            display.innerText = deleteLast(display.innerText);
            break;
        case SIGN:
            const sub = inner.charAt(0) == SUBTRACTION;
            display.innerText = sub ? inner.slice(1, inner.length) : SUBTRACTION + inner;
            break;
        case EQUALS:
            display.textContent = evaluate(inner);
            break;
        default:
            display.textContent += text;
            break;
    }
    decimalButton.disabled = !checkDecimal(display.textContent);
}

function checkDecimal(text) {
    for (let i = text.length - 1; i >= 0; i--) {
        c = text.charAt(i);
        if (isNaN(c)) {
            // symbol not a number
            return (c != DECIMAL)
        }
    }
    return true;
}

function deleteLast(text) {
    text = text.trimEnd();
    text = text.slice(0, text.length - 1);
    return text.trimEnd();
}

function evaluate(eq) {
    eq = eq.replaceAll(" ", "");
    // order of ops can be achieved by delimiting in opposite order perhaps later
    let a = "";
    let b = "";
    let op = "";
    for (let i = 0; i < eq.length; i++) {
        c = eq.charAt(i);
        if (isNaN(c) && c != DECIMAL) {
            if (a.length < 1) {
                if (c != SUBTRACTION)
                    return displayError();
                else a += '-';
            } else if (b.length < 1) {
                op = c;
            } else {
                a  = operate(op, a, b);
                op = c;
                b = '';
            }
        } else if (op.length < 1) {
            a += c;
        } else {
            b += c;
        }
    }
    const result = operate(op, a, b);
    return isNaN(result) ? displayError() : result;
}

function displayError() {
    clearOnNextClick = true;
    return "ERROR";
}

function operate(op, as, bs) {
    const a = parseFloat(as), b = parseFloat(bs);
    switch (op) {
        case ADDITION:
            return a + b;
        case SUBTRACTION:
            return a - b;
        case MULTIPLICATION:
            return a * b;
        case DIVISION:
            return b != 0 ? a / b : "ERROR";
    }
}