import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appIntegerInput]',
})
export class IntegerInputDirective {
  @HostListener('keypress', ['$event'])
  onInput(event: KeyboardEvent): boolean {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
