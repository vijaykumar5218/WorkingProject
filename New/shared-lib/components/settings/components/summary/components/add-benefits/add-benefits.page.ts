import planText from './constants/addBenefitsPage.json';
import {Component} from '@angular/core';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';

@Component({
  selector: 'app-add-benefits',
  templateUrl: './add-benefits.page.html',
})
export class AddBenefitsPage {
  planText: any = planText;
  actionOption: ActionOptions = {
    headername: planText.actionOption.headerName,
    btnleft: true,
    btnright: true,
    buttonLeft: {
      name: '',
      link: planText.actionOption.buttonLeft,
    },
    buttonRight: {
      name: '',
      link: planText.actionOption.buttonRight,
    },
  };
  constructor(private headerType: HeaderTypeService) {}
  ionViewWillEnter() {
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }
}
