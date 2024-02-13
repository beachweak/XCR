function getState(widget) {
  return {
      get output() {
          return widget.querySelector('.output');
      },
      get operation() {
          return widget.dataset.operation || '';
      },
      set operation(value) {
          widget.dataset.operation = value;
      },
      get num1() {
          return widget.dataset.num1 || '';
      },
      set num1(value) {
          widget.dataset.num1 = value;
      },
      get num2() {
          return widget.dataset.num2 || '';
      },
      set num2(value) {
          widget.dataset.num2 = value;
      },
      get equalsPressed() {
          return widget.dataset.equalsPressed === 'true';
      },
      set equalsPressed(value) {
          widget.dataset.equalsPressed = value;
      }
  };
}

function clickNumber(number, element) {
  const widget = element.closest('.rounded-square');
  const state = getState(widget);

  if(state.equalsPressed) {
      state.operation = ''; 
      state.num1 = ''; 
      state.num2 = '';
      state.equalsPressed = false;
  }

  if (state.operation === '') {
      state.num1 += number;
      state.output.value = state.num1;
  } else {
      state.num2 += number;
      state.output.value = state.num2;
  }
}

function clickOperation(oper, element) {
  const widget = element.closest('.rounded-square');
  const state = getState(widget);

  state.equalsPressed = false;
  state.operation = oper;
}

function calculate(element) {
  const widget = element.closest('.rounded-square');
  const state = getState(widget);

  if (state.equalsPressed) return;

  let result;
  const num1 = parseInt(state.num1);
  const num2 = parseInt(state.num2);

  switch (state.operation) {
      case '+':
          result = num1 + num2;
          break;
      case '-':
          result = num1 - num2;
          break;
      case '*':
          result = num1 * num2;
          break;
      case '/':
          result = num1 / num2;
          break;
      default:
          return;
  }

  if (!isFinite(result)) {
      state.output.value = '0';
      state.num1 = '0';
  } else {
      state.output.value = result;
      state.num1 = '' + result;
  }
  state.num2 = '';
  state.equalsPressed = true;
}

function clearCalculator(element) {
  const widget = element.closest('.rounded-square');
  const state = getState(widget);

  state.equalsPressed = false;
  state.operation = '';
  state.num1 = '';
  state.num2 = '';
  state.output.value = '';
}