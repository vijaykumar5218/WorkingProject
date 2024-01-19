import {Component} from '@angular/core';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Observable} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {LanguageDisclamerModalComponent} from '../language-disclaimer-modal/language-disclaimer-modal.component';

@Component({
  selector: 'app-footer-desktop',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss'],
})
export class FooterComponentDesktop {
  workplaceEnabled$: Observable<boolean>;
  isReady: boolean;

  constructor(
    private accessService: AccessService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.workplaceEnabled$ = this.accessService.isMyWorkplaceDashboardEnabled();
  }

  ngAfterViewInit() {
    this.isReady = true;
  }
  async handleSpanishModalEvent(e: Event) {
    const modal = await this.modalController.create({
      component: LanguageDisclamerModalComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: {
        message: (e as CustomEvent).detail.description,
        buttonText: (e as CustomEvent).detail.buttonText,
      },
      backdropDismiss: false,
    });
    return modal.present();
  }
}
