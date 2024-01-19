import {Component} from '@angular/core';
import {ClaimsContent} from './models/claimsContentModel';
import claimsContent from './constants/claimsContent.json';
import {HeaderFooterTypeService} from '../../../services/header-footer-type/headerFooterType.service';
import {HeaderType} from '../../../constants/headerType.enum';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {ViewWillEnter} from '@ionic/angular';

@Component({
  selector: 'app-coverages-claims',
  templateUrl: './claims.component.html',
  styleUrls: [],
})
export class ClaimsComponent implements ViewWillEnter {
  private content: ClaimsContent = claimsContent;
  header: string = this.content.authorizationHeader;

  constructor(private headerFooterTypeService: HeaderFooterTypeService) {}

  ionViewWillEnter() {
    this.headerFooterTypeService.publishType(
      {type: HeaderType.none},
      {type: FooterType.none}
    );
  }

  updateHeader(event: boolean) {
    if (event) {
      this.header = this.content.expensesHeader;
    } else {
      this.header = this.content.authorizationHeader;
    }
  }
}
