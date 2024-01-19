import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {OrangeMoneyService} from '../../services/orange-money.service';
import pageText from '../../constants/madlib.json';
import {OMStatus} from '@shared-lib/services/account/models/orange-money.model';
import {Subscription} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {MadlibModalComponent} from '../madlib-modal/madlib-modal.component';

@Component({
  selector: 'app-mad-lib',
  templateUrl: './mad-lib.component.html',
  styleUrls: ['./mad-lib.component.scss'],
})
export class MadLibComponent implements OnInit, OnDestroy {
  pageText = pageText;
  headerText: string;
  bodyText: string;
  hideButton: boolean;
  private orangeDataSubscription: Subscription;
  @Output() madlibClose = new EventEmitter<void>();
  constructor(
    private orangeMoneyService: OrangeMoneyService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.orangeDataSubscription = this.orangeMoneyService
      .getOrangeData()
      .subscribe(omData => {
        const status = this.orangeMoneyService.getOrangeMoneyStatus(omData);

        switch (status) {
          case OMStatus.ORANGE_DATA:
          case OMStatus.FE_DATA:
            //Hide this whole component
            this.headerText = '';
            this.bodyText = '';
            this.hideButton = true;
            break;

          case OMStatus.MADLIB_OM:
            //Show orange money madlib
            this.headerText = pageText.ontrack;
            this.bodyText = pageText.fewSteps;
            this.hideButton = false;
            break;

          case OMStatus.MADLIB_FE:
          case OMStatus.SERVICE_DOWN:
          case OMStatus.UNKNOWN:
            //Show FE madlib
            this.headerText = '';
            this.bodyText = this.pageText.visitWeb;
            this.hideButton = true;
            break;
        }
      });
  }

  async openMadlibModal() {
    const modal = await this.modalController.create({
      component: MadlibModalComponent,
      cssClass: 'modal-not-fullscreen',
    });
    modal.onDidDismiss().then(() => {
      this.madlibClose.emit();
    });
    return modal.present();
  }

  ngOnDestroy(): void {
    this.orangeDataSubscription.unsubscribe();
  }
}
