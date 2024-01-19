import {Component, Input} from '@angular/core';
import {DescString} from '@shared-lib/services/journey/models/descString.model';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import {PlanTransactionsComponent} from '../../../../../../../components/coverages/plan-tabs/plan-transactions/plan-transactions.component';
import {SharedUtilityService} from '../../../../../../../services/utility/utility.service';
@Component({
  selector: 'journeys-steps-step-intro-desc',
  templateUrl: './desc.component.html',
  styleUrls: ['./desc.component.scss'],
})
export class DescComponent {
  @Input() descStrings: DescString[];
  @Input() element: StepContentElement;

  constructor(
    private journeyService: JourneyService,
    private router: Router,
    private modalController: ModalController,
    private utilityService: SharedUtilityService
  ) {}

  openLink(desc: DescString) {
    if (desc.link) {
      this.openWebview(desc);
    } else if (desc.videoUrl) {
      this.journeyService.openModal({element: desc});
    } else if (desc.appLink) {
      this.openAppLink(desc.appLink);
    }
  }

  openAppLink(link: string) {
    if (this.utilityService.getIsWeb() && link === 'claims') {
      this.modalController
        .create({
          component: PlanTransactionsComponent,
          componentProps: {
            isModal: true,
          },
        })
        .then(modal => {
          modal.present();
        });
    } else {
      this.router.navigateByUrl(link);
    }
  }

  private openWebview(desc: DescString) {
    this.journeyService.openWebView(desc.link, desc.header || '', desc.toolbar);
  }
}
