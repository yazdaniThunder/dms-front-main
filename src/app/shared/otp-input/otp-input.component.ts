import { Component, ElementRef, Renderer2, ViewChild } from "@angular/core";

@Component({
  selector: "app-otp-input",
  templateUrl: "./otp-input.component.html",
  styleUrls: ["./otp-input.component.scss"],
})
export class OtpInputComponent {
  box1: string = "";
  box2: string = "";
  box3: string = "";
  box4: string = "";

  // ...

  @ViewChild("box1Input", { static: false }) box1Input!: ElementRef;
  @ViewChild("box2Input", { static: false }) box2Input!: ElementRef;
  @ViewChild("box3Input", { static: false }) box3Input!: ElementRef;
  @ViewChild("box4Input", { static: false }) box4Input!: ElementRef;

  // ...

  constructor(private renderer: Renderer2) {}

  getOtpValue(): string {
    return this.box1 + this.box2 + this.box3 + this.box4;
  }

  setOtpValue(otpValue: string): void {
    otpValue = otpValue.padEnd(16, "").substr(0, 16);

    this.box1 = otpValue.substr(0, 4);
    this.box2 = otpValue.substr(4, 4);
    this.box3 = otpValue.substr(8, 4);
    this.box4 = otpValue.substr(12, 4);
  }

  onInput(boxNumber: number): void {
    const currentBox = this[`box${boxNumber}Input`];
    const value = currentBox.nativeElement.value;

    if (value.length === currentBox.nativeElement.maxLength) {
      const nextBoxNumber = boxNumber < 4 ? boxNumber + 1 : 1;
      const nextBox = this[`box${nextBoxNumber}Input`];

      if (nextBox) {
        this.renderer.selectRootElement(nextBox.nativeElement).focus();
      }
    }
  }
}
