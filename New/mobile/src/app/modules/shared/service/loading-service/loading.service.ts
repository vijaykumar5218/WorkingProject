import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = false;
  constructor(public loadingController: LoadingController) {}
  loading;
  async startLoading() {
    this.isLoading = true;
    return this.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        duration: 400000,
      })
      .then(a => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async stopLoading() {
    this.isLoading = false;
    return this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }
}
