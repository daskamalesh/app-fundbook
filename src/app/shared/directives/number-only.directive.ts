import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {

  @Input() allowDecimal: boolean = false; // Allow decimal numbers (default: false)
  @Input() allowNegative: boolean = false; // Allow negative numbers (default: false)

  private regex: RegExp;

  constructor(private el: ElementRef) {
    this.regex = this.allowDecimal ? (this.allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/) : (this.allowNegative ? /^-?\d*$/ : /^\d*$/);
  }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    let currentValue = inputElement.value;
    let newValue = currentValue.replace(/[^0-9.-]/g, ''); // Remove any non-numeric characters (except . and - if allowed)

    if (!this.allowDecimal && newValue.includes('.')) {
      newValue = newValue.slice(0, newValue.indexOf('.')); // Remove decimal part if not allowed
    }

    if (!this.allowNegative && newValue.includes('-')) {
      newValue = newValue.slice(0, newValue.indexOf('-')) //Remove negative sign if not allowed
    }

    if (newValue !== currentValue) {
      inputElement.value = newValue;
      // Dispatch a 'input' event to notify Angular forms about the change
       inputElement.dispatchEvent(new Event('input'));
    }
  }

}

