import {Component} from '@angular/core';
import {ModalController} from '@ionic/angular';
import * as PageText from '../../constants/content.json';
import {AddAccountLandingContent} from '@shared-lib/models/add-account-landing.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AddAccountsPage} from '@shared-lib/modules/accounts/add-accounts/add-accounts.page';
@Component({
  selector: 'add-account-modal',
  templateUrl: './add-account-modal.component.html',
  styleUrls: ['./add-account-modal.component.scss'],
})
export class AddAccountModalComponent {
  content: AddAccountLandingContent;
  pageText = (PageText as any).default;

  constructor(
    private modalController: ModalController,
    private accountService: AccountService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit(): void {
    this.getAddAccountModalData();
  }

  async getAddAccountModalData() {
    this.content = await this.accountService.getAddAcctModalContent();
  }

  async openAddAccountWidgetModal() {
    this.closeModal();
    this.utilityService.setSuppressHeaderFooter(true);
    const addAccountModal = await this.modalController.create({
      component: AddAccountsPage,
      cssClass: 'modal-fullscreen',
      componentProps: {
        showCancel: true,
        preInitHeight: '530px',
      },
    });
    return addAccountModal.present();
  }

  closeModal() {
    this.utilityService.setSuppressHeaderFooter(false);
    this.modalController.dismiss();
  }
}
