import {Component, OnInit} from '@angular/core';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BSTSmartCardContent} from '@shared-lib/services/benefits/models/noBenefit.model.js';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {
  BSTSmartCardData,
  BSTSmartCardDetail,
} from '../../../../services/benefits/models/benefits.model';

@Component({
  selector: 'app-bstsmart-card-list',
  templateUrl: './bstsmart-card-list.component.html',
})
export class BSTSmartCardListComponent implements OnInit {
  cards: BSTSmartCardContent[];
  isWeb = false;

  constructor(
    private benefitService: BenefitsService,
    private utilityService: SharedUtilityService
  ) {}

  async ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();

    const smartCardData = await this.benefitService.fetchBstSmartCards();
    const content = await this.benefitService.getNoBenefitContents();
    const smartCardContent = JSON.parse(content.Insights_BSTsmartcard_Nudge);

    this.setUpCardContent(smartCardContent, smartCardData);
  }

  setUpCardContent(
    smartCardContent: BSTSmartCardContent[],
    smartCardData: BSTSmartCardData
  ) {
    smartCardContent.forEach((scContent: BSTSmartCardContent) => {
      scContent.show = smartCardData[scContent.name];
      if (scContent.name == 'sc2') {
        scContent.body = this.replaceDrugListInString(
          scContent.body,
          smartCardData.smartcardDetail
        );
        scContent.modalContent.topBody = this.replaceDrugListInString(
          scContent.modalContent.topBody,
          smartCardData.smartcardDetail
        );
      }
    });

    this.cards = smartCardContent;
  }

  private replaceDrugListInString(
    string: string,
    scData: BSTSmartCardDetail[]
  ): string {
    if (!scData) {
      return string;
    }

    const match = string.match('<druglist>(.*?)</druglist>');
    const rowData = match[1];

    const drugRows = [];
    scData.forEach((dat: BSTSmartCardDetail) => {
      let row = rowData.split('').join('');

      row = row.replace('{alternativeNdcName}', dat.alternativeNdcName);
      row = row.replace('{currentNdcName}', dat.currentNdcName);

      drugRows.push(row);
    });

    return string.replace(
      /<druglist>.*?<\/druglist>/,
      drugRows.join('<br><br>')
    );
  }
}
