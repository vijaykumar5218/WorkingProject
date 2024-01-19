import {AlertButton} from '@ionic/core/components/custom-elements';

export class AlertWindow {
  header?: string;
  subHeader?: string;
  message: string;
  buttons?: Array<string | AlertButton>;
  link?: string;
  cssClass?: string;
  backdropDismiss?: boolean;
}
