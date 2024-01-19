export class ActionOptions {
  headername = '';
  headerSection?: string;
  btnleft?: boolean = false;
  btnright?: boolean = false;
  buttonLeft?: ButtonOptions;
  buttonRight?: ButtonOptions;
  displayLogo?: boolean = false;
}

export class ButtonOptions {
  name?: string;
  link?: string;
}
