import {Component, Input} from '@angular/core';
import {ModalHeaderContent} from './models/modalHeaderContentModel';
import modalHeaderContent from './constants/modalHeaderContent.json';
import {ModalController} from '@ionic/angular';
import {Location} from '@angular/common';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent {
  content: ModalHeaderContent = modalHeaderContent;
  @Input() headerText: string;
  @Input() back: boolean;
  @Input() border = true;
  @Input() mxAccount: boolean;
  @Input() backUrl?: string;

  constructor(
    private modalController: ModalController,
    private location: Location,
    private mxService: MXService,
    private router: Router
  ) {}

  closeDialog() {
    if (this.back) {
      if (this.backUrl) {
        this.router.navigateByUrl(this.backUrl);
      } else {
        this.location.back();
      }
    } else {
      if (this.mxAccount) {
        this.mxService.getMxMemberConnect(true);
        this.mxService.getMxAccountConnect(true);
        this.mxService.removeMXWindowEventListener();
      }
      this.modalController.dismiss();
    }
  }
}
