class Calculator {
  constructor(selector) {
    this.holder = document.querySelector(selector);
    this.screen = null;
    this.numbers = [];
    this.operations = [];
    this.flagResult = false;
    this.charsToCheck = ["/", "*", "-", "+"];
    this.expression = /^\d$/;
  }

  init() {
    if (!this.holder) return console.log("There is no such element!");
    this.findElements();
    this.handleEvents();
    this.handleNumberClick();
    this.handleSubmit();
  }

  findElements() {
    this.screen = this.holder.querySelector(".screen");
    this.numbers = this.holder.querySelectorAll(".number");
    this.operations = this.holder.querySelectorAll(".operation");
  }

  handleSubmit() {
    this.holder.addEventListener("submit", (e) => {
      e.preventDefault();

      this.checkLastSymbol();
      this.calculate();
    });
  }

  handleNumberClick() {
    this.numbers.forEach((el) => {
      el.addEventListener("click", (e) => {
        if (this.screen.value === "0" || this.flagResult) {
          this.screen.value = "";
          this.flagResult = false;
        }

        this.screen.value += e.target.value;
      });
    });
  }

  handleEvents() {
    document.addEventListener("keydown", (e) => {
      const key = e.key;

      if (this.expression.test(key)) {
        if (this.screen.value === "0" || this.flagResult) {
          this.screen.value = "";
          this.flagResult = false;
        }
        this.screen.value += key;
      }

      if (this.charsToCheck.includes(key)) {
        this.handleOperator(key);
      }

      if (key === "Enter") {
        e.preventDefault();
        this.checkLastSymbol();
        this.calculate();
      }

      this.handlePressedKey(key);
    });

    this.operations.forEach((el) => {
      el.addEventListener("click", (e) => {
        switch (e.target.name) {
          case "percent":
            this.screen.value = this.percent();
            break;
          case "comma":
            if (!this.checkComma()) {
              this.addComma();
            }
            break;
          case "deleteLast":
            this.deleteLastSymbol();
            break;
        }

        this.handleOperator(e.target.value);
      });
    });
  }

  handlePressedKey(value) {
    switch (value) {
      case ".":
        if (!this.checkComma()) {
          this.addComma();
        }
        break;
      case "Backspace":
        this.deleteLastSymbol();
        break;
      case "Escape":
      case "Delete":
        this.resetScreen();
        break;
      default:
        return;
    }
  }

  handleOperator(value) {
    if (!this.charsToCheck.includes(value)) return;
    if (!+this.screen.value) {
      this.screen.value = "0";
    }
    this.flagResult = false;
    this.checkLastSymbol();
    this.screen.value += value;
  }

  calculate() {
    this.screen.value = !this.screen.value
      ? 0
      : new Function(`return ${this.screen.value}`)();
    this.flagResult = true;
  }

  percent() {
    this.calculate();
    return Number(this.screen.value) / 100;
  }

  checkComma() {
    const numArr = this.screen.value.split(/[+\-*/]/);
    const lastNum = numArr.at(-1);
    return lastNum.includes(".");
  }

  addComma() {
    this.screen.value += ".";
  }

  checkLastSymbol() {
    const symbol = this.screen.value.at(-1);
    const hasChar = this.charsToCheck.includes(symbol);
    if (hasChar) {
      this.screen.value = this.screen.value.slice(0, -1);
    }
  }

  deleteLastSymbol() {
    this.screen.value = this.screen.value.slice(0, -1);

    if (!this.screen.value.length) {
      this.resetScreen();
    }
  }

  resetScreen() {
    this.screen.value = 0;
  }
}

const calculator = new Calculator(".calculator");

document.addEventListener("DOMContentLoaded", () => {
  calculator.init();
});
