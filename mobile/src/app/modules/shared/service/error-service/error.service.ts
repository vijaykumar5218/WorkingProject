import {Injectable, NgZone} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {ToastController, AlertController} from '@ionic/angular';
import * as errorText from './constants/errorText.json';
import {ConnectionStatus, Network, NetworkPlugin} from '@capacitor/network';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errorText: Record<string, string> = errorText;
  hasShownError = false;

  constructor(
    public toastController: ToastController,
    private router: Router,
    private ngZone: NgZone,
    private alertController: AlertController
  ) {}

  async initialize(network: NetworkPlugin = Network): Promise<void> {
    network.addListener('networkStatusChange', this.onNetworkError.bind(this));

    const currentStatus = await network.getStatus();
    this.onNetworkError(currentStatus);
    this.registerErrorListener();
  }

  onNetworkError(status: ConnectionStatus) {
    if (!status.connected) {
      this.ngZone.run(async () => {
        const alert = await this.alertController.create({
          header: this.errorText.networkErrorTitle,
          message: this.errorText.networkErrorMessage,
          buttons: [this.errorText.dismiss],
        });
        alert.present();
      });
    }
  }

  registerErrorListener() {
    this.router.events.subscribe(async event => {
      if (event instanceof NavigationStart) {
        this.hasShownError = false;
      }
    });
  }
}
