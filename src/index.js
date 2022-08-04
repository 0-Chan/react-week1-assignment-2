/* eslint-disable react/react-in-jsx-scope, react/jsx-filename-extension, no-unused-vars */

/* @jsx createElement */

function createElement(tagName, props, ...children) {
  const element = document.createElement(tagName);

  Object.entries(props || {}).forEach(([key, value]) => {
    element[key.toLowerCase()] = value;
  });

  children.flat().forEach((child) => {
    if (child instanceof Node) {
      element.appendChild(child);
      return;
    }
    element.appendChild(document.createTextNode(child));
  });
  
  return element;
}

function render({
  count = 0, previousNumber = 0, previousSymbol = '',
}) {
  function calculate(number1, number2, symbol) {
    const symbols = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => a / b,
    };
    return symbols[symbol]?.(number1, number2) ?? 'Math symbol is not vaild.';
  }

  function handleClickDigit(digit) {
    // If input number exceeds 9007199254740991, reset the calculator.
    if (count > Number.MAX_SAFE_INTEGER) {
      render({
        count: 0, previousNumber: 0, previousSymbol: '',
      });
      return;
    }

    if (previousNumber !== count) {
      render({
        count: Number(count.toString() + digit.toString()), previousNumber, previousSymbol,
      });
      return;
    }

    render({
      count: digit, previousNumber, previousSymbol,
    });
  }

  function handleClickSymbol(symbol) {
    if (symbol === '=') {
      count = calculate(previousNumber, count, previousSymbol);
      previousNumber = calculate(previousNumber, count, previousSymbol);
      render({
        count, previousNumber, previousSymbol,
      });
      return;
    }

    if (previousSymbol) {
      count = calculate(previousNumber, count, previousSymbol);
      previousNumber = calculate(previousNumber, count, previousSymbol);
      render({
        count, previousNumber: count, previousSymbol: symbol,
      });
    }

    previousSymbol = symbol;
    previousNumber = count;
    count = 0;
  }

  const element = (
    <div>
      <p>간단 계산기</p>

      <p>
        {count}
      </p>

      <p>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((i) => (
          <button type="button" onClick={() => handleClickDigit(i)}>
            {i}
          </button>
        ))}
      </p>
      <p>
        {['+', '-', '*', '/', '='].map((i) => (
          <button type="button" onClick={() => handleClickSymbol(i)}>
            {i}
          </button>
        ))}
      </p>
    </div>
  );

  document.getElementById('app').textContent = '';
  document.getElementById('app').appendChild(element);
}

render({
  count: 0, previousNumber: 0, previousSymbol: '',
});
