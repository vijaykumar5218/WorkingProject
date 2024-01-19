import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {ValidationType} from '@shared-lib/services/journey/constants/validationType.enum';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Directive({
  selector: '[journeysValidation]',
})
export class ValidationDirective {
  @Output() ngModelChange: EventEmitter<string> = new EventEmitter();
  @Input() input: StepContentElement;

  @HostListener('input', ['$event'])
  onInput(event: {target: HTMLInputElement}) {
    this.clean(event.target);
  }

  @HostListener('ionInput', ['$event'])
  onIonInput(event: {target: HTMLInputElement}) {
    this.clean(event.target);
  }
  @HostListener('focusout', ['$event'])
  onFocusOut(event: {target: HTMLInputElement}) {
    this.ngModelChange.emit(this.validateMin(event.target));
  }

  clean(element: HTMLInputElement) {
    let cleanedValue = element.value ? element.value.toString() : '';
    if (cleanedValue) {
      cleanedValue = this.cleanNumber(cleanedValue);
    }
    if (this.input?.validationRules?.type === ValidationType.dollar) {
      cleanedValue = '$' + cleanedValue;
    }
    element.value = cleanedValue;
    this.ngModelChange.emit(element.value);
  }

  private cleanNumber(value: string): string {
    let cleanedValue: string | number = value;
    if (
      this.input?.validationRules?.type === ValidationType.number ||
      this.input?.validationRules?.type === ValidationType.dollar ||
      this.input?.validationRules?.type === ValidationType.percentage
    ) {
      cleanedValue = cleanedValue.replace(/[^0-9.]+/g, '');
      const decimalPlaces = this.input.validationRules?.decimalPlaces || 0;
      if (decimalPlaces === 0) {
        cleanedValue = parseFloat(cleanedValue);
        if (isNaN(cleanedValue)) {
          cleanedValue = '';
        } else if (decimalPlaces === 0) {
          cleanedValue = Math.floor(cleanedValue);
        }
      } else {
        cleanedValue = this.cleanDecimalValue(cleanedValue, decimalPlaces);
      }
    } else if (
      this.input?.validationRules?.type === ValidationType.alphabeticWithSpace
    ) {
      cleanedValue = cleanedValue.replace(/[^A-Za-z ]/g, '');
    }
    if (typeof cleanedValue === 'number') {
      cleanedValue = this.validateMax(cleanedValue);
    }
    return cleanedValue.toString();
  }

  private cleanDecimalValue(
    cleanedValue: string,
    decimalPlaces: number
  ): string {
    const cleanedValueDecimalSplit = cleanedValue.split('.');
    cleanedValue = cleanedValueDecimalSplit[0];
    if (cleanedValueDecimalSplit[1] !== undefined) {
      cleanedValue =
        cleanedValue +
        '.' +
        cleanedValueDecimalSplit[1].substring(0, decimalPlaces);
    }
    if (cleanedValue != '') {
      const valueAsNum = parseFloat(cleanedValue);
      const maxValidatedValue = this.validateMax(valueAsNum);
      if (maxValidatedValue !== valueAsNum) {
        cleanedValue = maxValidatedValue.toString();
      }
    }
    return cleanedValue;
  }

  private validateMax(value: number): number {
    const max = this.input?.validationRules?.max;
    if (max && value > max) {
      value = max;
    }
    return value;
  }

  private validateMin(element: HTMLInputElement): string {
    const min = this.input?.validationRules?.min;
    if (min && parseFloat(element.value) < min) {
      element.value = min.toString();
    }
    return element.value;
  }
}
