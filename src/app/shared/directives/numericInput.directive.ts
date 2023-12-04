import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[numericInput]",
})
export class NumericInputDirective {
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const numericValue = input.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    input.value = numericValue;
  }
}
