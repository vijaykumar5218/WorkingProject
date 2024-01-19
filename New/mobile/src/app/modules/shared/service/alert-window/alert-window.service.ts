import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {AlertWindow} from '../../../../../../src/app/data/schema/AlterWindow';
import * as text from './constants/alertText.json';

@Injectable({
  providedIn: 'root',
})
export class AlertWindowService {
  pageText: Record<string, string> = text;

  constructor(
    public alertController: AlertController,
    private router: Router
  ) {}

  async presentAlert(msg?: AlertWindow) {
    const link = msg.link || '';
    const alert = await this.alertController.create({
      cssClass: msg.cssClass || 'alert-window',
      header: msg.header || this.pageText.systemUnavailable,
      subHeader: msg.subHeader || '',
      message: msg.message || this.pageText.youMustUse,
      buttons: msg.buttons || ['OK'],
      backdropDismiss:
        msg?.backdropDismiss !== undefined ? msg.backdropDismiss : true,
    });

    await alert.present();
    if (link !== '') {
      await alert.onDidDismiss().then(() => {
        this.router.navigateByUrl('' + link);
      });
    } else {
      await alert.onDidDismiss();
    }
  }

  async createAndPresent(opts: any) {
    const alert = await this.alertController.create(opts);
    return alert.present();
  }
}
