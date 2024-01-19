import {IntegerInputDirective} from './integer-input.directive';

describe('IntegerInputDirective', () => {
  it('should create an instance', () => {
    const directive = new IntegerInputDirective();
    expect(directive).toBeTruthy();
  });
});

describe('onInput', () => {
  it('should call preventDefault if input is not a number and return false', () => {
    const directive = new IntegerInputDirective();

    const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
      key: 'a',
    });

    const result = directive.onInput(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(result).toBeFalse();
  });

  it('should not call preventDefault if input is a number and return true', () => {
    const directive = new IntegerInputDirective();

    const event = jasmine.createSpyObj('KeyboardEvent', ['preventDefault'], {
      key: '3',
    });

    const result = directive.onInput(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });
});
