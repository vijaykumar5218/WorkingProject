export interface AlertBox {
  headerName: string;
  headerDesc: string;
  label: string;
  button: {
    save: string;
    cancel: string;
  };
  alert: {
    message: string;
    imageUrl: string;
  };
  errors: {
    invalidPhone: string;
  };
}

export interface ModalCloseData {
  saved: boolean;
}
