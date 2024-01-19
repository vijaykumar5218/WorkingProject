export interface RecoveryText {
  title: string;
  mobile: string;
  email: string;
  status: {
    add: string;
    update: string;
    preferred: string;
  };
  actionOption: {
    header: string;
    buttonLeft: string;
    buttonRight: string;
  };
  button: {
    cancel: string;
    save: string;
  };
}

export interface UpdateEmailPageText {
  header: string;
  label: string;
  actionOption: {
    updateHeader: string;
    addHeader: string;
    buttonLeft: string;
    buttonRight: string;
  };
  buttons: {
    cancel: string;
    code: string;
  };
}
