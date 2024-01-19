import {Component, Output, EventEmitter, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {
  BenefitEnrollment,
  NudgeContent,
} from '@shared-lib/services/benefits/models/benefits.model';
import {Observable} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {EventTrackingService} from '@shared-lib/services/event-tracker/event-tracking.service';

@Component({
  selector: 'benefits-selection-modal-nudge',
  templateUrl: './nudge.component.html',
  styleUrls: ['./nudge.component.scss'],
})
export class NudgeComponent {
  @Output() selectBenefits = new EventEmitter<void>();
  @Input() content: NudgeContent;
  @Input() nudgeContent: NudgeContent;
  benefitsEnrollment$: Observable<BenefitEnrollment>;
  isWeb: boolean;
  constructor(
    private modalController: ModalController,
    private router: Router,
    private benefitsService: BenefitsService,
    private utilityService: SharedUtilityService,
    private eventTrackingService: EventTrackingService
  ) {}

  async ngOnInit() {
    this.benefitsEnrollment$ = await this.benefitsService.getBenefitsEnrollment();
    this.isWeb = this.utilityService.getIsWeb();
  }

  goToSummaryDetails() {
    if (this.isWeb) {
      this.utilityService.setSuppressHeaderFooter(false);
      this.modalController.dismiss();
      this.router.navigateByUrl('/coverages/all-coverages/elections');
    } else {
      this.modalController.dismiss();
      this.router.navigateByUrl('/settings/summary');
      this.benefitsService.setBenefitSummaryBackButton('home');
    }
  }

  emitSelect(status: string) {
    this.eventTrackingService.eventTracking({
      eventName: 'CTAClick',
      passThruAttributes: [
        {
          attributeName: 'subType',
          attributeValue: 'open_enrollment_splash',
        },
        {
          attributeName: 'Enrollment_user_status',
          attributeValue: status,
        },
      ],
    });
    this.selectBenefits.emit();
  }
}
