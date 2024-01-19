import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BSTSmartCardContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {Location} from '@angular/common';
import {delay, filter} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-bstsmart-card-modal',
  templateUrl: './bstsmart-card-modal.component.html',
  styleUrls: ['./bstsmart-card-modal.component.scss'],
})
export class BSTSmartCardModalComponent implements OnInit, OnDestroy {
  isWeb = false;
  smartCardContent: BSTSmartCardContent;
  radioOption = '';
  subscription: Subscription;
  @ViewChild('topmostElement', {read: ElementRef}) topmostElement: ElementRef;

  constructor(
    private modalController: ModalController,
    private benefitService: BenefitsService,
    private utilityService: SharedUtilityService,
    private location: Location,
    private router: Router
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  ngOnInit(): void {
    if (this.isWeb) {
      this.smartCardContent = this.benefitService.getSelectedSmartCard();
      this.scrollToTop();
    }
  }

  scrollToTop() {
    this.subscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        delay(100)
      )
      .subscribe(() => {
        this.utilityService.scrollToTop(this.topmostElement);
      });
  }

  radioOptionClicked(radioOption: string) {
    this.radioOption = radioOption;
  }

  saveButtonClicked() {
    if (this.isWeb) {
      this.location.back();
    } else {
      this.modalController.dismiss();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
