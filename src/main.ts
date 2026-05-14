import "./style.css";

class Calculator {
  private readonly holder: HTMLFormElement | null;
  private screen!: HTMLInputElement;
  private numbers: HTMLButtonElement[];
  private operations: HTMLButtonElement[];
  private flagResult: boolean;
  private readonly charsToCheck: string[];
  private readonly expression: RegExp;

  constructor(selector: string) {
    this.holder = document.querySelector(selector);
    this.numbers = [];
    this.operations = [];
    this.flagResult = false;
    this.charsToCheck = ["/", "*", "-", "+"];
    this.expression = /^\d$/;
  }

  public init(): void {
    if (!this.holder) throw new Error("There is no such element!");
    this.findElements();
    this.handleEvents();
    this.handleNumberClick();
    this.handleSubmit();
  }

  private findElements(): void {
    if (!this.holder) return;
    this.screen = this.holder.querySelector<HTMLInputElement>(".screen")!;
    this.numbers = Array.from(
      this.holder.querySelectorAll<HTMLButtonElement>(".number"),
    );
    this.operations = Array.from(
      this.holder.querySelectorAll<HTMLButtonElement>(".operation"),
    );
  }

  private handleSubmit(): void {
    if (!this.holder) return;

    this.holder.addEventListener("submit", (e) => {
      e.preventDefault();

      this.checkLastSymbol();
      this.calculate();
    });
  }

  private handleNumberClick(): void {
    this.numbers.forEach((button: HTMLButtonElement) => {
      button.addEventListener("click", (e) => {
        if (this.screen.value === "0" || this.flagResult) {
          this.screen.value = "";
          this.flagResult = false;
        }

        const target = e.currentTarget as HTMLButtonElement;

        this.screen.value += target.value;
      });
    });
  }

  private handleEvents(): void {
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

    this.operations.forEach((button: HTMLButtonElement) => {
      button.addEventListener("click", (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        switch (target.name) {
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

        this.handleOperator(target.value);
      });
    });
  }

  private handlePressedKey(value: string): void {
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

  private handleOperator(value: string): void {
    if (!this.charsToCheck.includes(value)) return;

    if (!+this.screen.value) {
      this.screen.value = "0";
    }
    this.flagResult = false;
    this.checkLastSymbol();
    this.screen.value += value;
  }

  private calculate(): void {
    this.screen.value = !this.screen.value
      ? "0"
      : String(new Function(`return ${this.screen.value}`)());
    this.flagResult = true;
  }

  private percent(): string {
    this.calculate();

    return (Number(this.screen.value) / 100).toString();
  }

  private checkComma(): boolean {
    const numArr = this.screen.value.split(/[+\-*/]/);
    const lastNum = numArr.at(-1);

    if (!lastNum) return false;
    return lastNum.includes(".");
  }

  private addComma(): void {
    this.screen.value += ".";
  }

  private checkLastSymbol(): void {
    const symbol = this.screen.value.at(-1);

    if (!symbol) return;
    const hasChar = this.charsToCheck.includes(symbol);

    if (hasChar) {
      this.screen.value = this.screen.value.slice(0, -1);
    }
  }

  private deleteLastSymbol(): void {
    this.screen.value = this.screen.value.slice(0, -1);

    if (!this.screen.value.length) {
      this.resetScreen();
    }
  }

  private resetScreen(): void {
    this.screen.value = "0";
  }
}

const calculator = new Calculator(".calculator");

document.addEventListener("DOMContentLoaded", () => {
  calculator.init();
});
