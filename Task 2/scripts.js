const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '0';
let operator = '';
let firstOperand = null;
let waitingForSecondOperand = false;

buttons.forEach(button => {
    button.addEventListener('click', function() {
        const value = this.dataset.value;

        if (value === 'C') {
            clear();
            updateDisplay();
            return;
        }

        if (value === '=') {
            calculate();
            updateDisplay();
            return;
        }

        if (isOperator(value)) {
            handleOperator(value);
            return;
        }

        if (value === '.') {
            handleDecimal();
            return;
        }

        handleNumber(value);
        updateDisplay();
    });
});

function updateDisplay() {
    display.innerText = currentInput;
}

function clear() {
    currentInput = '0';
    operator = '';
    firstOperand = null;
    waitingForSecondOperand = false;
}

function calculate() {
    if (firstOperand === null || operator === '' || waitingForSecondOperand) {
        return;
    }

    const secondOperand = parseFloat(currentInput);

    switch (operator) {
        case '+':
            currentInput = (firstOperand + secondOperand).toString();
            break;
        case '-':
            currentInput = (firstOperand - secondOperand).toString();
            break;
        case '*':
            currentInput = (firstOperand * secondOperand).toString();
            break;
        case '/':
            currentInput = (firstOperand / secondOperand).toString();
            break;
    }

    operator = '';
    firstOperand = null;
    waitingForSecondOperand = false;
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = operate(firstOperand, operator, inputValue);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        firstOperand = parseFloat(currentInput);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
}

function operate(first, operator, second) {
    switch (operator) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            return first / second;
        default:
            return second;
    }
}

function handleNumber(value) {
    if (waitingForSecondOperand) {
        currentInput = value;
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? value : currentInput + value;
    }
}

function handleDecimal() {
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}
