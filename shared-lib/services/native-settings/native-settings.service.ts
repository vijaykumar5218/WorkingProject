import {Injectable} from '@angular/core';
import {ModalController} from '@ionic/angular';
import PushPermission, {
  PushPermissionPlugin,
} from 'mobile/customPlugins/pushPermissionPlugin';
import {CardModalComponent} from '@shared-lib/components/coverages/plan-tabs/plan-details/my-id-card/card-modal/card-modal.component';

@Injectable({
  providedIn: 'root',
})
export class NativeSettingsService {
  private pushPermission: PushPermissionPlugin;

  constructor(private modalController: ModalController) {
    this.pushPermission = PushPermission;
  }

  async checkNotificationStatus(): Promise<boolean> {
    return (await this.pushPermission.checkPushPermissions()).result;
  }

  async createAndShowModal() {
    await this.showModal({
      yesText: 'Yes',
      description:
        'By clicking yes, you will be redirected to OS settings to turn on push notifications.',
      header: 'Enable Notifications',
      redirectToSetting: true,
    });
  }

  async showModal(componentProps: Record<string, string | boolean>) {
    const modal = await this.modalController.create({
      component: CardModalComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: componentProps,
    });
    modal.present();
  }
}
