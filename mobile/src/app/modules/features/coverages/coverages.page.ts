import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Benefit} from '@shared-lib/services/benefits/models/benefits.model';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';

@Component({
  selector: 'app-coverages',
  templateUrl: './coverages.page.html',
  styleUrls: ['./coverages.page.scss'],
})
export class CoveragesPage {
  actionOption: ActionOptions = {
    headername: 'Coverages',
    btnright: true,
    buttonRight: {
      name: '',
      link: 'notification',
    },
  };
  coverages: Benefit[];
  constructor(
    private headerType: HeaderTypeService,
    private footerType: FooterTypeService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.footerType.publish({type: FooterType.tabsnav});
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
    this.router.navigateByUrl('coverages/coverage-tabs');
  }
}
