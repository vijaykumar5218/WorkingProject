import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ConsentService} from '@shared-lib/services/consent/consent.service';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {SharedUtilityService} from '../../services/utility/utility.service';
import {Subscription} from 'rxjs';

interface ThankYouAuthContent {
  title: string;
  message: string;
}

@Component({
  selector: 'app-got-consent',
  templateUrl: './got-consent.component.html',
  styleUrls: ['./got-consent.component.scss'],
})
export class GotConsentComponent implements OnInit, OnDestroy {
  isWeb = false;
  show = true;
  content: ThankYouAuthContent;
  subscription: Subscription;
  @Output() visibilityChanged = new EventEmitter<boolean>();

  constructor(
    private benefitsService: BenefitsService,
    private consentService: ConsentService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.subscription = this.consentService.justGaveConsent.subscribe(
      (justGave: boolean) => {
        this.show = justGave;
        this.visibilityChanged.emit(this.show);
      }
    );
    this.benefitsService
      .getNoBenefitContents()
      .then((benContent: NoBenefitContent) => {
        this.content = JSON.parse(benContent.Insights_ThankYouforAuth_Banner);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
