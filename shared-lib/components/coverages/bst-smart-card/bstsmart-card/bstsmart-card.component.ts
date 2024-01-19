import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {BSTSmartCardContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {BSTSmartCardModalComponent} from '../bstsmart-card-modal/bstsmart-card-modal.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';

@Component({
  selector: 'app-bstsmart-card',
  templateUrl: './bstsmart-card.component.html',
  styleUrls: ['./bstsmart-card.component.scss'],
})
export class BSTSmartCardComponent {
  isWeb = false;
  @Input() content: BSTSmartCardContent;
  @Output() xButtonClicked: EventEmitter<string> = new EventEmitter();

  constructor(
    private modalController: ModalController,
    private utilityService: SharedUtilityService,
    private router: Router,
    private benefitService: BenefitsService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  async linkClicked() {
    if (this.isWeb) {
      this.benefitService.setSelectedSmartCard(this.content);
      this.router.navigateByUrl('coverages/smartCardModal');
    } else {
      const modal = await this.modalController.create({
        component: BSTSmartCardModalComponent,
        componentProps: {
          smartCardContent: this.content,
        },
      });
      modal.present();
    }
  }

  closeClicked() {
    this.xButtonClicked.emit(this.content.name);
  }
}
