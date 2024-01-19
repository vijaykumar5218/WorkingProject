import {Component, Input} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BenefitsSummaryModalContent} from '@shared-lib/services/benefits/models/benefits.model';
import {ModalPresentationService} from '../../../services/modal-presentation/modal-presentation.service';

@Component({
  selector: 'benefits-selection-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class BenefitsSelectionModalComponent {
  @Input() showBeforeStarting: boolean;
  content: BenefitsSummaryModalContent;
  @Input() exitIconPath = 'assets/icon/exitWhite.svg';

  constructor(
    private benefitService: BenefitsService,
    private modalPresentationService: ModalPresentationService
  ) {}

  ngOnInit(): void {
    this.getBenefitModalData();
  }

  getBenefitModalData() {
    return this.benefitService
      .getBenefitsSelectionModalContent()
      .then((res: BenefitsSummaryModalContent) => {
        this.content = res;
      });
  }

  handleSelectBenefitsClick() {
    this.exitIconPath = 'assets/icon/exit.svg';
    this.showBeforeStarting = true;
  }

  closeModal() {
    this.benefitService.setSmartBannerEnableConditions({
      isSmartBannerHidden: false,
    });
    this.modalPresentationService.dismiss();
  }
}
