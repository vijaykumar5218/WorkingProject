import {Component} from '@angular/core';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
@Component({
  selector: 'app-more',
  templateUrl: 'more.page.html',
})
export class MorePage {
  constructor(private footerTypeService: FooterTypeService) {}

  ngAfterViewInit() {
    this.footerTypeService.publish({
      type: FooterType.tabsnav,
      selectedTab: 'more',
    });
  }
}
